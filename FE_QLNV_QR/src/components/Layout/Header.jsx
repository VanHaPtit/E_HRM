


// import React from 'react';
// import { Layout, Dropdown, Space, Avatar, theme, message } from 'antd';
// import { UserOutlined, LogoutOutlined, DownOutlined } from '@ant-design/icons';
// import { useNavigate } from 'react-router-dom';

// const { Header } = Layout;

// // Thêm prop collapsed để header biết sidebar đang đóng hay mở
// const AppHeader = ({ collapsed }) => {
//     const navigate = useNavigate();
//     const { token: { colorBgContainer } } = theme.useToken();

//     const menuItems = [
//         { key: 'profile', label: 'Thông tin cá nhân', icon: <UserOutlined /> },
//         { type: 'divider' },
//         { key: 'logout', label: 'Đăng xuất', icon: <LogoutOutlined />, danger: true },
//     ];

//     const handleMenuClick = ({ key }) => {
//         if (key === 'logout') {
//             message.success('Đã đăng xuất');
//             navigate('/login');
//         }
//         if (key === 'profile') navigate('/profile');
//     };

//     return (
//         <Header
//             style={{
//                 padding: '0 16px',
//                 background: colorBgContainer,
//                 position: 'fixed',
//                 top: 0,
//                 right: 0,
//                 // 👇 QUAN TRỌNG: Tính toán vị trí Left dựa trên sidebar
//                 left: collapsed ? 80 : 250,
//                 height: 64,
//                 zIndex: 999, // Nhỏ hơn Sidebar (thường sidebar modal là 1000+)
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'flex-end', // Đẩy user profile sang phải
//                 boxShadow: '0 1px 4px rgba(0,21,41,0.08)',
//                 transition: 'left 0.2s', // Hiệu ứng trượt mượt mà
//             }}
//         >
//             <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }} placement="bottomRight" arrow>
//                 <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
//                     <Space>
//                         <Avatar style={{ backgroundColor: '#1677ff' }} icon={<UserOutlined />} />
//                         <span style={{ fontWeight: 500 }}>Admin User</span>
//                         <DownOutlined style={{ fontSize: 12 }} />
//                     </Space>
//                 </div>
//             </Dropdown>
//         </Header>
//     );
// };

// export default AppHeader;





import React, { useEffect, useState } from 'react';
import { Layout, Dropdown, Space, Avatar, theme, message } from 'antd';
import { UserOutlined, LogoutOutlined, DownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient'; // Đảm bảo đúng đường dẫn tới file axios của bạn

const { Header } = Layout;

const AppHeader = ({ collapsed }) => {
    const navigate = useNavigate();
    const { token: { colorBgContainer } } = theme.useToken();
    const [displayName, setDisplayName] = useState('Người dùng');

    // Lấy tên từ localStorage khi Header render
    useEffect(() => {
        const name = localStorage.getItem('user_name');
        if (name) {
            setDisplayName(name);
        }
    }, []);

    const menuItems = [
        { key: 'my-profile', label: 'Thông tin cá nhân', icon: <UserOutlined /> },
        { type: 'divider' },
        { key: 'logout', label: 'Đăng xuất', icon: <LogoutOutlined />, danger: true },
    ];

    const handleMenuClick = async ({ key }) => {
        if (key === 'logout') {
            try {
                // Gọi API signout để Backend xóa Cookie
                await axiosClient.post('/auth/signout');

                // Xóa dữ liệu ở trình duyệt
                localStorage.removeItem('user_name');
                localStorage.removeItem('user_roles');
                localStorage.removeItem('token');

                message.success('Đã đăng xuất thành công');
                navigate('/login');
            } catch (error) {
                // Dù lỗi API vẫn xóa local để bảo mật
                localStorage.clear();
                navigate('/login');
            }
        } if (key === 'my-profile') {
            navigate('/my-profile');
        }
    };

    return (
        <Header
            style={{
                padding: '0 16px',
                background: colorBgContainer,
                position: 'fixed',
                top: 0,
                right: 0,
                left: collapsed ? 80 : 250, // Giữ nguyên thuộc tính quan trọng này
                height: 64,
                zIndex: 999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                boxShadow: '0 1px 4px rgba(0,21,41,0.08)',
                transition: 'left 0.2s',
            }}
        >
            <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }} placement="bottomRight" arrow>
                <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <Space>
                        <Avatar style={{ backgroundColor: '#1677ff' }} icon={<UserOutlined />} />
                        {/* HIỂN THỊ TÊN ĐỘNG TẠI ĐÂY */}
                        <span style={{ fontWeight: 500 }}>{displayName}</span>
                        <DownOutlined style={{ fontSize: 12 }} />
                    </Space>
                </div>
            </Dropdown>
        </Header>
    );
};

export default AppHeader;
