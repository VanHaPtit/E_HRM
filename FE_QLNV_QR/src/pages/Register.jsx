import React, { useState } from 'react';
import { Form, Input, Button, Typography, message, Card, Result } from 'antd';
import { UserOutlined, LockOutlined, IdcardOutlined, UserAddOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const { Title, Text } = Typography;

const Register = () => {
    const [loading, setLoading] = useState(false);
    const [successful, setSuccessful] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const { username, nhanVienId, password } = values;
            const res = await axiosClient.post("/auth/signup", {
                username: username,
                password: password,
                role: ["USER"], 
                nhanVienId: nhanVienId 
            });

            message.success(res.message || "Đăng ký thành công!");
            setSuccessful(true);
        } catch (error) {
            console.error("Register Error:", error);
            const resMessage = error.response?.data?.message || "Đăng ký thất bại! Vui lòng kiểm tra lại thông tin.";
            message.error(resMessage);
            setSuccessful(false);
        } finally {
            setLoading(false);
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
                {successful ? (
                    <Result
                        status="success"
                        title="Tạo tài khoản thành công!"
                        subTitle="Hồ sơ của bạn đã được liên kết với mã nhân viên. Bạn đã có thể đăng nhập ngay bây giờ."
                        extra={[
                            <Button 
                                type="primary" 
                                key="login" 
                                onClick={() => navigate('/login')}
                                style={{ 
                                    height: 45, 
                                    borderRadius: 10, 
                                    background: 'linear-gradient(to right, #52c41a, #389e0d)',
                                    border: 'none',
                                    fontWeight: 'bold'
                                }}
                            >
                                Đi đến trang Đăng Nhập
                            </Button>
                        ]}
                    />
                ) : (
                    <>
                        <div style={{ textAlign: 'center', marginBottom: 30, marginTop: 10 }}>
                            <div style={{ 
                                width: 80, height: 80, borderRadius: '24px', background: 'linear-gradient(135deg, #52c41a, #13c2c2)', 
                                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                margin: '0 auto 20px', boxShadow: '0 10px 20px rgba(82,196,26,0.3)',
                                transform: 'rotate(-10deg)'
                            }}>
                                <UserAddOutlined style={{ fontSize: 40, color: 'white', transform: 'rotate(10deg)' }} />
                            </div>
                            <Title level={2} style={{ margin: 0, fontWeight: 800, color: '#1f1f1f', letterSpacing: '-0.5px' }}>
                                Tạo Tài Khoản
                            </Title>
                            <Text type="secondary" style={{ fontSize: '15px' }}>
                                Cấp quyền truy cập hệ thống nội bộ
                            </Text>
                        </div>

                        <Form
                            name="register_form"
                            layout="vertical"
                            onFinish={onFinish}
                            size="large"
                            requiredMark={false}
                        >
                            <Form.Item
                                name="username"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
                                    { min: 3, message: 'Tên đăng nhập phải có ít nhất 3 ký tự!' }
                                ]}
                            >
                                <Input 
                                    prefix={<UserOutlined style={{ color: '#bfbfbf', marginRight: 4 }} />} 
                                    placeholder="Tên đăng nhập (Username)" 
                                    style={{ borderRadius: 10, padding: '10px 14px' }}
                                />
                            </Form.Item>

                            <Form.Item
                                name="nhanVienId"
                                rules={[{ required: true, message: 'Vui lòng nhập mã nhân viên!' }]}
                            >
                                <Input 
                                    prefix={<IdcardOutlined style={{ color: '#bfbfbf', marginRight: 4 }} />} 
                                    placeholder="Mã nhân viên (Ví dụ: NV001)" 
                                    style={{ borderRadius: 10, padding: '10px 14px' }}
                                />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mật khẩu!' },
                                    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                                ]}
                                style={{ marginBottom: 24 }}
                            >
                                <Input.Password 
                                    prefix={<LockOutlined style={{ color: '#bfbfbf', marginRight: 4 }} />} 
                                    placeholder="Mật khẩu bảo mật" 
                                    style={{ borderRadius: 10, padding: '10px 14px' }}
                                />
                            </Form.Item>

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
                                        background: 'linear-gradient(to right, #52c41a, #13c2c2)',
                                        border: 'none',
                                        boxShadow: '0 4px 14px rgba(82,196,26,0.4)'
                                    }}
                                >
                                    Đăng Ký Ngay
                                </Button>
                            </Form.Item>

                            <div style={{ textAlign: 'center', marginTop: 24 }}>
                                <Text type="secondary">Đã có tài khoản? </Text>
                                <Link to="/login" style={{ fontWeight: 'bold', color: '#13c2c2' }}>Đăng nhập</Link>
                            </div>
                        </Form>
                    </>
                )}
            </Card>
        </div>
    );
};

export default Register;