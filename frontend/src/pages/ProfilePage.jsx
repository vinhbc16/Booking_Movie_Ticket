import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { bookingService } from "@/services/bookingService";
import { userService } from "@/services/userService";
import { User, Clock, MapPin, Edit2, Save, X, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Helper function to convert ISO Date to YYYY-MM-DD for input
const formatDateForInput = (isoDateString) => {
  if (!isoDateString) return "";
  const date = new Date(isoDateString);
  if (isNaN(date.getTime())) return ""; // Check invalid date
  return date.toISOString().split("T")[0];
};
export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-20">
      {/* Light header background */}
      <div className="bg-gray-50 border-b py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gray-200 overflow-hidden">
                <img
                  src={`https://ui-avatars.com/api/?name=${user?.name}&background=random&color=fff`}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-red-600 hover:bg-red-700">
                  VIP Member
                </Badge>
                <span className="text-sm text-gray-500">Joined since 2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl mt-8 space-y-10">
        {/* 1. PERSONAL INFO FORM */}
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <User className="text-red-600" /> Personal Information
          </h2>
          <PersonalInfoForm user={user} />
        </section>

        <hr className="border-gray-100" />

        {/* 2. BOOKING HISTORY */}
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Clock className="text-red-600" /> Booking History
          </h2>
          <RecentBookings />
        </section>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: FORM (Light Theme + Edit Mode + Gender) ---
const PersonalInfoForm = ({ user: initialUser }) => {
  const [isEditing, setIsEditing] = useState(false); // State to manage edit mode
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    sex: "Male", // Default
    birthDate: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Call API to get latest data from DB when component loads
  useEffect(() => {
    const fetchUserData = async () => {
      if (!initialUser?.userID) return;
      try {
        // Call API to get user detail
        const res = await userService.getProfile(initialUser.userID);
        const userData = res.data.user;

        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          sex: userData.sex || "Male", // Load gender
          birthDate: formatDateForInput(userData.dateOfBirth),
        });
      } catch (error) {
        console.error("Error loading user info:", error);
      }
    };

    fetchUserData();
  }, [initialUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Call Update API - use dateOfBirth for DB
            const dataToUpdate = {
                name: formData.name,
                phone: formData.phone,
                sex: formData.sex,
                dateOfBirth: formData.birthDate === '' ? null : formData.birthDate
            };
            await userService.updateProfile(initialUser.userID, dataToUpdate);
            
            // Show success message
            toast.success("Profile updated successfully!");
            setIsEditing(false);

            // Reload new data after update
            const res = await userService.getProfile(initialUser.userID);
            const userData = res.data.user;
            setFormData({
              name: userData.name || "",
              email: userData.email || "",
              phone: userData.phone || "",
              sex: userData.sex || "Male",
              birthDate: formatDateForInput(userData.dateOfBirth),
            });

        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.msg || "Update failed");
        } finally {
            setIsLoading(false);
        }
    };

  // Function to cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    // Can call fetchUserData again if want to reset form
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6 relative">
      {/* Edit / Cancel button in top corner */}
      <div className="absolute top-6 right-6 z-10">
        {!isEditing ? (
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => setIsEditing(true)}
            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <Edit2 className="w-4 h-4 mr-2" /> Edit
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4 mr-2" /> Cancel
          </Button>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4"
      >
        {/* FULL NAME */}
        <div className="space-y-2">
          <Label>Full Name</Label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={!isEditing} // 🔥 Disable nếu không phải mode sửa
            className="bg-white border-gray-300 focus:border-red-500 text-gray-900 disabled:bg-gray-50 disabled:text-gray-600"
          />
        </div>

        {/* GENDER (New) */}
        <div className="space-y-2">
          <Label>Gender</Label>
          <Select
            value={formData.sex}
            onValueChange={(val) => setFormData({ ...formData, sex: val })}
            disabled={!isEditing} // Disable
          >
            <SelectTrigger className="bg-white border-gray-300 disabled:bg-gray-50 disabled:text-gray-600">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* DATE OF BIRTH */}
        <div className="space-y-2">
          <Label>Date of Birth</Label>
          <Input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            disabled={!isEditing}
            className="bg-white border-gray-300 focus:border-red-500 text-gray-900 disabled:bg-gray-50 disabled:text-gray-600"
          />
        </div>

        {/* PHONE NUMBER */}
        <div className="space-y-2">
          <Label>Phone Number</Label>
          <Input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={!isEditing}
            className="bg-white border-gray-300 focus:border-red-500 text-gray-900 disabled:bg-gray-50 disabled:text-gray-600"
          />
        </div>

        {/* EMAIL - Always disabled */}
        <div className="space-y-2 md:col-span-2">
          <Label>
            Email{" "}
            <span className="text-xs text-gray-400 font-normal">
              (Cannot be changed)
            </span>
          </Label>
          <Input
            value={formData.email}
            disabled={true}
            className="bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed"
          />
        </div>

        {/* SAVE BUTTON - Only show when editing */}
        {isEditing && (
          <div className="md:col-span-2 flex justify-end animate-in fade-in zoom-in duration-300">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-6"
            >
              {isLoading ? (
                "Saving..."
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </>
              )}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

// --- SUB-COMPONENT: HISTORY LIST (Light Theme) ---
const RecentBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await bookingService.getMyBookings();
        setBookings(res.data.bookings || []);
      } catch (error) {}
    };
    fetchBookings();
  }, []);

  if (bookings.length === 0)
    return <p className="text-gray-500">No booking history yet.</p>;

  return (
    <div className="grid grid-cols-1 gap-4">
      {bookings.map((booking) => (
        <div
          key={booking._id}
          className="bg-white border rounded-lg p-4 flex gap-4 hover:shadow-md transition-shadow"
        >
          <img
            src={booking.showtime.movie.posterUrl}
            className="w-20 h-28 object-cover rounded"
            alt="Poster"
          />
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg text-gray-900">
                {booking.showtime.movie.title}
              </h3>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <MapPin size={14} /> {booking.showtime.room.theater.name} -{" "}
                {booking.showtime.room.name}
              </p>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <Clock size={14} />{" "}
                {new Date(booking.showtime.startTime).toLocaleString("vi-VN")}
              </p>
            </div>
            <div className="flex justify-between items-end mt-2">
              <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                Seats: {booking.seats.map((s) => s.seatName).join(", ")}
              </span>
              <Badge
                variant={booking.status === "success" ? "default" : "secondary"}
                className={booking.status === "success" ? "bg-green-600" : ""}
              >
                {booking.status === "success"
                  ? "Paid"
                  : booking.status}
              </Badge>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
