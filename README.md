# 🎬 Movie Ticket Booking System

Hệ thống đặt vé xem phim trực tuyến với quản lý rạp chiếu, phòng chiếu, suất chiếu và đặt chỗ realtime.

## 📋 Mục Lục

- [Tổng Quan](#tổng-quan)
- [Yêu Cầu Hệ Thống](#yêu-cầu-hệ-thống)
- [Công Nghệ Sử Dụng](#công-nghệ-sử-dụng)
- [Cài Đặt](#cài-đặt)
- [Cấu Trúc Project](#cấu-trúc-project)
- [Mô Tả Các Module](#mô-tả-các-module)
- [API Endpoints](#api-endpoints)
- [Tính Năng](#tính-năng)

## 🎯 Tổng Quan

Hệ thống đặt vé xem phim với hai vai trò chính:
- **Admin**: Quản lý phim, rạp chiếu, phòng chiếu, suất chiếu, người dùng
- **Customer**: Xem phim, đặt vé, quản lý vé của mình, cập nhật thông tin cá nhân

Hệ thống sử dụng WebSocket (Socket.IO) để đồng bộ trạng thái ghế realtime và Redis để cache dữ liệu, tăng hiệu suất.

## 💻 Yêu Cầu Hệ Thống

### Phần Mềm Cần Thiết

| Tool | Version | Mô Tả |
|------|---------|-------|
| **Node.js** | >= 18.x | JavaScript runtime cho backend và build frontend |
| **npm** | >= 9.x | Package manager |
| **MongoDB** | >= 6.x | NoSQL database để lưu trữ dữ liệu |
| **Redis** | >= 7.x | Cache và session storage |
| **Docker** | >= 20.x (Optional) | Container cho Redis |

### Kiểm Tra Version

```bash
# Kiểm tra Node.js
node --version

# Kiểm tra npm
npm --version

# Kiểm tra MongoDB
mongod --version

# Kiểm tra Redis (nếu cài local)
redis-server --version
```

## 🛠️ Công Nghệ Sử Dụng

### Backend

| Package | Version | Mô Tả |
|---------|---------|-------|
| **Express** | ^5.1.0 | Web framework |
| **Mongoose** | ^8.18.3 | MongoDB ODM |
| **Redis** | ^5.10.0 | Redis client |
| **Socket.IO** | ^4.8.1 | Realtime communication |
| **JWT** | ^9.0.2 | Authentication token |
| **bcryptjs** | ^3.0.2 | Password hashing |
| **helmet** | ^8.1.0 | Security middleware |
| **express-rate-limit** | ^8.1.0 | Rate limiting |
| **date-fns** | ^4.1.0 | Date manipulation |
| **nanoid** | ^5.1.6 | Unique ID generation |

### Frontend

| Package | Version | Mô Tả |
|---------|---------|-------|
| **React** | ^19.1.1 | UI library |
| **Vite** | ^5.x | Build tool |
| **React Router** | ^7.9.5 | Client-side routing |
| **Axios** | ^1.13.1 | HTTP client |
| **Socket.IO Client** | ^4.8.1 | Realtime client |
| **Zustand** | ^5.0.9 | State management |
| **React Hook Form** | ^7.67.0 | Form validation |
| **Zod** | ^4.1.13 | Schema validation |
| **Tailwind CSS** | ^4.1.16 | CSS framework |
| **Framer Motion** | ^12.23.24 | Animation library |
| **Radix UI** | Latest | UI components |
| **Lucide React** | ^0.552.0 | Icons |

## 📦 Cài Đặt

### 1. Clone Repository

```bash
git clone <repository-url>
cd ProjectBooking_Movie_Ticket
```

### 2. Cài Đặt Backend

```bash
cd backend

# Cài đặt dependencies
npm install

# Tạo file .env
# Copy nội dung từ .env.example (nếu có) hoặc tạo mới với các biến sau:
```

**File .env cho Backend:**

```env
# Server
PORT=3000

# MongoDB
MONGO_URI=mongodb://localhost:27017/movie_booking
# Hoặc MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/movie_booking

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_LIFETIME=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 3. Cài Đặt Frontend

```bash
cd ../frontend

# Cài đặt dependencies
npm install
```

**File .env cho Frontend (nếu cần):**

```env
VITE_API_URL=http://localhost:3000
```

### 4. Khởi Chạy Redis

#### Sử dụng Docker (Khuyến nghị):

```bash
cd backend
docker-compose up -d
```

#### Hoặc cài đặt Redis local:

**Windows:**
```bash
# Download Redis from https://redis.io/download
# Hoặc sử dụng WSL
wsl
sudo service redis-server start
```

**Linux/Mac:**
```bash
# Ubuntu/Debian
sudo apt-get install redis-server
sudo service redis-server start

# Mac
brew install redis
brew services start redis
```

### 5. Khởi Chạy MongoDB

```bash
# Nếu cài local
mongod

# Hoặc sử dụng MongoDB Atlas (Cloud)
# Cập nhật MONGO_URI trong .env
```

### 6. Chạy Ứng Dụng

#### Development Mode:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Truy cập:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

#### Production Build:

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## 📁 Cấu Trúc Project

```
ProjectBooking_Movie_Ticket/
├── backend/                      # Backend Server (Node.js + Express)
│   ├── controllers/              # Request handlers
│   │   ├── admin/                # Admin controllers
│   │   │   ├── authAdmin.js      # Xác thực admin
│   │   │   ├── dashboardController.js  # Thống kê dashboard
│   │   │   ├── movieController.js      # Quản lý phim
│   │   │   ├── roomController.js       # Quản lý phòng
│   │   │   ├── showtimeController.js   # Quản lý suất chiếu
│   │   │   ├── theaterController.js    # Quản lý rạp
│   │   │   └── userController.js       # Quản lý user
│   │   └── customer/             # Customer controllers
│   │       ├── authCustomer.js         # Xác thực customer
│   │       ├── bookingController.js    # Đặt vé
│   │       ├── customerMovieController.js
│   │       ├── customerShowtimeController.js
│   │       └── getFeaturedMoviesController.js
│   ├── db/                       # Database connections
│   │   ├── connect.js            # MongoDB connection
│   │   └── redis.js              # Redis connection
│   ├── errors/                   # Error handling
│   │   └── custom-error.js       # Custom error classes
│   ├── middlewares/              # Express middlewares
│   │   ├── authentication.js     # JWT verification
│   │   ├── error-handler.js      # Global error handler
│   │   ├── not-found.js          # 404 handler
│   │   └── role.js               # Role-based access control
│   ├── models/                   # Mongoose schemas
│   │   ├── Booking.js            # Booking schema
│   │   ├── Movie.js              # Movie schema
│   │   ├── Room.js               # Room schema
│   │   ├── Session.js            # Session schema
│   │   ├── Showtime.js           # Showtime schema
│   │   ├── Theater.js            # Theater schema
│   │   └── User.js               # User schema
│   ├── routes/                   # API routes
│   │   ├── admin/                # Admin routes
│   │   └── customer/             # Customer routes
│   ├── socket/                   # WebSocket handlers
│   │   └── socket.js             # Socket.IO configuration
│   ├── utils/                    # Helper functions
│   │   ├── dateFormat.js         # Date utilities
│   │   └── generateBookingCode.js
│   ├── docker-compose.yml        # Docker configuration
│   ├── package.json              # Backend dependencies
│   └── web.js                    # Entry point
│
└── frontend/                     # Frontend (React + Vite)
    ├── public/                   # Static assets
    ├── src/
    │   ├── assets/               # Images, fonts
    │   ├── components/           # Reusable components
    │   │   ├── layout/           # Layout components
    │   │   │   ├── admin/        # Admin layout
    │   │   │   └── customer/     # Customer layout
    │   │   ├── ui/               # UI components (Radix)
    │   │   ├── MovieCard.jsx
    │   │   └── TrailerModal.jsx
    │   ├── features/             # Feature modules
    │   │   ├── admin/            # Admin features
    │   │   │   ├── dashboard/    # Dashboard
    │   │   │   ├── movies/       # Quản lý phim
    │   │   │   ├── rooms/        # Quản lý phòng
    │   │   │   ├── showtimes/    # Quản lý suất chiếu
    │   │   │   ├── theaters/     # Quản lý rạp
    │   │   │   └── users/        # Quản lý users
    │   │   ├── auth/             # Authentication
    │   │   ├── booking/          # Booking flow
    │   │   └── home/             # Homepage
    │   ├── hooks/                # Custom hooks
    │   │   ├── useDebounce.js
    │   │   ├── useInitializeAuth.js
    │   │   └── useSocket.js
    │   ├── lib/                  # Libraries & utilities
    │   │   ├── axios.js          # Axios config
    │   │   ├── seatHelper.js     # Seat utilities
    │   │   └── utils.js          # Helper functions
    │   ├── pages/                # Page components
    │   │   ├── BookingPage.jsx
    │   │   ├── HomePage.jsx
    │   │   ├── MovieDetailPage.jsx
    │   │   ├── MyTicketsPage.jsx
    │   │   ├── PaymentPage.jsx
    │   │   └── ProfilePage.jsx
    │   ├── services/             # API services
    │   │   ├── authService.jsx
    │   │   ├── bookingService.jsx
    │   │   ├── movieService.jsx
    │   │   └── dashboardService.jsx
    │   ├── store/                # Zustand stores
    │   ├── App.jsx               # App component
    │   ├── main.jsx              # Entry point
    │   └── index.css             # Global styles
    ├── components.json           # Shadcn config
    ├── package.json              # Frontend dependencies
    ├── vite.config.js            # Vite configuration
    └── tailwind.config.js        # Tailwind configuration
```

## 🔧 Mô Tả Các Module

### Backend Modules

#### 1. **Authentication & Authorization**
- **Location**: `middlewares/authentication.js`, `controllers/*/auth*.js`
- **Công nghệ**: JWT (JSON Web Token)
- **Chức năng**:
  - Đăng ký, đăng nhập admin/customer
  - Xác thực token từ cookie
  - Phân quyền dựa trên role (admin/customer)
  - Middleware bảo vệ routes

#### 2. **Movie Management**
- **Location**: `models/Movie.js`, `controllers/admin/movieController.js`
- **Chức năng**:
  - CRUD operations cho phim
  - Thông tin phim: tiêu đề, mô tả, thời lượng, thể loại, đạo diễn, diễn viên
  - Hình ảnh poster, trailer URL
  - Release date và rating

#### 3. **Theater & Room Management**
- **Location**: `models/Theater.js`, `models/Room.js`
- **Chức năng**:
  - Quản lý rạp chiếu (tên, địa chỉ)
  - Quản lý phòng chiếu (tên, số ghế, layout ghế)
  - Liên kết phòng với rạp

#### 4. **Showtime Management**
- **Location**: `models/Showtime.js`, `controllers/admin/showtimeController.js`
- **Chức năng**:
  - Tạo lịch chiếu phim
  - Liên kết phim, phòng, rạp, thời gian
  - Quản lý giá vé theo từng suất chiếu

#### 5. **Booking System**
- **Location**: `models/Booking.js`, `controllers/customer/bookingController.js`
- **Công nghệ**: Redis + Socket.IO
- **Chức năng**:
  - Đặt vé realtime với WebSocket
  - Lock ghế tạm thời (pending seats)
  - Auto-expire bookings sau timeout
  - Mã đặt vé unique (nanoid)
  - Trạng thái: pending, success, failed, expired
  - Tích hợp thanh toán VietQR

#### 6. **Real-time Seat Management**
- **Location**: `socket/socket.js`
- **Công nghệ**: Socket.IO + Redis
- **Chức năng**:
  - Đồng bộ trạng thái ghế realtime giữa các users
  - Lock ghế khi user chọn
  - Release ghế khi user hủy hoặc timeout
  - Broadcast seat updates cho tất cả users trong cùng showtime
  - Prevent race condition khi nhiều users chọn cùng ghế

#### 7. **Dashboard & Analytics**
- **Location**: `controllers/admin/dashboardController.js`
- **Chức năng**:
  - Thống kê doanh thu theo thời gian
  - Số lượng bookings
  - Phim phổ biến nhất
  - Thống kê theo rạp

#### 8. **User Management**
- **Location**: `models/User.js`, `controllers/admin/userController.js`
- **Chức năng**:
  - Quản lý thông tin user
  - Role-based access (admin/customer)
  - Profile management

### Frontend Modules

#### 1. **Authentication Feature**
- **Location**: `src/features/auth/`
- **Chức năng**:
  - Login/Register forms
  - Protected routes
  - Auth state management (Zustand)
  - Auto-refresh token

#### 2. **Admin Features**
- **Location**: `src/features/admin/`
- **Modules**:
  - **Dashboard**: Thống kê tổng quan, charts
  - **Movies**: CRUD phim với form validation
  - **Theaters**: Quản lý rạp
  - **Rooms**: Quản lý phòng với seat layout
  - **Showtimes**: Tạo lịch chiếu
  - **Users**: Quản lý users

#### 3. **Customer Features**
- **Location**: `src/features/`
- **Modules**:
  - **Home**: Trang chủ với featured movies
  - **Movies**: Danh sách phim, tìm kiếm, filter
  - **Movie Detail**: Chi tiết phim, trailer modal
  - **Booking**: Chọn ghế realtime, payment flow
  - **My Tickets**: Lịch sử đặt vé, booking codes
  - **Profile**: Cập nhật thông tin cá nhân

#### 4. **Real-time Booking**
- **Location**: `src/pages/BookingPage.jsx`, `src/hooks/useSocket.js`
- **Công nghệ**: Socket.IO Client
- **Chức năng**:
  - Hiển thị seat map
  - Real-time seat locking
  - Visual feedback cho ghế đã chọn/locked/available
  - Auto-refresh khi có thay đổi từ users khác

#### 5. **State Management**
- **Location**: `src/store/`
- **Công nghệ**: Zustand
- **Stores**:
  - Auth store (user, token)
  - Booking store (selected seats, showtime)
  - UI store (modals, loading states)

#### 6. **API Services**
- **Location**: `src/services/`
- **Công nghệ**: Axios
- **Features**:
  - Centralized API calls
  - Request/response interceptors
  - Error handling
  - Auto-attach auth token

## 🌐 API Endpoints

### Admin APIs

```
POST   /api/v1/admin/auth/login              # Admin login
POST   /api/v1/admin/auth/register           # Admin register

GET    /api/v1/admin/dashboard               # Dashboard stats
GET    /api/v1/admin/movies                  # Get all movies
POST   /api/v1/admin/movies                  # Create movie
PUT    /api/v1/admin/movies/:id              # Update movie
DELETE /api/v1/admin/movies/:id              # Delete movie

GET    /api/v1/admin/theaters                # Get all theaters
POST   /api/v1/admin/theaters                # Create theater
PUT    /api/v1/admin/theaters/:id            # Update theater
DELETE /api/v1/admin/theaters/:id            # Delete theater

GET    /api/v1/admin/rooms                   # Get all rooms
POST   /api/v1/admin/rooms                   # Create room
PUT    /api/v1/admin/rooms/:id               # Update room
DELETE /api/v1/admin/rooms/:id               # Delete room

GET    /api/v1/admin/showtimes               # Get all showtimes
POST   /api/v1/admin/showtimes               # Create showtime
PUT    /api/v1/admin/showtimes/:id           # Update showtime
DELETE /api/v1/admin/showtimes/:id           # Delete showtime

GET    /api/v1/admin/users                   # Get all users
```

### Customer APIs

```
POST   /api/v1/customer/auth/register        # Customer register
POST   /api/v1/customer/auth/login           # Customer login
POST   /api/v1/customer/auth/logout          # Customer logout

GET    /api/v1/customer/movies               # Get all movies
GET    /api/v1/customer/movies/:id           # Get movie details
GET    /api/v1/customer/featured-movies      # Get featured movies

GET    /api/v1/customer/theaters             # Get all theaters
GET    /api/v1/customer/showtimes            # Get showtimes

POST   /api/v1/customer/bookings             # Create booking
GET    /api/v1/customer/bookings             # Get user bookings
GET    /api/v1/customer/bookings/:id         # Get booking detail

GET    /api/v1/customer/user/profile         # Get profile
PUT    /api/v1/customer/user/profile         # Update profile
```

### WebSocket Events

```
# Client -> Server
join_showtime        # Tham gia room showtime
select_seat          # Chọn ghế
unselect_seat        # Bỏ chọn ghế
confirm_payment      # Xác nhận thanh toán

# Server -> Client
seat_status_update   # Cập nhật trạng thái ghế
seat_locked          # Ghế đã bị lock
seat_released        # Ghế được release
payment_confirmed    # Thanh toán thành công
```

## ✨ Tính Năng

### Admin Panel
- ✅ Dashboard với thống kê realtime
- ✅ Quản lý phim (CRUD với upload ảnh)
- ✅ Quản lý rạp chiếu
- ✅ Quản lý phòng chiếu với seat layout
- ✅ Tạo và quản lý suất chiếu
- ✅ Quản lý users
- ✅ Xem booking history

### Customer Portal
- ✅ Xem danh sách phim đang chiếu
- ✅ Tìm kiếm và filter phim
- ✅ Xem chi tiết phim, trailer
- ✅ Chọn suất chiếu
- ✅ Đặt vé với seat map interactive
- ✅ Real-time seat locking
- ✅ Thanh toán VietQR
- ✅ Quản lý vé đã đặt
- ✅ Cập nhật thông tin cá nhân

### Technical Features
- ✅ JWT Authentication với refresh token
- ✅ Role-based access control
- ✅ Real-time seat synchronization
- ✅ Redis caching
- ✅ Rate limiting
- ✅ Security headers (Helmet)
- ✅ CORS configuration
- ✅ Error handling middleware
- ✅ MongoDB TTL index cho auto-expire bookings
- ✅ Responsive design (Mobile-first)

## 📚 Documentation

This repo uses DeepWiki for additional documentation.

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/vinhbc16/Booking_Movie_Ticket)

## 📝 License

This project is licensed under the ISC License.

## 👥 Contributors

Contributions are welcome! Please feel free to submit a Pull Request.