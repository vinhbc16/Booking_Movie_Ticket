import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { PlusCircle, Search, Calendar } from 'lucide-react'

// Import shadcn components
import { Button } from '@/components/ui/button'
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"

// Import services và components
import { showtimeService } from '@/services/showtimeService'
import { theaterService } from '@/services/theaterService' // Dùng theaterService
import { AddShowtimeForm } from '@/components/admin/AddShowtimeForm'
import { ShowtimeListItem } from '@/components/admin/ShowtimeListItem'

// Hàm helper format ngày
const formatDateForAPI = (date) => {
  return date.toISOString().split('T')[0]; // "YYYY-MM-DD"
}

export default function ShowtimeManagement() {
  const [showtimes, setShowtimes] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  
  // State cho filters
  const [theaters, setTheaters] = useState([]) // Danh sách rạp
  const [selectedTheaterId, setSelectedTheaterId] = useState('')
  const [selectedDate, setSelectedDate] = useState(formatDateForAPI(new Date())) // Mặc định là hôm nay

  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // 1. Fetch TẤT CẢ rạp (cho dropdown)
  useEffect(() => {
    // Giả sử chúng ta cần một hàm lấy *tất cả* rạp
    // Tạm dùng hàm getTheaters với limit lớn
    theaterService.getTheaters({ limit: 1000 }) 
      .then(response => {
        setTheaters(response.data.theatersList);
        // Tự động chọn rạp đầu tiên
        if (response.data.theatersList.length > 0) {
          setSelectedTheaterId(response.data.theatersList[0]._id);
        }
      })
      .catch(err => toast.error("Lỗi khi tải danh sách rạp."))
  }, []) // Chỉ chạy 1 lần

  // 2. Fetch suất chiếu khi filter thay đổi
  const fetchShowtimes = () => {
    if (!selectedTheaterId || !selectedDate) {
      setShowtimes([]); // Xóa danh sách nếu không đủ filter
      return;
    }
    
    setIsLoading(true)
    showtimeService.getAll({ 
      theaterId: selectedTheaterId, 
      date: selectedDate 
    })
      .then(response => {
        setShowtimes(response.data.showtimesList)
      })
      .catch(err => {
        console.error(err);
        toast.error(err.response?.data?.msg || "Lỗi khi tải danh sách suất chiếu!");
      })
      .finally(() => setIsLoading(false))
  }

  // Chạy lại khi filter thay đổi
  useEffect(() => {
    fetchShowtimes()
  }, [selectedTheaterId, selectedDate])

  // 3. Xử lý submit
  const handleFormSubmit = (formData) => {
    // formData đã có { movie, room, basePrice, startTime }
    // Backend sẽ tự động thêm theaterId qua room
    
    toast.promise(showtimeService.create(formData), {
      loading: "Đang tạo suất chiếu...",
      success: (response) => {
        fetchShowtimes() // Tải lại danh sách
        setIsDialogOpen(false)
        return response.data.msg
      },
      // Backend sẽ tự báo lỗi conflict
      error: (err) => err.response?.data?.message || "Tạo thất bại!",
    })
  }

  // 4. Xử lý xóa
  const handleDelete = (id) => {
    toast.warning("Bạn có chắc muốn xóa suất chiếu này?", {
      description: "Hành động này sẽ bị từ chối nếu đã có vé được đặt.",
      action: {
        label: "Xóa",
        onClick: () => {
          toast.promise(showtimeService.deleteShowtime(id), {
            loading: "Đang xóa...",
            success: (response) => {
              fetchShowtimes() // Tải lại
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
          <CardTitle className="text-2xl">Quản lý suất chiếu</CardTitle>
          <CardDescription>Lọc theo rạp và ngày, sau đó thêm/xóa suất chiếu.</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* == Khu vực Filter == */}
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="theater-filter">Chọn rạp</Label>
              <Select id="theater-filter" value={selectedTheaterId} onValueChange={setSelectedTheaterId}>
                <SelectTrigger><SelectValue placeholder="Chọn rạp..." /></SelectTrigger>
                <SelectContent>
                  {theaters.map(theater => (
                    <SelectItem key={theater._id} value={theater._id}>{theater.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 space-y-2">
              <Label htmlFor="date-filter">Chọn ngày</Label>
              <Input
                id="date-filter"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>
          
          {/* == Nút Thêm == */}
          <div className="flex justify-end">
            <DialogTrigger asChild>
              <Button disabled={!selectedTheaterId}>
                <PlusCircle className="mr-2 h-4 w-4" /> Thêm suất chiếu
              </Button>
            </DialogTrigger>
          </div>

          {/* == Danh sách suất chiếu == */}
          <div className="space-y-4">
            {isLoading ? (
              <p>Đang tải...</p>
            ) : showtimes.length > 0 ? (
              showtimes.map(showtime => (
                <ShowtimeListItem
                  key={showtime._id}
                  showtime={showtime}
                  onDelete={() => handleDelete(showtime._id)}
                />
              ))
            ) : (
              <p className="text-center text-muted-foreground">
                {selectedTheaterId ? "Không tìm thấy suất chiếu nào." : "Vui lòng chọn rạp."}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* == Dialog Thêm Suất chiếu == */}
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Thêm suất chiếu mới</DialogTitle>
          <DialogDescription>
            Chọn phim, phòng, giá vé và thời gian.
          </DialogDescription>
        </DialogHeader>
        {/* Truyền theaterId vào form để nó fetch rooms */}
        <AddShowtimeForm 
          theaterId={selectedTheaterId}
          onSubmit={handleFormSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}