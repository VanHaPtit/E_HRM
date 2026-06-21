import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Tag, Avatar, Row, Col, Spin, Divider, Tabs, Typography, Button, Modal, Form, Input, message } from 'antd';
import { UserOutlined, EditOutlined, MailOutlined, PhoneOutlined, BankOutlined, IdcardOutlined, LockOutlined } from '@ant-design/icons';
import nhanVienApi from '../api/nhanVienApi';
import axiosClient from '../api/axiosClient';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const MyProfile = () => {
    const [loading, setLoading] = useState(true);
    const [employee, setEmployee] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [form] = Form.useForm();
    const [passwordForm] = Form.useForm();

    const userName = localStorage.getItem("user_name");
    const userRoles = JSON.parse(localStorage.getItem("user_roles") || "[]");

    const fetchMyProfile = async () => {
        setLoading(true);
        try {
            const res = await nhanVienApi.getAll();
            const employees = Array.isArray(res) ? res : (res?.data || []);
            
            // Cố gắng tìm nhân viên khớp với tên đăng nhập (hoặc lấy nhân viên đầu tiên làm mặc định nếu dùng tài khoản admin)
            const myProfile = employees.find(e => e.hoTen === userName || e.maNv === userName) || employees[0];
            setEmployee(myProfile);
        } catch (error) {
            console.error("Lỗi khi tải hồ sơ:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyProfile();
    }, [userName]);

    const formatCurrency = (value) => {
        if (!value) return "0 ₫";
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const handleOpenEdit = () => {
        form.setFieldsValue({
            soDienThoai: employee.soDienThoai,
            emailCaNhan: employee.emailCaNhan,
            diaChiThuongTru: employee.diaChiThuongTru,
            diaChiHienTai: employee.diaChiHienTai,
            soTaiKhoan: employee.soTaiKhoan,
            nganHang: employee.nganHang
        });
        setIsModalVisible(true);
    };

    const handleUpdateProfile = async (values) => {
        setUpdating(true);
        try {
            // Giữ lại toàn bộ dữ liệu cũ, chỉ ghi đè các trường trên Form
            const updatePayload = {
                ...employee,
                ...values,
                // Định dạng lại ngày tháng để tránh lỗi backend
                ngaySinh: employee.ngaySinh ? dayjs(employee.ngaySinh).format('YYYY-MM-DD') : null,
                ngayCap: employee.ngayCap ? dayjs(employee.ngayCap).format('YYYY-MM-DD') : null
            };

            await nhanVienApi.update(employee.id, updatePayload);
            message.success("Cập nhật hồ sơ thành công!");
            setIsModalVisible(false);
            fetchMyProfile(); // Reload data
        } catch (error) {
            console.error(error);
            message.error("Lỗi khi cập nhật hồ sơ!");
        } finally {
            setUpdating(false);
        }
    };

    const handleChangePassword = async (values) => {
        setChangingPassword(true);
        try {
            await axiosClient.post('/auth/change-password', {
                oldPassword: values.oldPassword,
                newPassword: values.newPassword
            });
            message.success('Đổi mật khẩu thành công!');
            setIsPasswordModalVisible(false);
            passwordForm.resetFields();
        } catch (error) {
            const resMessage = error.response?.data?.message || 'Lỗi khi đổi mật khẩu. Vui lòng kiểm tra lại mật khẩu cũ.';
            message.error(resMessage);
        } finally {
            setChangingPassword(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <Spin size="large" tip="Đang tải hồ sơ cá nhân..." />
            </div>
        );
    }

    if (!employee) {
        return <div style={{ padding: 24 }}>Không tìm thấy thông tin nhân viên.</div>;
    }

    const getStatusTag = (status) => {
        switch(status) {
            case 'DANG_LAM_VIEC': return <Tag color="green">Đang làm việc</Tag>;
            case 'THU_VIEC': return <Tag color="blue">Thử việc</Tag>;
            case 'DA_NGHI_VIEC': return <Tag color="red">Đã nghỉ việc</Tag>;
            default: return <Tag color="default">{status}</Tag>;
        }
    };

    // Chuẩn bị dữ liệu cho Tabs
    const items = [
        {
            key: '1',
            label: 'Thông tin cá nhân',
            children: (
                <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
                    <Descriptions.Item label="Họ và tên"><b>{employee.hoTen}</b></Descriptions.Item>
                    <Descriptions.Item label="Ngày sinh">{employee.ngaySinh ? dayjs(employee.ngaySinh).format('DD/MM/YYYY') : 'N/A'}</Descriptions.Item>
                    <Descriptions.Item label="Giới tính">{employee.gioiTinh}</Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại"><PhoneOutlined style={{marginRight: 8, color: '#1890ff'}}/>{employee.soDienThoai}</Descriptions.Item>
                    <Descriptions.Item label="Email cá nhân"><MailOutlined style={{marginRight: 8, color: '#1890ff'}}/>{employee.emailCaNhan || 'N/A'}</Descriptions.Item>
                    <Descriptions.Item label="Số CCCD"><IdcardOutlined style={{marginRight: 8, color: '#1890ff'}}/>{employee.cccd || 'N/A'}</Descriptions.Item>
                    <Descriptions.Item label="Ngày cấp CCCD">{employee.ngayCap ? dayjs(employee.ngayCap).format('DD/MM/YYYY') : 'N/A'}</Descriptions.Item>
                    <Descriptions.Item label="Nơi cấp">{employee.noiCap || 'N/A'}</Descriptions.Item>
                    <Descriptions.Item label="Địa chỉ thường trú" span={2}>{employee.diaChiThuongTru || 'N/A'}</Descriptions.Item>
                    <Descriptions.Item label="Địa chỉ hiện tại" span={2}>{employee.diaChiHienTai || 'N/A'}</Descriptions.Item>
                </Descriptions>
            ),
        },
        {
            key: '2',
            label: 'Công việc & Lương',
            children: (
                <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
                    <Descriptions.Item label="Phòng ban"><BankOutlined style={{marginRight: 8, color: '#52c41a'}}/><b>{employee.tenPhongBan || 'N/A'}</b></Descriptions.Item>
                    <Descriptions.Item label="Chức vụ"><b>{employee.tenChucVu || 'N/A'}</b></Descriptions.Item>
                    <Descriptions.Item label="Mã nhân viên"><b>{employee.maNv}</b></Descriptions.Item>
                    <Descriptions.Item label="Email công ty">{employee.emailCongTy || 'N/A'}</Descriptions.Item>
                    <Descriptions.Item label="Mã số thuế">{employee.maSoThue || 'N/A'}</Descriptions.Item>
                    <Descriptions.Item label="Người phụ thuộc">{employee.soNguoiPhuThuoc || 0} người</Descriptions.Item>
                    <Descriptions.Item label="Tài khoản ngân hàng">
                        {employee.soTaiKhoan ? `${employee.soTaiKhoan} - ${employee.nganHang}` : 'Chưa cập nhật'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Lương cơ bản"><span style={{ color: '#389e0d', fontWeight: 'bold' }}>{formatCurrency(employee.luongCoBan)}</span></Descriptions.Item>
                    <Descriptions.Item label="Hệ số lương">{employee.heSoLuong || 1.0}</Descriptions.Item>
                    <Descriptions.Item label="Phụ cấp cố định">{formatCurrency(employee.phuCapCoDinh)}</Descriptions.Item>
                </Descriptions>
            ),
        }
    ];

    return (
        <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
            <Row gutter={[24, 24]}>
                {/* CỘT TRÁI: Avatar & Tóm tắt */}
                <Col xs={24} md={8} lg={6}>
                    <Card 
                        style={{ borderRadius: 12, textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                        cover={<div style={{ height: 120, background: 'linear-gradient(90deg, #1890ff 0%, #722ed1 100%)', borderRadius: '12px 12px 0 0' }}></div>}
                    >
                        <div style={{ marginTop: '-60px', position: 'relative' }}>
                            <Avatar 
                                size={120} 
                                src={employee.avatarUrl} 
                                icon={!employee.avatarUrl && <UserOutlined />} 
                                style={{ border: '4px solid white', backgroundColor: '#fff', color: '#1890ff' }}
                            />
                        </div>
                        <Title level={4} style={{ marginTop: 16, marginBottom: 4 }}>{employee.hoTen}</Title>
                        <Text type="secondary">{employee.tenChucVu || 'Chưa rõ chức vụ'}</Text>
                        <div style={{ margin: '16px 0' }}>
                            {getStatusTag(employee.trangThai)}
                        </div>
                        
                        <Divider dashed />
                        
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ marginBottom: 12 }}>
                                <Text type="secondary">Vai trò hệ thống</Text><br/>
                                {userRoles.map(role => <Tag color="magenta" key={role}>{role}</Tag>)}
                            </div>
                            <div>
                                <Text type="secondary">Phòng ban</Text><br/>
                                <b>{employee.tenPhongBan || 'N/A'}</b>
                            </div>
                        </div>

                        <Divider dashed />

                        <Button type="primary" icon={<EditOutlined />} block onClick={handleOpenEdit} style={{ marginBottom: 10 }}>
                            Cập nhật thông tin
                        </Button>
                        <Button type="default" icon={<LockOutlined />} block onClick={() => setIsPasswordModalVisible(true)} style={{ color: '#fa8c16', borderColor: '#fa8c16' }}>
                            Đổi mật khẩu
                        </Button>
                    </Card>
                </Col>

                {/* CỘT PHẢI: Chi tiết hồ sơ */}
                <Col xs={24} md={16} lg={18}>
                    <Card style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', minHeight: '100%' }}>
                        <Title level={4} style={{ marginBottom: 24 }}>Chi Tiết Hồ Sơ Nhân Viên</Title>
                        <Tabs defaultActiveKey="1" items={items} size="large" />
                    </Card>
                </Col>
            </Row>

            {/* MODAL CẬP NHẬT THÔNG TIN */}
            <Modal
                title="Cập Nhật Thông Tin Cá Nhân"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => form.submit()}
                confirmLoading={updating}
                width={600}
                okText="Lưu thay đổi"
                cancelText="Hủy bỏ"
            >
                <Form form={form} layout="vertical" onFinish={handleUpdateProfile}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="soDienThoai" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập số ĐT' }]}>
                                <Input placeholder="Ví dụ: 0987654321" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="emailCaNhan" label="Email cá nhân" rules={[{ type: 'email', message: 'Email không hợp lệ' }]}>
                                <Input placeholder="Ví dụ: nguyenvan.a@gmail.com" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item name="diaChiHienTai" label="Địa chỉ hiện tại">
                                <Input placeholder="Nhập địa chỉ chỗ ở hiện tại" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item name="diaChiThuongTru" label="Địa chỉ thường trú">
                                <Input placeholder="Nhập địa chỉ trên CCCD" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="soTaiKhoan" label="Số tài khoản ngân hàng">
                                <Input placeholder="Số tài khoản" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="nganHang" label="Tên Ngân hàng">
                                <Input placeholder="Ví dụ: Vietcombank, Techcombank..." />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>

            {/* MODAL ĐỔI MẬT KHẨU */}
            <Modal
                title="Đổi Mật Khẩu"
                open={isPasswordModalVisible}
                onCancel={() => {
                    setIsPasswordModalVisible(false);
                    passwordForm.resetFields();
                }}
                footer={null}
                centered
            >
                <Form
                    form={passwordForm}
                    layout="vertical"
                    onFinish={handleChangePassword}
                >
                    <Form.Item
                        name="oldPassword"
                        label="Mật khẩu hiện tại"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu cũ" />
                    </Form.Item>

                    <Form.Item
                        name="newPassword"
                        label="Mật khẩu mới"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                        ]}
                        hasFeedback
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu mới (Tối thiểu 6 ký tự)" />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="Xác nhận mật khẩu mới"
                        dependencies={['newPassword']}
                        hasFeedback
                        rules={[
                            { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Hai mật khẩu không khớp nhau!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu mới" />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, marginTop: 24, textAlign: 'right' }}>
                        <Button onClick={() => { setIsPasswordModalVisible(false); passwordForm.resetFields(); }} style={{ marginRight: 10 }}>
                            Hủy
                        </Button>
                        <Button type="primary" htmlType="submit" loading={changingPassword}>
                            Cập nhật
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default MyProfile;