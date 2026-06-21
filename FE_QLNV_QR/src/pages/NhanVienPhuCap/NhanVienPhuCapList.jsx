import React, { useEffect, useState } from 'react';
import {
    Table, Button, Modal, Form, Select, InputNumber,
    message, Popconfirm, Space, Tag, Card, Row, Col
} from 'antd';
import {
    PlusOutlined, EditOutlined, DeleteOutlined
} from '@ant-design/icons';

// Import các API cần thiết
import nhanVienPhuCapApi from '../../api/nhanVienPhuCapApi';
import hopDongApi from '../../api/hopDongApi';
import cauHinhPhuCapApi from '../../api/cauHinhPhuCapApi';

const NhanVienPhuCapList = () => {
    // --- STATE ---
    const [data, setData] = useState([]);

    // State cho Dropdown
    const [hopDongs, setHopDongs] = useState([]); // List hợp đồng (chứa thông tin nhân viên)
    const [loaiPhuCaps, setLoaiPhuCaps] = useState([]); // List loại phụ cấp

    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);

    const [form] = Form.useForm();

    // --- FETCH DATA ---
    const fetchData = async () => {
        setLoading(true);
        try {
            // Load song song 3 API để tiết kiệm thời gian
            const [mainRes, hdRes, pcRes] = await Promise.all([
                nhanVienPhuCapApi.getAll(),
                hopDongApi.getAll(),
                cauHinhPhuCapApi.getAll()
            ]);

            setData(Array.isArray(mainRes) ? mainRes : []);
            setHopDongs(Array.isArray(hdRes) ? hdRes : []);
            setLoaiPhuCaps(Array.isArray(pcRes) ? pcRes : []);
        } catch (error) {
            console.error(error);
            message.error("Lỗi tải dữ liệu");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- UTILS ---
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    // --- HANDLERS ---
    const handleSave = async (values) => {
        try {
            // Mapping ID vào object con để khớp với JPA
            const payload = {
                id: editingRecord?.id,
                hopDong: { id: values.hopDongId },
                phuCap: { id: values.phuCapId },
                soTien: values.soTien
            };

            if (editingRecord) {
                await nhanVienPhuCapApi.update(editingRecord.id, payload);
                message.success("Cập nhật thành công");
            } else {
                await nhanVienPhuCapApi.create(payload);
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
            await nhanVienPhuCapApi.delete(id);
            message.success("Đã xóa");
            fetchData();
        } catch (error) {
            message.error("Xóa thất bại");
        }
    };

    const openEditModal = (record) => {
        setEditingRecord(record);
        form.setFieldsValue({
            hopDongId: record.hopDong?.id,
            phuCapId: record.phuCap?.id,
            soTien: record.soTien
        });
        setIsModalOpen(true);
    };

    // --- COLUMNS ---
    const columns = [
        {
            title: 'Nhân Viên',
            key: 'nhanVien',
            render: (r) => (
                <div>
                    {/* Hiển thị tên nhân viên */}
                    <b>{r.tenNhanVien || r.hopDong?.nhanVien?.hoTen}</b> <br />
                    <small style={{ color: '#888' }}>
                        {r.maNv ? `NV: ${r.maNv} - ` : ''}
                        HĐ: {r.soHopDong || r.hopDong?.soHopDong}
                    </small>
                </div>
            )
        },
        {
            title: 'Loại Phụ Cấp',
            key: 'phuCap',
            render: (r) => <Tag color="blue">{r.tenPhuCap || r.phuCap?.tenPhuCap}</Tag>
        },
        {
            title: 'Số Tiền',
            dataIndex: 'soTien',
            align: 'right',
            render: (val) => <span style={{ fontWeight: 'bold', color: '#389e0d' }}>{formatCurrency(val)}</span>
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 100,
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        icon={<EditOutlined />}
                        type="primary" ghost size="small"
                        onClick={() => openEditModal(record)}
                    />
                    <Popconfirm title="Xóa?" onConfirm={() => handleDelete(record.id)}>
                        <Button icon={<DeleteOutlined />} danger size="small" />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: 20 }}>
            <Card title="Danh Sách Phụ Cấp Nhân Viên" variant="borderless">
                <div style={{ marginBottom: 16, textAlign: 'right' }}>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                        setEditingRecord(null);
                        form.resetFields();
                        setIsModalOpen(true);
                    }}>
                        Gán Phụ Cấp Mới
                    </Button>
                </div>

                <Table
                    dataSource={data}
                    columns={columns}
                    rowKey="id"
                    loading={loading}
                    bordered
                />
            </Card>

            {/* MODAL */}
            <Modal
                title={editingRecord ? "Cập Nhật" : "Gán Phụ Cấp"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
            >
                <Form form={form} layout="vertical" onFinish={handleSave}>

                    <Form.Item
                        name="hopDongId"
                        label="Chọn Nhân Viên (Theo Hợp Đồng)"
                        rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}
                    >
                        <Select showSearch optionFilterProp="children" placeholder="Tìm theo tên NV hoặc số HĐ">
                            {hopDongs.map(hd => (
                                <Select.Option key={hd.id} value={hd.id}>
                                    {hd.nhanVien?.hoTen} - {hd.soHopDong}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="phuCapId"
                                label="Loại Phụ Cấp"
                                rules={[{ required: true, message: 'Vui lòng chọn loại' }]}
                            >
                                <Select placeholder="Chọn loại phụ cấp">
                                    {loaiPhuCaps.map(pc => (
                                        <Select.Option key={pc.id} value={pc.id}>
                                            {pc.tenPhuCap}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="soTien"
                                label="Số Tiền"
                                rules={[{ required: true, message: 'Nhập số tiền' }]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    addonAfter="VND"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default NhanVienPhuCapList;