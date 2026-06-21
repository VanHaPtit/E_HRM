import React, { useState } from 'react';
import { Form, Input, Button, Typography, message, Card, Modal } from 'antd';
import { UserOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const { Title, Text } = Typography;

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [forgotLoading, setForgotLoading] = useState(false);
    const [isForgotModalVisible, setIsForgotModalVisible] = useState(false);
    const navigate = useNavigate();
    const [forgotForm] = Form.useForm();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const { username, password } = values;
            const res = await axiosClient.post("/auth/signin", { username, password });

            // Lưu token
            const token = res.accessToken || res.token;
            if (token) {
                localStorage.setItem("token", token);
            }

            // Lưu thông tin người dùng
            localStorage.setItem("user_name", res.fullName || res.username);
            localStorage.setItem("user_roles", JSON.stringify(res.roles));
            localStorage.setItem("user_id", res.id);

            message.success("Xác thực thành công! Đang vào hệ thống...");
            
            setTimeout(() => {
                navigate("/");
                window.location.reload();
            }, 800);
            
        } catch (error) {
            console.error("Login Error:", error);
            const resMessage = error.response?.data?.message || "Tài khoản hoặc mật khẩu không chính xác!";
            message.error(resMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (values) => {
        setForgotLoading(true);
        try {
            await axiosClient.post(`/auth/forgot-password?username=${values.username}`);
            message.success("Mật khẩu mới đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư!");
            setIsForgotModalVisible(false);
            forgotForm.resetFields();
        } catch (error) {
            const resMessage = error.response?.data?.message || "Lỗi khi khôi phục mật khẩu. Vui lòng kiểm tra lại.";
            message.error(resMessage);
        } finally {
            setForgotLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            padding: '20px'
        }}>
            <Card 
                bordered={false} 
                style={{
                    maxWidth: 420,
                    width: '100%',
                    borderRadius: 20,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    background: '#ffffff'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: 30, marginTop: 10 }}>
                    <div style={{ 
                        width: 80, height: 80, borderRadius: '24px', background: 'linear-gradient(135deg, #1890ff, #722ed1)', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        margin: '0 auto 20px', boxShadow: '0 10px 20px rgba(114,46,209,0.3)',
                        transform: 'rotate(10deg)'
                    }}>
                        <SafetyCertificateOutlined style={{ fontSize: 40, color: 'white', transform: 'rotate(-10deg)' }} />
                    </div>
                    <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#1f1f1f', letterSpacing: '-0.5px' }}>
                        Welcome Back
                    </Title>
                    <Text type="secondary" style={{ fontSize: '15px' }}>
                        Hệ thống Quản lý Nhân sự Tích hợp
                    </Text>
                </div>

                <Form
                    name="login_form"
                    layout="vertical"
                    onFinish={onFinish}
                    size="large"
                    requiredMark={false}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Vui lòng nhập tài khoản!' }]}
                    >
                        <Input 
                            prefix={<UserOutlined style={{ color: '#bfbfbf', marginRight: 4 }} />} 
                            placeholder="Tên đăng nhập / Mã NV" 
                            style={{ borderRadius: 10, padding: '10px 14px' }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                        style={{ marginBottom: 12 }}
                    >
                        <Input.Password 
                            prefix={<LockOutlined style={{ color: '#bfbfbf', marginRight: 4 }} />} 
                            placeholder="Mật khẩu bảo mật" 
                            style={{ borderRadius: 10, padding: '10px 14px' }}
                        />
                    </Form.Item>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
                        <a onClick={() => setIsForgotModalVisible(true)} style={{ fontSize: 14, color: '#722ed1', fontWeight: 500 }}>Quên mật khẩu?</a>
                    </div>

                    <Form.Item style={{ marginBottom: 16 }}>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            block 
                            loading={loading}
                            style={{ 
                                height: 50, 
                                borderRadius: 10, 
                                fontSize: 16, 
                                fontWeight: 'bold',
                                background: 'linear-gradient(to right, #1890ff, #722ed1)',
                                border: 'none',
                                boxShadow: '0 4px 14px rgba(24,144,255,0.4)'
                            }}
                        >
                            Đăng Nhập Hệ Thống
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: 'center', marginTop: 24 }}>
                        <Text type="secondary">Vui lòng liên hệ Phòng Nhân Sự nếu bạn chưa có tài khoản.</Text>
                    </div>
                </Form>
            </Card>

            <Modal
                title="Khôi phục mật khẩu"
                open={isForgotModalVisible}
                onCancel={() => setIsForgotModalVisible(false)}
                footer={null}
                centered
            >
                <div style={{ marginBottom: 20 }}>
                    <Text type="secondary">Vui lòng nhập Mã nhân viên (Tên đăng nhập). Hệ thống sẽ tạo mật khẩu mới và gửi về Email công ty hoặc Email cá nhân đã đăng ký trong hồ sơ của bạn.</Text>
                </div>
                <Form
                    form={forgotForm}
                    layout="vertical"
                    onFinish={handleForgotPassword}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Vui lòng nhập Mã nhân viên!' }]}
                    >
                        <Input 
                            prefix={<UserOutlined style={{ color: '#bfbfbf', marginRight: 4 }} />} 
                            placeholder="Nhập Mã nhân viên (VD: NV001)" 
                            size="large"
                            style={{ borderRadius: 8 }}
                        />
                    </Form.Item>
                    
                    <Form.Item style={{ marginBottom: 0, marginTop: 20, textAlign: 'right' }}>
                        <Button onClick={() => setIsForgotModalVisible(false)} style={{ marginRight: 10, borderRadius: 8 }}>
                            Hủy
                        </Button>
                        <Button type="primary" htmlType="submit" loading={forgotLoading} style={{ borderRadius: 8 }}>
                            Gửi yêu cầu
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Login;