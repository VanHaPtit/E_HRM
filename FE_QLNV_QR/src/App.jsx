
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';

import Login from './pages/Login';

// --- IMPORT CÁC TRANG (PAGE) ---
import NhanVienList from './pages/NhanVien/NhanVienList';
import SendEmailPage from './pages/NhanVien/SendEmailPage';
import BangLuongPage from './pages/TinhLuong/BangLuongPage';
import PhongBanPage from './pages/DanhMuc/PhongBanPage';
import CaLamViecPage from './pages/DanhMuc/CaLamViecPage';
import HopDongList from './pages/HopDong/HopDongList';
import NguoiPhuThuocList from './pages/NguoiPhuThuoc/NguoiPhuThuocList';
import QuaTrinhCongTacList from './pages/QuaTrinhCongTac/QuaTrinhCongTacList';
import ChucVuList from './pages/DanhMuc/ChucVuList';
import ChamCongChiTietPage from './pages/ChamCongChiTiet/ChamCongChiTietPage';
import DonXinPhepList from './pages/DonXinPhep/DonXinPhepList';
import QuyPhepNamList from './pages/QuyPhepNam/QuyPhepNamList';
import CauHinhPhuCapPage from './pages/DanhMuc/CauHinhPhuCapPage';
import NhanVienPhuCapList from './pages/NhanVienPhuCap/NhanVienPhuCapList';
import AllowedIpPage from './pages/DanhMuc/AllowedIpPage';
import SystemConfigPage from './pages/SystemConfig/SystemConfigPage';

const ComingSoon = ({ title }) => (
  <div style={{ textAlign: 'center', marginTop: 50 }}>
    <h1>{title}</h1>
    <p>Tính năng đang được phát triển...</p>
  </div>
);

// --- COMPONENT BẢO VỆ ROUTE (AUTH GUARD) ---
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('user_name') !== null;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const ProtectedRoute = ({ allowedRoles }) => {
  const userRoles = JSON.parse(localStorage.getItem("user_roles") || "[]");

  // Kiểm tra quyền
  const hasPermission = allowedRoles.some(role => userRoles.includes(role));

  if (!hasPermission) {
    // Nếu không có quyền, đá về trang 403
    return <Navigate to="/403" replace />;
  }

  // Nếu có quyền, Outlet sẽ hiển thị các Route con bên trong
  return <Outlet />;
};


import Dashboard from "./pages/Dashboard";
import MyProfile from "./pages/MyProfile";

const RoleBasedDashboard = () => {
  const userRoles = JSON.parse(localStorage.getItem("user_roles") || "[]");
  const isAdminOrHR = userRoles.includes("ADMIN") || userRoles.includes("HR");
  
  if (!isAdminOrHR) {
    return <Navigate to="/cham-cong" replace />;
  }
  return <Dashboard />;
};

function App() {
  return (
    <Routes>
      {/* 1. ROUTE CÔNG KHAI */}
      <Route path="/login" element={<Login />} />
      <Route path="/403" element={<div style={{ textAlign: "center", padding: "50px" }}><h1>403</h1><p>Bạn không có quyền truy cập trang này!</p></div>} />

      {/* 2. ROUTE CHO TẤT CẢ USER ĐÃ ĐĂNG NHẬP (USER, HR, ADMIN) */}
      <Route element={<ProtectedRoute allowedRoles={["USER", "HR", "ADMIN"]} />}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<RoleBasedDashboard />} />
          <Route path="my-profile" element={<MyProfile />} />
          <Route path="cham-cong" element={<ChamCongChiTietPage />} /> {/* Cho phép chấm công */}
          <Route path="don-xin-phep" element={<DonXinPhepList />} />
          <Route path="quy-phep-nam" element={<QuyPhepNamList />} />
        </Route>
      </Route>

      {/* 3. ROUTE CHỈ DÀNH CHO NHÂN SỰ & QUẢN TRỊ VIÊN (HR, ADMIN) */}
      <Route element={<ProtectedRoute allowedRoles={["HR", "ADMIN"]} />}>
        <Route path="/" element={<MainLayout />}>
          {/* Quản lý hồ sơ nhân viên */}
          <Route path="nhan-vien" element={<NhanVienList />} />
          <Route path="send-email" element={<SendEmailPage />} />
          <Route path="qua-trinh-cong-tac" element={<QuaTrinhCongTacList />} />
          <Route path="hop-dong" element={<HopDongList />} />
          <Route path="nguoi-phu-thuoc" element={<NguoiPhuThuocList />} />

          <Route path="ca-lam-viec" element={<CaLamViecPage />} />
        </Route>
      </Route>

      {/* 4. ROUTE CHỈ DÀNH CHO QUẢN TRỊ VIÊN (ADMIN) */}
      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route path="/" element={<MainLayout />}>
          {/* Cấu hình danh mục hệ thống */}
          <Route path="phong-ban" element={<PhongBanPage />} />
          <Route path="chuc-vu" element={<ChucVuList />} />
          <Route path="phu-cap" element={<CauHinhPhuCapPage />} />
          <Route path="nhan-vien-phu-cap" element={<NhanVienPhuCapList />} />
          <Route path="cau-hinh-ip" element={<AllowedIpPage />} />
          <Route path="cai-dat-tham-so" element={<SystemConfigPage />} />

          {/* Lương thưởng */}
          <Route path="tinh-luong" element={<BangLuongPage />} />
        </Route>
      </Route>

      {/* Redirect các link sai về Login hoặc Dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;