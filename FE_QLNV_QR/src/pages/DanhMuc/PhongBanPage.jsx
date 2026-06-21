import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import categoryApi from '../../api/categoryApi';

const PhongBanPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    // State quản lý Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [form] = Form.useForm();

    // 1. Thêm State cho ô tìm kiếm
    const [searchText, setSearchText] = useState('');

    const fetchData = async (keyword = '') => {
        setLoading(true);
        try {
            const res = keyword
                ? await categoryApi.searchPhongBan(keyword)
                : await categoryApi.getPhongBans();
            setData(res);
        } catch (error) {
            message.error("Lỗi tải dữ liệu");
        }
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (editingItem) {
                await categoryApi.updatePhongBan(editingItem.id, values);
                message.success("Cập nhật thành công");
            } else {
                await categoryApi.createPhongBan(values);
                message.success("Thêm mới thành công");
            }
            setIsModalOpen(false);
            fetchData(searchText); // Load lại dữ liệu giữ nguyên từ khóa tìm kiếm (nếu có)
        } catch (error) {
            console.error(error);
        }
    };

    // 2. Thêm hàm xử lý khi thay đổi ô tìm kiếm
    const onSearchChange = (e) => {
        const value = e.target.value;
        setSearchText(value);
        if (value === '') {
            fetchData(); // Tự động load lại danh sách khi xóa hết chữ
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 80, align: 'center' },
        {
            title: 'Tên Phòng Ban',
            dataIndex: 'tenPhongBan',
            key: 'tenPhongBan',
            render: (text) => <b>{text}</b>
        },
        { title: 'Mô Tả', dataIndex: 'moTa', key: 'moTa' },
        {
            title: 'Thao tác',
            key: 'action',
            width: 150,
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => {
                        setEditingItem(record);
                        form.setFieldsValue(record);
                        setIsModalOpen(true);
                    }} />
                    <Popconfirm title="Xóa?" onConfirm={async () => {
                        try {
                            await categoryApi.deletePhongBan(record.id);
                            message.success("Đã xóa");
                            fetchData();
                        } catch (e) {
                            message.error("Lỗi khi xóa");
                        }
                    }}>
                        <Button icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Space>
                    <Input.Search
                        placeholder="Tìm phòng ban..."

                        // 3. Gắn các props mới vào đây
                        value={searchText}
                        onChange={onSearchChange}
                        onSearch={fetchData} // Khi nhấn Enter hoặc nút Search

                        style={{ width: 300 }}
                        allowClear
                        enterButton
                    />
                </Space>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                    setEditingItem(null);
                    form.resetFields();
                    setIsModalOpen(true);
                }}>Thêm Phòng Ban</Button>
            </div>

            {/* Bảng dữ liệu */}
            <Table
                dataSource={data}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 5 }}
            />

            {/* Modal Form */}
            <Modal
                title={editingItem ? "Sửa Phòng Ban" : "Thêm Phòng Ban"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="tenPhongBan" label="Tên Phòng Ban" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="moTa" label="Mô Tả">
                        <Input.TextArea rows={3} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default PhongBanPage;