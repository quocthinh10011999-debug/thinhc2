
# 🎖️ Hệ thống Quản lý Thăm Quân nhân VMS (Tiểu đoàn 15 SPG-9)

Hệ thống quản lý thông tin, đăng ký thăm quân nhân và theo dõi diễn biến tư tưởng chuyên nghiệp dành cho đơn vị quân đội. Tích hợp AI (Gemini) và cơ sở dữ liệu PostgreSQL.

![Chuyên nghiệp](https://img.shields.io/badge/Military-Dashboard-800000)
![Công nghệ](https://img.shields.io/badge/React-19-blue)
![Database](https://img.shields.io/badge/PostgreSQL-Neon-green)
![AI](https://img.shields.io/badge/Gemini-AI-orange)

## 📖 Mục lục
- [Giới thiệu](#giới-thiệu)
- [Tính năng chính](#tính-năng-chính)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Hướng dẫn cài đặt](#hướng-dẫn-cài-đặt)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Bảo mật](#bảo-mật)

## 🚀 Giới thiệu
Dự án được xây dựng nhằm hiện đại hóa công tác quản lý tại đơn vị, giúp thân nhân chiến sĩ dễ dàng đăng ký thăm hỏi trực tuyến, đồng thời giúp chỉ huy nắm bắt tình hình tư tưởng đơn vị một cách trực quan qua Dashboard "War Room".

## ✨ Tính năng chính
- **Portal Thân nhân**: 
  - Xem truyền thống, quy định đơn vị.
  - Đăng ký thăm quân nhân qua tờ khai điện tử.
  - Hòm thư góp ý tích hợp **AI Trực ban** (Gemini API) phản hồi tự động.
- **Dashboard Chỉ huy**:
  - Quản lý danh sách đăng ký thăm (Duyệt/Từ chối).
  - **Bảng chỉ huy tư tưởng**: Theo dõi chỉ số ổn định của 4 đơn vị (C1, C2, C3, Tiểu đoàn bộ) qua biểu đồ Radar và Heatmap.
  - Quản lý tài khoản cán bộ vận hành.
  - Tùy biến toàn bộ giao diện (Logo, Màu sắc, Nội dung) qua Admin Panel.

## 🛠 Công nghệ sử dụng
- **Frontend**: React 19 (ES6+), Vite, Tailwind CSS.
- **Icons**: Lucide React.
- **Backend/Database**: PostgreSQL (Neon Serverless).
- **AI Integration**: Google Gemini 3.0 Flash.
- **Deployment**: Vercel/GitHub Pages.

## 📦 Hướng dẫn cài đặt

1. **Clone repository:**
   ```bash
   git clone https://github.com/username/vms-military-management.git
   cd vms-military-management
   ```

2. **Cài đặt thư viện:**
   ```bash
   npm install
   ```

3. **Cấu hình biến môi trường:**
   Tạo tệp `.env` ở thư mục gốc và thêm các thông số:
   ```env
   API_KEY=your_gemini_api_key_here
   DATABASE_URL=your_postgresql_url_here
   ```

4. **Chạy dự án ở chế độ Dev:**
   ```bash
   npm run dev
   ```

## 🔒 Bảo mật
- Dữ liệu kết nối Database được bảo mật qua SSL/TLS.
- Hệ thống phân quyền chặt chẽ giữa Quản trị viên và Nhân viên.
- Toàn bộ log thao tác được lưu vết trên hệ thống Cloud.

## 👨‍✈️ Tác giả
- Đơn vị: **Tiểu đoàn 15 SPG-9 - Sư đoàn 324**
- Phát triển bởi: Đội ngũ Kỹ thuật CNTT đơn vị.

---
*Lưu ý: Đây là hệ thống mô phỏng phục vụ mục đích quản lý hành chính dân sự, không chứa các thông tin bí mật quân sự tối mật.*
