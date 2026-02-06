import React, { useEffect, useState } from 'react';
import { bookingService } from '@/services/bookingService';
import { useAuthStore } from '@/store/useAuthStore'; // Get user information
import { Loader2, Ticket, Calendar, MapPin, Clock, X, User, Mail, Phone, QrCode, CreditCard, Armchair , ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';

export default function MyTicketsPage() {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // State to store selected ticket for detail view
    const [selectedBooking, setSelectedBooking] = useState(null);
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await bookingService.getMyBookings();
                setBookings(res.data.bookings);
            } catch (error) {
                console.error("Error loading tickets:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBookings();
    }, []);

    // Function to close modal
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
                {/* 1. BACK TO HOME BUTTON */}
                <div className="mb-6">
                    <Button 
                        variant="ghost" 
                        onClick={() => navigate('/')} 
                        className="text-gray-400 hover:text-white hover:bg-white/10 pl-0"
                    >
                        <ArrowLeft className="mr-2 h-5 w-5" /> Back to Home
                    </Button>
                </div>
                
                <div className="flex items-center gap-3 mb-8">
                    <Ticket className="w-8 h-8 text-yellow-500" />
                    <h1 className="text-3xl font-bold">My Tickets</h1>
                </div>

                {bookings.length === 0 ? (
                    <div className="text-center py-20 bg-[#1c1c2e] rounded-2xl border border-white/5">
                        <p className="text-gray-400 mb-4">You haven't booked any tickets yet.</p>
                        <Button onClick={() => navigate('/')}>Book Now</Button>
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

            {/* TICKET DETAIL MODAL (Only show when selectedBooking != null) */}
            {selectedBooking && (
                <BookingDetailModal 
                    booking={selectedBooking} 
                    onClose={closeDetail} 
                />
            )}
        </div>
    );
}

// --- SUB-COMPONENT: TICKET CARD (In List) ---
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
                            {status === 'success' ? 'Successful' : status}
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
                    <span className="text-sm text-gray-300 font-medium">{seats.length} tickets</span>
                    <span className="font-mono font-bold text-yellow-400">{bookingCode}</span>
                </div>
            </div>
        </div>
    );
}

// --- SUB-COMPONENT: DETAIL MODAL (FULL INFO) ---
function BookingDetailModal({ booking, onClose }) {
    // Get current user info from Store (API mine may not populate user)
    const currentUser = useAuthStore(state => state.user);
    
    const { showtime, seats, totalPrice, status, bookingCode, createdAt, paymentMethod } = booking;
    const movie = showtime.movie;
    const theater = showtime.room.theater;

    return (
        // BLUR OVERLAY (Backdrop Blur)
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={onClose} // Click outside to close
        >
            {/* MAIN CONTAINER */}
            <div 
                className="bg-[#1c1c2e] w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()} // Prevent click event to not close when clicking content
            >
                {/* HEADER */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#25253a]">
                    <h2 className="text-xl font-bold text-purple-400 flex items-center gap-2">
                        <Ticket className="w-5 h-5" /> Booking Details
                    </h2>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-white/10">
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* BODY: SCROLLABLE */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    
                    {/* Section 1: Movie Info & Booking Code */}
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
                                        {status === 'success' ? 'Paid' : 'Unpaid/Cancelled'}
                                    </Badge>
                                </div>
                            </div>

                            <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase mb-1">Booking Code</p>
                                    <p className="text-2xl font-mono font-bold text-yellow-500 tracking-wider">{bookingCode}</p>
                                </div>
                                <QrCode className="w-10 h-10 text-white/50" />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Detailed Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Left Column: Showtime Info */}
                        <div className="space-y-4">
                            <h4 className="font-bold text-gray-300 border-b border-white/10 pb-2">Showtime Information</h4>
                            
                            <InfoRow icon={<MapPin className="text-blue-400"/>} label="Theater" value={theater.name} />
                            <InfoRow icon={<MapPin className="text-gray-500"/>} label="Address" value={theater.address} />
                            <InfoRow icon={<CreditCard className="text-purple-400"/>} label="Screening Room" value={showtime.room.name} />
                            <InfoRow 
                                icon={<Calendar className="text-green-400"/>} 
                                label="Showtime" 
                                value={`${new Date(showtime.startTime).toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit'})} - ${new Date(showtime.startTime).toLocaleDateString('vi-VN')}`} 
                            />
                        </div>

                        {/* Right Column: Transaction & Customer Info */}
                        <div className="space-y-4">
                            <h4 className="font-bold text-gray-300 border-b border-white/10 pb-2">Transaction & Customer</h4>

                            <InfoRow icon={<Clock className="text-orange-400"/>} label="Booking Time" value={new Date(createdAt).toLocaleString('vi-VN')} />
                            <InfoRow icon={<User className="text-pink-400"/>} label="Customer" value={currentUser?.name || "N/A"} />
                            <InfoRow icon={<Mail className="text-cyan-400"/>} label="Email" value={currentUser?.email || "N/A"} />
                            <InfoRow icon={<CreditCard className="text-yellow-400"/>} label="Payment Method" value={paymentMethod || "VietQR"} />
                        </div>
                    </div>

                    {/* Section 3: Seat List & Total */}
                    <div className="mt-8 bg-purple-500/10 rounded-xl p-5 border border-purple-500/20">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <Armchair className="w-6 h-6 text-purple-400" />
                                <div>
                                    <p className="font-bold text-white">Seat List ({seats.length})</p>
                                    <p className="text-sm text-purple-300/80">
                                        {seats.map(s => s.seatName).join(', ')}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-purple-500/20">
                            <span className="text-gray-300">Total Payment</span>
                            <span className="text-2xl font-bold text-white">{totalPrice.toLocaleString()} VND</span>
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