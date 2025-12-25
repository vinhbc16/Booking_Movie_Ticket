import React, { useEffect, useState } from "react";
import { userService } from "@/services/userService";
import { Loader2, Search, Trash2, Edit, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"; // Import Dialog của Shadcn
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Helper format date
const formatDateForInput = (isoDateString) => {
  if (!isoDateString) return "";
  const date = new Date(isoDateString);
  if (isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};
export default function AdminUserPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  // State cho Modal Edit
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await userService.getAllUsers({ search, limit: 100 });
      setUsers(res.data.users);
    } catch (error) {
      toast.error("Lỗi tải danh sách");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Debounce simple implementation
    const timeout = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(timeout);
  }, [search]);

  // Mở Modal Edit
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  // Callback khi update thành công
  const onUpdateSuccess = () => {
    setIsDialogOpen(false);
    fetchUsers();
    toast.success("Cập nhật user thành công");
  };

  return (
    <div className="p-6 bg-white min-h-screen text-gray-900">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">
        Quản lý người dùng
      </h1>

      <div className="bg-white border rounded-lg p-4 mb-6 shadow-sm">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Tìm theo tên hoặc email..."
            className="pl-10 border-gray-300 focus:border-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="text-gray-700 font-bold">
                Người dùng
              </TableHead>
              <TableHead className="text-gray-700 font-bold">Vai trò</TableHead>
              <TableHead className="text-gray-700 font-bold">
                Ngày tạo
              </TableHead>
              <TableHead className="text-right text-gray-700 font-bold">
                Hành động
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <Loader2 className="animate-spin mx-auto text-blue-500" />
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => (
                <TableRow
                  key={u._id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleEditClick(u)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 border overflow-hidden">
                        <img
                          src={`https://ui-avatars.com/api/?name=${u.name}&background=random`}
                          alt={u.name}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{u.name}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={u.role === "admin" ? "destructive" : "secondary"}
                    >
                      {u.role.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {new Date(u.createdAt).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* MODAL EDIT USER */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white text-gray-900 border-gray-200">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin chi tiết cho tài khoản này.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <EditUserForm user={selectedUser} onSuccess={onUpdateSuccess} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// --- SUB-COMPONENT: FORM EDIT TRONG MODAL ---
function EditUserForm({ user, onSuccess }) {
  // State form
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    birthDate: "",
    sex: "Nam",
    role: "", // Role chỉ để hiển thị
  });
  const [isLoading, setIsLoading] = useState(false);

  // 🔥 Effect: Khi user prop thay đổi (mở modal), gọi API lấy chi tiết mới nhất
  useEffect(() => {
    const fetchDetail = async () => {
      if (!user._id) return;
      try {
        // Gọi API admin get detail
        const res = await userService.adminGetUser(user._id);
        const u = res.data.user;

        // Fill dữ liệu vào form
        setFormData({
          name: u.name || "",
          phone: u.phone || "",
          role: u.role || "customer",
          sex: u.sex || "Nam",
          birthDate: formatDateForInput(u.birthDate),
        });
      } catch (error) {
        toast.error("Không thể tải thông tin chi tiết user");
      }
    };
    fetchDetail();
  }, [user]);

 const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // FIX LỖI 400 BAD REQUEST Ở ĐÂY
            // Nếu birthDate là chuỗi rỗng "", gửi null hoặc undefined để Mongoose không lỗi
            const dataToSend = {
                name: formData.name,
                phone: formData.phone,
                gender: formData.gender,
                birthDate: formData.birthDate === '' ? null : formData.birthDate 
            };
            
            await userService.adminUpdateUser(user._id, dataToSend);
            onSuccess();
        } catch (error) {
            console.error(error);
            toast.error("Lỗi cập nhật user: " + (error.response?.data?.msg || "Lỗi server"));
        } finally {
            setIsLoading(false);
        }
    };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Họ tên</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Số điện thoại</Label>
          <Input
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Ngày sinh</Label>
          <Input
            type="date"
            value={formData.birthDate}
            onChange={(e) =>
              setFormData({ ...formData, birthDate: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Giới tính</Label>
          <Select
            value={formData.sex}
            onValueChange={(val) => setFormData({ ...formData, sex: val })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="Nam">Nam</SelectItem>
              <SelectItem value="Nữ">Nữ</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 🔥 ROLE: Chỉ hiển thị, KHÔNG CHO SỬA */}
      <div className="space-y-2">
        <Label>Vai trò (Không thể chỉnh sửa)</Label>
        <div className="pt-1">
          <Badge
            variant={formData.role === "admin" ? "destructive" : "secondary"}
            className="text-sm px-3 py-1"
          >
            {formData.role.toUpperCase()}
          </Badge>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t mt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </div>
    </form>
  );
}
