import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useSocket } from '@/hooks/useSocket';
import { SeatMap } from '@/features/booking/components/SeatMap';
import { useAuthStore } from '@/store/useAuthStore';
import { showtimeService } from '@/services/showtimeService'; 
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { BookingSummary } from '@/features/booking/components/BookingSummary';

export default function BookingPage() {
    const { showtimeId } = useParams();
    const navigate = useNavigate();
    const user = useAuthStore(state => state.user);
    const [totalPrice, setTotalPrice] = useState(0);
    // Kết nối socket
    const socket = useSocket(showtimeId);

    const [showtime, setShowtime] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [heldSeats, setHeldSeats] = useState([]); // Ghế bị người khác giữ (Redis)
    const [mySeats, setMySeats] = useState([]); // Ghế mình đang chọn

    // 1. Lấy thông tin suất chiếu từ API
    useEffect(() => {
        if (!showtimeId) return;

        const fetchShowtime = async () => {
            try {
                console.log("Đang tải showtime ID:", showtimeId);
                const res = await showtimeService.getShowtimeDetail(showtimeId);
                console.log("Dữ liệu nhận được:", res.data);
                if (res.data.showtime) {
             console.log("Room Info:", res.data.showtime.room);
             console.log("Total Rows:", res.data.showtime.room.numberOfRows);
             console.log("Seats Per Row:", res.data.showtime.room.seatsPerRow);
        }
                
                setShowtime(res.data.showtime);
            } catch (error) {
                console.error("Lỗi tải suất chiếu:", error);
                toast.error("Không thể tải thông tin suất chiếu");
            } finally {
                setIsLoading(false);
            }
        };

        fetchShowtime();
    }, [showtimeId]);

    // 2. Lắng nghe Socket (Real-time)
    useEffect(() => {
        if (!socket) return;

        // Khi mới join, server có thể gửi danh sách ghế đang bị hold (nếu backend làm tính năng này)
        // Hiện tại ta nghe sự kiện lock/release
        socket.on('seat_locked', ({ seatName, userId }) => {
            console.log("Socket: Ghế bị lock", seatName);
            if (userId !== user?.userID) {
                setHeldSeats(prev => [...prev, seatName]);
            }
        });

        socket.on('seat_released', ({ seatName }) => {
            console.log("Socket: Ghế được thả", seatName);
            setHeldSeats(prev => prev.filter(s => s !== seatName));
        });

        return () => {
            socket.off('seat_locked');
            socket.off('seat_released');
        };
    }, [socket, user]);

    // Xử lý chọn ghế (Cập nhật giá tiền)
    const handleSeatClick = (seatName, isVip, isCouple) => {
        if (!user) { toast.error("Vui lòng đăng nhập lại"); return; }

        let price = showtime.basePrice;
        if (isVip) price *= 1.5; // Logic giá giống Backend
        if (isCouple) price *= 2;

        if (mySeats.includes(seatName)) {
            // Bỏ chọn -> Trừ tiền
            setMySeats(prev => prev.filter(s => s !== seatName));
            setTotalPrice(prev => prev - price);
            socket.emit('release_seat', { showtimeId, seatName, userId: user.userID });
        } else {
            // Chọn mới -> Cộng tiền
            if (mySeats.length >= 8) { toast.warning("Tối đa 8 ghế"); return; }
            setMySeats(prev => [...prev, seatName]);
            setTotalPrice(prev => prev + price);
            socket.emit('hold_seat', { showtimeId, seatName, userId: user.userID });
        }
    };

    // 1. Màn hình Loading
    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background-secondary">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <span className="ml-3 text-lg font-medium text-gray-600">Đang tải sơ đồ ghế...</span>
            </div>
        );
    }

    // 2. Màn hình Lỗi (nếu không lấy được showtime)
    if (!showtime) {
        return (
            <div className="flex h-screen flex-col items-center justify-center gap-4">
                <p className="text-xl text-gray-500">Không tìm thấy suất chiếu này.</p>
                <Button onClick={() => navigate('/')}>Về trang chủ</Button>
            </div>
        );
    }

    if (!showtime || !showtime.room) return <div>Dữ liệu phòng lỗi...</div>;

    // 3. Màn hình chính
    return (
        // Đổi background sang màu tối cho giống rạp phim
        <div className="min-h-screen bg-[#0f0f1b] text-white pb-10">
            
            {/* Header tối giản */}
            <div className="bg-[#1c1c2e] border-b border-white/5 py-4 px-6 mb-8 flex justify-between items-center">
                <Button variant="ghost" onClick={() => navigate(-1)} className="text-white hover:bg-white/10">
                    <ArrowLeft className="mr-2 h-5 w-5" /> Quay lại
                </Button>
                <h1 className="text-xl font-bold uppercase tracking-wider">Chọn ghế ngồi</h1>
                <div className="w-24"></div> {/* Spacer */}
            </div>

            <div className="container mx-auto px-4">
                {/* LAYOUT 2 CỘT */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Cột Trái: Sơ đồ ghế (Chiếm 2 phần) */}
                    <div className="lg:col-span-2 overflow-x-auto">
                        <SeatMap 
                            rows={showtime.room.numberOfRows}
                            cols={showtime.room.seatsPerRow}
                            bookedSeats={showtime.seats.filter(s => s.status === 'booked').map(s => s.seatNumber)}
                            heldSeats={heldSeats}
                            selectedSeats={mySeats}
                            // Truyền thêm props mới
                            vipRows={showtime.room.vipRows} 
                            coupleRows={showtime.room.coupleRows}
                            onSeatClick={handleSeatClick}
                        />
                    </div>

                    {/* Cột Phải: Thông tin & Thanh toán (Chiếm 1 phần) */}
                    <div className="lg:col-span-1">
                        <BookingSummary 
                            showtime={showtime}
                            selectedSeats={mySeats}
                            totalPrice={totalPrice}
                            onConfirm={() => console.log("Thanh toán!")} // Sẽ làm tiếp
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}