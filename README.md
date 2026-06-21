# Tổng quan dự án Quản Lý Nhân Viên

Dự án Quản Lý Nhân Viên là một hệ thống phần mềm giúp số hóa và tự động hóa các quy trình quản lý nhân sự trong doanh nghiệp. Hệ thống cung cấp các giải pháp quản lý từ thông tin hồ sơ nhân viên, phòng ban, điểm danh qua hai hình thức: quét mã QR và kết nối mạng WiFi, cho đến tự động tính toán lương và quản lý ngày phép.

Dự án được xây dựng theo kiến trúc Client-Server:

- **Backend:** Spring Boot (Java), MySQL, Bảo mật JWT, tích hợp SendGrid (gửi Email), Cloudinary (lưu trữ ảnh).
- **Frontend:** ReactJS, Vite, Ant Design.
- **Triển khai (Deployment):** Hệ thống được đóng gói hoàn chỉnh bằng Docker, giúp cài đặt và chạy toàn bộ ứng dụng chỉ với một dòng lệnh duy nhất.

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

## Phân rã nghiệp vụ (Business Breakdown)

Dựa trên thiết kế cơ sở dữ liệu và các Use Case cốt lõi, hệ thống E_HRM được phân rã thành các nhóm API chính sau:

**1. Nhóm Authentication & Security (Xác thực & Phân quyền)**

- Đăng nhập (nhận JWT Token) / Đăng xuất.
- Tạo/Cấp tài khoản cho nhân viên mới.
- Đổi mật khẩu.

**2. Nhóm Core HR (Quản lý Hồ sơ Nhân sự)**

- Quản lý Nhân viên (CRUD thông tin cá nhân, chức vụ, phòng ban).
- Quản lý Phòng ban & Chức vụ.
- Quản lý Hợp đồng lao động, Người phụ thuộc, Lịch sử công tác.

**3. Nhóm Time & Attendance (Chấm công)**

- Quản lý Ca làm việc (WorkShift).
- Tạo phiên điểm danh & Sinh mã QR động (AttendanceSession).
- Cấu hình IP/MAC mạng WiFi hợp lệ (AllowedIp).
- Thực hiện Check-in / Check-out (Bằng QR hoặc WiFi).

**4. Nhóm Leave Management (Nghỉ phép)**

- Gửi Đơn xin nghỉ phép.
- Duyệt/Từ chối đơn xin nghỉ.
- Tra cứu Quỹ phép năm (AnnualLeave).

**5. Nhóm Payroll (Lương & Thưởng)**

- Cấu hình tham số lương (Lương cơ sở, Thuế TNCN, Bảo hiểm).
- Kích hoạt chạy tính lương tự động hàng tháng.
- Xem chi tiết Bảng lương cá nhân (MonthlyPayroll).

---

## Đặc tả chi tiết API Specification

### Nhóm Authentication & Security

#### API 1: Xác thực người dùng (Login)

**1. Mô tả tổng quan:** API cho phép người dùng (Admin, HR, User) xác thực thông tin đăng nhập. Nếu hợp lệ, hệ thống trả về mã bảo mật JWT (JSON Web Token) để sử dụng cho các phiên làm việc tiếp theo.
**2. Thông tin kết nối:**

- **Method (Phương thức):** POST
- **Endpoint (Đường dẫn):** `/api/v1/auth/login`
  **3. Yêu cầu gửi đi (Request):**
- **Headers:** `Content-Type: application/json`
- **Cấu trúc Dữ liệu gửi đi (Request Body):**
  ```json
  {
    "username": "string (Tên đăng nhập)",
    "password": "string (Mật khẩu)"
  }
  ```

**4. Kết quả trả về (Response):**

- **Cấu trúc Dữ liệu trả về khi thành công (HTTP Status 200):**

| Tên trường (Field)   | Kiểu dữ liệu | Mô tả chi tiết (Description)                                       |
| :---------------------- | :-------------- | :-------------------------------------------------------------------- |
| status                  | Number          | Mã trạng thái hệ thống (200).                                    |
| message                 | String          | Thông báo trả về (VD: "Đăng nhập thành công").               |
| payload                 | Object          | Chứa thông tin token và người dùng.                             |
| payload.accessToken     | String          | JWT token dùng để gọi các private API.                           |
| payload.user            | Object          | Thông tin cơ bản của user.                                        |
| payload.user.role       | String          | Phân quyền truy cập đa cấp bậc (VD: ADMIN, HR, USER).           |
| payload.user.employeeId | Number          | ID của nhân viên tương ứng trong bảng Employee (Quan hệ 1-1). |

- **Ví dụ gói dữ liệu nhận về (JSON):**
  ```json
  {
    "status": 200,
    "message": "Login successful",
    "payload": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": 1,
        "username": "ha.van",
        "role": "HR",
        "employeeId": 105
      }
    }
  }
  ```

**5. Các mã lỗi thường gặp (Error Codes):**

- `400 Bad Request`: Thiếu username hoặc password.
- `401 Unauthorized`: Sai tài khoản hoặc mật khẩu.
- `403 Forbidden`: Tài khoản đã bị khóa.

---

### Nhóm Core HR

#### API 2: Lấy danh sách & tra cứu nhân viên

**1. Mô tả tổng quan:** API cho phép người dùng (HR, Admin) tra cứu danh sách nhân viên trong hệ thống. API hỗ trợ phân trang và tìm kiếm cơ bản. Dữ liệu trả về bao gồm thông tin cá nhân và thông tin phòng ban, chức vụ tương ứng (Quan hệ N-1).
**2. Thông tin kết nối:**

- **Method (Phương thức):** GET
- **Endpoint (Đường dẫn):** `/api/v1/employees`
  **3. Yêu cầu gửi đi (Request):**
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters (Tham số trên URL):**
  - `page` (Number): Trang hiện tại (Mặc định: 1).
  - `size` (Number): Số lượng bản ghi trên mỗi trang (Mặc định: 20).
  - `keyword` (String): Từ khóa tìm kiếm (theo tên hoặc mã nhân viên).
    **4. Kết quả trả về (Response):**
- **Cấu trúc Dữ liệu trả về khi thành công (HTTP Status 200):**

| Tên trường (Field)      | Kiểu dữ liệu | Mô tả chi tiết (Description)                        |
| :------------------------- | :-------------- | :----------------------------------------------------- |
| status                     | Number          | Mã trạng thái hệ thống (200).                     |
| message                    | String          | Thông báo trả về.                                  |
| payload                    | Object          | Chứa danh sách dữ liệu và thông tin phân trang. |
| payload.content            | ArrayObject     | Danh sách chi tiết thông tin nhân viên.           |
| payload.content.id         | Number          | ID của nhân viên.                                   |
| payload.content.fullName   | String          | Họ và tên nhân viên.                              |
| payload.content.department | Object          | Thông tin phòng ban của nhân viên.                |
| payload.content.position   | Object          | Thông tin chức vụ của nhân viên.                 |
| payload.totalElements      | Number          | Tổng số nhân viên trong hệ thống.                |

- **Ví dụ gói dữ liệu nhận về (JSON):**
  ```json
  {
    "status": 200,
    "message": "Lấy danh sách nhân viên thành công",
    "payload": {
      "content": [
        {
          "id": 105,
          "fullName": "Nguyễn Văn A",
          "department": { "id": 1, "name": "Phòng IT" },
          "position": { "id": 2, "name": "Senior Developer" }
        }
      ],
      "totalElements": 50
    }
  }
  ```

**5. Các mã lỗi thường gặp (Error Codes):**

- `401 Unauthorized`: Token JWT không hợp lệ hoặc đã hết hạn.
- `403 Forbidden`: Người dùng không có quyền truy cập (yêu cầu quyền HR hoặc ADMIN).

#### API 3: Tạo mới hồ sơ nhân viên

**1. Mô tả tổng quan:** API dành cho bộ phận HR hoặc Admin để tạo mới một thực thể Nhân viên (Employee), đồng thời thiết lập quan hệ Nhiều-Một với Phòng ban (Department) và Chức vụ (Position).
**2. Thông tin kết nối:**

- **Method (Phương thức):** POST
- **Endpoint (Đường dẫn):** `/api/v1/employees`
  **3. Yêu cầu gửi đi (Request):**
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Cấu trúc Dữ liệu gửi đi (Request Body):**
  ```json
  {
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "departmentId": "number (ID phòng ban)",
    "positionId": "number (ID chức vụ)"
  }
  ```

**4. Kết quả trả về (Response):**

- **Cấu trúc Dữ liệu trả về khi thành công (HTTP Status 201 Created):**

| Tên trường (Field)  | Kiểu dữ liệu | Mô tả chi tiết (Description)           |
| :--------------------- | :-------------- | :---------------------------------------- |
| status                 | Number          | Mã trạng thái hệ thống (201).        |
| message                | String          | Thông báo trả về.                     |
| payload                | Object          | Dữ liệu nhân viên vừa tạo.          |
| payload.id             | Number          | ID định danh của nhân viên.          |
| payload.fullName       | String          | Họ và tên nhân viên.                 |
| payload.departmentName | String          | Tên phòng ban nhân viên trực thuộc. |

**5. Các mã lỗi thường gặp (Error Codes):**

- `401 Unauthorized`: Token truy cập không hợp lệ hoặc bị thiếu.
- `403 Forbidden`: User không có quyền HR hoặc ADMIN.
- `404 Not Found`: Không tìm thấy departmentId hoặc positionId tương ứng trong CSDL.

#### API 4: Cập nhật thông tin nhân viên & Upload ảnh đại diện

**1. Mô tả tổng quan:** API hỗ trợ cập nhật thông tin cá nhân cơ bản, bao gồm cả việc lưu trữ ảnh đại diện (avatar) đã được upload qua Cloudinary.
**2. Thông tin kết nối:**

- **Method (Phương thức):** PUT
- **Endpoint (Đường dẫn):** `/api/v1/employees/{id}`
  **3. Yêu cầu gửi đi (Request):**
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Path Variable:** `id` (Number): ID của nhân viên cần cập nhật.
- **Cấu trúc Dữ liệu gửi đi (Request Body):**
  ```json
  {
    "fullName": "string (Họ và tên mới)",
    "phone": "string (Số điện thoại mới)",
    "avatarUrl": "string (Đường dẫn ảnh trả về từ Cloudinary)",
    "departmentId": "number",
    "positionId": "number"
  }
  ```

**4. Kết quả trả về (Response):**

- **Cấu trúc Dữ liệu trả về khi thành công (HTTP Status 200):**

| Tên trường (Field) | Kiểu dữ liệu | Mô tả chi tiết (Description)                              |
| :-------------------- | :-------------- | :----------------------------------------------------------- |
| status                | Number          | Mã trạng thái hệ thống (200).                           |
| message               | String          | Thông báo trả về.                                        |
| payload               | Object          | Thông tin nhân viên sau khi đã cập nhật thành công. |
| payload.avatarUrl     | String          | Link ảnh đại diện (Lưu trên Cloudinary).               |

**5. Các mã lỗi thường gặp (Error Codes):**

- `400 Bad Request`: Dữ liệu đầu vào không hợp lệ (VD: Số điện thoại sai định dạng).
- `404 Not Found`: Không tìm thấy nhân viên với ID tương ứng.

#### API 5: Quản lý phòng ban (Khởi tạo mới)

**1. Mô tả tổng quan:** Khởi tạo và thiết lập các phòng ban chuyên trách trong công ty. Thiết lập thực thể Department để phục vụ móc nối dữ liệu Quan hệ N-1 với bảng Employee.
**2. Thông tin kết nối:**

- **Method (Phương thức):** POST
- **Endpoint (Đường dẫn):** `/api/v1/departments`
  **3. Yêu cầu gửi đi (Request):**
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Cấu trúc Dữ liệu gửi đi (Request Body):**
  ```json
  {
    "name": "string (Tên phòng ban, VD: Khối Kỹ Thuật)",
    "description": "string (Mô tả chức năng phòng ban)"
  }
  ```

**4. Kết quả trả về (Response):**

- **Cấu trúc Dữ liệu trả về khi thành công (HTTP Status 201 Created):**

| Tên trường (Field) | Kiểu dữ liệu | Mô tả chi tiết (Description) |
| :-------------------- | :-------------- | :------------------------------ |
| payload.id            | Number          | ID định danh của phòng ban. |
| payload.name          | String          | Tên hiển thị phòng ban.     |

**5. Các mã lỗi thường gặp (Error Codes):**

- `403 Forbidden`: User không có quyền thực hiện.
- `409 Conflict`: Tên phòng ban đã tồn tại trong hệ thống.

#### API 6: Lấy danh sách hợp đồng lao động của nhân viên

**1. Mô tả tổng quan:** Lấy toàn bộ lịch sử và thời hạn hợp đồng của một nhân viên cụ thể. Thực thể LaborContract có quan hệ N-1 với Employee.
**2. Thông tin kết nối:**

- **Method (Phương thức):** GET
- **Endpoint (Đường dẫn):** `/api/v1/employees/{id}/labor-contracts`
  **3. Yêu cầu gửi đi (Request):**
- **Headers:** `Authorization: Bearer <token>`
  **4. Kết quả trả về (Response):**
- **Cấu trúc Dữ liệu trả về khi thành công (HTTP Status 200):**

| Tên trường (Field) | Kiểu dữ liệu | Mô tả chi tiết (Description)                                |
| :-------------------- | :-------------- | :------------------------------------------------------------- |
| payload               | ArrayObject     | Danh sách các hợp đồng lao động.                        |
| payload.id            | Number          | ID của hợp đồng.                                           |
| payload.contractType  | String          | Loại hợp đồng (VD: Thử việc, 1 năm, Không thời hạn). |
| payload.startDate     | String          | Ngày bắt đầu hợp đồng.                                  |
| payload.endDate       | String          | Ngày kết thúc hợp đồng (nếu có).                       |
| payload.isActive      | Boolean         | Trạng thái hiệu lực của hợp đồng.                      |

- **Ví dụ gói dữ liệu nhận về (JSON):**
  ```json
  {
    "status": 200,
    "message": "Thành công",
    "payload": [
      {
        "id": 10,
        "contractType": "Hợp đồng 1 năm",
        "startDate": "2025-01-01",
        "endDate": "2025-12-31",
        "isActive": true
      }
    ]
  }
  ```

**5. Các mã lỗi thường gặp (Error Codes):**

- `404 Not Found`: Không tìm thấy nhân viên (Employee) tương ứng để lấy danh sách hợp đồng.

---

### Nhóm Time & Attendance (Chấm công)

#### API 7: Quản lý ca làm việc (WorkShift)

**1. Mô tả tổng quan:** API cho phép HR hoặc Admin thiết lập các ca làm việc chuẩn (quy định giờ vào, giờ ra) để làm căn cứ tính đi muộn, về sớm.
**2. Thông tin kết nối:**

- **Method (Phương thức):** POST
- **Endpoint (Đường dẫn):** `/api/v1/attendance/workshifts`
  **3. Yêu cầu gửi đi (Request):**
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Cấu trúc Dữ liệu gửi đi (Request Body):**
  ```json
  {
    "name": "string (Tên ca, VD: Ca Hành chính)",
    "startTime": "string (Giờ bắt đầu chuẩn, định dạng HH:mm:ss)",
    "endTime": "string (Giờ kết thúc chuẩn, định dạng HH:mm:ss)"
  }
  ```

**4. Kết quả trả về (Response):**

- **Cấu trúc Dữ liệu trả về khi thành công (HTTP Status 201):**

| Tên trường (Field) | Kiểu dữ liệu | Mô tả chi tiết (Description)    |
| :-------------------- | :-------------- | :--------------------------------- |
| status                | Number          | Mã trạng thái hệ thống (201). |
| message               | String          | Thông báo trả về.              |
| payload               | Object          | Dữ liệu ca làm việc vừa tạo. |
| payload.id            | Number          | ID của ca làm việc.             |
| payload.name          | String          | Tên ca làm việc.                |
| payload.startTime     | String          | Giờ bắt đầu ca.                |
| payload.endTime       | String          | Giờ kết thúc ca.                |

**5. Các mã lỗi thường gặp (Error Codes):**

- `401 Unauthorized`: Token truy cập không hợp lệ hoặc bị thiếu.
- `403 Forbidden`: Người dùng không có quyền quản trị.
- `409 Conflict`: Tên ca làm việc đã tồn tại.

#### API 8: Tạo phiên điểm danh & Sinh mã QR động (AttendanceSession)

**1. Mô tả tổng quan:** API dùng để tạo một phiên điểm danh đại diện cho một ngày chấm công, có quan hệ N-1 với bảng WorkShift. Hệ thống sẽ tự động sinh ra một mã QR động (có thời hạn) để nhân viên quét.
**2. Thông tin kết nối:**

- **Method (Phương thức):** POST
- **Endpoint (Đường dẫn):** `/api/v1/attendance/sessions`
  **3. Yêu cầu gửi đi (Request):**
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Cấu trúc Dữ liệu gửi đi (Request Body):**
  ```json
  {
    "workShiftId": "number (ID của ca làm việc tương ứng)",
    "date": "string (Ngày áp dụng, định dạng YYYY-MM-DD)"
  }
  ```

**4. Kết quả trả về (Response):**

- **Cấu trúc Dữ liệu trả về khi thành công (HTTP Status 201):**

| Tên trường (Field) | Kiểu dữ liệu | Mô tả chi tiết (Description)                                         |
| :-------------------- | :-------------- | :---------------------------------------------------------------------- |
| status                | Number          | Mã trạng thái hệ thống.                                            |
| message               | String          | Thông báo trả về.                                                   |
| payload               | Object          | Dữ liệu phiên điểm danh chứa mã QR.                              |
| payload.id            | Number          | ID của phiên điểm danh.                                             |
| payload.workShiftId   | Number          | Khóa ngoại trỏ đến ID ca làm việc.                               |
| payload.date          | String          | Ngày của phiên.                                                      |
| payload.qrCode        | String          | Chuỗi mã hóa QR sinh ngẫu nhiên dùng để render lên giao diện. |

**5. Các mã lỗi thường gặp (Error Codes):**

- `404 Not Found`: Không tìm thấy workShiftId.
- `409 Conflict`: Phiên điểm danh cho ca làm việc này trong ngày đã tồn tại.

#### API 9: Cấu hình IP/MAC mạng WiFi hợp lệ (AllowedIp)

**1. Mô tả tổng quan:** Khởi tạo danh sách các mạng WiFi hợp lệ (dựa trên IP/MAC) tại văn phòng công ty. Chỉ những thiết bị kết nối với mạng này mới được phép điểm danh.
**2. Thông tin kết nối:**

- **Method (Phương thức):** POST
- **Endpoint (Đường dẫn):** `/api/v1/attendance/allowed-ips`
  **3. Yêu cầu gửi đi (Request):**
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Cấu trúc Dữ liệu gửi đi (Request Body):**
  ```json
  {
    "ipAddress": "string (Địa chỉ IP Public/Local hợp lệ)",
    "macAddress": "string (Địa chỉ MAC của Router - Tùy chọn)",
    "description": "string (Mô tả, VD: WiFi Tầng 3 - Phòng IT)"
  }
  ```

**4. Kết quả trả về (Response):**

- **Cấu trúc Dữ liệu trả về khi thành công (HTTP Status 200):**

| Tên trường (Field) | Kiểu dữ liệu | Mô tả chi tiết (Description)                          |
| :-------------------- | :-------------- | :------------------------------------------------------- |
| status                | Number          | Mã trạng thái hệ thống (200).                       |
| message               | String          | Thông báo trả về (VD: "Cấu hình IP thành công"). |
| payload               | Object          | Dữ liệu mạng vừa thêm.                              |
| payload.id            | Number          | ID định danh mạng.                                    |
| payload.ipAddress     | String          | Dải IP được lưu.                                    |

**5. Các mã lỗi thường gặp (Error Codes):**

- `400 Bad Request`: Định dạng IP không hợp lệ.

#### API 10: Thực hiện Check-in / Check-out (AttendanceDetail)

**1. Mô tả tổng quan:** API này ghi nhận Giờ Check-in/Check-out thực tế của nhân viên vào bảng trung gian AttendanceDetail. Hệ thống sẽ xác thực mã QR của Phiên điểm danh (AttendanceSession) hoặc xác thực tính hợp lệ của IP/MAC mạng WiFi công ty (AllowedIp).
**2. Thông tin kết nối:**

- **Method (Phương thức):** POST
- **Endpoint (Đường dẫn):** `/api/v1/attendance/record`
  **3. Yêu cầu gửi đi (Request):**
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Cấu trúc Dữ liệu gửi đi (Request Body):**
  ```json
  {
    "sessionId": "number (ID phiên điểm danh hiện tại)",
    "method": "string (Hình thức điểm danh, Enum: 'QR' hoặc 'WIFI')",
    "type": "string (Loại thao tác, Enum: 'CHECK_IN' hoặc 'CHECK_OUT')",
    "qrToken": "string (Bắt buộc nếu method là QR - Token giải mã từ mã QR)",
    "clientIp": "string (IP hiện tại của thiết bị - Bắt buộc nếu method là WIFI)"
  }
  ```

**4. Kết quả trả về (Response):**

- **Cấu trúc Dữ liệu trả về khi thành công (HTTP Status 200):**

| Tên trường (Field) | Kiểu dữ liệu | Mô tả chi tiết (Description)                                                   |
| :-------------------- | :-------------- | :-------------------------------------------------------------------------------- |
| status                | Number          | Mã trạng thái hệ thống.                                                      |
| message               | String          | Thông báo trả về.                                                             |
| payload               | Object          | Chi tiết bản ghi chấm công (AttendanceDetail).                                |
| payload.employeeId    | Number          | ID của nhân viên điểm danh.                                                  |
| payload.recordTime    | String          | Thời gian ghi nhận hệ thống (Giờ vào/ra).                                   |
| payload.status        | String          | Trạng thái (VD: ON_TIME, LATE, EARLY_LEAVE) tự động so sánh với WorkShift. |

- **Ví dụ gói dữ liệu nhận về (JSON):**
  ```json
  {
    "status": 200,
    "message": "Check-in thành công",
    "payload": {
      "employeeId": 105,
      "recordTime": "2026-06-21T08:05:00Z",
      "status": "LATE"
    }
  }
  ```

**5. Các mã lỗi thường gặp (Error Codes):**

- `401 Unauthorized`: Lỗi xác thực token JWT.
- `403 Forbidden`: clientIp không khớp với bất kỳ AllowedIp nào trong hệ thống (lỗi WiFi).
- `406 Not Acceptable`: qrToken/qrCode không hợp lệ hoặc đã hết hạn.
- `409 Conflict`: Nhân viên đã thực hiện thao tác (Check-in/Check-out) cho ca này rồi.

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
