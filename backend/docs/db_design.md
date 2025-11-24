# Database Design

## 1. Collection: users - Người dùng

```
{
  _id: ObjectId,
  email: String, // unique, indexed
  password: String, // hashed
  fullName: String,
  avatar: String, // URL
  phone: String, // Số điện thoại (định dạng 10 ký tự)
  address: String,
  dateOfBirth: Date,
  role: String, // Vai trò: "STUDENT", "ADMIN"
  isActive: Boolean, // Tài khoản có đang hoạt động không (default: false)
  isVerified: Boolean, // Email đã được xác thực chưa (default: false)
  verificationCode: String, // Mã code xác thực gửi qua email
  lastVerificationSent: Date, // Thời gian gửi mã code xác thực gần nhất
  lastLoginAt: Date, // Lần đăng nhập cuối (default: null)
  createdAt: Date,
  updatedAt: Date
}
```

## 2. Collection: categories - Danh mục khóa học

```
{
  _id: ObjectId,
  name: String,
  slug: String, // unique, indexed - URL-friendly slug
  description: String,
  order: Number, // Thứ tự hiển thị (độ ưu tiên)
  createdAt: Date,
  updatedAt: Date
}
```

## 3. Collection: courses - Khóa học

```
{
  _id: ObjectId,
  title: String,
  slug: String, // unique, indexed - Dùng cho URL: /courses/react-js-tu-co-ban
  description: String, // Mô tả chi tiết (HTML)
  shortDescription: String, // Mô tả ngắn hiển thị ở card
  thumbnail: String, // URL - Ảnh thumbnail (default: null)
  previewVideo: String, // URL - Video giới thiệu (default: null)
  instructorId: ObjectId, // reference đến users - ID giảng viên
  categoryId: ObjectId, // reference đến categories
  level: String, // "beginner", "intermediate", "advanced"
  language: String, // "vi", "en"
  price: Number, // Giá khóa học (min: 0)
  discount: Number, // Phần trăm giảm giá (min: 0, max: 100, default: 0)

  // Thông tin chi tiết
  requirements: [String], // Yêu cầu trước khóa học (default: [])

  // Thống kê
  totalLectures: Number, // Tổng số bài giảng (default: 0)
  totalDuration: Number, // Tổng thời lượng (default: 0)
  totalStudents: Number, // Tổng số học viên đã đăng ký (default: 0)
  totalReviews: Number, // Tổng số đánh giá (default: 0)
  averageRating: Number, // Đánh giá trung bình (min: 0, max: 5, default: 0)

  // Trạng thái
  status: String, // "draft", "published", "archived" (default: "draft")
  isPublished: Boolean, // Đã xuất bản chưa (default: false)
  publishedAt: Date, // Ngày xuất bản (default: null)

  createdAt: Date,
  updatedAt: Date,

  // Virtual field
  finalPrice: Number // Giá sau khi áp dụng giảm giá (virtual)
}
```

## 4. Collection: chapters - Chương học

```
{
  _id: ObjectId,
  courseId: ObjectId, // reference đến courses
  title: String,
  description: String,
  order: Number, // Thứ tự chapter trong khóa học (min: 1)
  createdAt: Date,
  updatedAt: Date
}
```

## 5. Collection: lectures - Bài giảng

```
{
  _id: ObjectId,
  chapterId: ObjectId, // reference đến chapters
  courseId: ObjectId, // reference đến courses
  title: String,
  description: String,
  order: Number, // Thứ tự bài giảng trong chapter (min: 1)

  // Video
  videoUrl: String, // URL video
  videoDuration: Number, // Thời lượng của video (tính bằng giây, min: 0)

  // Nội dung bổ sung
  content: String, // HTML content (default: "")
  isFree: Boolean, // Bài học miễn phí để preview (default: false)

  createdAt: Date,
  updatedAt: Date
}
```

## 6. Collection: enrollments - Đăng ký khóa học

```
{
  _id: ObjectId,
  userId: ObjectId, // reference đến users
  courseId: ObjectId, // reference đến courses
  orderId: ObjectId, // reference đến orders

  enrolledAt: Date, // Thời gian đăng ký (default: Date.now)
  expiresAt: Date, // Thời gian hết hạn (default: null nếu truy cập vĩnh viễn)

  // Tiến độ học
  progress: Number, // 0-100 (default: 0)

  // Trạng thái
  status: String, // "active", "completed", "expired", "suspended" (default: "active")

  createdAt: Date,
  updatedAt: Date
}
```

## 7. Collection: courseProgress - Tiến độ khóa học

```
{
  _id: ObjectId,
  userId: ObjectId, // reference đến users
  courseId: ObjectId, // reference đến courses
  completedLectures: [ObjectId], // array các lectureId đã hoàn thành

  createdAt: Date,
  updatedAt: Date
}
```

## 8. Collection: orders - Đơn hàng

```
{
  _id: ObjectId,
  orderNumber: String, // unique - mã đơn hàng
  userId: ObjectId, // reference đến users

  // Chi tiết đơn hàng
  items: [{
    courseId: ObjectId,
    courseName: String,
    price: Number // Giá của khóa học tại thời điểm đặt hàng (min: 0)
  }],

  total: Number, // Tổng tiền (min: 0)

  // Thanh toán
  paymentMethod: String, // "vnpay", "momo", "bank_transfer"
  paymentStatus: String, // "pending", "completed", "failed", "refunded" (default: "pending")
  paymentDetails: {
    transactionId: String, // Mã giao dịch từ cổng thanh toán (default: null)
    paymentGateway: String, // Tên cổng thanh toán (VNPay, MoMo, etc.) (default: null)
    paidAt: Date, // Thời điểm thanh toán thành công (default: null)
    bankCode: String, // Mã ngân hàng (VNPay) (default: null)
    bankTranNo: String, // Mã giao dịch của ngân hàng (default: null)
    cardType: String, // Loại thẻ (ATM, QRCODE, etc.) (default: null)
    payDate: String, // Ngày thanh toán từ VNPay (format: yyyyMMddHHmmss) (default: null)
    responseCode: String, // Mã phản hồi từ cổng thanh toán (00 = thành công) (default: null)
    transactionStatus: String, // Trạng thái giao dịch từ cổng thanh toán (default: null)
  },

  // Trạng thái
  status: String, // "unpaid", "paid", "cancelled", "refunded" (default: "unpaid")

  cancelledBy: ObjectId, // Người hủy đơn hàng
  cancelledAt: Date, // Thời gian hủy

  createdAt: Date,
  updatedAt: Date
}
```

## 9. Collection: carts - Giỏ hàng

```
  {
    _id: ObjectId,
    userId: ObjectId, // reference đến users
    items: [{
      courseId: ObjectId,
      addedAt: Date
    }],
    updatedAt: Date
  }
```

## 10. Review: reviews - Đánh giá

```
  {
    _id: ObjectId,
    userId: ObjectId, // reference đến users
    courseId: ObjectId, // reference đến courses

    rating: Number, // 1-5
    comment: String,

    helpful: Number, // Tổng số người thấy review này hữu ích
    helpfulBy: [String], // Danh sách user ID đã vote "helpful"

    // Trạng thái
    isPublished: Boolean,
    isVerifiedPurchase: Boolean,

    createdAt: Date,
    updatedAt: Date
  }
```

## Indexes

### users

- `email` (unique)
- `role`

### categories

- `order` (ascending)
- `slug` (unique)

### courses

- `categoryId`
- `instructorId`
- `status, isPublished`
- `averageRating` (descending)
- `totalStudents` (descending)
- `slug` (unique)

### chapters

- `courseId, order`

### lectures

- `chapterId, order`
- `courseId`
- `isFree`

### enrollments

- `userId, courseId` (unique)
- `status`

### courseProgress

- `userId, courseId` (unique)

### orders

- `orderNumber` (unique)
- `userId`
- `status`
- `paymentStatus`
