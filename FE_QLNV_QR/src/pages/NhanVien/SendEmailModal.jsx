import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import nhanVienApi from '../../api/nhanVienApi';

const SendEmailModal = ({ open, onCancel, employee }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && employee) {
            form.setFieldsValue({
                toEmail: employee.emailCongTy || employee.emailCaNhan || '',
                subject: '',
                content: ''
            });
        }
    }, [open, employee, form]);

    const handleSend = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            await nhanVienApi.sendEmail(values);
            message.success('Gửi email thành công!');
            form.resetFields();
            onCancel();
        } catch (error) {
            if (error.errorFields) {
                return; // Validation errors are shown inline
            }
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                const errMsg = errorData.message || errorData;
                message.error('Lỗi: ' + errMsg);
            } else {
                message.error('Gửi email thất bại!');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={`Gửi Email cho ${employee?.hoTen || 'Nhân viên'}`}
            open={open}
            onCancel={onCancel}
            onOk={handleSend}
            confirmLoading={loading}
            okText="Gửi"
            cancelText="Hủy"
            destroyOnClose
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="toEmail"
                    label="Email người nhận"
                    rules={[
                        { required: true, message: 'Vui lòng nhập email!' },
                        { type: 'email', message: 'Email không đúng định dạng!' }
                    ]}
                >
                    <Input placeholder="Nhập email người nhận" />
                </Form.Item>

                <Form.Item
                    name="subject"
                    label="Tiêu đề"
                    rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                >
                    <Input placeholder="Nhập tiêu đề email" />
                </Form.Item>

                <Form.Item
                    name="content"
                    label="Nội dung"
                    rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
                >
                    <Input.TextArea rows={6} placeholder="Nhập nội dung email..." />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default SendEmailModal;
