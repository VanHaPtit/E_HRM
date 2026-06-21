import React, { useState } from 'react';
import { Layout, Menu, theme } from 'antd';
import {
    HomeOutlined, TeamOutlined, ApartmentOutlined,
    ScheduleOutlined, DollarOutlined
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import AppHeader from '../Layout/Header';

const { Sider, Content, Footer } = Layout;

// Hàm tạo cấu trúc item cho Menu
function getItem(label, key, icon, children) {
    return { key, icon, children, label };
}

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Lấy thông tin màu sắc/bo góc từ Theme Ant Design
    const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

    // 1. Lấy và kiểm tra Role từ localStorage
    const userRoles = JSON.parse(localStorage.getItem("user_roles") || "[]");
    const isAdmin = userRoles.includes("ADMIN");
    const isHR = userRoles.includes("HR");

    // 2. Định nghĩa Menu theo Role (Logic Lọc Menu)
    const menuItems = [
        (isAdmin || isHR) && getItem('Dashboard', '/', <HomeOutlined />),
        
        // Quản Lý Nhân Sự: Admin/HR thấy
        (isAdmin || isHR) && getItem('Quản Lý Nhân Sự', 'sub_hr', <TeamOutlined />, [
            getItem('Danh sách nhân viên', '/nhan-vien'),
            getItem('Hợp đồng lao động', '/hop-dong'),
            getItem('Người phụ thuộc', '/nguoi-phu-thuoc'),
            getItem('Quá trình công tác', '/qua-trinh-cong-tac'),
        ]),

        // Cơ Cấu Tổ Chức & Cấu Hình: Chỉ Admin
        isAdmin && getItem('Cơ Cấu Tổ Chức', 'sub_org', <ApartmentOutlined />, [
            getItem('Phòng ban', '/phong-ban'),
            getItem('Chức vụ', '/chuc-vu'),
            getItem('Cấu hình IP Chấm công', '/cau-hinh-ip'),
        ]),

        // Chấm Công & Phép: User thấy chấm công, Admin/HR thấy hết
        getItem('Chấm Công & Phép', 'sub_time', <ScheduleOutlined />, [
            getItem('Dữ liệu chấm công', '/cham-cong'),
            (isAdmin || isHR) && getItem('Ca làm việc', '/ca-lam-viec'),
            getItem('Đơn xin phép', '/don-xin-phep'),
            getItem('Quỹ phép năm', '/quy-phep-nam'),
        ].filter(Boolean)),

        // Lương & Phúc Lợi: Chỉ Admin
        isAdmin && getItem('Lương & Phúc Lợi', 'sub_salary', <DollarOutlined />, [
            getItem('Bảng tính lương', '/tinh-luong'),
            getItem('Phụ cấp', '/phu-cap'),
            getItem('Nhân viên phụ cấp', '/nhan-vien-phu-cap'),
            getItem('Cài đặt tham số', '/cai-dat-tham-so'),
        ]),
    ].filter(Boolean);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* --- SIDEBAR CỐ ĐỊNH --- */}
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={setCollapsed}
                width={250}
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    zIndex: 1001,
                    boxShadow: '2px 0 8px rgba(0,0,0,0.15)'
                }}
            >
                <div style={{
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#001529',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: collapsed ? 16 : 20,
                    borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}>
                    {collapsed ? 'HR' : 'HR SYSTEM'}
                </div>

                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={({ key }) => navigate(key)}
                />
            </Sider>

            {/* --- PHẦN LAYOUT BÊN PHẢI --- */}
            <Layout style={{
                marginLeft: collapsed ? 80 : 250,
                transition: 'all 0.2s',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Header cố định */}
                <AppHeader collapsed={collapsed} />

                {/* --- NỘI DUNG CHÍNH --- */}
                <Content style={{
                    margin: '24px 16px 0',
                    marginTop: 88, // 64px Header + 24px Margin
                    flex: '1 0 auto' // Đẩy footer xuống dưới
                }}>
                    <div style={{
                        padding: 24,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                        minHeight: 'calc(100vh - 170px)', // Tính toán chiều cao linh hoạt
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}>
                        {/* Nơi hiển thị các Component từ App.jsx */}
                        <Outlet />
                    </div>
                </Content>

                <Footer style={{ textAlign: 'center' }}>
                    HR Management System ©{new Date().getFullYear()} - Phát triển bởi Đội ngũ IT
                </Footer>
            </Layout>
        </Layout>
    );
};

export default MainLayout;




// import React, { useState } from 'react';
// import { Layout, Menu, theme } from 'antd';
// import {
//     HomeOutlined, TeamOutlined, ApartmentOutlined,
//     ScheduleOutlined, DollarOutlined
// } from '@ant-design/icons';
// import { Outlet, useNavigate, useLocation } from 'react-router-dom';
// import AppHeader from '../Layout/Header';

// const { Sider, Content, Footer } = Layout;

// function getItem(label, key, icon, children) {
//     return { key, icon, children, label };
// }


// const MainLayout = () => {
//     const [collapsed, setCollapsed] = useState(false);
//     const navigate = useNavigate();
//     const location = useLocation();

//     const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

//     const menuItems = [
//         getItem('Dashboard', '/', <HomeOutlined />),
//         getItem('Quản Lý Nhân Sự', 'sub_hr', <TeamOutlined />, [
//             getItem('Danh sách nhân viên', '/nhan-vien'),
//             getItem('Hợp đồng lao động', '/hop-dong'),
//             getItem('Người phụ thuộc', '/nguoi-phu-thuoc'),
//             getItem('Quá trình công tác', '/qua-trinh-cong-tac'),
//         ]),
//         getItem('Cơ Cấu Tổ Chức', 'sub_org', <ApartmentOutlined />, [
//             getItem('Phòng ban', '/phong-ban'),
//             getItem('Chức vụ', '/chuc-vu'),
//         ]),
//         getItem('Chấm Công & Phép', 'sub_time', <ScheduleOutlined />, [
//             getItem('Dữ liệu chấm công', '/cham-cong'),
//             getItem('Ca làm việc', '/ca-lam-viec'),
//             getItem('Đơn xin phép', '/don-xin-phep'),
//             getItem('Quỹ phép năm', '/quy-phep-nam'),
//         ]),
//         getItem('Lương & Phúc Lợi', 'sub_salary', <DollarOutlined />, [
//             getItem('Bảng tính lương', '/tinh-luong'),
//             getItem('Phụ cấp', '/phu-cap'),
//             getItem('Nhân viên phụ cấp', '/nhan-vien-phu-cap'),
//         ]),
//     ];

//     return (
//         <Layout style={{ minHeight: '100vh' }}>

//             {/* --- SIDEBAR (Luôn cố định bên trái) --- */}
//             <Sider
//                 collapsible
//                 collapsed={collapsed}
//                 onCollapse={setCollapsed}
//                 width={250}
//                 style={{
//                     overflow: 'auto',
//                     height: '100vh',
//                     position: 'fixed',
//                     left: 0,
//                     top: 0,
//                     bottom: 0,
//                     zIndex: 1001, // Cao hơn Header để bóng đổ đè lên
//                     boxShadow: '2px 0 8px rgba(0,0,0,0.15)'
//                 }}
//             >
//                 {/* Logo Area */}
//                 <div style={{
//                     height: 64, // Bằng chiều cao Header
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     background: '#001529', // Màu trùng sidebar
//                     color: '#fff',
//                     fontWeight: 'bold',
//                     fontSize: collapsed ? 16 : 20,
//                     transition: 'all 0.2s',
//                     borderBottom: '1px solid rgba(255,255,255,0.1)'
//                 }}>
//                     {collapsed ? 'HR' : 'HR SYSTEM'}
//                 </div>

//                 <Menu
//                     theme="dark"
//                     mode="inline"
//                     defaultSelectedKeys={['/']}
//                     selectedKeys={[location.pathname]}
//                     items={menuItems}
//                     onClick={({ key }) => navigate(key)}
//                 />
//             </Sider>

//             {/* --- RIGHT LAYOUT (Nội dung bên phải) --- */}
//             <Layout style={{
//                 marginLeft: collapsed ? 80 : 250,
//                 transition: 'all 0.2s',
//                 minHeight: '100vh'
//             }}>

//                 {/* Truyền collapsed vào Header để nó tự chỉnh width/left */}
//                 <AppHeader collapsed={collapsed} />

//                 {/* --- CONTENT AREA --- */}
//                 <Content style={{
//                     margin: '24px 16px 0',
//                     overflow: 'initial',
//                     // 👇 QUAN TRỌNG: Đẩy nội dung xuống bằng chiều cao Header (64px) + khoảng cách (24px)
//                     marginTop: 88
//                 }}>
//                     <div style={{
//                         padding: 24,
//                         background: colorBgContainer,
//                         borderRadius: borderRadiusLG,
//                         // Tính toán chiều cao tối thiểu để Footer luôn ở đáy
//                         minHeight: 'calc(100vh - 150px)',
//                         boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
//                     }}>
//                         <Outlet />
//                     </div>
//                 </Content>

//                 <Footer style={{ textAlign: 'center', padding: '20px 0' }}>
//                     HR Management System ©{new Date().getFullYear()}
//                 </Footer>
//             </Layout>
//         </Layout>
//     );
// };

// export default MainLayout;