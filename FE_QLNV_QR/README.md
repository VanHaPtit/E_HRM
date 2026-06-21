# Quản Lý Nhân Viên - Frontend 

Đây là phần ứng dụng giao diện (Frontend) cho hệ thống Quản lý nhân viên. Dự án được xây dựng bằng ReactJS với công cụ Vite giúp tốc độ phát triển cực nhanh, kết hợp cùng thư viện UI Ant Design (antd) để mang lại giao diện hiện đại và thân thiện với người dùng.

## Công nghệ sử dụng

- **Core:** React 19, React DOM
- **Build Tool:** Vite 7
- **UI Framework:** Ant Design, @ant-design/icons
- **Charts/Biểu đồ:** @ant-design/plots
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Xử lý ngày tháng:** Day.js

## Yêu cầu hệ thống

Để chạy được dự án này, máy tính của bạn cần cài đặt:

- **Node.js** (Khuyến nghị phiên bản 18.x trở lên)
- **npm** (được cài đặt sẵn cùng Node.js) hoặc **yarn**

## Hướng dẫn Cài đặt & Khởi chạy dự án

### Bước 1: Cài đặt các thư viện (Dependencies)

Mở Terminal tại thư mục của dự án Frontend (Ví dụ: Mở trực tiếp bằng Terminal của VS Code). Chạy lệnh sau để cài đặt tất cả các gói cần thiết:

```bash
npm install
```

### Bước 2: Chạy dự án (Môi trường Development)

Sau khi quá trình cài đặt hoàn tất, hãy khởi động ứng dụng bằng lệnh:

```bash
npm run dev
```

Sau khi chạy lệnh trên, Vite sẽ cung cấp cho bạn một đường dẫn cục bộ trên Terminal (thường là **`http://localhost:5173/`** hoặc tương tự).
Bạn chỉ cần **ấn giữ nút `Ctrl` và Click chuột** vào đường link đó (hoặc copy paste) vào trình duyệt để xem ứng dụng.

## Các câu lệnh (Scripts) khác

- **`npm run build`**: Biên dịch và đóng gói ứng dụng để sẵn sàng đưa lên môi trường thực tế (Production).
- **`npm run preview`**: Chạy thử bản build (sau khi đã chạy npm run build) ngay trên máy cục bộ để kiểm tra.
- **`npm run lint`**: Quét và tìm các lỗi cú pháp trong mã nguồn bằng ESLint.

## Lưu ý

- Đảm bảo rằng Backend của hệ thống (Spring Boot) đang được chạy song song để Frontend có thể gọi API thành công.
- Nếu bị lỗi liên quan đến cổng (port) đã được sử dụng, Vite sẽ tự động tìm một cổng trống tiếp theo (ví dụ: 5174, 5175,...).
