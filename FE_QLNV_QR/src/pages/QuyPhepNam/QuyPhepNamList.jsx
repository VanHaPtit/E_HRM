import React, { useEffect, useState } from 'react';
import {
    Table, Button, Modal, Form, Select, DatePicker, InputNumber,
    message, Popconfirm, Space, Tag, Card, Row, Col, Progress
} from 'antd';
import {
    PlusOutlined, EditOutlined, DeleteOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

import quyPhepNamApi from '../../api/quyPhepNamApi';
import nhanVienApi from '../../api/nhanVienApi';

const QuyPhepNamList = () => {
    const [data, setData] = useState([]);
    const [nhanViens, setNhanViens] = useState([]);
    const [loading, setLoading] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);

    const [filterYear, setFilterYear] = useState(null);
    const [filterNhanVien, setFilterNhanVien] = useState(null);

    const [form] = Form.useForm();

    const userRoles = JSON.parse(localStorage.getItem("user_roles") || "[]");
    const isAdminOrHR = userRoles.includes("ADMIN") || userRoles.includes("HR");

    // ================= FETCH ==================
    const fetchData = async () => {
        setLoading(true);
        try {
            if (nhanViens.length === 0) {
                const nvRes = await nhanVienApi.getAll();
                setNhanViens(Array.isArray(nvRes) ? nvRes : []);
            }

            const res = await quyPhepNamApi.getAll();
            let rawData = Array.isArray(res) ? res : [];

            if (filterYear) {
                rawData = rawData.filter(item => item.nam === filterYear.year());
            }
            if (filterNhanVien) {
                rawData = rawData.filter(item => item.nhanVienId === filterNhanVien || item.nhanVien?.id === filterNhanVien);
            }

            setData(rawData);
        } catch (e) {
            message.error("Lỗi tải dữ liệu");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [filterYear, filterNhanVien]);

    // ================ SAVE ====================
    const handleSave = async (values) => {
        try {
            const payload = {
                ...values,
                nhanVien: { id: values.nhanVienId },
                nam: values.nam.year(),
                tongPhepDuocCap: parseFloat(values.tongPhepDuocCap),
                phepTonNamTruoc: parseFloat(values.phepTonNamTruoc || 0),
                phepDaNghi: parseFloat(values.phepDaNghi || 0),
            };

            if (editingRecord) {
                await quyPhepNamApi.update(editingRecord.id, payload);
                message.success("Cập nhật thành công");
            } else {
                await quyPhepNamApi.create(payload);
                message.success("Thêm mới thành công");
            }

            setIsModalOpen(false);
            setEditingRecord(null);
            form.resetFields();
            fetchData();

        } catch (e) {
            message.error("Lỗi khi lưu");
        }
    };

    // ================ DELETE ===================
    const handleDelete = async (id) => {
        try {
            await quyPhepNamApi.delete(id);
            message.success("Đã xóa bản ghi");
            fetchData();
        } catch (e) {
            message.error("Xóa thất bại");
        }
    };

    // ================ OPEN EDIT =================
    const openEditModal = (record) => {
        setEditingRecord(record);
        form.setFieldsValue({
            nhanVienId: record.nhanVienId || record.nhanVien?.id,
            nam: dayjs(record.nam.toString(), "YYYY"),   // FIX CỰC QUAN TRỌNG
            tongPhepDuocCap: record.tongPhepDuocCap,
            phepTonNamTruoc: record.phepTonNamTruoc,
            phepDaNghi: record.phepDaNghi
        });
        setIsModalOpen(true);
    };

    // ================= COLUMNS =================
    const columns = [
        {
            title: 'Năm',
            dataIndex: 'nam',
            width: 80,
            align: 'center'
        },
        {
            title: 'Nhân Viên',
            key: 'nhanVien',
            width: 200,
            render: (r) => (
                <>
                    <b>{r.tenNhanVien || r.nhanVien?.hoTen}</b> <br />
                    <small style={{ color: "#777" }}>{r.maNv || r.nhanVien?.maNv}</small>
                </>
            )
        },
        {
            title: 'Tổng Cấp',
            dataIndex: 'tongPhepDuocCap',
            align: 'center',
            render: v => <Tag color="blue">{v}</Tag>
        },
        {
            title: 'Tồn Năm Trước',
            dataIndex: 'phepTonNamTruoc',
            align: 'center',
            render: v => v > 0 ? <Tag color="cyan">{v}</Tag> : '-'
        },
        {
            title: 'Đã Nghỉ',
            dataIndex: 'phepDaNghi',
            align: 'center',
            render: v => <span style={{ color: v > 0 ? "red" : "#333" }}>{v}</span>
        },
        {
            title: 'Phép Còn',
            key: 'conLai',
            width: 160,
            render: (_, r) => {
                const tong = (r.tongPhepDuocCap || 0) + (r.phepTonNamTruoc || 0);
                const con = tong - (r.phepDaNghi || 0);
                const percent = tong > 0 ? (con / tong) * 100 : 0;

                let status = "success";
                if (percent < 30) status = "exception";
                else if (percent < 60) status = "normal";

                return (
                    <div>
                        <b style={{ color: status === "exception" ? "red" : "green" }}>
                            {con.toFixed(1)} ngày
                        </b>
                        <Progress percent={percent} size="small" showInfo={false} status={status} />
                    </div>
                );
            }
        }
    ];

    if (isAdminOrHR) {
        columns.push({
            title: 'Hành động',
            key: 'action',
            width: 90,
            align: 'center',
            render: (_, r) => (
                <Space>
                    <Button icon={<EditOutlined />} size="small" onClick={() => openEditModal(r)} />
                    <Popconfirm title="Xóa bản ghi?" onConfirm={() => handleDelete(r.id)}>
                        <Button icon={<DeleteOutlined />} danger size="small" />
                    </Popconfirm>
                </Space>
            )
        });
    }

    return (
        <div style={{ padding: 20 }}>
            <Card title="Quản lý Quỹ Phép Năm" variant="borderless">

                {/* TOOLBAR */}
                <Row gutter={16} style={{ marginBottom: 12 }}>
                    <Col span={6}>
                        <DatePicker
                            picker="year"
                            style={{ width: '100%' }}
                            placeholder="Lọc theo năm"
                            value={filterYear}
                            onChange={setFilterYear}
                            allowClear
                        />
                    </Col>

                    {isAdminOrHR && (
                        <Col span={6}>
                            <Select
                                style={{ width: '100%' }}
                                placeholder="Lọc nhân viên"
                                allowClear
                                showSearch
                                optionFilterProp="children"
                                onChange={setFilterNhanVien}
                            >
                                {nhanViens.map(nv => (
                                    <Select.Option key={nv.id} value={nv.id}>
                                        {nv.maNv} - {nv.hoTen}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Col>
                    )}

                    <Col span={isAdminOrHR ? 12 : 18} style={{ textAlign: 'right' }}>
                        {isAdminOrHR && (
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => {
                                    setEditingRecord(null);
                                    form.resetFields();
                                    form.setFieldsValue({
                                        nam: dayjs(),
                                        tongPhepDuocCap: 12,
                                        phepDaNghi: 0,
                                        phepTonNamTruoc: 0
                                    });
                                    setIsModalOpen(true);
                                }}>
                                Cấp phép mới
                            </Button>
                        )}
                    </Col>
                </Row>

                {/* TABLE */}
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
                title={editingRecord ? "Cập nhật Quỹ Phép" : "Cấp Phép Năm"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
                width={650}
            >
                <Form form={form} layout="vertical" onFinish={handleSave}>
                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item name="nhanVienId" label="Nhân viên" rules={[{ required: true }]}>
                                <Select
                                    showSearch
                                    placeholder="Chọn nhân viên"
                                    optionFilterProp="children"
                                >
                                    {nhanViens.map(nv => (
                                        <Select.Option key={nv.id} value={nv.id}>
                                            {nv.maNv} - {nv.hoTen}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item name="nam" label="Năm" rules={[{ required: true }]}>
                                <DatePicker picker="year" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={12}>
                        <Col span={8}>
                            <Form.Item name="tongPhepDuocCap" label="Tổng phép cấp" rules={[{ required: true }]}>
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item name="phepTonNamTruoc" label="Tồn năm trước">
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item name="phepDaNghi" label="Đã nghỉ">
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default QuyPhepNamList;
