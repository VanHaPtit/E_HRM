import React, { useEffect, useState } from 'react';
import {
    Table, Button, Modal, Form, Select, DatePicker,
    message, Popconfirm, Space, Tag, Card, Row, Col, Tabs, Tooltip
} from 'antd';
import {
    PlusOutlined, EditOutlined, DeleteOutlined,
    CheckCircleOutlined, CloseCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

// Import API
import donXinPhepApi from '../../api/donXinPhepApi';
import nhanVienApi from '../../api/nhanVienApi';

const DonXinPhepList = () => {
    // --- STATE ---
    const [data, setData] = useState([]);
    const [nhanViens, setNhanViens] = useState([]);
    const [loading, setLoading] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);

    const [filterStatus, setFilterStatus] = useState('ALL');

    const [form] = Form.useForm();

    const userRoles = JSON.parse(localStorage.getItem("user_roles") || "[]");
    const isAdminOrHR = userRoles.includes("ADMIN") || userRoles.includes("HR");
    const currentUserId = localStorage.getItem("user_id");

    // --- FETCH DATA ---
    const fetchData = async () => {
        setLoading(true);
        try {
            // Load song song: Đơn phép & Nhân viên
            const [donRes, nvRes] = await Promise.all([
                donXinPhepApi.getAll(),
                nhanVienApi.getAll()
            ]);

            // Xử lý dữ liệu đơn phép
            let rawData = Array.isArray(donRes) ? donRes : [];

            // Lọc dữ liệu theo Tab trạng thái
            if (filterStatus !== 'ALL') {
                rawData = rawData.filter(item => item.trangThai === filterStatus);
            }

            setData(rawData);
            setNhanViens(Array.isArray(nvRes) ? nvRes : []);
        } catch (error) {
            console.error(error);
            message.error("Lỗi tải dữ liệu");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [filterStatus]); // Reload khi đổi tab

    // --- HANDLERS (CRUD) ---
    const handleSave = async (values) => {
        try {
            const payload = {
                ...values,
                nhanVien: { id: values.nhanVienId },
                tuNgay: values.tuNgay ? values.tuNgay.format('YYYY-MM-DDTHH:mm:ss') : null,
                denNgay: values.denNgay ? values.denNgay.format('YYYY-MM-DDTHH:mm:ss') : null,
                // Mặc định tạo mới là CHO_DUYET
                trangThai: editingRecord ? values.trangThai : 'CHO_DUYET',
            };

            if (editingRecord) {
                await donXinPhepApi.update(editingRecord.id, payload);
                message.success("Cập nhật thành công");
            } else {
                await donXinPhepApi.create(payload);
                message.success("Gửi đơn thành công");
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
            await donXinPhepApi.delete(id);
            message.success("Đã xóa đơn");
            fetchData();
        } catch (error) {
            message.error("Xóa thất bại");
        }
    };

    // --- HANDLERS (DUYỆT / TỪ CHỐI) ---
    const handleApprove = async (id) => {
        try {
            // Giả lập ID người duyệt là 1 (Admin). 
            // Thực tế bạn cần lấy ID từ localStorage hoặc Context User đang login
            const currentUserId = 1;
            await donXinPhepApi.approve(id, currentUserId);
            message.success("Đã duyệt đơn");
            fetchData();
        } catch (error) {
            message.error("Lỗi khi duyệt");
        }
    };

    const handleReject = async (id) => {
        try {
            const currentUserId = 1; // Giả lập ID người duyệt
            await donXinPhepApi.reject(id, currentUserId);
            message.success("Đã từ chối đơn");
            fetchData();
        } catch (error) {
            message.error("Lỗi khi từ chối");
        }
    };

    // --- HELPER ---
    const openEditModal = (record) => {
        setEditingRecord(record);
        form.setFieldsValue({
            ...record,
            nhanVienId: record.nhanVien?.id,
            tuNgay: record.tuNgay ? dayjs(record.tuNgay) : null,
            denNgay: record.denNgay ? dayjs(record.denNgay) : null,
        });
        setIsModalOpen(true);
    };

    const getStatusTag = (status) => {
        switch (status) {
            case 'CHO_DUYET': return <Tag color="orange">Chờ duyệt</Tag>;
            case 'DA_DUYET': return <Tag color="green">Đã duyệt</Tag>;
            case 'TU_CHOI': return <Tag color="red">Từ chối</Tag>;
            default: return <Tag>{status}</Tag>;
        }
    };

    // --- COLUMNS ---
    const columns = [
        {
            title: 'Nhân Viên',
            key: 'nhanVien',
            width: 200,
            render: (r) => (
                <div>
                    <b>{r.nhanVien?.hoTen}</b> <br />
                    <small style={{ color: '#888' }}>{r.nhanVien?.maNv}</small>
                </div>
            )
        },
        {
            title: 'Loại Nghỉ',
            dataIndex: 'loaiNghi',
            width: 120,
            render: (val) => {
                let color = val === 'NGHI_PHEP_NAM' ? 'blue' : 'cyan';
                return <Tag color={color}>{val}</Tag>
            }
        },
        {
            title: 'Thời Gian',
            width: 200,
            render: (r) => (
                <span>
                    {dayjs(r.tuNgay).format('DD/MM/YYYY HH:mm')}
                    <span style={{ margin: '0 5px' }}>→</span>
                    {dayjs(r.denNgay).format('DD/MM/YYYY HH:mm')}
                </span>
            )
        },
        {
            title: 'Trạng Thái',
            dataIndex: 'trangThai',
            width: 120,
            render: (val) => getStatusTag(val)
        },
        {
            title: 'Người Duyệt',
            render: (r) => r.nguoiDuyet ? r.nguoiDuyet.hoTen : '-'
        },
        {
            title: 'Hành động',
            key: 'action',
            align: 'center',
            width: 150,
            render: (_, record) => (
                <Space size="small">
                    {/* Chỉ Admin/HR mới thấy nút Duyệt/Từ chối nếu trạng thái là CHỜ DUYỆT */}
                    {isAdminOrHR && record.trangThai === 'CHO_DUYET' && (
                        <>
                            <Tooltip title="Duyệt">
                                <Button
                                    icon={<CheckCircleOutlined />}
                                    type="text"
                                    style={{ color: 'green' }}
                                    onClick={() => handleApprove(record.id)}
                                />
                            </Tooltip>
                            <Tooltip title="Từ chối">
                                <Popconfirm title="Từ chối đơn này?" onConfirm={() => handleReject(record.id)}>
                                    <Button
                                        icon={<CloseCircleOutlined />}
                                        type="text"
                                        style={{ color: 'red' }}
                                    />
                                </Popconfirm>
                            </Tooltip>
                        </>
                    )}

                    <Button
                        icon={<EditOutlined />}
                        type="primary" ghost size="small"
                        onClick={() => openEditModal(record)}
                        disabled={record.trangThai !== 'CHO_DUYET'} // Không cho sửa nếu đã duyệt/từ chối
                    />

                    <Popconfirm title="Xóa đơn này?" onConfirm={() => handleDelete(record.id)}>
                        <Button icon={<DeleteOutlined />} danger size="small" />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    // --- TABS ITEMS ---
    const tabItems = [
        { key: 'ALL', label: 'Tất Cả' },
        { key: 'CHO_DUYET', label: 'Chờ Duyệt' },
        { key: 'DA_DUYET', label: 'Đã Duyệt' },
        { key: 'TU_CHOI', label: 'Từ Chối' },
    ];

    return (
        <div style={{ padding: 20 }}>
            <Card title="Quản Lý Đơn Xin Phép" variant="borderless">
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Tabs
                        defaultActiveKey="ALL"
                        items={tabItems}
                        onChange={(key) => setFilterStatus(key)}
                        style={{ marginBottom: -16 }} // Hack nhỏ để căn chỉnh đẹp hơn
                    />
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                        setEditingRecord(null);
                        form.resetFields();
                        // Mặc định ngày hôm nay
                        form.setFieldsValue({ 
                            loaiNghi: 'NGHI_PHEP_NAM', 
                            tuNgay: dayjs(), 
                            denNgay: dayjs(),
                            nhanVienId: !isAdminOrHR ? Number(currentUserId) : undefined
                        });
                        setIsModalOpen(true);
                    }}>
                        Tạo Đơn Mới
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

            {/* --- MODAL --- */}
            <Modal
                title={editingRecord ? "Cập Nhật Đơn" : "Tạo Đơn Xin Phép"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
                width={700}
                maskClosable={false}
            >
                <Form form={form} layout="vertical" onFinish={handleSave}>
                    <Row gutter={16}>
                        {isAdminOrHR && (
                            <Col span={12}>
                                <Form.Item name="nhanVienId" label="Nhân Viên" rules={[{ required: true, message: 'Chọn nhân viên' }]}>
                                    <Select showSearch optionFilterProp="children" placeholder="Chọn nhân viên">
                                        {nhanViens.map(nv => (
                                            <Select.Option key={nv.id} value={nv.id}>
                                                {nv.maNv} - {nv.hoTen}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        )}
                        <Col span={isAdminOrHR ? 12 : 24}>
                            <Form.Item name="loaiNghi" label="Loại Nghỉ" rules={[{ required: true }]}>
                                {/* Giá trị Value phải khớp với Enum Java LoaiNghi */}
                                <Select>
                                    <Select.Option value="NGHI_PHEP_NAM">Nghỉ phép năm</Select.Option>
                                    <Select.Option value="NGHI_OM">Nghỉ ốm</Select.Option>
                                    <Select.Option value="NGHI_KHONG_LUONG">Nghỉ không lương</Select.Option>
                                    <Select.Option value="NGHI_THAI_SAN">Nghỉ thai sản</Select.Option>
                                    <Select.Option value="NGHI_CUOI_HOI">Nghỉ cưới hỏi</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="tuNgay" label="Từ Thời Gian" rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu' }]}>
                                <DatePicker showTime style={{ width: '100%' }} format="DD/MM/YYYY HH:mm" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item 
                                name="denNgay" 
                                label="Đến Thời Gian" 
                                rules={[
                                    { required: true, message: 'Vui lòng chọn thời gian kết thúc' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || !getFieldValue('tuNgay')) {
                                                return Promise.resolve();
                                            }
                                            if (value.isBefore(getFieldValue('tuNgay'))) {
                                                return Promise.reject(new Error('Thời gian kết thúc phải lớn hơn thời gian bắt đầu!'));
                                            }
                                            return Promise.resolve();
                                        },
                                    }),
                                ]}
                            >
                                <DatePicker showTime style={{ width: '100%' }} format="DD/MM/YYYY HH:mm" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default DonXinPhepList;