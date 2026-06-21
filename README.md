# Tổng quan dự án Quản Lý Nhân Viên

Dự án Quản Lý Nhân Viên là một hệ thống phần mềm giúp số hóa và tự động hóa các quy trình quản lý nhân sự trong doanh nghiệp. Hệ thống cung cấp các giải pháp quản lý từ thông tin hồ sơ nhân viên, phòng ban, điểm danh qua hai hình thức: quét mã QR và kết nối mạng WiFi, cho đến tự động tính toán lương và quản lý ngày phép.

Dự án được xây dựng theo kiến trúc Client-Server:

- **Backend:** Spring Boot (Java), MySQL, Bảo mật JWT, tích hợp SendGrid (gửi Email), Cloudinary (lưu trữ ảnh).
- **Frontend:** ReactJS, Vite, Ant Design.
- **Triển khai (Deployment):** Hệ thống được đóng gói hoàn chỉnh bằng Docker (kiến trúc Monorepo), giúp cài đặt và chạy toàn bộ ứng dụng chỉ với một dòng lệnh duy nhất.

---

## Biểu đồ Thực thể Liên kết (ERD)

Cơ sở dữ liệu của hệ thống, thể hiện các mối quan hệ giữa Nhân viên, Phòng ban, Chấm công, Lương và các bảng liên quan khác:

### Mô tả chi tiết cấu trúc Database

Cơ sở dữ liệu được thiết kế chuẩn hóa và chia thành 6 phân hệ (module) chính, lấy bảng **Nhân viên (`Employee`)** làm trung tâm:

**1. Phân hệ Cốt lõi (Core Entity)**

- **`Employee` (Nhân viên):** Thực thể trung tâm lưu trữ thông tin cá nhân cơ bản.
- Có quan hệ **Nhiều - Một (N-1)** với **`Department` (Phòng ban)** và **`Position` (Chức vụ)**: Mỗi nhân viên thuộc một phòng ban và giữ một chức vụ nhất định.

**2. Phân hệ Tài khoản & Phân quyền (Security)**

- **`User` (Tài khoản):** Có quan hệ **1-1** với `Employee`. Mỗi nhân viên được cấp duy nhất một tài khoản đăng nhập.
- **`User` - `Role` (Quyền):** Hệ thống phân quyền truy cập đa cấp bậc (ADMIN, HR, USER).

**3. Phân hệ Hồ sơ Nhân sự (HR Records)**
Các thực thể này có quan hệ **N-1** với `Employee`:

- **`LaborContract` (Hợp đồng lao động):** Quản lý lịch sử và thời hạn hợp đồng.
- **`Dependent` (Người phụ thuộc):** Lưu thông tin người thân để tính giảm trừ gia cảnh thuế TNCN.
- **`WorkHistory` (Lịch sử công tác):** Ghi nhận quá trình thăng tiến, chuyển phòng ban.

**4. Phân hệ Chấm công (Time & Attendance)**

- **`WorkShift` (Ca làm việc):** Quy định giờ vào/ra chuẩn.
- **`AttendanceSession` (Phiên điểm danh):** Đại diện cho một ngày chấm công (chứa mã QR động). Quan hệ **N-1** với `WorkShift`.
- **`AttendanceDetail` (Chi tiết chấm công):** Bảng trung gian nối giữa `Employee` và `AttendanceSession`. Ghi nhận Giờ Check-in/Check-out thực tế của nhân viên.
- **`AllowedIp`:** Danh sách mạng WiFi hợp lệ (IP/MAC) để xác thực điểm danh.

**5. Phân hệ Nghỉ phép (Leave Management)**

- **`AnnualLeave` (Quỹ phép năm):** Quan hệ **N-1** với `Employee`. Quản lý tổng số phép, đã nghỉ, còn lại.
- **`LeaveRequest` (Đơn xin nghỉ):** Quan hệ **N-1** với `Employee`. Lưu thông tin đơn từ, trạng thái chờ duyệt/đã duyệt.

**6. Phân hệ Lương & Thưởng (Payroll)**

- **`AllowanceConfig` & `EmployeeAllowance`:** Cấu hình phụ cấp chung và chi tiết phụ cấp cho từng nhân viên.
- **`SystemConfig` & `TaxBracket`:** Lưu trữ các hằng số tính lương (Lương cơ sở, Tỷ lệ BHXH, Bậc thuế TNCN lũy tiến).
- **`MonthlyPayroll` (Bảng lương tháng):** Thực thể đích cuối cùng. Quan hệ **N-1** với `Employee`. Tổng hợp dữ liệu từ mọi phân hệ (Số ngày công từ bảng Chấm công, Phụ cấp, Phạt, Thuế, Bảo hiểm) để tự động tính ra **Lương Thực Nhận**.

---

## Các Giao diện chính

Danh sách các màn hình chức năng chính của hệ thống:

1. **Giao diện Dashboard (Trang chủ)**
   ![Dashboard](images/Giao%20diện%20DashBoad.png)
2. **Giao diện Danh sách Nhân viên**
   ![Danh sách nhân viên](images/Giao%20diện%20danh%20sách%20nhân%20viên.png)
3. **Giao diện Thông tin Cá nhân**
   ![Thông tin cá nhân](images/Giao%20diện%20thông%20tin%20cá%20nhân.png)
4. **Giao diện Thêm mới Nhân viên**
   ![Thêm mới nhân viên](images/Giao%20diện%20thêm%20mới%20nhân%20viên.png)
5. **Giao diện Quản lý Hợp đồng Lao động**
   ![Quản lý hợp đồng](images/Giao%20diện%20quản%20lí%20hợp%20đồng%20lao%20động.png)
6. **Giao diện Thêm mới Hợp đồng Lao động**
   ![Thêm mới hợp đồng](images/Giao%20diện%20thêm%20mới%20hợp%20đồng%20lao%20động.png)
7. **Giao diện Tạo phiên Điểm danh & Mã QR**
   ![Tạo phiên điểm danh](images/Giao%20diện%20tạo%20phiên%20điểm%20danh.png)

   ![Mã QR](images/Giao%20diện%20mã%20QR.png)
8. **Giao diện Chi tiết Chấm công**
   ![Chi tiết chấm công](images/Giao%20diện%20chi%20tiết%20chấm%20công.png)
9. **Giao diện Quản lý IP WiFi hợp lệ**
   ![Quản lý IP wifi](images/Giao%20diện%20quản%20lí%20IP%20wifi.png)
10. **Giao diện Bảng tính lương**
    ![Bảng tính lương](images/Giao%20diện%20bảng%20tính%20lương.png)
11. **Giao diện Cấu hình Hệ thống (Các tham số)**
    ![Cài đặt tham số](images/Giao%20diện%20cài%20đặt%20các%20tham%20số.png)
12. **Giao diện Soạn Email Thông báo**
    ![Soạn Email](images/Giao%20diện%20soạn%20Email.png)

---

## Các Use Case (UC) Chính

Hệ thống được chia thành các nhóm chức năng (Use Case) cốt lõi như sau:

### 1. Phân hệ Xác thực & Phân quyền

- **UC Đăng nhập / Đăng xuất:** Xác thực người dùng và bảo mật API bằng JWT.
- **UC Quản lý Tài khoản (Cấp quyền):** HR/Admin tạo và cấp tài khoản cho nhân viên mới.
- **UC Đổi mật khẩu / Cập nhật hồ sơ:** Cho phép nhân viên tự quản lý thông tin cá nhân cơ bản.

### 2. Phân hệ Quản lý Nhân sự

- **UC Quản lý Nhân viên:** Thêm mới, cập nhật, xóa, và tra cứu chi tiết thông tin nhân viên (chức vụ, liên hệ, ảnh đại diện upload qua Cloudinary).
- **UC Quản lý Phòng ban:** Khởi tạo và thiết lập các phòng ban chuyên trách trong công ty.

### 3. Phân hệ Chấm công (Time & Attendance)

- **UC Thiết lập QR / Cấu hình WiFi:** Hệ thống cung cấp cơ chế tạo mã QR an toàn và thiết lập các địa chỉ IP/MAC WiFi hợp lệ để chuẩn bị cho quá trình điểm danh.
- **UC Điểm danh (QR / WiFi):** Nhân viên thực hiện điểm danh bằng cách quét mã QR hoặc tự động ghi nhận khi kết nối vào mạng WiFi của công ty để lưu log (Giờ vào / Giờ ra).
- **UC Quản lý Đơn xin nghỉ phép:** Nhân viên nộp đơn xin nghỉ, Quản lý tiến hành Phê duyệt / Từ chối. Trạng thái nghỉ được đồng bộ với quỹ phép và hệ thống lương.

### 4. Phân hệ Lương & Thưởng (Payroll)

- **UC Tính lương tự động:** Hệ thống tổng hợp dữ liệu chấm công hàng tháng, kết hợp với các tham số (đi muộn, về sớm, nghỉ không phép) để tự động tính toán lương thực nhận.
- **UC Quản lý Cấu hình Lương:** Cho phép Admin cài đặt các thông số chung (Mức lương cơ sở, tỷ lệ bảo hiểm, quy định phạt đi muộn).
- **UC Xem Bảng lương:** Nhân viên có thể theo dõi chi tiết phiếu lương cá nhân của từng tháng.

### 5. Phân hệ Thông báo & Tiện ích

- **UC Gửi Email Hàng loạt:** HR sử dụng tính năng gửi email để thông báo cho một nhóm nhân viên hoặc toàn bộ công ty (sử dụng SendGrid API).

---

## Hướng dẫn Cài đặt & Chạy dự án (Tự động bằng Docker)

Dự án này được thiết kế theo chuẩn Monorepo và tích hợp sẵn Docker Compose. Điều này giúp bạn không cần phải cài đặt thủ công môi trường lập trình (không cần cài đặt Java hay Node.js rườm rà).

### 1. Yêu cầu hệ thống (Prerequisites)

- Đã cài đặt phần mềm **Docker Desktop**.
- Đã bật sẵn **MySQL** (thông qua XAMPP, Laragon, hoặc MySQL Workbench) đang chạy ở cổng `3306` trên máy tính (Host) của bạn.
- Đã tạo sẵn một cơ sở dữ liệu trống có tên là `qlnv` trong MySQL.

### 2. Các bước khởi chạy

**Bước 1:** Mở Terminal (Command Prompt / PowerShell / Git Bash) tại thư mục gốc của dự án.

**Bước 2:** Chạy dòng lệnh duy nhất sau để tự động xây dựng toàn bộ hệ thống:

```bash
docker-compose up -d --build
```

**Bước 3: Truy cập ứng dụng**
Sau khi màn hình Terminal báo `Started` màu xanh, bạn có thể mở trình duyệt và trải nghiệm dự án tại:
**`http://localhost:5173`**

*(Để tắt toàn bộ hệ thống sau khi dùng xong, bạn chỉ cần gõ lệnh `docker-compose down`)*
