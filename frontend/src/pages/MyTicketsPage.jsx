import React, { useEffect, useState } from 'react';
import { bookingService } from '@/services/bookingService';
import { useAuthStore } from '@/store/useAuthStore'; // Lấy thông tin user
import { Loader2, Ticket, Calendar, MapPin, Clock, X, User, Mail, Phone, QrCode, CreditCard, Armchair , ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';

export default function MyTicketsPage() {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // 1️⃣ State lưu vé đang được chọn để xem chi tiết
    const [selectedBooking, setSelectedBooking] = useState(null);
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await bookingService.getMyBookings();
                setBookings(res.data.bookings);
            } catch (error) {
                console.error("Lỗi tải vé:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBookings();
    }, []);

    // Hàm đóng modal
    const closeDetail = () => setSelectedBooking(null);

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#0f0f1b] text-white">
                <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f0f1b] text-white py-10 px-4 relative">
            <div className="max-w-5xl mx-auto">
                {/* 👇 1. NÚT BACK VỀ TRANG CHỦ */}
                <div className="mb-6">
                    <Button 
                        variant="ghost" 
                        onClick={() => navigate('/')} 
                        className="text-gray-400 hover:text-white hover:bg-white/10 pl-0"
                    >
                        <ArrowLeft className="mr-2 h-5 w-5" /> Quay lại trang chủ
                    </Button>
                </div>
                
                <div className="flex items-center gap-3 mb-8">
                    <Ticket className="w-8 h-8 text-yellow-500" />
                    <h1 className="text-3xl font-bold">Vé của tôi</h1>
                </div>

                {bookings.length === 0 ? (
                    <div className="text-center py-20 bg-[#1c1c2e] rounded-2xl border border-white/5">
                        <p className="text-gray-400 mb-4">Bạn chưa đặt vé nào cả.</p>
                        <Button onClick={() => navigate('/')}>Đặt vé ngay</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {bookings.map((booking) => (
                            <div key={booking._id} onClick={() => setSelectedBooking(booking)} className="cursor-pointer">
                                <TicketCard booking={booking} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 2️⃣ MODAL CHI TIẾT VÉ (Chỉ hiện khi selectedBooking != null) */}
            {selectedBooking && (
                <BookingDetailModal 
                    booking={selectedBooking} 
                    onClose={closeDetail} 
                />
            )}
        </div>
    );
}

// --- SUB-COMPONENT: CARD VÉ (Ở LIST) ---
function TicketCard({ booking }) {
    const { showtime, seats, status, bookingCode } = booking;
    const movie = showtime.movie;

    const getStatusColor = (st) => {
        switch(st) {
            case 'success': return 'bg-green-500/20 text-green-400 border-green-500/50';
            case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
            case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/50';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    return (
        <div className="bg-[#1c1c2e] rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all flex group h-full">
            <div className="w-1/3 relative">
                <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1c1c2e]/90"></div>
            </div>
            <div className="w-2/3 p-5 flex flex-col justify-between relative">
                <div>
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg leading-tight line-clamp-1 group-hover:text-purple-400 transition-colors">{movie.title}</h3>
                        <Badge variant="outline" className={`ml-2 whitespace-nowrap text-[10px] ${getStatusColor(status)}`}>
                            {status === 'success' ? 'Thành công' : status}
                        </Badge>
                    </div>
                    <p className="text-sm text-gray-400 flex items-center gap-2 mb-1">
                        <Calendar className="w-3 h-3" /> {new Date(showtime.startTime).toLocaleDateString('vi-VN')}
                    </p>
                    <p className="text-sm text-gray-400 flex items-center gap-2">
                        <Clock className="w-3 h-3" /> {new Date(showtime.startTime).toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit'})}
                    </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-end">
                    <span className="text-sm text-gray-300 font-medium">{seats.length} vé</span>
                    <span className="font-mono font-bold text-yellow-400">{bookingCode}</span>
                </div>
            </div>
        </div>
    );
}

// --- 3️⃣ SUB-COMPONENT: MODAL CHI TIẾT (FULL INFO) ---
function BookingDetailModal({ booking, onClose }) {
    // Lấy thông tin user hiện tại từ Store (Vì API mine chưa chắc populate user)
    const currentUser = useAuthStore(state => state.user);
    
    const { showtime, seats, totalPrice, status, bookingCode, createdAt, paymentMethod } = booking;
    const movie = showtime.movie;
    const theater = showtime.room.theater;

    return (
        // LỚP PHỦ MỜ (Backdrop Blur)
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={onClose} // Ấn ra ngoài thì đóng
        >
            {/* CONTAINER CHÍNH */}
            <div 
                className="bg-[#1c1c2e] w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()} // Chặn sự kiện click để không đóng khi ấn vào nội dung
            >
                {/* HEADER */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#25253a]">
                    <h2 className="text-xl font-bold text-purple-400 flex items-center gap-2">
                        <Ticket className="w-5 h-5" /> Chi tiết vé đặt
                    </h2>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-white/10">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* BODY: SCROLLABLE */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    
                    {/* Phần 1: Thông tin Phim & Mã vé */}
                    <div className="flex gap-6 mb-8">
                        <img src={movie.posterUrl} className="w-32 h-48 object-cover rounded-lg shadow-lg hidden sm:block" alt="Poster"/>
                        <div className="flex-1 space-y-4">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">{movie.title}</h3>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="secondary">{movie.ageRating || 'T16'}</Badge>
                                    <Badge variant="outline" className={
                                        status === 'success' ? 'text-green-400 border-green-500' : 'text-red-400 border-red-500'
                                    }>
                                        {status === 'success' ? 'Đã thanh toán' : 'Chưa thanh toán/Hủy'}
                                    </Badge>
                                </div>
                            </div>

                            <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase mb-1">Mã đặt vé</p>
                                    <p className="text-2xl font-mono font-bold text-yellow-500 tracking-wider">{bookingCode}</p>
                                </div>
                                <QrCode className="w-10 h-10 text-white/50" />
                            </div>
                        </div>
                    </div>

                    {/* Phần 2: Grid thông tin chi tiết */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Cột Trái: Thông tin chiếu */}
                        <div className="space-y-4">
                            <h4 className="font-bold text-gray-300 border-b border-white/10 pb-2">Thông tin suất chiếu</h4>
                            
                            <InfoRow icon={<MapPin className="text-blue-400"/>} label="Rạp chiếu" value={theater.name} />
                            <InfoRow icon={<MapPin className="text-gray-500"/>} label="Địa chỉ" value={theater.address} />
                            <InfoRow icon={<CreditCard className="text-purple-400"/>} label="Phòng chiếu" value={showtime.room.name} />
                            <InfoRow 
                                icon={<Calendar className="text-green-400"/>} 
                                label="Thời gian chiếu" 
                                value={`${new Date(showtime.startTime).toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit'})} - ${new Date(showtime.startTime).toLocaleDateString('vi-VN')}`} 
                            />
                        </div>

                        {/* Cột Phải: Thông tin giao dịch & Khách hàng */}
                        <div className="space-y-4">
                            <h4 className="font-bold text-gray-300 border-b border-white/10 pb-2">Giao dịch & Khách hàng</h4>

                            <InfoRow icon={<Clock className="text-orange-400"/>} label="Thời gian đặt" value={new Date(createdAt).toLocaleString('vi-VN')} />
                            <InfoRow icon={<User className="text-pink-400"/>} label="Khách hàng" value={currentUser?.name || "N/A"} />
                            <InfoRow icon={<Mail className="text-cyan-400"/>} label="Email" value={currentUser?.email || "N/A"} />
                            <InfoRow icon={<CreditCard className="text-yellow-400"/>} label="Phương thức" value={paymentMethod || "VietQR"} />
                        </div>
                    </div>

                    {/* Phần 3: Danh sách ghế & Tổng tiền */}
                    <div className="mt-8 bg-purple-500/10 rounded-xl p-5 border border-purple-500/20">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <Armchair className="w-6 h-6 text-purple-400" />
                                <div>
                                    <p className="font-bold text-white">Danh sách ghế ({seats.length})</p>
                                    <p className="text-sm text-purple-300/80">
                                        {seats.map(s => s.seatName).join(', ')}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-purple-500/20">
                            <span className="text-gray-300">Tổng thanh toán</span>
                            <span className="text-2xl font-bold text-white">{totalPrice.toLocaleString()} đ</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

// Helper component cho dòng thông tin nhỏ
const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-start gap-3">
        <div className="mt-1 w-4 h-4">{React.cloneElement(icon, { className: `w-4 h-4 ${icon.props.className}` })}</div>
        <div>
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-sm font-medium text-gray-200">{value}</p>
        </div>
    </div>
);