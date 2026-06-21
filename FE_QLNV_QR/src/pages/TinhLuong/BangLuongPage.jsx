import React, { useEffect, useState } from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    InputNumber,
    Select,
    DatePicker,
    message,
    Space,
    Popconfirm,
    Tag,
    Row,
    Col,
    Card,
    Descriptions,
    Divider,
    Upload,
    notification,
    Statistic
} from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    CalculatorOutlined,
    SearchOutlined,
    PrinterOutlined,
    PlusOutlined,
    EyeOutlined,
    UploadOutlined,
    DownloadOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import luongApi from '../../api/luongApi';
import nhanVienApi from '../../api/nhanVienApi';

const BangLuongPage = () => {
    // --- STATE ---
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewRecord, setViewRecord] = useState(null);
    const [form] = Form.useForm();
    const [filterMonth, setFilterMonth] = useState(dayjs());
    const [nhanViens, setNhanViens] = useState([]);

    // --- FORMAT TIỀN ---
    const formatCurrency = (value) => {
        if (value === null || value === undefined) return "0 ₫";
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    // INPUT FORMATTER
    const currencyInputProps = {
        style: { width: '100%' },
        formatter: value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        parser: value => value.replace(/(,*)/g, ''),
        min: 0
    };

    // --- LOAD DATA ---
    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await luongApi.getAll();
            const nvRes = await nhanVienApi.getAll();
            setData(Array.isArray(res) ? res : res?.data || []);
            setNhanViens(Array.isArray(nvRes) ? nvRes : nvRes?.data || []);
        } catch (e) {
            message.error("Không tải được dữ liệu");
            console.error(e);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Reset form khi mở modal sửa/tạo
    useEffect(() => {
        if (isModalOpen) {
            if (editingRecord) {
                form.setFieldsValue({
                    ...editingRecord,
                    nhanVienId: editingRecord.nhanVienId || editingRecord.nhanVien?.id
                });
            } else {
                form.resetFields();
                form.setFieldsValue({
                    thang: dayjs().month() + 1,
                    nam: dayjs().year(),
                    luongNgayCong: 0,
                    luongOt: 0,
                    tongPhuCap: 0,
                    thuongDoanhSo: 0,
                    khauTruBhxh: 0,
                    khauTruBhyt: 0,
                    khauTruBhtn: 0,
                    doanPhi: 0,
                    thueTncn: 0,
                    tamUng: 0,
                    thucLinh: 0
                });
            }
        }
    }, [isModalOpen, editingRecord, form]);

    // --- TÍNH TỔNG ---
    const calculateTotals = () => {
        const tongThuNhap = data.reduce((sum, item) =>
            sum + (item.luongNgayCong || 0) + (item.luongOt || 0) +
            (item.tongPhuCap || 0) + (item.thuongDoanhSo || 0), 0
        );
        const tongKhauTru = data.reduce((sum, item) =>
            sum + (item.khauTruBhxh || 0) + (item.khauTruBhyt || 0) +
            (item.khauTruBhtn || 0) + (item.doanPhi || 0) +
            (item.thueTncn || 0) + (item.tamUng || 0), 0
        );
        const tongThucLinh = data.reduce((sum, item) => sum + (item.thucLinh || 0), 0);

        return { tongThuNhap, tongKhauTru, tongThucLinh };
    };

    // --- HANDLERS ---
    const handleFilter = async () => {
        if (!filterMonth) {
            message.warning("Vui lòng chọn tháng để lọc");
            return;
        }

        setLoading(true);
        try {
            const thang = filterMonth.month() + 1;
            const nam = filterMonth.year();

            console.log('Đang lọc với tháng:', thang, 'năm:', nam);

            // Thử nhiều cách gọi API khác nhau
            let res;
            try {
                // Cách 1: Dùng hàm filter của API
                res = await luongApi.filter(undefined, thang, nam);
            } catch (err) {
                console.log('Cách 1 thất bại, thử cách 2');
                // Cách 2: Gọi trực tiếp endpoint
                res = await fetch(
                    `http://localhost:8080/api/bangluong/filter?thang=${thang}&nam=${nam}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                ).then(r => r.json());
            }

            const filteredData = Array.isArray(res) ? res : res?.data || [];
            console.log('Dữ liệu sau khi lọc:', filteredData);

            setData(filteredData);
            message.success(`Đã lọc ${filteredData.length} bản ghi tháng ${thang}/${nam}`);
        } catch (e) {
            message.error("Lỗi lọc dữ liệu: " + e.message);
            console.error('Chi tiết lỗi:', e);
        }
        setLoading(false);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const { nhanVienId, ...rest } = values;
            const payload = {
                ...rest,
                nhanVien: { id: nhanVienId }
            };

            if (editingRecord) {
                await luongApi.update(editingRecord.id, payload);
                message.success("Cập nhật thành công");
            } else {
                await luongApi.create(payload);
                message.success("Tạo mới thành công");
            }
            setIsModalOpen(false);
            fetchData();
        } catch (e) {
            if (!e.errorFields) message.error("Có lỗi khi lưu dữ liệu!");
        }
    };

    const handleDelete = async (id) => {
        try {
            await luongApi.delete(id);
            message.success("Đã xóa bản ghi");
            fetchData();
        } catch {
            message.error("Xóa thất bại");
        }
    };

    const openViewModal = (record) => {
        setViewRecord(record);
        setIsViewModalOpen(true);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleExportExcel = async () => {
        try {
            const thang = filterMonth.month() + 1;
            const nam = filterMonth.year();
            const response = await fetch(
                `http://localhost:8080/api/bangluong/export?thang=${thang}&nam=${nam}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `BangLuong_${thang}_${nam}.xlsx`;
                a.click();
                message.success('Xuất Excel thành công!');
            } else {
                message.error('Lỗi khi xuất Excel');
            }
        } catch (error) {
            message.error('Lỗi kết nối server');
            console.error(error);
        }
    };

    const uploadProps = {
        name: 'file',
        action: 'http://localhost:8080/api/bangluong/upload',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        showUploadList: false,
        onChange(info) {
            if (info.file.status === 'uploading') {
                setLoading(true);
            }
            if (info.file.status === 'done') {
                setLoading(false);
                const res = info.file.response;
                if (!res.errors || res.errors.length === 0) {
                    message.success(res.message || "Import dữ liệu thành công!");
                } else {
                    notification.warning({
                        message: 'Import hoàn tất nhưng có lỗi',
                        description: (
                            <ul>
                                {res.errors.map((err, index) => (
                                    <li key={index}>{err}</li>
                                ))}
                            </ul>
                        ),
                        duration: 0
                    });
                }
                fetchData();
            } else if (info.file.status === 'error') {
                setLoading(false);
                message.error("Lỗi xác thực hoặc lỗi hệ thống khi Import!");
            }
        }
    };

    // --- COLUMNS ---
    const columns = [
        {
            title: 'STT',
            width: 60,
            align: 'center',
            render: (_, __, index) => index + 1
        },
        {
            title: 'Tháng',
            width: 90,
            align: 'center',
            render: (_, r) => `${r.thang}/${r.nam}`
        },
        {
            title: 'Nhân Viên',
            width: 200,
            render: (_, r) => (
                <div>
                    <div style={{ fontWeight: 600 }}>{r.hoTen || r.nhanVien?.hoTen}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>{r.maNv || r.nhanVien?.maNv}</div>
                </div>
            )
        },
        {
            title: 'Lương NC',
            dataIndex: 'luongNgayCong',
            align: 'right',
            render: v => formatCurrency(v)
        },
        {
            title: 'Lương OT',
            dataIndex: 'luongOt',
            align: 'right',
            render: v => formatCurrency(v)
        },
        {
            title: 'Phụ Cấp',
            dataIndex: 'tongPhuCap',
            align: 'right',
            render: v => formatCurrency(v)
        },
        {
            title: 'Thưởng',
            dataIndex: 'thuongDoanhSo',
            align: 'right',
            render: v => formatCurrency(v)
        },
        {
            title: 'Khấu Trừ',
            align: 'right',
            render: (_, r) => {
                const total = (r.khauTruBhxh || 0) + (r.khauTruBhyt || 0) +
                    (r.khauTruBhtn || 0) + (r.doanPhi || 0) +
                    (r.thueTncn || 0) + (r.tamUng || 0);
                return <span style={{ color: '#ff4d4f' }}>{formatCurrency(total)}</span>;
            }
        },
        {
            title: 'Thực Lĩnh',
            dataIndex: 'thucLinh',
            align: 'right',
            render: v => (
                <Tag color="green" style={{ fontSize: 14, fontWeight: 600 }}>
                    {formatCurrency(v)}
                </Tag>
            )
        },
        {
            title: 'Hành động',
            width: 150,
            align: 'center',
            fixed: 'right',
            render: (_, r) => (
                <Space>
                    <Button
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={() => openViewModal(r)}
                    />
                    <Button
                        icon={<EditOutlined />}
                        type="primary"
                        size="small"
                        onClick={() => {
                            setEditingRecord(r);
                            setIsModalOpen(true);
                        }}
                    />
                    <Popconfirm
                        title="Xác nhận xóa?"
                        onConfirm={() => handleDelete(r.id)}
                    >
                        <Button icon={<DeleteOutlined />} danger size="small" />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    const totals = calculateTotals();

    return (
        <div style={{ padding: 24 }}>
            {/* THỐNG KÊ TỔNG QUAN */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Tổng Thu Nhập"
                            value={totals.tongThuNhap}
                            formatter={(value) => formatCurrency(value)}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Tổng Khấu Trừ"
                            value={totals.tongKhauTru}
                            formatter={(value) => formatCurrency(value)}
                            valueStyle={{ color: '#cf1322' }}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Tổng Thực Lĩnh"
                            value={totals.tongThucLinh}
                            formatter={(value) => formatCurrency(value)}
                            precision={0}
                            styles={{ content: { color: '#1890ff', fontWeight: 'bold' } }}
                            suffix="VNĐ"
                        />
                    </Card>
                </Col>
            </Row>

            {/* TOOLBAR */}
            <Card style={{ marginBottom: 16 }}>
                <Space wrap>
                    <DatePicker
                        picker="month"
                        value={filterMonth}
                        onChange={(date) => setFilterMonth(date || dayjs())}
                        format="MM/YYYY"
                        style={{ width: 200 }}
                        placeholder="Chọn tháng"
                    />
                    <Button
                        type="primary"
                        icon={<SearchOutlined />}
                        onClick={handleFilter}
                    >
                        Lọc
                    </Button>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={fetchData}
                    >
                        Tải lại
                    </Button>
                    <Divider type="vertical" />
                    <Button
                        type="primary"
                        icon={<CalculatorOutlined />}
                        onClick={() => {
                            setEditingRecord(null);
                            setIsModalOpen(true);
                        }}
                    >
                        Tính Lương Mới
                    </Button>
                    <Upload {...uploadProps}>
                        <Button icon={<UploadOutlined />}>Import Excel</Button>
                    </Upload>
                    <Button
                        icon={<DownloadOutlined />}
                        onClick={handleExportExcel}
                    >
                        Xuất Excel
                    </Button>
                </Space>
            </Card>

            {/* BẢNG DỮ LIỆU */}
            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                loading={loading}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Tổng ${total} bản ghi`
                }}
                scroll={{ x: 1200 }}
                bordered
            />

            {/* MODAL EDIT/CREATE */}
            <Modal
                title={editingRecord ? "Sửa Bảng Lương" : "Tính Lương Mới"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
                width={900}
                okText="Lưu"
                cancelText="Hủy"
                destroyOnClose
            >
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="nhanVienId"
                                label="Nhân Viên"
                                rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Chọn nhân viên"
                                    optionFilterProp="label"
                                    options={nhanViens.map(nv => ({
                                        label: `${nv.maNv} - ${nv.hoTen}`,
                                        value: nv.id
                                    }))}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="thang"
                                label="Tháng"
                                rules={[{ required: true }]}
                            >
                                <InputNumber min={1} max={12} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item
                                name="nam"
                                label="Năm"
                                rules={[{ required: true }]}
                            >
                                <InputNumber min={2020} max={2100} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left">Thu Nhập</Divider>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="luongNgayCong" label="Lương Ngày Công">
                                <InputNumber {...currencyInputProps} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="luongOt" label="Lương OT">
                                <InputNumber {...currencyInputProps} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="tongPhuCap" label="Tổng Phụ Cấp">
                                <InputNumber {...currencyInputProps} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="thuongDoanhSo" label="Thưởng Doanh Số">
                                <InputNumber {...currencyInputProps} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left">Khấu Trừ</Divider>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="khauTruBhxh" label="BHXH">
                                <InputNumber {...currencyInputProps} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="khauTruBhyt" label="BHYT">
                                <InputNumber {...currencyInputProps} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="khauTruBhtn" label="BHTN">
                                <InputNumber {...currencyInputProps} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="doanPhi" label="Đoàn Phí">
                                <InputNumber {...currencyInputProps} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="thueTncn" label="Thuế TNCN">
                                <InputNumber {...currencyInputProps} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="tamUng" label="Tạm Ứng">
                                <InputNumber {...currencyInputProps} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider />
                    <Form.Item name="thucLinh" label="Thực Lĩnh">
                        <InputNumber {...currencyInputProps} />
                    </Form.Item>
                </Form>
            </Modal>

            {/* MODAL XEM CHI TIẾT */}
            <Modal
                title="Chi Tiết Bảng Lương"
                open={isViewModalOpen}
                onCancel={() => setIsViewModalOpen(false)}
                footer={[
                    <Button key="close" onClick={() => setIsViewModalOpen(false)}>
                        Đóng
                    </Button>,
                    <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>
                        In Phiếu
                    </Button>
                ]}
                width={700}
            >
                {viewRecord && (
                    <div>
                        <Descriptions bordered column={2}>
                            <Descriptions.Item label="Nhân Viên" span={2}>
                                <strong>{viewRecord.hoTen || viewRecord.nhanVien?.hoTen}</strong>
                            </Descriptions.Item>
                            <Descriptions.Item label="Mã NV">
                                {viewRecord.maNv || viewRecord.nhanVien?.maNv}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tháng/Năm">
                                {viewRecord.thang} / {viewRecord.nam}
                            </Descriptions.Item>
                            <Descriptions.Item label="Phòng Ban" span={2}>
                                {viewRecord.nhanVien?.phongBan?.tenPhongBan || 'N/A'}
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider>Khoản Thu Nhập</Divider>
                        <Descriptions bordered column={1}>
                            <Descriptions.Item label="Lương Ngày Công">
                                {formatCurrency(viewRecord.luongNgayCong)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Lương OT">
                                {formatCurrency(viewRecord.luongOt)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Phụ Cấp">
                                {formatCurrency(viewRecord.tongPhuCap)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thưởng Doanh Số">
                                {formatCurrency(viewRecord.thuongDoanhSo)}
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider>Khoản Khấu Trừ</Divider>
                        <Descriptions bordered column={1}>
                            <Descriptions.Item label="BHXH">
                                {formatCurrency(viewRecord.khauTruBhxh)}
                            </Descriptions.Item>
                            <Descriptions.Item label="BHYT">
                                {formatCurrency(viewRecord.khauTruBhyt)}
                            </Descriptions.Item>
                            <Descriptions.Item label="BHTN">
                                {formatCurrency(viewRecord.khauTruBhtn)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Đoàn Phí">
                                {formatCurrency(viewRecord.doanPhi)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thuế TNCN">
                                {formatCurrency(viewRecord.thueTncn)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tạm Ứng">
                                {formatCurrency(viewRecord.tamUng)}
                            </Descriptions.Item>
                        </Descriptions>

                        <Card
                            style={{
                                marginTop: 16,
                                background: '#e6f7ff',
                                borderColor: '#1890ff'
                            }}
                        >
                            <div style={{ textAlign: 'center', fontSize: 18 }}>
                                <strong>THỰC LĨNH CUỐI CÙNG:</strong>{' '}
                                <span style={{ color: '#52c41a', fontSize: 24, fontWeight: 'bold' }}>
                                    {formatCurrency(viewRecord.thucLinh)}
                                </span>
                            </div>
                        </Card>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default BangLuongPage;