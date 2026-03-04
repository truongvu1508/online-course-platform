# 🎓 Online Course Platform

<div align="center">

**A comprehensive full-stack web application for managing online courses with student enrollment, course management, and payment integration.**

![React](https://img.shields.io/badge/React-19.1.1-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-6.19.0-green?logo=mongodb)
![License](https://img.shields.io/badge/License-ISC-blue)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [API Documentation](#-api-documentation) • [Demo Accounts](#-demo-accounts)

</div>

---

## 📋 Overview

**Online Course Platform** is a modern, full-stack learning management system that enables instructors to create and manage courses while allowing students to enroll, learn, and track their progress. The platform includes admin dashboard for course management, payment integration with VNPay, and interactive learning features.

## ✨ Features

### For Students

- 📚 **Browse Courses** - Discover courses across different categories and levels
- 🔍 **Search & Filter** - Find courses by title, category, and difficulty level
- ✍️ **Enroll in Courses** - Join courses and start learning
- 📈 **Track Progress** - Monitor learning progress with progress tracking
- ⭐ **Review & Rate** - Leave reviews and rate courses
- 🛒 **Shopping Cart** - Add courses to cart and complete purchase
- 💳 **Payment Integration** - Secure payment with VNPay
- 👤 **User Profile** - Manage personal information and enrolled courses
- 📧 **Email Verification** - Verify email during registration

### For Instructors/Admin

- 🎥 **Create Courses** - Design and publish courses
- 📖 **Course Structure** - Organize courses with chapters and lectures
- 📹 **Upload Content** - Upload video lectures and course materials
- 🎬 **Video Preview** - Set course preview videos
- 📊 **Analytics Dashboard** - View course statistics and student enrollment
- 👥 **User Management** - Manage user accounts and roles
- 💰 **Order Management** - Track and manage student orders
- 📂 **Category Management** - Organize courses into categories
- 📁 **File Management** - Upload and manage course files/thumbnails

### General Features

- 🔐 **Authentication** - Secure login/registration with JWT
- 🛡️ **Authorization** - Role-based access control (Admin, Student, Instructor)
- 🌍 **Responsive Design** - Works seamlessly on desktop and mobile
- 🎨 **Modern UI** - Beautiful interface with Ant Design & Material-UI
- 🚀 **Cloud Storage** - Cloudinary integration for media management
- 📧 **Email Service** - Nodemailer for sending notifications

## 🛠️ Tech Stack

### Frontend

- **React** 19.1.1 - UI library
- **Vite** 7.1.7 - Fast build tool
- **React Router** 7.9.5 - Navigation & routing
- **Ant Design** 5.18.1 - Component library
- **Material-UI** 7.3.4 - Additional UI components
- **TailwindCSS** 3.4.18 - Utility-first CSS
- **Axios** 1.13.1 - HTTP client
- **Recharts** 3.6.0 - Data visualization
- **Swiper** 12.0.3 - Carousel component
- **Sass** 1.94.0 - CSS preprocessing

### Backend

- **Node.js** + **Express** 4.18.2 - Server & routing
- **MongoDB** 6.19.0 - NoSQL database
- **Mongoose** 8.18.1 - ODM for MongoDB
- **JWT (jsonwebtoken)** 9.0.2 - Authentication
- **Passport.js** 0.7.0 - Authentication strategies
- **Cloudinary** 2.7.0 - Cloud storage for media
- **Nodemailer** 7.0.6 - Email service
- **VNPay** 2.4.4 - Payment gateway
- **Multer** 2.0.2 - File upload handling
- **Sharp** 0.34.4 - Image processing
- **bcryptjs** 3.0.2 - Password hashing

## 📁 Project Structure

```
online-course-platform/
├── frontend/                           # React frontend application
│   ├── src/
│   │   ├── components/                 # Reusable React components
│   │   ├── pages/                      # Page components
│   │   │   ├── site/                   # Public pages (Home, Courses, etc.)
│   │   │   └── admin/                  # Admin dashboard pages
│   │   ├── contexts/                   # React Context (Auth, Cart)
│   │   ├── services/                   # API service calls
│   │   ├── routes/                     # Route configuration
│   │   ├── utils/                      # Utility functions & constants
│   │   └── layouts/                    # Layout components
│   ├── package.json
│   └── vite.config.js
│
├── backend/                            # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/                # Route controllers
│   │   ├── models/                     # Mongoose schemas
│   │   │   ├── course.model.js         # Course model
│   │   │   ├── users.model.js          # User model
│   │   │   ├── enrollment.model.js     # Student enrollment
│   │   │   ├── order.model.js          # Purchase orders
│   │   │   ├── review.model.js         # Course reviews
│   │   │   └── ...
│   │   ├── routes/                     # API routes
│   │   │   ├── public/                 # Public endpoints (auth, courses)
│   │   │   ├── admin/                  # Admin endpoints
│   │   │   ├── student/                # Student endpoints
│   │   │   └── shared/                 # Shared endpoints
│   │   ├── middleware/                 # Custom middleware
│   │   ├── services/                   # Business logic
│   │   ├── config/                     # Configuration files
│   │   ├── utils/                      # Utility functions
│   │   ├── enums/                      # Enum definitions
│   │   └── server.js                   # Express server entry point
│   ├── package.json
│   └── vercel.json                     # Vercel deployment config
│
└── README.md                           # This file
```

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** v16+ and **npm** or **yarn**
- **MongoDB** instance (local or MongoDB Atlas)
- **Cloudinary** account (for image uploads)
- **VNPay** merchant account (for payments)
- **Mailtrap** or email service provider account

### Backend Setup

1. **Navigate to backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create `.env` file with the following variables:**

   ```env
   PORT=8080
   MONGODB_URI=mongodb://localhost:27017/online-course-platform
   FRONTEND_URL=http://localhost:5173

   # JWT
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Email
   MAIL_HOST=your_mail_host
   MAIL_PORT=your_mail_port
   MAIL_USER=your_email
   MAIL_PASSWORD=your_password

   # VNPay
   VNP_TMNCODE=your_vnp_tmncode
   VNP_HASHSECRET=your_vnp_hashsecret
   VNP_URL=https://sandbox.vnpayment.vn/paygate
   VNP_RETURN_URL=http://localhost:5173/payment-result
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```
   Backend runs on `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create `.env.local` file:**

   ```env
   VITE_API_URL=http://localhost:8080/api
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

## 🌐 API Documentation

### Base URL

- **Development:** `http://localhost:8080/api`
- **Production:** `https://your-vercel-domain.vercel.app/api`

### Authentication Endpoints

#### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "_id": "...",
      "email": "john@example.com",
      "role": "student"
    }
  }
}
```

### Course Endpoints

#### Get All Courses (Public)

```http
GET /api/courses?page=1&limit=10&category=web-development
```

#### Get Course Detail

```http
GET /api/courses/:id
```

#### Create Course (Admin)

```http
POST /api/admin/courses
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "title": "Advanced React",
  "description": "Learn advanced React patterns",
  "shortDescription": "Master React",
  "categoryId": "...",
  "level": "advanced",
  "price": 99.99
}
```

#### Update Course (Admin)

```http
PUT /api/admin/courses/:id
Authorization: Bearer {access_token}
```

#### Delete Course (Admin)

```http
DELETE /api/admin/courses/:id
Authorization: Bearer {access_token}
```

### Enrollment Endpoints

#### Enroll in Course

```http
POST /api/student/enrollments
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "courseId": "...",
  "orderId": "..."
}
```

#### Get My Enrollments

```http
GET /api/student/enrollments
Authorization: Bearer {access_token}
```

### Order/Payment Endpoints

#### Create Order

```http
POST /api/orders
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "courseIds": ["course1_id", "course2_id"]
}
```

#### Create Payment (VNPay)

```http
POST /api/payment/create-vnpay
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "orderId": "...",
  "amount": 99.99
}
```

### Admin Dashboard Endpoints

#### Get Dashboard Stats

```http
GET /api/admin/dashboard
Authorization: Bearer {access_token}
```

#### Get All Users

```http
GET /api/admin/users?page=1&limit=10
Authorization: Bearer {access_token}
```

#### Get Orders

```http
GET /api/admin/orders
Authorization: Bearer {access_token}
```

## 📊 Database Models

### User Model

```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  avatar: String,
  role: Enum ["student", "instructor", "admin"],
  phoneNumber: String,
  isEmailVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Course Model

```javascript
{
  title: String,
  slug: String (unique),
  description: String,
  shortDescription: String,
  thumbnail: String,
  previewVideo: String,
  instructorId: ObjectId (ref: User),
  categoryId: ObjectId (ref: Category),
  level: Enum ["beginner", "intermediate", "advanced"],
  price: Number,
  originalPrice: Number,
  rating: Number,
  enrolledCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Enrollment Model

```javascript
{
  userId: ObjectId (ref: User),
  courseId: ObjectId (ref: Course),
  enrolledAt: Date,
  completedAt: Date,
  isCompleted: Boolean,
  progress: Number
}
```

### Order Model

```javascript
{
  userId: ObjectId (ref: User),
  courseIds: [ObjectId],
  totalPrice: Number,
  status: Enum ["pending", "completed", "cancelled"],
  paymentMethod: String,
  paymentId: String,
  createdAt: Date
}
```

## 👥 Demo Accounts

### Admin Account

- **Email:** `admin.demo@gmail.com`
- **Password:** `Demo@123`
- **Access:** Full admin dashboard, manage courses, users, orders

### Student Account

- **Email:** `user.demo@gmail.com`
- **Password:** `Demo@123`
- **Access:** Browse courses, enroll, track progress

## 🚀 Deployment

### Deploy Backend to Vercel

1. **Push to GitHub:**

   ```bash
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set environment variables in Vercel dashboard
   - Deploy!

### Deploy Frontend to Vercel

1. **Update `.env.local` for production:**

   ```env
   VITE_API_URL=https://your-backend-vercel-domain.vercel.app/api
   ```

2. **Same deployment steps as backend**

## 📝 Available Scripts

### Frontend

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend

```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm run start:debug  # Start with debugging enabled
npm test             # Run tests
```

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcryptjs
- ✅ CORS enabled
- ✅ Rate limiting on API endpoints
- ✅ Input validation & sanitization
- ✅ Secure payment processing with VNPay
- ✅ Email verification for user registration

## 📱 Responsive Design

The platform is fully responsive and optimized for:

- 📱 Mobile devices (320px and up)
- 💻 Tablets (768px and up)
- 🖥️ Desktop (1024px and up)

## 🎨 UI Components

- **Ant Design** - Data tables, forms, modals, notifications
- **Material-UI** - Cards, buttons, icons
- **TailwindCSS** - Styling & layout
- **Custom Components** - Specific platform features

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the **ISC License** - see the LICENSE file for details.

## 👨‍💼 Author

**EnTiVi** - [GitHub](https://github.com/truongvu1508)

## 📞 Contact & Support

- 📧 Email: [Your Email]
- 🐛 Issues: [GitHub Issues](https://github.com/truongvu1508/online-course-platform/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/truongvu1508/online-course-platform/discussions)

## 🙏 Acknowledgments

- React and Vue.js communities
- Ant Design team for amazing components
- VNPay for payment integration
- Cloudinary for cloud storage
- All contributors who made this project possible

---

<div align="center">

**Made with ❤️ by EnTiVi**

[⬆ Back to top](#-online-course-platform)

</div>
