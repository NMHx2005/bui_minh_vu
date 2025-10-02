# Gym Booking App

Ứng dụng đặt lịch tập gym/yoga được xây dựng với React, TypeScript, Redux Toolkit và Tailwind CSS.

## Công nghệ sử dụng

- **React 18** với TypeScript
- **Redux Toolkit** với createAsyncThunk
- **React Router v6** cho routing
- **Axios** cho HTTP requests
- **Tailwind CSS** cho styling
- **React Hook Form** với Yup validation
- **JSON Server** cho mock API

## Cấu trúc dự án

```
src/
├── apis/                   # API functions với Axios
├── assets/                 # Static files
├── components/             # React components
│   ├── common/            # Header, Footer, Spinner, ProtectedRoute
│   ├── ui/                # CourseCard, CustomModal, Pagination
│   └── forms/             # LoginForm, RegisterForm
├── hooks/                 # Custom hooks
├── pages/                 # Page components
│   └── admin/             # Admin pages
├── slices/                # Redux slices
├── stores/                # Redux store configuration
├── types/                 # TypeScript interfaces
└── utils/                 # Utility functions
```

## Tính năng chính

### Module Xác thực (Auth)
-  Đăng ký tài khoản với validation
-  Đăng nhập với phân quyền
-  Phân quyền User/Admin
-  Protected Routes

### Module Lớp học (Course)
-  Hiển thị danh sách lớp học
-  Sắp xếp theo tên, giá, loại
-  Tìm kiếm lớp học
-  Card layout responsive

### Module Đặt lịch (Booking - User)
-  Xem lịch đặt của user
-  Thêm/sửa/xóa lịch đặt
-  Validation không trùng lặp
-  Phân trang danh sách
-  Modal popup cho CRUD

### Module Quản lý (Admin)
-  Dashboard với thống kê
-  Quản lý người dùng (CRUD)
-  Quản lý lớp học (CRUD)
-  Quản lý lịch đặt với bộ lọc
-  Biểu đồ thống kê

## Cách chạy dự án

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Chạy JSON Server (Terminal 1)
```bash
npm run server
```
Server sẽ chạy tại: http://localhost:3001

### 3. Chạy React App (Terminal 2)
```bash
npm start
```
App sẽ chạy tại: http://localhost:3000

## Tài khoản demo

### Admin
- Email: `admin@gym.com`
- Password: `123`

### User
- Email: `user1@mail.com`
- Password: `456`

## API Endpoints

### Users
- `GET /users` - Lấy danh sách users
- `GET /users/:id` - Lấy user theo ID
- `POST /users` - Tạo user mới
- `PATCH /users/:id` - Cập nhật user
- `DELETE /users/:id` - Xóa user

### Courses
- `GET /courses` - Lấy danh sách courses
- `GET /courses/:id` - Lấy course theo ID
- `POST /courses` - Tạo course mới
- `PATCH /courses/:id` - Cập nhật course
- `DELETE /courses/:id` - Xóa course

### Bookings
- `GET /bookings` - Lấy danh sách bookings
- `GET /bookings?_expand=user&_expand=course` - Lấy bookings với thông tin chi tiết
- `POST /bookings` - Tạo booking mới
- `PATCH /bookings/:id` - Cập nhật booking
- `DELETE /bookings/:id` - Xóa booking

## Cấu trúc dữ liệu

### User
```typescript
interface User {
  id: number;
  email: string;
  password: string;
  role: 'admin' | 'user';
  fullName: string;
}
```

### Course
```typescript
interface Course {
  id: number;
  name: string;
  type: string;
  price: number;
  imageUrl: string;
  description: string;
  duration: number;
}
```

### Booking
```typescript
interface Booking {
  id: number;
  userId: number;
  courseId: number;
  bookingDate: string;
  bookingTime: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}
```

## Redux Store Structure

```typescript
interface RootState {
  auth: AuthState;
  course: CourseState;
  booking: BookingState;
}
```

## Tính năng nổi bật

1. **State Management**: Sử dụng Redux Toolkit với createAsyncThunk cho async operations
2. **Type Safety**: TypeScript interfaces cho tất cả data structures
3. **Form Validation**: React Hook Form với Yup schema validation
4. **Responsive Design**: Tailwind CSS với mobile-first approach
5. **Protected Routes**: Phân quyền dựa trên role
6. **Error Handling**: Comprehensive error handling trong Redux slices
7. **Loading States**: Loading indicators cho tất cả async operations
8. **Modal System**: Reusable modal component
9. **Pagination**: Custom pagination hook
10. **Search & Filter**: Tìm kiếm và lọc dữ liệu

## Scripts

- `npm start` - Chạy development server
- `npm run build` - Build production
- `npm run server` - Chạy JSON Server
- `npm test` - Chạy tests