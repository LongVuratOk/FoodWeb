# 📦 FoodWeb

> Dự án cơ bản về thiết lập một website bán đồ ăn cho backend sử dụng nodejs

## 📁 Mục lục

- [🧱 Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [🚀 Cài đặt & Khởi chạy](#-cài-đặt--khởi-chạy)
- [🗂️ Cấu trúc thư mục](#️-cấu-trúc-thư-mục)
- [⚙️ Cấu hình môi trường (.env)](#️-cấu-hình-môi-trường-env)
- [🧪 Scripts](#-scripts)
- [📡 API Docs](#-api-docs)
- [🔐 Xác thực & Bảo mật](#-xác-thực--bảo-mật)

---

## 🧱 Công nghệ sử dụng

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Bcrypt (mã hoá mật khẩu)
- Dotenv (quản lý biến môi trường)
- Cloudinary (upload ảnh)
- Nodemon

---

## 🚀 Cài đặt & Khởi chạy

```bash
# Clone project
git clone https://github.com/LongVuratOk/FoodWeb.git

# Cài đặt thư viện
npm install

---

## 🗂️ Cấu trúc thư mục

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

---

## ⚙️ Cấu hình môi trường (.env)

- MONGO_URI = 
- CLOUD_NAME = 
- CLOUD_API_KEY = 
- CLOUD_API_SECRET =

---

## Chạy ở chế độ phát triển

npm run dev

---

## 📡 API Docs

- Tạm thời tham khảo trong thư mục routes/

---

## 🔐 Xác thực & Bảo mật

- Thiết lập api key để sử dụng dịch vụ
- Xác thực bằng JWT Access Token và Refresh Token
- Quản lý phiên đăng nhập và phân quyền theo role
- Bảo vệ route bằng middleware
