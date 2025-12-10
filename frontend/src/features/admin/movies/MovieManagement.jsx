import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { PlusCircle, Search, Pencil, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'

import { movieService } from '@/services/movieService'
import { MovieForm } from './components/MovieForm'
import { MovieItem } from './components/MovieItem'


// Component trang quản lý phim
export default function MovieManagement() {
  const [movies, setMovies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  
  // State cho Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMovie, setEditingMovie] = useState(null) // null = Thêm mới, object = Sửa

  // Hàm gọi API
  const fetchMovies = () => {
    setIsLoading(true)
    movieService.getMovies({ page: currentPage, search: searchTerm })
      .then(response => {
        setMovies(response.data.moviesList)
        setTotalPages(response.data.totalPages)
      })
      .catch(err => {
        console.error(err);
        toast.error(err.response?.data?.msg || "Lỗi khi tải danh sách phim!");
      })
      .finally(() => setIsLoading(false))
  }

  // Gọi API khi component mount hoặc filter/page thay đổi
  useEffect(() => {
    fetchMovies()
  }, [currentPage, searchTerm]) // Chạy lại khi page hoặc search thay đổi

  // Xử lý bộ lọc
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1) // Reset về trang 1 khi search
  }

  // Xử lý mở dialog
  const handleOpenEdit = (movie) => {
    setEditingMovie(movie)
    setIsDialogOpen(true)
  }

  const handleOpenCreate = () => {
    setEditingMovie(null)
    setIsDialogOpen(true)
  }

  // Xử lý submit form (Thêm/Sửa)
  const handleFormSubmit = (formData) => {
    // Tách _id ra nếu đang edit (Mongoose thường dùng _id)
    const { _id, ...dataToSubmit } = formData;
    
    const apiCall = editingMovie
      ? movieService.updateMovie(editingMovie._id, dataToSubmit) // Gửi data không có _id
      : movieService.createMovie(formData)
    
    toast.promise(apiCall, {
      loading: "Đang lưu...",
      success: (response) => {
        fetchMovies() // Tải lại danh sách
        setIsDialogOpen(false)
        return response.data.msg // Lấy msg từ BE
      },
      error: (err) => err.response?.data?.msg || "Lưu thất bại!",
    })
  }

  // Xử lý xóa
  const handleDelete = (id) => {
    // Giả sử ID phim là _id từ Mongoose
    toast.warning("Bạn có chắc muốn xóa phim này?", {
      action: {
        label: "Xóa",
        onClick: () => {
          toast.promise(movieService.deleteMovie(id), {
            loading: "Đang xóa...",
            success: (response) => {
              fetchMovies() // Tải lại
              return response.data.msg // Lấy msg từ BE
            },
            error: (err) => err.response?.data?.msg || "Xóa thất bại!",
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
          <CardTitle className="text-2xl">Quản lý phim</CardTitle>
          <CardDescription>Thêm, sửa, xóa và tìm kiếm phim trong hệ thống.</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* == Khu vực Filter và Nút Thêm == */}
          <div className="flex items-center justify-between space-x-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm phim theo tên..."
                className="pl-10"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <DialogTrigger asChild>
              <Button onClick={handleOpenCreate}>
                <PlusCircle className="mr-2 h-4 w-4" /> Thêm phim mới
              </Button>
            </DialogTrigger>
          </div>

          {/* == Danh sách phim == */}
          <div className="space-y-4">
            {isLoading ? (
              <p>Đang tải...</p>
            ) : movies.length > 0 ? (
              movies.map(movie => (
                <MovieItem
                  key={movie._id} // Dùng _id của Mongoose
                  movie={movie}
                  onEdit={handleOpenEdit}
                  onDelete={() => handleDelete(movie._id)} // Truyền _id
                />
              ))
            ) : (
              <p>Không tìm thấy phim nào.</p>
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
                {/* (Tạm thời chỉ hiển thị trang hiện tại) */}
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

      {/* == Dialog Thêm/Sửa Phim == */}
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{editingMovie ? 'Chỉnh sửa phim' : 'Thêm phim mới'}</DialogTitle>
          <DialogDescription>
            Điền thông tin chi tiết của bộ phim vào bên dưới.
          </DialogDescription>
        </DialogHeader>
        <MovieForm 
          onSubmit={handleFormSubmit}
          initialData={editingMovie} // Chỉ cần truyền object phim (hoặc null)
        />
      </DialogContent>
    </Dialog>
  )
}
