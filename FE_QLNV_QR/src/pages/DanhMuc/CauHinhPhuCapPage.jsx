import React, { useEffect, useState } from 'react';
import {
    Table, Button, Modal, Form, Input, Switch,
    message, Popconfirm, Space, Card, Tag
} from 'antd';
import {
    PlusOutlined, EditOutlined, DeleteOutlined,
    CheckCircleOutlined, CloseCircleOutlined
} from '@ant-design/icons';

import cauHinhPhuCapApi from '../../api/cauHinhPhuCapApi';

const CauHinhPhuCapPage = () => {
    // --- STATE ---
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);

    const [form] = Form.useForm();

    // --- FETCH DATA ---
    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await cauHinhPhuCapApi.getAll();
            setData(Array.isArray(res) ? res : []);
        } catch (error) {
            console.error(error);
            message.error("Lỗi tải danh sách phụ cấp");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- HANDLERS ---
    const handleSave = async (values) => {
        try {
            // Giá trị từ Switch trả về true/false, đúng với Entity Java
            const payload = {
                ...values,
                // Đảm bảo nếu undefined thì là false
                tinhThueTncn: values.tinhThueTncn || false,
                dongBhxh: values.dongBhxh || false
            };

            if (editingRecord) {
                await cauHinhPhuCapApi.update(editingRecord.id, payload);
                message.success("Cập nhật thành công");
            } else {
                await cauHinhPhuCapApi.create(payload);
                message.success("Thêm mới thành công");
            }

            setIsModalOpen(false);
            setEditingRecord(null);
            form.resetFields();
            fetchData();
        } catch (error) {
            message.error("Có lỗi xảy ra khi lưu");
        }
    };

    const handleDelete = async (id) => {
        try {
            await cauHinhPhuCapApi.delete(id);
            message.success("Đã xóa phụ cấp");
            fetchData();
        } catch (error) {
            message.error("Xóa thất bại (Có thể phụ cấp đang được sử dụng)");
        }
    };

    const openEditModal = (record) => {
        setEditingRecord(record);
        form.setFieldsValue({
            ...record,
            // Các trường boolean tự động map vào Switch nếu name khớp
        });
        setIsModalOpen(true);
    };

    // --- COLUMNS ---
    const columns = [
        {
            title: 'Tên Phụ Cấp',
            dataIndex: 'tenPhuCap',
            key: 'tenPhuCap',
            render: (text) => <b>{text}</b>
        },
        {
            title: 'Tính Thuế TNCN',
            dataIndex: 'tinhThueTncn',
            align: 'center',
            width: 150,
            render: (val) => val ? (
                <Tag color="red" icon={<CheckCircleOutlined />}>Có tính</Tag>
            ) : (
                <Tag color="green" icon={<CloseCircleOutlined />}>Miễn thuế</Tag>
            )
        },
        {
            title: 'Đóng BHXH',
            dataIndex: 'dongBhxh',
            align: 'center',
            width: 150,
            render: (val) => val ? (
                <Tag color="blue" icon={<CheckCircleOutlined />}>Có đóng</Tag>
            ) : (
                <Tag color="default" icon={<CloseCircleOutlined />}>Không đóng</Tag>
            )
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 120,
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        icon={<EditOutlined />}
                        type="primary" ghost size="small"
                        onClick={() => openEditModal(record)}
                    />
                    <Popconfirm
                        title="Xóa phụ cấp này?"
                        description="Hành động này không thể hoàn tác"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa" cancelText="Hủy"
                    >
                        <Button icon={<DeleteOutlined />} danger size="small" />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: 20 }}>
            <Card title="Cấu Hình Các Khoản Phụ Cấp" variant="borderless">
                <div style={{ marginBottom: 16, textAlign: 'right' }}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setEditingRecord(null);
                            form.resetFields();
                            // Giá trị mặc định
                            form.setFieldsValue({ tinhThueTncn: true, dongBhxh: false });
                            setIsModalOpen(true);
                        }}
                    >
                        Thêm Phụ Cấp
                    </Button>
                </div>

                <Table
                    dataSource={data}
                    columns={columns}
                    rowKey="id"
                    loading={loading}
                    bordered
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            {/* MODAL */}
            <Modal
                title={editingRecord ? "Cập Nhật Phụ Cấp" : "Thêm Phụ Cấp Mới"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
            >
                <Form form={form} layout="vertical" onFinish={handleSave}>
                    <Form.Item
                        name="tenPhuCap"
                        label="Tên khoản phụ cấp"
                        rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                    >
                        <Input placeholder="Ví dụ: Ăn trưa, Xăng xe, Điện thoại..." />
                    </Form.Item>

                    <div style={{ display: 'flex', gap: 40, marginTop: 20 }}>
                        <Form.Item
                            name="tinhThueTncn"
                            label="Tính Thuế TNCN?"
                            valuePropName="checked" // Quan trọng: Để map với Switch
                        >
                            <Switch checkedChildren="Có" unCheckedChildren="Không" />
                        </Form.Item>

                        <Form.Item
                            name="dongBhxh"
                            label="Đóng Bảo Hiểm?"
                            valuePropName="checked" // Quan trọng: Để map với Switch
                        >
                            <Switch checkedChildren="Có" unCheckedChildren="Không" />
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default CauHinhPhuCapPage;