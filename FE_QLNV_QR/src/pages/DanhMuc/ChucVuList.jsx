import React, { useEffect, useState } from 'react';
import {
    Table, Button, Modal, Form, Input, InputNumber,
    message, Popconfirm, Space, Card, Row, Col
} from 'antd';
import {
    PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined
} from '@ant-design/icons';
import chucVuApi from '../../api/chucVuApi';

const ChucVuList = () => {
    // --- STATE ---
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    // State Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);

    // Form instance
    const [form] = Form.useForm();

    // --- FETCH DATA ---
    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await chucVuApi.getAll();
            setData(Array.isArray(res) ? res : []);
        } catch (error) {
            message.error("Lỗi tải danh sách chức vụ");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- HANDLERS ---

    // Tìm kiếm
    const handleSearch = async (value) => {
        setLoading(true);
        try {
            if (value) {
                const res = await chucVuApi.search(value);
                setData(res);
            } else {
                fetchData(); // Nếu ô tìm kiếm rỗng thì load lại tất cả
            }
        } catch (error) {
            message.error("Lỗi tìm kiếm");
        }
        setLoading(false);
    };

    // Lưu (Tạo mới / Cập nhật)
    const handleSave = async (values) => {
        try {
            if (editingRecord) {
                await chucVuApi.update(editingRecord.id, values);
                message.success("Cập nhật thành công");
            } else {
                await chucVuApi.create(values);
                message.success("Thêm mới thành công");
            }

            setIsModalOpen(false);
            setEditingRecord(null);
            form.resetFields();
            fetchData();
        } catch (error) {
            console.error(error);
            message.error("Có lỗi xảy ra khi lưu");
        }
    };

    // Xóa
    const handleDelete = async (id) => {
        try {
            await chucVuApi.delete(id);
            message.success("Đã xóa chức vụ");
            fetchData();
        } catch (error) {
            message.error("Xóa thất bại (Có thể chức vụ đang được sử dụng)");
        }
    };

    // Mở Modal Edit
    const openEditModal = (record) => {
        setEditingRecord(record);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    // --- COLUMNS ---
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 80,
            align: 'center',
        },
        {
            title: 'Tên Chức Vụ',
            dataIndex: 'tenChucVu',
            key: 'tenChucVu',
            render: (text) => <b>{text}</b>
        },
        {
            title: 'Cấp Bậc',
            dataIndex: 'capBac',
            key: 'capBac',
            width: 120,
            align: 'center',
            render: (val) => <span style={{ color: '#1677ff', fontWeight: 'bold' }}>Level {val}</span>
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
                        title="Xóa chức vụ này?"
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
            <Card title="Danh Mục Chức Vụ" variant="borderless">
                {/* Thanh công cụ: Tìm kiếm + Thêm mới */}
                <Row gutter={16} style={{ marginBottom: 16 }}>
                    <Col span={12}>
                        <Input.Search
                            placeholder="Tìm kiếm theo tên chức vụ..."
                            allowClear
                            enterButton={<SearchOutlined />}
                            onSearch={handleSearch}
                        />
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => {
                                setEditingRecord(null);
                                form.resetFields();
                                setIsModalOpen(true);
                            }}
                        >
                            Thêm Chức Vụ
                        </Button>
                    </Col>
                </Row>

                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    loading={loading}
                    bordered
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            {/* --- MODAL FORM --- */}
            <Modal
                title={editingRecord ? "Cập Nhật Chức Vụ" : "Thêm Mới Chức Vụ"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
                maskClosable={false}
            >
                <Form form={form} layout="vertical" onFinish={handleSave}>
                    <Form.Item
                        name="tenChucVu"
                        label="Tên Chức Vụ"
                        rules={[{ required: true, message: 'Vui lòng nhập tên chức vụ' }]}
                    >
                        <Input placeholder="Ví dụ: Trưởng phòng, Nhân viên..." />
                    </Form.Item>

                    <Form.Item
                        name="capBac"
                        label="Cấp Bậc (Level)"
                        rules={[{ required: true, message: 'Vui lòng nhập cấp bậc' }]}
                        help="Số càng nhỏ chức vụ càng cao (VD: 1 - Giám đốc)"
                    >
                        <InputNumber style={{ width: '100%' }} min={1} max={10} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ChucVuList;