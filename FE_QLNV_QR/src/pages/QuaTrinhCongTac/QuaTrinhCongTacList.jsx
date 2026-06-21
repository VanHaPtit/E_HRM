import React, { useEffect, useState } from 'react';
import {
    Table, Button, Modal, Form, Select, DatePicker,
    message, Popconfirm, Space, Tag, Card, Row, Col, Descriptions, Divider
} from 'antd';
import {
    PlusOutlined, EditOutlined, DeleteOutlined,
    EyeOutlined // Import icon xem
} from '@ant-design/icons';
import dayjs from 'dayjs';

import quaTrinhCongTacApi from '../../api/quaTrinhCongTacApi';
import nhanVienApi from '../../api/nhanVienApi';
import phongBanApi from '../../api/phongBanApi';
import chucVuApi from '../../api/chucVuApi';

const QuaTrinhCongTacList = () => {
    // --- STATE ---
    const [data, setData] = useState([]);

    // State cho các danh sách chọn
    const [nhanViens, setNhanViens] = useState([]);
    const [phongBans, setPhongBans] = useState([]);
    const [chucVus, setChucVus] = useState([]);

    const [loading, setLoading] = useState(false);

    // State Modal Tạo/Sửa
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);

    // State Modal Xem Chi Tiết
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewRecord, setViewRecord] = useState(null);

    const [form] = Form.useForm();

    // --- FETCH DATA ---
    const fetchData = async () => {
        setLoading(true);
        try {
            const [qtctRes, nvRes, pbRes, cvRes] = await Promise.all([
                quaTrinhCongTacApi.getAll(),
                nhanVienApi.getAll(),
                phongBanApi.getAll(),
                chucVuApi.getAll()
            ]);

            setData(Array.isArray(qtctRes) ? qtctRes : []);
            setNhanViens(Array.isArray(nvRes) ? nvRes : []);
            setPhongBans(Array.isArray(pbRes) ? pbRes : []);
            setChucVus(Array.isArray(cvRes) ? cvRes : []);
        } catch (error) {
            console.error(error);
            message.error("Lỗi tải dữ liệu. Hãy kiểm tra lại API.");
        }
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    // --- HANDLERS ---
    const handleSave = async (values) => {
        try {
            const payload = {
                ...values,
                nhanVien: { id: values.nhanVienId },
                phongBan: { id: values.phongBanId },
                chucVu: { id: values.chucVuId },
                ngayHieuLuc: values.ngayHieuLuc ? values.ngayHieuLuc.format('YYYY-MM-DD') : null,
                ngayKetThuc: values.ngayKetThuc ? values.ngayKetThuc.format('YYYY-MM-DD') : null,
            };

            if (editingRecord) {
                await quaTrinhCongTacApi.update(editingRecord.id, payload);
                message.success("Cập nhật thành công");
            } else {
                await quaTrinhCongTacApi.create(payload);
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

    const handleDelete = async (id) => {
        try {
            await quaTrinhCongTacApi.delete(id);
            message.success("Đã xóa bản ghi");
            fetchData();
        } catch (error) {
            message.error("Xóa thất bại");
        }
    };

    const openEditModal = (record) => {
        setEditingRecord(record);
        form.setFieldsValue({
            ...record,
            nhanVienId: record.nhanVien?.id,
            phongBanId: record.phongBan?.id,
            chucVuId: record.chucVu?.id,
            ngayHieuLuc: record.ngayHieuLuc ? dayjs(record.ngayHieuLuc) : null,
            ngayKetThuc: record.ngayKetThuc ? dayjs(record.ngayKetThuc) : null,
        });
        setIsModalOpen(true);
    };

    // Mở Modal Xem Chi Tiết
    const openViewModal = (record) => {
        setViewRecord(record);
        setIsViewModalOpen(true);
    };

    // --- COLUMNS ---
    const columns = [
        {
            title: 'Nhân Viên',
            key: 'nhanVien',
            width: 180,
            render: (r) => (
                <div>
                    <div style={{ fontWeight: 'bold' }}>{r.nhanVien?.hoTen}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>{r.nhanVien?.maNv}</div>
                </div>
            )
        },
        {
            title: 'Loại Quyết Định',
            dataIndex: 'loaiQuyetDinh',
            render: (val) => <Tag color="blue">{val}</Tag>
        },
        {
            title: 'Phòng Ban & Chức Vụ',
            key: 'pb_cv',
            width: 200,
            render: (r) => (
                <div>
                    <div>PB: <b>{r.phongBan?.tenPhongBan}</b></div>
                    <div>CV: <i>{r.chucVu?.tenChucVu}</i></div>
                </div>
            )
        },
        {
            title: 'Thời Gian',
            key: 'thoiGian',
            width: 150,
            render: (r) => (
                <div>
                    <div>Từ: {r.ngayHieuLuc ? dayjs(r.ngayHieuLuc).format('DD/MM/YYYY') : '...'}</div>
                    <div>Đến: {r.ngayKetThuc ? dayjs(r.ngayKetThuc).format('DD/MM/YYYY') : <Tag color="green">Hiện tại</Tag>}</div>
                </div>
            )
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 120, // Tăng width để chứa 3 nút
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={() => openViewModal(record)}
                    />
                    <Button
                        icon={<EditOutlined />}
                        type="primary" ghost size="small"
                        onClick={() => openEditModal(record)}
                    />
                    <Popconfirm
                        title="Xóa quyết định này?"
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
            <Card title="Quá Trình Công Tác & Điều Chuyển" variant="borderless">
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
                        Tạo Quyết Định Mới
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

            {/* --- MODAL EDIT / CREATE --- */}
            <Modal
                title={editingRecord ? "Cập Nhật Quyết Định" : "Tạo Quyết Định Điều Chuyển/Bổ Nhiệm"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
                width={700}
                maskClosable={false}
            >
                <Form form={form} layout="vertical" onFinish={handleSave}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="nhanVienId" label="Nhân Viên" rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}>
                                <Select showSearch placeholder="Tìm nhân viên..." optionFilterProp="children">
                                    {nhanViens.map(nv => (
                                        <Select.Option key={nv.id} value={nv.id}>{nv.maNv} - {nv.hoTen}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="loaiQuyetDinh" label="Loại Quyết Định" rules={[{ required: true }]}>
                                <Select placeholder="Chọn loại quyết định">
                                    <Select.Option value="TIEP_NHAN">Tiếp nhận</Select.Option>
                                    <Select.Option value="BO_NHIEM">Bổ nhiệm</Select.Option>
                                    <Select.Option value="DIEU_CHUYEN">Điều chuyển</Select.Option>
                                    <Select.Option value="THANG_CHUC">Thăng chức</Select.Option>
                                    <Select.Option value="THOI_VIEC">Thôi việc</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="phongBanId" label="Phòng Ban (Mới)" rules={[{ required: true }]}>
                                <Select showSearch placeholder="Tìm phòng ban..." optionFilterProp="children">
                                    {phongBans.map(pb => (
                                        <Select.Option key={pb.id} value={pb.id}>{pb.tenPhongBan}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="chucVuId" label="Chức Vụ (Mới)" rules={[{ required: true }]}>
                                <Select showSearch placeholder="Tìm chức vụ..." optionFilterProp="children">
                                    {chucVus.map(cv => (
                                        <Select.Option key={cv.id} value={cv.id}>{cv.tenChucVu}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="ngayHieuLuc" label="Ngày Hiệu Lực" rules={[{ required: true }]}>
                                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="ngayKetThuc" label="Ngày Kết Thúc (Nếu có)">
                                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="Để trống nếu đang hiệu lực" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>

            {/* --- MODAL VIEW DETAIL --- */}
            <Modal
                title="Chi Tiết Quyết Định"
                open={isViewModalOpen}
                onCancel={() => setIsViewModalOpen(false)}
                footer={[
                    <Button key="close" onClick={() => setIsViewModalOpen(false)}>Đóng</Button>,
                    <Button key="edit" type="primary" onClick={() => {
                        setIsViewModalOpen(false);
                        openEditModal(viewRecord);
                    }}>
                        Chỉnh sửa
                    </Button>
                ]}
                width={700}
            >
                {viewRecord && (
                    <>
                        <Descriptions title="Thông tin Quyết Định" bordered column={2}>
                            <Descriptions.Item label="Loại Quyết Định">
                                <Tag color="blue">{viewRecord.loaiQuyetDinh}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="ID Quyết Định">
                                <b>#{viewRecord.id}</b>
                            </Descriptions.Item>

                            <Descriptions.Item label="Ngày Hiệu Lực">
                                {viewRecord.ngayHieuLuc ? dayjs(viewRecord.ngayHieuLuc).format('DD/MM/YYYY') : '...'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày Kết Thúc">
                                {viewRecord.ngayKetThuc ? dayjs(viewRecord.ngayKetThuc).format('DD/MM/YYYY') : <Tag color="green">Đang hiệu lực</Tag>}
                            </Descriptions.Item>

                            <Descriptions.Item label="Phòng Ban Mới">
                                <b>{viewRecord.phongBan?.tenPhongBan}</b>
                            </Descriptions.Item>
                            <Descriptions.Item label="Chức Vụ Mới">
                                <b>{viewRecord.chucVu?.tenChucVu}</b>
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider orientation="left">Thông tin Nhân Viên</Divider>

                        <Descriptions bordered column={2} size="small">
                            <Descriptions.Item label="Họ và Tên">{viewRecord.nhanVien?.hoTen}</Descriptions.Item>
                            <Descriptions.Item label="Mã Nhân Viên">{viewRecord.nhanVien?.maNv}</Descriptions.Item>
                            <Descriptions.Item label="Ngày Sinh">
                                {viewRecord.nhanVien?.ngaySinh ? dayjs(viewRecord.nhanVien.ngaySinh).format('DD/MM/YYYY') : '...'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Email">{viewRecord.nhanVien?.emailCongTy}</Descriptions.Item>
                        </Descriptions>
                    </>
                )}
            </Modal>
        </div>
    );
};

export default QuaTrinhCongTacList;