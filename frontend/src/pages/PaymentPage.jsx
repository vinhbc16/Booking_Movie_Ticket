import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { bookingService } from '@/services/bookingService';
import { useSocket } from '@/hooks/useSocket'; // Hook socket của bạn
import { Loader2, Copy, CheckCircle, Clock , ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function PaymentPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const socket = useSocket();

    // Dữ liệu nhận từ trang chọn ghế
    const { showtime, selectedSeats, totalPrice } = location.state || {};

    const [booking, setBooking] = useState(null);
    const [qrUrl, setQrUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(600); // 10 phút đếm ngược

    // 1. Tạo đơn hàng ngay khi vào trang (hoặc bạn có thể làm nút Xác nhận rồi mới tạo)
    useEffect(() => {
        if (!showtime || !selectedSeats) {
            navigate('/'); // Nếu không có dữ liệu thì đá về trang chủ
            return;
        }

        const createOrder = async () => {
            try {
                const res = await bookingService.createBooking({
                    showtimeId: showtime._id,
                    seats: selectedSeats
                });
                
                setBooking(res.data.booking);
                setQrUrl(res.data.qrUrl);
                // Set thời gian đếm ngược dựa trên expiresAt từ server
                const expireTime = new Date(res.data.booking.expiresAt).getTime();
                const now = new Date().getTime();
                setTimeLeft(Math.floor((expireTime - now) / 1000));
                
            } catch (error) {
                console.error(error);
                toast.error(error.response?.data?.msg || "Lỗi tạo đơn hàng");
                navigate(-1); // Quay lại trang trước
            } finally {
                setIsLoading(false);
            }
        };

        createOrder();
    }, []);

    // 2. Logic đếm ngược
    useEffect(() => {
        if (!booking) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate('/'); // Hết giờ -> Về trang chủ hoặc hiện thông báo
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [booking]);

    // Format giây thành MM:SS
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    // 3. LẮNG NGHE SOCKET THANH TOÁN THÀNH CÔNG
    useEffect(() => {
        if (!socket || !booking) return;
        const eventName = `payment_success_${booking._id}`;
        
        socket.on(eventName, (data) => {
            // 👇 LOG ĐÃ SỬA: Thêm chữ [SOCKET] to rõ
            console.group("🎉 THANH TOÁN THÀNH CÔNG");
            console.log("🚀 Nguồn xử lý: SOCKET IO (Real-time)");
            console.log("Dữ liệu:", data);
            console.groupEnd();

            toast.success("Thanh toán thành công! (Xử lý bởi Socket)");
            navigate('/payment/success', { state: { bookingId: booking._id } });
        });

        return () => socket.off(eventName);
    }, [socket, booking]);

    // 2. LOGIC POLLING (Thêm nhãn [POLLING])
    useEffect(() => {
        if (!booking) return;

        const checkStatus = async () => {
            try {
                const res = await bookingService.getBookingDetail(booking._id);
                const currentStatus = res.data.booking?.status;

                // Log nhẹ để biết polling vẫn đang chạy ngầm
                console.log(`🔍 [Polling] Đang kiểm tra... Status: ${currentStatus}`);

                if (currentStatus === 'success') {
                    // 👇 LOG ĐÃ SỬA: Thêm chữ [POLLING]
                    console.group("🎉 THANH TOÁN THÀNH CÔNG");
                    console.log("🐢 Nguồn xử lý: POLLING API (Dự phòng)");
                    console.log("Trạng thái:", currentStatus);
                    console.groupEnd();

                    toast.success("Giao dịch hoàn tất! (Xử lý bởi Polling)");
                    navigate('/payment/success', { state: { bookingId: booking._id } });
                }
            } catch (error) {
                console.error("Lỗi polling:", error);
            }
        };

        const intervalId = setInterval(checkStatus, 3000); // 3 giây hỏi 1 lần
        return () => clearInterval(intervalId);
    }, [booking, navigate]);
    
    // --- RENDER ---
    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#0f0f1b] text-white">
                <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
                <span className="ml-3">Đang tạo đơn hàng...</span>
            </div>
        );
    }

    if (!booking) return null;

    // Hàm Hủy giao dịch (Nút Quay lại)
    const handleCancel = () => {
        // 1. Nếu có socket, bắn tin hiệu nhả ghế ngay lập tức
        if (socket && booking) {
            // Lặp qua từng ghế để nhả (hoặc backend có API release batch thì tốt hơn)
            // Ở đây ta dùng socket release từng ghế cho nhanh
            booking.seats.forEach(s => {
                socket.emit('release_seat', { 
                    showtimeId: booking.showtime, 
                    seatName: s.seatName, 
                    userId: booking.user 
                });
            });
        }
        
        // 2. Quay về trang chủ hoặc trang chọn ghế
        navigate(-1); // Quay lại trang trước
    };

    return (
        <div className="min-h-screen bg-[#0f0f1b] text-white py-10 px-4">
            {/* Thêm nút Back ở góc trên cùng */}
            <div className="max-w-4xl mx-auto mb-4 pt-4">
                <Button variant="ghost" onClick={handleCancel} className="text-gray-400 hover:text-white pl-0">
                    <ArrowLeft className="mr-2 w-5 h-5" /> Hủy & Quay lại chọn ghế
                </Button>
            </div>
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Cột Trái: Thông tin QR */}
                <div className="bg-[#1c1c2e] p-8 rounded-2xl border border-white/10 flex flex-col items-center text-center">
                    <h2 className="text-2xl font-bold mb-2 text-purple-400">Thanh toán qua VietQR</h2>
                    <p className="text-gray-400 text-sm mb-6">Mở App ngân hàng và quét mã bên dưới</p>

                    {/* Khung QR */}
                    <div className="bg-white p-4 rounded-xl shadow-lg mb-6">
                        <img src={qrUrl} alt="VietQR" className="w-64 h-64 object-contain" />
                    </div>

                    {/* Đồng hồ đếm ngược */}
                    <div className="flex items-center gap-2 text-yellow-400 font-mono text-xl bg-yellow-400/10 px-4 py-2 rounded-lg border border-yellow-400/20 mb-6">
                        <Clock className="w-5 h-5" />
                        <span>Đơn hàng hết hạn sau: {formatTime(timeLeft)}</span>
                    </div>

                    <div className="w-full space-y-4 text-left">
                        <div className="bg-[#2c2c44] p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="text-xs text-gray-400">Số tiền</p>
                                <p className="text-xl font-bold text-green-400">{booking.totalPrice.toLocaleString()} đ</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => {navigator.clipboard.writeText(booking.totalPrice); toast.success("Đã copy số tiền")}}>
                                <Copy className="w-4 h-4 text-gray-400" />
                            </Button>
                        </div>

                        <div className="bg-[#2c2c44] p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="text-xs text-gray-400">Nội dung chuyển khoản (Bắt buộc)</p>
                                <p className="text-xl font-bold text-purple-400">{booking.bookingCode}</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => {navigator.clipboard.writeText(booking.bookingCode); toast.success("Đã copy nội dung")}}>
                                <Copy className="w-4 h-4 text-gray-400" />
                            </Button>
                        </div>
                    </div>
                    
                    <p className="mt-6 text-xs text-gray-500 italic">
                        *Hệ thống sẽ tự động xác nhận khi nhận được tiền. Vui lòng không tắt trình duyệt.
                    </p>
                </div>

                {/* Cột Phải: Thông tin Vé */}
                <div className="bg-[#1c1c2e] p-8 rounded-2xl border border-white/10 h-fit">
                    <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Thông tin đặt vé</h3>
                    
                    <div className="flex gap-4 mb-6">
                        <img src={showtime.movie.posterUrl} className="w-20 h-28 object-cover rounded" alt="Poster" />
                        <div>
                            <h4 className="font-bold text-lg">{showtime.movie.title}</h4>
                            <p className="text-gray-400 text-sm">{showtime.room.theater.name}</p>
                            <p className="text-gray-400 text-sm">{showtime.room.name}</p>
                            <p className="text-gray-400 text-sm">
                                {new Date(showtime.startTime).toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit'})} - 
                                {new Date(showtime.startTime).toLocaleDateString('vi-VN')}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2 mb-6">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Ghế đã chọn</span>
                            <span className="font-bold">{selectedSeats.join(', ')}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Combo</span>
                            <span className="font-bold">-</span>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-4 flex justify-between items-end">
                        <span className="text-gray-400">Tổng thanh toán</span>
                        <span className="text-2xl font-bold text-yellow-500">{booking.totalPrice.toLocaleString()} đ</span>
                    </div>
                </div>
            </div>
        </div>
    );
}