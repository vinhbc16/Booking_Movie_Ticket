import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { PlusCircle, Search, Building } from 'lucide-react'

// Import shadcn components
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'

// Import service, form, và list item
import { theaterService } from '@/services/theaterService'
import { TheaterForm } from './components/TheaterForm'
import { TheaterItem } from './components/TheaterItem'

export default function TheaterManagement() {
  const [theaters, setTheaters] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  
  // State cho Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTheater, setEditingTheater] = useState(null) // null = Thêm mới, object = Sửa

  // Hàm gọi API
  const fetchTheaters = () => {
    setIsLoading(true)
    theaterService.getTheaters({ page: currentPage, search: searchTerm })
      .then(response => {
        setTheaters(response.data.theatersList)
        setTotalPages(response.data.totalPages)
      })
      .catch(err => {
        console.error(err);
        toast.error(err.response?.data?.msg || "Lỗi khi tải danh sách rạp!");
      })
      .finally(() => setIsLoading(false))
  }

  // Gọi API khi component mount hoặc filter/page thay đổi
  useEffect(() => {
    fetchTheaters()
  }, [currentPage, searchTerm])

  // Xử lý bộ lọc
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1) // Reset về trang 1 khi search
  }

  // Xử lý mở dialog
  const handleOpenEdit = (theater) => {
    setEditingTheater(theater)
    setIsDialogOpen(true)
  }

  const handleOpenCreate = () => {
    setEditingTheater(null)
    setIsDialogOpen(true)
  }

  // Xử lý submit form (Thêm/Sửa)
  const handleFormSubmit = (formData) => {
    const { _id, ...dataToSubmit } = formData;
    
    const apiCall = editingTheater
      ? theaterService.updateTheater(editingTheater._id, dataToSubmit)
      : theaterService.createTheater(formData)
    
    toast.promise(apiCall, {
      loading: "Đang lưu...",
      success: (response) => {
        fetchTheaters() // Tải lại danh sách
        setIsDialogOpen(false)
        return response.data.msg // Lấy msg từ BE
      },
      error: (err) => err.response?.data?.msg || "Lưu thất bại!",
    })
  }

  // Xử lý xóa
  const handleDelete = (id) => {
    toast.warning("Bạn có chắc muốn xóa rạp này?", {
      description: "Hành động này có thể bị từ chối nếu rạp có suất chiếu đã đặt vé.",
      action: {
        label: "Xóa",
        onClick: () => {
          toast.promise(theaterService.deleteTheater(id), {
            loading: "Đang xóa...",
            success: (response) => {
              fetchTheaters() // Tải lại
              return response.data.msg // "delete successfully"
            },
            // 🚀 Tự động xử lý lỗi 400 từ BE
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
          <CardTitle className="text-2xl">Quản lý rạp chiếu</CardTitle>
          <CardDescription>Thêm, sửa, xóa và tìm kiếm rạp trong hệ thống.</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* == Khu vực Filter và Nút Thêm == */}
          <div className="flex items-center justify-between space-x-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm rạp theo tên hoặc địa chỉ..."
                className="pl-10"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <DialogTrigger asChild>
              <Button onClick={handleOpenCreate}>
                <PlusCircle className="mr-2 h-4 w-4" /> Thêm rạp mới
              </Button>
            </DialogTrigger>
          </div>

          {/* == Danh sách rạp == */}
          <div className="space-y-4">
            {isLoading ? (
              <p>Đang tải...</p>
            ) : theaters.length > 0 ? (
              theaters.map(theater => (
                <TheaterItem
                  key={theater._id}
                  theater={theater}
                  onEdit={handleOpenEdit}
                  onDelete={() => handleDelete(theater._id)}
                />
              ))
            ) : (
              <p className="text-center text-muted-foreground">Không tìm thấy rạp nào.</p>
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

      {/* == Dialog Thêm/Sửa Rạp == */}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editingTheater ? 'Chỉnh sửa rạp' : 'Thêm rạp mới'}</DialogTitle>
          <DialogDescription>
            Điền thông tin tên và địa chỉ của rạp.
          </DialogDescription>
        </DialogHeader>
        <TheaterForm 
          onSubmit={handleFormSubmit}
          initialData={editingTheater}
        />
      </DialogContent>
    </Dialog>
  )
}