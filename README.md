# 📦 FoodWeb

> Dự án cơ bản về thiết lập một website bán đồ ăn với backend sử dụng Node.js

## 📁 Mục lục

- 🧱 Công nghệ sử dụng
- 🚀 Cài đặt & Khởi chạy
- 🗂️ Cấu trúc thư mục
- ⚙️ Cấu hình môi trường (.env)
- 🧪 Scripts
- 📡 API Docs
- 🔐 Xác thực & Bảo mật

---

## 🧱 Công nghệ sử dụng

- **Node.js**: Môi trường runtime cho backend.
- **Express.js**: Framework để xây dựng API.
- **MongoDB (Mongoose)**: Cơ sở dữ liệu NoSQL.
- **JWT Authentication**: Xác thực người dùng bằng JSON Web Tokens.
- **Bcrypt**: Mã hóa mật khẩu.
- **Dotenv**: Quản lý biến môi trường.
- **Cloudinary**: Dịch vụ upload và quản lý hình ảnh.
- **Nodemon**: Tự động khởi động lại server trong quá trình phát triển.

---

## 🚀 Cài đặt & Khởi chạy

1. Clone dự án:

   ```bash
   git clone https://github.com/LongVuratOk/FoodWeb.git
   ```

2. Cài đặt thư viện:

   ```bash
   npm install
   ```

3. Cấu hình file `.env` (xem phần Cấu hình môi trường).

4. Khởi chạy dự án:

   ```bash
   npm run dev
   ```

---

## 🗂️ Cấu trúc thư mục

```
your-project-name/
├── src/
│   ├── auth/
│   ├── configs/
│   ├── constants
│   ├── controllers/
│   ├── core/
│   ├── services/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── utils/
│   ├── validation/
│   └── app.js
├── .env
├── package.json
├── README.md
└── server.js
```

---

## ⚙️ Cấu hình môi trường (.env)

Tạo file `.env` trong thư mục gốc với các biến sau:

```
MONGO_URI=mongodb://localhost:27017/foodweb
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_cloud_api_key
CLOUD_API_SECRET=your_cloud_api_secret
```

> **Lưu ý**: Thay các giá trị trên bằng thông tin thực tế từ dịch vụ MongoDB và Cloudinary của bạn.

---

## 🧪 Scripts

- Chạy ở chế độ phát triển:

  ```bash
  npm run dev
  ```

---

## 📡 API Docs

- Tài liệu API hiện tại được định nghĩa trong thư mục `src/routes/`.

---

## 🔐 Xác thực & Bảo mật

- **API Key**: Sử dụng API key để truy cập vào dịch vụ.
- **JWT Authentication**:
  - Sử dụng **Access Token** và **Refresh Token** để xác thực.
  - Quản lý phiên đăng nhập và phân quyền theo vai trò (role-based).
- **Route Protection**: Các route nhạy cảm được bảo vệ bằng middleware xác thực.
- **Mã hóa mật khẩu**: Sử dụng Bcrypt để mã hóa mật khẩu người dùng.
