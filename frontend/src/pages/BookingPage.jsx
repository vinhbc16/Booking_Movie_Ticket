import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useSocket } from '@/hooks/useSocket';
import { SeatMap } from '@/features/booking/components/SeatMap';
import { useAuthStore } from '@/store/useAuthStore';
import { showtimeService } from '@/services/showtimeService'; // Import service
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function BookingPage() {
    const { showtimeId } = useParams();
    const navigate = useNavigate();
    const user = useAuthStore(state => state.user);
    
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

    // 3. Xử lý chọn ghế
    const handleSeatClick = (seatName) => {
        if (!user) {
            toast.error("Vui lòng đăng nhập lại");
            return;
        }

        if (mySeats.includes(seatName)) {
            // Bỏ chọn
            setMySeats(prev => prev.filter(s => s !== seatName));
            socket.emit('release_seat', { showtimeId, seatName, userId: user.userID });
        } else {
            // Chọn mới (Giới hạn tối đa 8 ghế chẳng hạn)
            if (mySeats.length >= 8) {
                toast.warning("Bạn chỉ được chọn tối đa 8 ghế");
                return;
            }
            setMySeats(prev => [...prev, seatName]);
            socket.emit('hold_seat', { showtimeId, seatName, userId: user.userID });
        }
    };

    // --- RENDER ---

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
        <div className="min-h-screen bg-gray-50 pb-32"> {/* pb-32 để không bị footer che */}
            {/* Header đơn giản */}
            <div className="sticky top-0 z-10 bg-white shadow-sm px-4 py-3 flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-lg font-bold text-gray-900">
                        {showtime.movie.title}
                    </h1>
                    <p className="text-sm text-gray-500">
                        {showtime.room.theater.name} - {showtime.room.name} - {new Date(showtime.startTime).toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit'})}
                    </p>
                </div>
            </div>

            {/* Sơ đồ ghế */}
            <div className="container mx-auto mt-8 px-4 overflow-auto">
                <SeatMap 
                    rows={showtime.room.numberOfRows ?? 0}
                    cols={showtime.room.seatsPerRow ?? 0 }
                    // Lọc ra các ghế có status='booked' từ mảng seats của showtime
                    bookedSeats={showtime.seats
                        ? showtime.seats
                        .filter(s => s.status === 'booked')
                        .map(s => s.seatNumber) : []
                    }
                    heldSeats={heldSeats}
                    selectedSeats={mySeats}
                    onSeatClick={handleSeatClick}
                />
            </div>
            
            {/* Footer thanh toán (Bottom Bar) */}
            {mySeats.length > 0 && (
                <div className="fixed bottom-0 left-0 w-full bg-white border-t p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-20 animate-in slide-in-from-bottom-5">
                    <div className="container mx-auto flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-500">Ghế đang chọn:</p>
                            <p className="text-lg font-bold text-black">{mySeats.join(', ')}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Tổng cộng:</p>
                                <p className="text-xl font-bold text-[#F5C518]">
                                    {(mySeats.length * showtime.basePrice).toLocaleString()} đ
                                </p>
                            </div>
                            <Button size="lg" className="bg-[#F5C518] text-black hover:bg-[#dcb015] font-bold px-8">
                                THANH TOÁN
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}