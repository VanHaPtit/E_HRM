import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Switch, message, Popconfirm, Space, Card, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import allowedIpApi from '../../api/allowedIpApi';

const AllowedIpPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [form] = Form.useForm();

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await allowedIpApi.getAll();
            setData(Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []));
        } catch (error) {
            message.error("Lỗi khi tải danh sách IP cấu hình");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSave = async (values) => {
        try {
            if (editingRecord) {
                await allowedIpApi.update(editingRecord.id, values);
                message.success("Cập nhật thành công!");
            } else {
                await allowedIpApi.create(values);
                message.success("Thêm mới thành công!");
            }
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            message.error(error?.response?.data?.message || "Lỗi khi lưu dữ liệu");
        }
    };

    const handleDelete = async (id) => {
        try {
            await allowedIpApi.delete(id);
            message.success("Đã xóa IP thành công!");
            fetchData();
        } catch (error) {
            message.error("Lỗi khi xóa dữ liệu");
        }
    };

    const openModal = (record = null) => {
        setEditingRecord(record);
        if (record) {
            form.setFieldsValue({
                ipAddress: record.ipAddress,
                description: record.description,
                active: record.active
            });
        } else {
            form.resetFields();
            form.setFieldsValue({ active: true });
        }
        setIsModalOpen(true);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: 'Địa chỉ IP',
            dataIndex: 'ipAddress',
            key: 'ipAddress',
            render: (text) => <b>{text}</b>
        },
        {
            title: 'Mô tả chi tiết',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'active',
            key: 'active',
            render: (active) => (
                active 
                    ? <Tag icon={<CheckCircleOutlined />} color="success">Đang hoạt động</Tag>
                    : <Tag icon={<CloseCircleOutlined />} color="error">Đã khóa</Tag>
            )
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button type="primary" ghost icon={<EditOutlined />} onClick={() => openModal(record)}>Sửa</Button>
                    <Popconfirm title="Bạn có chắc chắn muốn xóa IP này không?" onConfirm={() => handleDelete(record.id)}>
                        <Button danger icon={<DeleteOutlined />}>Xóa</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: 20 }}>
            <Card title="Quản Lý Mạng / IP Chấm Công" bordered={false}>
                <div style={{ marginBottom: 16, textAlign: 'right' }}>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
                        Thêm IP Mới
                    </Button>
                </div>
                
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    loading={loading}
                    bordered
                />
            </Card>

            <Modal
                title={editingRecord ? "Cập nhật IP Cấu Hình" : "Thêm Mới IP Cấu Hình"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
            >
                <Form form={form} layout="vertical" onFinish={handleSave}>
                    <Form.Item 
                        name="ipAddress" 
                        label="Địa chỉ IP (VD: 14.232.112.55 hoặc 192.168.1.1)" 
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ IP' }]}
                    >
                        <Input placeholder="Nhập địa chỉ IP..." />
                    </Form.Item>
                    
                    <Form.Item 
                        name="description" 
                        label="Mô tả"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
                    >
                        <Input.TextArea placeholder="Mạng WiFi văn phòng tầng 1..." rows={3} />
                    </Form.Item>

                    <Form.Item name="active" label="Trạng thái" valuePropName="checked">
                        <Switch checkedChildren="Hoạt động" unCheckedChildren="Khóa" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AllowedIpPage;
