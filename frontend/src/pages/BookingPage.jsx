import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useSocket } from "@/hooks/useSocket";
import { SeatMap } from "@/features/booking/components/SeatMap";
import { useAuthStore } from "@/store/useAuthStore";
import { showtimeService } from "@/services/showtimeService";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BookingSummary } from "@/features/booking/components/BookingSummary";
import { calculateSeatPrice } from "@/lib/seatHelper";

export default function BookingPage() {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  
  // State
  const [totalPrice, setTotalPrice] = useState(0);
  const [showtime, setShowtime] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // State quản lý ghế
  const [heldSeats, setHeldSeats] = useState([]); // Ghế người khác giữ (Disable)
  const [mySeats, setMySeats] = useState([]);     // Ghế mình chọn (Màu vàng)

  // Kết nối socket
  const socket = useSocket();

  // 1. API: Lấy thông tin suất chiếu
  useEffect(() => {
    if (!showtimeId) return;

    const fetchShowtime = async () => {
      try {
        const res = await showtimeService.getShowtimeDetail(showtimeId);
        if (res.data.showtime) {
          setShowtime(res.data.showtime);
        }
      } catch (error) {
        console.error("Error loading showtime:", error);
        toast.error("Unable to load showtime information");
      } finally {
        setIsLoading(false);
      }
    };

    fetchShowtime();
  }, [showtimeId]);

  // 2. LOGIC TÍNH TIỀN TỰ ĐỘNG (Fix lỗi âm tiền)
  // Mỗi khi danh sách ghế (mySeats) thay đổi, tính lại tổng tiền từ đầu
  useEffect(() => {
    if (!showtime || !mySeats) return;

    const newTotal = mySeats.reduce((total, seatName) => {
      return total + calculateSeatPrice(seatName, showtime);
    }, 0);

    setTotalPrice(newTotal);
  }, [mySeats, showtime]);

  // 3. SOCKET: QUẢN LÝ TRẠNG THÁI GHẾ REAL-TIME
  useEffect(() => {
    if (!socket || !showtimeId) return;

    if (!socket.connected) {
      socket.connect();
    }

    // --- Định nghĩa sự kiện ---

    // A. Đồng bộ trạng thái (Khi mới vào hoặc Back lại)
    const onSyncSeatStatus = ({ heldSeats, mySeats }) => {
      console.log("🔄 Sync Data:", { heldSeats, mySeats });
      
      // 1. Cập nhật ghế người khác giữ
      setHeldSeats(heldSeats || []);

      // 2. Khôi phục ghế mình đang giữ (nếu có)
      if (mySeats && mySeats.length > 0) {
        setMySeats(mySeats);
        // Lưu ý: useEffect tính tiền ở trên sẽ tự chạy khi setMySeats xong
      }
    };

    // B. Ghế vừa bị ai đó khóa
    const onSeatLocked = ({ seatName, userId }) => {
      // Chỉ thêm vào heldSeats nếu KHÔNG PHẢI mình khóa
      if (userId !== user?.userID) {
        setHeldSeats((prev) => {
          if (!prev.includes(seatName)) return [...prev, seatName];
          return prev;
        });
      }
    };

    // C. Ghế vừa được nhả ra
    const onSeatReleased = ({ seatName }) => {
      setHeldSeats((prev) => prev.filter((s) => s !== seatName));
    };
    const onSeatsSold = (soldSeats) => {
        // Cập nhật lại list bookedSeats (Để disable ghế)
        // Cách làm: reload lại trang hoặc fetch lại API showtime
        // Cách nhanh nhất: Fetch lại API
        fetchShowtime(); 
    };

    socket.on("seats_sold", onSeatsSold); // Lắng nghe sự kiện này

    // --- Lắng nghe ---
    socket.on("sync_seat_status", onSyncSeatStatus);
    socket.on("seat_locked", onSeatLocked);
    socket.on("seat_released", onSeatReleased);

    // --- Join Room ---
    const onConnect = () => {
      console.log("🔌 Socket connected, joining room:", showtimeId);
      // Gửi kèm userId để Backend biết đường phân loại ghế
      socket.emit("join_showtime", { showtimeId, userId: user?.userID }); 
    };

    if (socket.connected) {
      onConnect();
    } else {
      socket.on("connect", onConnect);
    }

    // --- Cleanup ---
    return () => {
      socket.off("sync_seat_status", onSyncSeatStatus);
      socket.off("seat_locked", onSeatLocked);
      socket.off("seat_released", onSeatReleased);
      socket.off("connect", onConnect);
    };
  }, [socket, showtimeId, user]);

  
  // 4. HANDLER: XỬ LÝ CLICK GHẾ
  const handleSeatClick = (seatName) => {
    if (!user) {
      toast.error("Please login to book tickets");
      return;
    }

    // Trường hợp 1: Bỏ chọn ghế
    if (mySeats.includes(seatName)) {
      setMySeats((prev) => prev.filter((s) => s !== seatName));
      // Gửi socket báo nhả ghế
      socket.emit("release_seat", {
        showtimeId,
        seatName,
        userId: user.userID,
      });
    } 
    // Trường hợp 2: Chọn ghế mới
    else {
      if (mySeats.length >= 8) {
        toast.warning("You can only select up to 8 seats");
        return;
      }
      setMySeats((prev) => [...prev, seatName]);
      // Gửi socket báo giữ ghế
      socket.emit("hold_seat", { 
        showtimeId, 
        seatName, 
        userId: user.userID 
      });
    }
    // KHÔNG CẦN setTotalPrice thủ công ở đây nữa
  };


  // 5. HANDLER: XÁC NHẬN THANH TOÁN
  const handleConfirmBooking = () => {
    if (!mySeats || mySeats.length === 0) {
      toast.error("Please select at least 1 seat!");
      return;
    }

    // A. Gửi tín hiệu báo Backend: "Đừng xóa ghế, tôi đi thanh toán đây"
    if (socket && socket.connected) {
      socket.emit('start_payment', { 
        showtimeId, 
        seats: mySeats 
      });
    }

    // B. Chuyển trang
    navigate('/payment', { 
      state: { 
        showtime, 
        selectedSeats: mySeats, 
        totalPrice 
      } 
    });
  };

  // --- RENDER: LOADING ---
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0f0f1b]">
        <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
        <span className="ml-3 text-lg font-medium text-gray-400">
          Loading seat map...
        </span>
      </div>
    );
  }

  // --- RENDER: ERROR ---
  if (!showtime) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-[#0f0f1b] text-white">
        <p className="text-xl text-gray-500">Showtime not found.</p>
        <Button onClick={() => navigate("/")}>Back to Home</Button>
      </div>
    );
  }

  // --- RENDER: MAIN ---
  return (
    <div className="min-h-screen bg-[#0f0f1b] text-white pb-10">
      {/* Header */}
      <div className="bg-[#1c1c2e] border-b border-white/5 py-4 px-6 mb-8 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="text-gray-300 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="mr-2 h-5 w-5" /> Back
        </Button>
        <h1 className="text-xl font-bold uppercase tracking-wider hidden sm:block">
          Select Your Seats
        </h1>
        <div className="w-24"></div> {/* Spacer để cân đối header */}
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: SEAT MAP */}
          <div className="lg:col-span-2 overflow-x-auto custom-scrollbar pb-4">
            <SeatMap
              rows={showtime.room.numberOfRows}
              cols={showtime.room.seatsPerRow}
              // Booked seats (from DB)
              bookedSeats={showtime.seats
                .filter((s) => s.status === "booked")
                .map((s) => s.seatNumber)}
              // Seats held by others (from Redis)
              heldSeats={heldSeats}
              // Seats I'm selecting
              selectedSeats={mySeats}
              // Room configuration
              vipRows={showtime.room.vipRows}
              coupleRows={showtime.room.coupleRows}
              // Click event
              onSeatClick={handleSeatClick}
            />
          </div>

          {/* RIGHT COLUMN: SUMMARY & PAYMENT */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
                <BookingSummary
                showtime={showtime}
                selectedSeats={mySeats}
                totalPrice={totalPrice}
                onConfirm={handleConfirmBooking}
                />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}