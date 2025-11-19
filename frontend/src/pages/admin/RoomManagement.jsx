import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router' // Import hooks
import { toast } from 'sonner'
import { PlusCircle, Search, ArrowLeft } from 'lucide-react'

// Import shadcn components
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'

// Import services và components
import { theaterService } from '@/services/theaterService' // Để lấy tên rạp
import { roomService } from '@/services/roomService'
import { AddRoomForm } from '@/components/admin/AddRoomForm'
import { RoomListItem } from '@/components/admin/RoomListItem'

export default function RoomManagement() {
  const { theaterId } = useParams() // 1. Lấy theaterId từ URL
  const navigate = useNavigate() // Để quay lại
  
  const [theater, setTheater] = useState(null) // State cho tên rạp
  const [rooms, setRooms] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState(null)

  // 2. Hàm gọi API
  const fetchRooms = () => {
    setIsLoading(true)
    // Gọi service với theaterId
    roomService.getRooms(theaterId, { page: currentPage, search: searchTerm })
      .then(response => {
        setRooms(response.data.roomsList)
        setTotalPages(response.data.totalPages)
      })
      .catch(err => {
        console.error(err);
        toast.error(err.response?.data?.msg || "Lỗi khi tải danh sách phòng!");
      })
      .finally(() => setIsLoading(false))
  }

  // 3. Hàm lấy tên rạp (chỉ chạy 1 lần)
  useEffect(() => {
    theaterService.getTheater(theaterId)
      .then(response => {
        setTheater(response.data.theater)
      })
      .catch(err => {
        console.error(err);
        toast.error("Không tìm thấy rạp này.");
        navigate('/admin/theaters'); // Quay lại nếu ko tìm thấy rạp
      })
  }, [theaterId, navigate])

  // 4. Chạy lại khi page/search thay đổi
  useEffect(() => {
    if (theater) { // Chỉ fetch rooms khi đã có thông tin rạp
      fetchRooms()
    }
  }, [currentPage, searchTerm, theater]) // Thêm theater vào dependency

  // ... (handleSearchChange, handleOpenEdit, handleOpenCreate giữ nguyên như TheaterManagement) ...
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }
  const handleOpenEdit = (room) => {
    setEditingRoom(room)
    setIsDialogOpen(true)
  }
  const handleOpenCreate = () => {
    setEditingRoom(null)
    setIsDialogOpen(true)
  }

  // 5. Xử lý submit (phải truyền theaterId)
  const handleFormSubmit = (formData) => {
    const { _id, ...dataToSubmit } = formData;
    
    // Thêm theaterId vào data (schema của bạn yêu cầu)
    dataToSubmit.theater = theaterId;

    const apiCall = editingRoom
      ? roomService.updateRoom(theaterId, editingRoom._id, dataToSubmit)
      : roomService.createRoom(theaterId, dataToSubmit)
    
    toast.promise(apiCall, {
      loading: "Đang lưu...",
      success: (response) => {
        fetchRooms() // Tải lại
        setIsDialogOpen(false)
        return response.data.msg
      },
      error: (err) => err.response?.data?.message || "Lưu thất bại!",
    })
  }

  // 6. Xử lý xóa (phải truyền theaterId và roomId)
  const handleDelete = (roomId) => {
    toast.warning("Bạn có chắc muốn xóa phòng này?", {
      description: "Hành động này sẽ bị từ chối nếu phòng có suất chiếu đã đặt vé.",
      action: {
        label: "Xóa",
        onClick: () => {
          toast.promise(roomService.deleteRoom(theaterId, roomId), {
            loading: "Đang xóa...",
            success: (response) => {
              fetchRooms() // Tải lại
              return response.data.msg
            },
            error: (err) => err.response?.data?.message || "Xóa thất bại!",
          })
        },
      },
      cancel: { label: "Hủy" }
    })
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Card>
        <CardHeader>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/admin/theaters')}
            className="mb-4 w-fit"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách rạp
          </Button>
          <CardTitle className="text-2xl">
            Quản lý phòng
          </CardTitle>
          <CardDescription>
            Thêm, sửa, xóa phòng cho rạp: <span className="font-bold text-primary">{theater?.name || '...'}</span>
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between space-x-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm phòng theo tên..."
                className="pl-10"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <DialogTrigger asChild>
              <Button onClick={handleOpenCreate}>
                <PlusCircle className="mr-2 h-4 w-4" /> Thêm phòng mới
              </Button>
            </DialogTrigger>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <p>Đang tải...</p>
            ) : rooms.length > 0 ? (
              rooms.map(room => (
                <RoomListItem
                  key={room._id}
                  room={room}
                  onEdit={handleOpenEdit}
                  onDelete={() => handleDelete(room._id)}
                />
              ))
            ) : (
              <p className="text-center text-muted-foreground">Không tìm thấy phòng nào.</p>
            )}
          </div>
        </CardContent>

        {/* == Phân trang == */}
        {totalPages > 1 && (
          <CardFooter>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.max(1, p - 1)); }}
                    disabled={currentPage === 1}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    {currentPage} / {totalPages}
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.min(totalPages, p + 1)); }}
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        )}
      </Card>

      {/* == Dialog Thêm/Sửa Phòng == */}
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{editingRoom ? 'Chỉnh sửa phòng' : 'Thêm phòng mới'}</DialogTitle>
          <DialogDescription>
            Điền thông tin chi tiết của phòng.
          </DialogDescription>
        </DialogHeader>
        <AddRoomForm 
          onSubmit={handleFormSubmit}
          initialData={editingRoom}
        />
      </DialogContent>
    </Dialog>
  )
}