# Database Design

## 1. Collection: users - Người dùng

```
  {
    _id: ObjectId,
    email: String, // unique, indexed
    password: String, // hashed
    fullName: String,
    avatar: String, // URL
    phone: String,
    address: String,
    dateOfBirth: Date,
    role: String, // Vai trò: "STUDENT", "ADMIN"
    isActive: Boolean, // Tài khoản có đang hoạt động không (false = bị khóa)
    verificationCode: String, // Mã code xác thực gửi qua email
    lastVerificationCode: Date, // Thời gian gửi mã code xác thực
    isEmailVerified: Boolean, // Email đã được xác thực chưa
    createdAt: Date,
    updatedAt: Date,
    lastLoginAt: Date // Lần đăng nhập cuối
  }
```

## 2. Collection: categories - Danh mục khóa học

```
  {
    _id: ObjectId,
    name: String,
    slug: String, // unique, indexed , URL-friendly slug
    description: String,
    order: Number, // Thứ tự hiển thị (độ ưu tiên nhất là 1)
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
    thumbnail: String, // URL - Ảnh thumbnail
    previewVideo: String, // URL - Video giới thiệu
    instructorId: ObjectId, // reference đến users - ID giảng viên
    categoryId: ObjectId, // reference đến categories
    level: String, // "beginner", "intermediate", "advanced" - Cấp độ: beginner/intermediate/advanced
    language: String, // "vi", "en" - Ngôn ngữ giảng dạy của khóa học
    discount: Number,
    price: Number,

    // Thông tin chi tiết
    requirements: [String], // Yêu cầu trước khóa học
    whatYouWillLearn: [String], // Học được gì
    targetAudience: [String], // Đối tượng học viên

    // Thống kê
    totalLectures: Number, // Tổng số bài giảng
    totalDuration: Number, // Tổng thời lượng
    totalStudents: Number, // Tổng số học viên đã đăng ký
    averageRating: Number, // Đánh giá trung bình
    totalReviews: Number, // Tổng số đánh giá

    // Trạng thái
    status: String, // "draft" - nháp, "published" - đã xuất bản, "archived" - lưu trữ
    isPublished: Boolean, // Đã xuất bản chưa
    publishedAt: Date, // Ngày xuất bản

    createdAt: Date,
    updatedAt: Date
  }
```

## 4. Collection: chapters - Chương học

```
  {
    _id: ObjectId,
    courseId: ObjectId, // reference đến courses - Thuộc khóa học nào
    title: String,
    description: String,
    order: Number, // thứ tự chapter trong khóa học
    createdAt: Date,
    updatedAt: Date
  }
```

## 5. Collection: lectures - Bài giảng

```
  {
    _id: ObjectId,
    sectionId: ObjectId, // reference đến chapters - Thuộc chương nào
    courseId: ObjectId, // reference đến courses - Thuộc khóa học nào
    title: String,
    description: String,
    order: Number, // thứ tự bài giảng trong chapter

    // Video
    videoUrl: String, // URL video
    videoDuration: Number, // Thời lượng của video - tính bằng giây

    // Tài liệu đính kèm
    attachments: [{
      name: String,
      url: String,
      type: String, // "pdf", "zip", "doc", etc.
      size: Number // bytes
    }],

    // Nội dung bổ sung
    content: String, // HTML content

    isFree: Boolean, // Bài học miễn phí để preview

    createdAt: Date,
    updatedAt: Date
  }
```

## 6. Collection: enrollments

```
  {
    _id: ObjectId,
    userId: ObjectId, // reference đến users
    courseId: ObjectId, // reference đến courses

    // Thông tin thanh toán
    orderId: ObjectId, // reference đến orders
    enrolledAt: Date, // Thời gian lúc đăng ký
    expiresAt: Date, // null nếu truy cập vĩnh viễn

    // Tiến độ học
    progress: Number, // 0-100 - Đã học được bao nhiêu %
    completedLectures: [ObjectId], // array các lectureId đã hoàn thành
    lastAccessedLectureId: ObjectId,
    lastAccessedAt: Date,

    totalWatchTime: Number, // Đã xem tổng ... phút

    // Chứng chỉ - Làm sau
    certificateIssued: Boolean,
    certificateIssuedAt: Date,
    certificateUrl: String,

    // Trạng thái
    status: String, // "active" - đang học, "completed" - đã hoàn thành, "expired" - hết hạn, "suspended" - cấm
    createdAt: Date,
    updatedAt: Date
  }
```

## 7. Collection: lecture_progress

```
  {
    _id: ObjectId,
    userId: ObjectId, // reference đến users
    lectureId: ObjectId, // reference đến lectures
    courseId: ObjectId, // reference đến courses

    // Tiến độ
    watchedDuration: Number, // giây đã xem
    totalDuration: Number, // tổng thời lượng
    progress: Number, // 0-100
    isCompleted: Boolean,
    completedAt: Date,


    lastWatchedAt: Date,
    createdAt: Date,
    updatedAt: Date
  }
```

## 8. Collection: orders

```
  {
    _id: ObjectId,
    orderNumber: String, // unique, mã đơn hàng
    userId: ObjectId, // reference đến users

    // Chi tiết đơn hàng
    items: [{
      courseId: ObjectId,
      courseName: String,
      originalPrice: Number, // Giá gốc
      price: Number // Giá sau khi giảm
    }],

    total: Number, // Tổng tiền

    // Thanh toán
    paymentMethod: String, // "credit_card", "paypal", "momo", "zalopay", "bank_transfer" - Phương thức thanh toán
    paymentStatus: String, // "pending", "completed", "failed", "refunded" - Trạng thái thanh toán
    paymentDetails: {
      transactionId: String, // Mã giao dịch
      paymentGateway: String, // Cổng thanh toán
      paidAt: Date // Thời điểm thanh toán thành công
    },

    // Hóa đơn
    invoiceUrl: String,

    // Trạng thái
    status: String, // "pending", "completed", "cancelled", "refunded"

    createdAt: Date,
    updatedAt: Date
  }
```

## 9. Collection: carts

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

## 10. Review

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
