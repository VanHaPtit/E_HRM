import React, { useEffect, useState } from 'react';
import {
    Table, Button, Modal, Form, Input, DatePicker, Select,
    message, Popconfirm, Space, Tag, Card, Row, Col
} from 'antd';
import {
    PlusOutlined, EditOutlined, DeleteOutlined,
    UsergroupAddOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import nguoiPhuThuocApi from '../../api/nguoiPhuThuocApi';
import nhanVienApi from '../../api/nhanVienApi';

const NguoiPhuThuocList = () => {

    const [data, setData] = useState([]);
    const [nhanViens, setNhanViens] = useState([]);
    const [loading, setLoading] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false); // modal thêm/sửa
    const [detailOpen, setDetailOpen] = useState(false);   // modal xem chi tiết

    const [editingRecord, setEditingRecord] = useState(null);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const [form] = Form.useForm();

    // LOAD DATA
    const fetchData = async () => {
        setLoading(true);
        try {
            const [nptRes, nvRes] = await Promise.all([
                nguoiPhuThuocApi.getAll(),
                nhanVienApi.getAll()
            ]);
            setData(Array.isArray(nptRes) ? nptRes : []);
            setNhanViens(Array.isArray(nvRes) ? nvRes : []);
        } catch (error) {
            message.error("Lỗi tải dữ liệu");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // SAVE
    const handleSave = async (values) => {
        try {
            const payload = {
                ...values,
                nhanVien: { id: values.nhanVienId },
                ngaySinh: values.ngaySinh ? values.ngaySinh.format('YYYY-MM-DD') : null,
                ngayBatDauGiamTru: values.ngayBatDauGiamTru ? values.ngayBatDauGiamTru.format('YYYY-MM-DD') : null,
                ngayKetThucGiamTru: values.ngayKetThucGiamTru ? values.ngayKetThucGiamTru.format('YYYY-MM-DD') : null
            };

            if (editingRecord) {
                await nguoiPhuThuocApi.update(editingRecord.id, payload);
                message.success("Cập nhật thành công");
            } else {
                await nguoiPhuThuocApi.create(payload);
                message.success("Thêm mới thành công");
            }

            setIsModalOpen(false);
            setEditingRecord(null);
            form.resetFields();
            fetchData();
        } catch (error) {
            console.error(error);
            message.error("Lỗi khi lưu dữ liệu");
        }
    };

    // DELETE
    const handleDelete = async (id) => {
        try {
            await nguoiPhuThuocApi.delete(id);
            message.success("Đã xoá");
            fetchData();
        } catch (error) {
            message.error("Xoá thất bại");
        }
    };

    // OPEN EDIT
    const openEditModal = (record) => {
        setEditingRecord(record);
        form.setFieldsValue({
            ...record,
            nhanVienId: record.nhanVienId || record.nhanVien?.id,
            hoTenNguoiThan: record.hoTenNguoiThan || "",
            ngaySinh: record.ngaySinh ? dayjs(record.ngaySinh) : null,
            ngayBatDauGiamTru: record.ngayBatDauGiamTru ? dayjs(record.ngayBatDauGiamTru) : null,
            ngayKetThucGiamTru: record.ngayKetThucGiamTru ? dayjs(record.ngayKetThucGiamTru) : null,
        });
        setIsModalOpen(true);
    };

    // OPEN DETAIL
    const openDetailModal = (record) => {
        setSelectedRecord(record);
        setDetailOpen(true);
    };

    // COLUMNS
    const columns = [
        {
            title: 'Nhân Viên',
            key: 'nhanVien',
            width: 200,
            render: (r) => (
                <div>
                    <div style={{ fontWeight: 'bold' }}>{r.tenNhanVien || r.nhanVien?.hoTen}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>{r.maNv || r.nhanVien?.maNv}</div>
                </div>
            )
        },
        {
            title: 'Họ Tên Người Phụ Thuộc',
            dataIndex: 'hoTenNguoiThan',
            key: 'hoTenNguoiThan',
            render: (value) =>
                value ? (
                    <Tag color="cyan" style={{ fontSize: 14, padding: "4px 10px" }}>
                        {value}
                    </Tag>
                ) : (
                    <span style={{ color: '#999' }}>Chưa có</span>
                )
        },
        {
            title: 'Quan Hệ',
            dataIndex: 'quanHe',
            width: 120,
        },
        {
            title: 'MST',
            dataIndex: 'maSoThue',
            width: 120,
        },
        {
            title: 'Thời Gian Giảm Trừ',
            width: 220,
            render: (r) => (
                <div style={{ fontSize: 13 }}>
                    <div>Bắt đầu: {r.ngayBatDauGiamTru ? dayjs(r.ngayBatDauGiamTru).format('DD/MM/YYYY') : '...'}</div>
                    <div>Kết thúc: {r.ngayKetThucGiamTru ? dayjs(r.ngayKetThucGiamTru).format('DD/MM/YYYY') : '...'}</div>
                </div>
            )
        },
        {
            title: 'Hành Động',
            key: 'action',
            width: 140,
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="default"
                        size="small"
                        onClick={() => openDetailModal(record)}
                    >
                        Xem
                    </Button>

                    <Button
                        icon={<EditOutlined />}
                        type="primary" ghost size="small"
                        onClick={() => openEditModal(record)}
                    />

                    <Popconfirm
                        title="Xóa bản ghi này?"
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
            <Card title="Quản Lý Người Phụ Thuộc" variant="borderless">
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setEditingRecord(null);
                            form.resetFields();
                            setIsModalOpen(true);
                        }}
                    >
                        Thêm Mới
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    loading={loading}
                    bordered
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            {/* MODAL THÊM / SỬA */}
            <Modal
                title={editingRecord ? "Cập Nhật Thông Tin" : "Thêm Người Phụ Thuộc"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
                width={700}
                maskClosable={false}
            >
                <Form form={form} layout="vertical" onFinish={handleSave}>

                    <Form.Item
                        name="nhanVienId"
                        label="Nhân Viên"
                        rules={[{ required: true, message: 'Chọn nhân viên' }]}
                    >
                        <Select showSearch placeholder="Tìm theo tên hoặc mã..." optionFilterProp="children">
                            {nhanViens.map(nv => (
                                <Select.Option key={nv.id} value={nv.id}>
                                    {nv.maNv} - {nv.hoTen}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="hoTenNguoiThan"
                        label="Họ Tên Người Phụ Thuộc"
                        rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                    >
                        <Input placeholder="Nhập họ tên" prefix={<UsergroupAddOutlined />} />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="quanHe" label="Quan Hệ" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="ngaySinh" label="Ngày Sinh">
                                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="maSoThue" label="Mã Số Thuế">
                        <Input />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="ngayBatDauGiamTru" label="Ngày Bắt Đầu Giảm Trừ">
                                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="ngayKetThucGiamTru" label="Ngày Kết Thúc">
                                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                            </Form.Item>
                        </Col>
                    </Row>

                </Form>
            </Modal>

            {/* MODAL XEM CHI TIẾT */}
            <Modal
                title="Chi tiết người phụ thuộc"
                open={detailOpen}
                onCancel={() => setDetailOpen(false)}
                footer={null}
                width={700}
            >
                {selectedRecord && (
                    <Form layout="vertical" style={{ marginTop: 10 }}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Nhân viên">
                                    <Input value={selectedRecord.tenNhanVien || selectedRecord.nhanVien?.hoTen} readOnly />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Mã nhân viên">
                                    <Input value={selectedRecord.maNv || selectedRecord.nhanVien?.maNv} readOnly />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item label="Họ tên người phụ thuộc">
                            <Input value={selectedRecord.hoTenNguoiThan} readOnly />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Quan hệ">
                                    <Input value={selectedRecord.quanHe} readOnly />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item label="Ngày sinh">
                                    <Input
                                        value={selectedRecord.ngaySinh ? dayjs(selectedRecord.ngaySinh).format("DD/MM/YYYY") : ""}
                                        readOnly
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item label="Mã số thuế">
                            <Input value={selectedRecord.maSoThue || ""} readOnly />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Ngày bắt đầu giảm trừ">
                                    <Input
                                        value={
                                            selectedRecord.ngayBatDauGiamTru
                                                ? dayjs(selectedRecord.ngayBatDauGiamTru).format("DD/MM/YYYY")
                                                : ""
                                        }
                                        readOnly
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={12}>
                                <Form.Item label="Ngày kết thúc giảm trừ">
                                    <Input
                                        value={
                                            selectedRecord.ngayKetThucGiamTru
                                                ? dayjs(selectedRecord.ngayKetThucGiamTru).format("DD/MM/YYYY")
                                                : ""
                                        }
                                        readOnly
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                )}
            </Modal>

        </div>
    );
};

export default NguoiPhuThuocList;
