// import React, { useEffect, useState } from 'react';
// import {
//     Table, Button, Tag, Space, message, Modal, Form,
//     Select, DatePicker, Input, InputNumber, Popconfirm, Descriptions, Divider, Upload
// } from 'antd';
// import {
//     PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, UploadOutlined, FileTextOutlined
// } from '@ant-design/icons';
// import dayjs from 'dayjs';
// import axiosClient from '../../api/axiosClient'; // Import axiosClient
// import hopDongApi from '../../api/hopDongApi';
// import nhanVienApi from '../../api/nhanVienApi';

// const HopDongList = () => {
//     // --- STATE ---
//     const [data, setData] = useState([]);
//     const [nhanViens, setNhanViens] = useState([]);
//     const [loading, setLoading] = useState(false);

//     // State Modal
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [editingRecord, setEditingRecord] = useState(null);
//     const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//     const [viewRecord, setViewRecord] = useState(null);

//     // State Upload File
//     const [fileList, setFileList] = useState([]);

//     const [form] = Form.useForm();

//     // --- UTILS ---
//     const formatCurrency = (val) => {
//         if (!val) return '0 ₫';
//         return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
//     };

//     const formatDate = (dateStr) => {
//         if (!dateStr) return '';
//         return dayjs(dateStr).format('DD/MM/YYYY');
//     };

//     // --- API CALLS ---
//     const fetchData = async () => {
//         setLoading(true);
//         try {
//             const [hdRes, nvRes] = await Promise.all([
//                 hopDongApi.getAll(),
//                 nhanVienApi.getAll()
//             ]);
//             setData(Array.isArray(hdRes) ? hdRes : []);
//             setNhanViens(Array.isArray(nvRes) ? nvRes : []);
//         } catch (error) {
//             message.error("Lỗi tải dữ liệu");
//         }
//         setLoading(false);
//     };

//     useEffect(() => { fetchData(); }, []);

//     // --- HANDLERS ---

//     // Cấu hình Upload của Ant Design
//     const uploadProps = {
//         onRemove: (file) => {
//             setFileList([]);
//         },
//         beforeUpload: (file) => {
//             // Chặn upload tự động, lưu file vào state để gửi sau
//             // Lưu ý: ở đây 'file' là đối tượng File gốc của JS
//             setFileList([file]);
//             return false;
//         },
//         fileList,
//     };

//     // Hàm Lưu (Create / Update)
//     const handleSave = async (values) => {
//         try {
//             const formData = new FormData();

//             // 1. Chuẩn bị dữ liệu JSON
//             const hopDongInfo = {
//                 ...values,
//                 nhanVien: { id: values.nhanVienId },
//                 ngayHieuLuc: values.ngayHieuLuc ? values.ngayHieuLuc.format('YYYY-MM-DD') : null,
//                 ngayHetHan: values.ngayHetHan ? values.ngayHetHan.format('YYYY-MM-DD') : null,
//                 // Nếu đang sửa và không chọn file mới, giữ nguyên link cũ
//                 fileDinhKem: editingRecord?.fileDinhKem || null
//             };

//             // Append JSON (Backend Java nhận @RequestPart("hopDong"))
//             formData.append("hopDong", JSON.stringify(hopDongInfo));

//             // 2. Chuẩn bị File
//             if (fileList.length > 0) {
//                 // Lấy file thực: nếu qua onChange thì nó nằm trong originFileObj, nếu qua beforeUpload thì nó là chính nó
//                 const fileToUpload = fileList[0].originFileObj || fileList[0];
//                 formData.append("file", fileToUpload);
//             }

//             // 3. Cấu hình Header quan trọng
//             // Để 'Content-Type': undefined giúp trình duyệt tự động thêm boundary
//             const config = {
//                 headers: { 'Content-Type': undefined }
//             };

//             // 4. Gọi API
//             if (editingRecord) {
//                 await axiosClient.put(`/hop-dong/${editingRecord.id}`, formData, config);
//                 message.success("Cập nhật thành công");
//             } else {
//                 await axiosClient.post('/hop-dong', formData, config);
//                 message.success("Tạo hợp đồng thành công");
//             }

//             // Reset và load lại
//             setIsModalOpen(false);
//             setEditingRecord(null);
//             setFileList([]);
//             form.resetFields();
//             fetchData();

//         } catch (e) {
//             console.error(e);
//             message.error("Có lỗi xảy ra khi lưu (Kiểm tra log console)");
//         }
//     };

//     const handleDelete = async (id) => {
//         try {
//             await hopDongApi.delete(id);
//             message.success("Đã xóa hợp đồng");
//             fetchData();
//         } catch (error) {
//             message.error("Xóa thất bại");
//         }
//     };

//     const openEditModal = (record) => {
//         setEditingRecord(record);
//         setFileList([]); // Reset file khi mở modal

//         form.setFieldsValue({
//             ...record,
//             nhanVienId: record.nhanVien?.id,
//             ngayHieuLuc: record.ngayHieuLuc ? dayjs(record.ngayHieuLuc) : null,
//             ngayHetHan: record.ngayHetHan ? dayjs(record.ngayHetHan) : null,
//         });
//         setIsModalOpen(true);
//     };

//     const openViewModal = (record) => {
//         setViewRecord(record);
//         setIsViewModalOpen(true);
//     };

//     // --- COLUMNS ---
//     const columns = [
//         {
//             title: 'Số HĐ',
//             dataIndex: 'soHopDong',
//             key: 'soHopDong',
//             render: (text, record) => <a onClick={() => openViewModal(record)}>{text}</a>
//         },
//         {
//             title: 'Nhân Viên',
//             key: 'nhanVien',
//             render: (r) => (
//                 <div>
//                     <div style={{ fontWeight: 'bold' }}>{r.nhanVien?.hoTen || 'N/A'}</div>
//                     <div style={{ fontSize: '12px', color: '#888' }}>{r.nhanVien?.maNv}</div>
//                 </div>
//             )
//         },
//         {
//             title: 'Loại HĐ',
//             dataIndex: 'loaiHopDong',
//             render: (type) => {
//                 let color = type === 'CO_THOI_HAN' ? 'blue' : (type === 'KHONG_THOI_HAN' ? 'green' : 'orange');
//                 return <Tag color={color}>{type}</Tag>
//             }
//         },
//         {
//             title: 'Lương Cơ Bản',
//             dataIndex: 'luongCoBan',
//             align: 'right',
//             render: (val) => formatCurrency(val)
//         },
//         {
//             title: 'Thời Hạn',
//             render: (r) => (
//                 <span>
//                     {formatDate(r.ngayHieuLuc)} <br />
//                     <span style={{ color: '#999' }}>đến</span> {r.ngayHetHan ? formatDate(r.ngayHetHan) : '...'}
//                 </span>
//             )
//         },
//         {
//             title: 'Hành động',
//             key: 'action',
//             align: 'center',
//             render: (_, record) => (
//                 <Space size="small">
//                     <Button icon={<EyeOutlined />} size="small" onClick={() => openViewModal(record)} />
//                     <Button icon={<EditOutlined />} type="primary" ghost size="small" onClick={() => openEditModal(record)} />
//                     <Popconfirm title="Xóa hợp đồng này?" onConfirm={() => handleDelete(record.id)} okText="Xóa" cancelText="Hủy">
//                         <Button icon={<DeleteOutlined />} danger size="small" />
//                     </Popconfirm>
//                 </Space>
//             )
//         }
//     ];

//     return (
//         <div style={{ padding: 20 }}>
//             <div className="flex justify-between mb-4" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
//                 <h2>Quản lý Hợp Đồng Lao Động</h2>
//                 <Button type="primary" icon={<PlusOutlined />} onClick={() => {
//                     setEditingRecord(null);
//                     setFileList([]);
//                     form.resetFields();
//                     setIsModalOpen(true);
//                 }}>
//                     Tạo Hợp Đồng
//                 </Button>
//             </div>

//             <Table dataSource={data} columns={columns} rowKey="id" loading={loading} bordered />

//             {/* --- MODAL CREATE / UPDATE --- */}
//             <Modal
//                 title={editingRecord ? "Cập Nhật Hợp Đồng" : "Tạo Hợp Đồng Mới"}
//                 open={isModalOpen}
//                 onCancel={() => setIsModalOpen(false)}
//                 onOk={() => form.submit()}
//                 width={700}
//                 maskClosable={false}
//             >
//                 <Form form={form} layout="vertical" onFinish={handleSave}>
//                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
//                         <Form.Item name="soHopDong" label="Số Hợp Đồng" rules={[{ required: true }]}>
//                             <Input placeholder="VD: HĐLĐ-001" />
//                         </Form.Item>
//                         <Form.Item name="nhanVienId" label="Chọn Nhân Viên" rules={[{ required: true }]}>
//                             <Select showSearch placeholder="Tìm nhân viên..." optionFilterProp="children">
//                                 {nhanViens.map(nv => (
//                                     <Select.Option key={nv.id} value={nv.id}>{nv.maNv} - {nv.hoTen}</Select.Option>
//                                 ))}
//                             </Select>
//                         </Form.Item>
//                     </div>

//                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
//                         <Form.Item name="loaiHopDong" label="Loại Hợp Đồng" initialValue="CO_THOI_HAN" rules={[{ required: true }]}>
//                             <Select>
//                                 <Select.Option value="THU_VIEC">Thử Việc</Select.Option>
//                                 <Select.Option value="CO_THOI_HAN">Có Thời Hạn</Select.Option>
//                                 <Select.Option value="KHONG_THOI_HAN">Không Thời Hạn</Select.Option>
//                             </Select>
//                         </Form.Item>
//                         <Form.Item name="luongCoBan" label="Lương Cơ Bản" rules={[{ required: true }]}>
//                             <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\$\s?|(,*)/g, '')} addonAfter="VND" />
//                         </Form.Item>
//                     </div>

//                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
//                         <Form.Item name="luongDongBhxh" label="Lương Đóng BHXH">
//                             <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\$\s?|(,*)/g, '')} addonAfter="VND" />
//                         </Form.Item>

//                         {/* INPUT UPLOAD FILE */}
//                         <Form.Item label="File Đính Kèm (PDF/Ảnh)">
//                             <Upload {...uploadProps} maxCount={1}>
//                                 <Button icon={<UploadOutlined />}>Chọn File</Button>
//                             </Upload>

//                             {/* Link xem file cũ nếu đang Edit */}
//                             {editingRecord?.fileDinhKem && fileList.length === 0 && (
//                                 <div style={{ marginTop: 8 }}>
//                                     <a href={editingRecord.fileDinhKem} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
//                                         <FileTextOutlined /> Xem file hiện tại
//                                     </a>
//                                 </div>
//                             )}
//                         </Form.Item>
//                     </div>

//                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
//                         <Form.Item name="ngayHieuLuc" label="Ngày Hiệu Lực" rules={[{ required: true }]}>
//                             <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
//                         </Form.Item>
//                         <Form.Item name="ngayHetHan" label="Ngày Hết Hạn">
//                             <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="Để trống nếu vô thời hạn" />
//                         </Form.Item>
//                     </div>
//                 </Form>
//             </Modal>

//             {/* --- MODAL VIEW DETAIL --- */}
//             <Modal
//                 title="Chi Tiết Hợp Đồng"
//                 open={isViewModalOpen}
//                 onCancel={() => setIsViewModalOpen(false)}
//                 footer={[
//                     <Button key="close" onClick={() => setIsViewModalOpen(false)}>Đóng</Button>,
//                     <Button key="edit" type="primary" onClick={() => { setIsViewModalOpen(false); openEditModal(viewRecord); }}>Chỉnh sửa</Button>
//                 ]}
//                 width={800}
//             >
//                 {viewRecord && (
//                     <>
//                         <Descriptions title="Thông tin Hợp Đồng" bordered column={2}>
//                             <Descriptions.Item label="Số Hợp Đồng"><b>{viewRecord.soHopDong}</b></Descriptions.Item>
//                             <Descriptions.Item label="Loại Hợp Đồng"><Tag color="blue">{viewRecord.loaiHopDong}</Tag></Descriptions.Item>
//                             <Descriptions.Item label="Ngày Hiệu Lực">{formatDate(viewRecord.ngayHieuLuc)}</Descriptions.Item>
//                             <Descriptions.Item label="Ngày Hết Hạn">{viewRecord.ngayHetHan ? formatDate(viewRecord.ngayHetHan) : <Tag color="green">Vô thời hạn</Tag>}</Descriptions.Item>
//                             <Descriptions.Item label="Lương Cơ Bản"><span style={{ color: '#1677ff', fontWeight: 'bold' }}>{formatCurrency(viewRecord.luongCoBan)}</span></Descriptions.Item>
//                             <Descriptions.Item label="Lương BHXH">{viewRecord.luongDongBhxh ? formatCurrency(viewRecord.luongDongBhxh) : <i>(Theo lương CB)</i>}</Descriptions.Item>
//                             <Descriptions.Item label="File đính kèm" span={2}>
//                                 {viewRecord.fileDinhKem ? (
//                                     <a href={viewRecord.fileDinhKem} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
//                                         <FileTextOutlined style={{ fontSize: 20 }} /> Bấm để xem file
//                                     </a>
//                                 ) : "Không có file"}
//                             </Descriptions.Item>
//                         </Descriptions>
//                         <Divider orientation="left">Thông tin Nhân Viên</Divider>
//                         <a
//                             href={`https://docs.google.com/gview?url=${encodeURIComponent(viewRecord.fileDinhKem)}&embedded=true`}
//                             target="_blank"
//                             rel="noreferrer"
//                             style={{ display: 'flex', alignItems: 'center', gap: 5 }}
//                         >
//                             <FileTextOutlined style={{ fontSize: 20 }} />
//                             Bấm để xem file
//                         </a>
//                     </>
//                 )}
//             </Modal>
//         </div>
//     );
// };

// export default HopDongList;








import React, { useEffect, useState } from 'react';
import {
    Table, Button, Tag, Space, message, Modal, Form,
    Select, DatePicker, Input, InputNumber, Popconfirm, Descriptions, Divider, Upload
} from 'antd';
import {
    PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, UploadOutlined, FileTextOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import axiosClient from '../../api/axiosClient';
import hopDongApi from '../../api/hopDongApi';
import nhanVienApi from '../../api/nhanVienApi';

const HopDongList = () => {
    // --- STATE ---
    const [data, setData] = useState([]);
    const [nhanViens, setNhanViens] = useState([]);
    const [loading, setLoading] = useState(false);

    // State Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewRecord, setViewRecord] = useState(null);

    // State Upload File
    const [fileList, setFileList] = useState([]);

    const [form] = Form.useForm();

    // --- UTILS ---
    const formatCurrency = (val) => {
        if (!val) return '0 ₫';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return dayjs(dateStr).format('DD/MM/YYYY');
    };

    /**
     * HÀM MỞ FILE TRỰC TIẾP
     * Đảm bảo URL luôn có protocol để trình duyệt không nối thêm localhost
     */
    const handleViewFile = (url) => {
        if (!url) {
            message.warning("Không có file đính kèm");
            return;
        }
        let finalUrl = url.startsWith('http') ? url : `https://${url}`;
        window.open(finalUrl, '_blank', 'noopener,noreferrer');
    };

    // --- API CALLS ---
    const fetchData = async () => {
        setLoading(true);
        try {
            const [hdRes, nvRes] = await Promise.all([
                hopDongApi.getAll(),
                nhanVienApi.getAll()
            ]);
            const hdData = hdRes?.data ? hdRes.data : hdRes;
            const nvData = nvRes?.data ? nvRes.data : nvRes;

            setData(Array.isArray(hdData) ? hdData : []);
            setNhanViens(Array.isArray(nvData) ? nvData : []);
        } catch (error) {
            message.error("Lỗi tải dữ liệu");
        }
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    // --- HANDLERS ---
    const uploadProps = {
        onRemove: () => setFileList([]),
        beforeUpload: (file) => {
            setFileList([file]);
            return false;
        },
        fileList,
    };

    const handleSave = async (values) => {
        try {
            const formData = new FormData();

            // 1. Chuẩn bị dữ liệu JSON
            const hopDongInfo = {
                ...values,
                nhanVien: { id: values.nhanVienId },
                ngayHieuLuc: values.ngayHieuLuc ? values.ngayHieuLuc.format('YYYY-MM-DD') : null,
                ngayHetHan: values.ngayHetHan ? values.ngayHetHan.format('YYYY-MM-DD') : null,
                fileDinhKem: editingRecord?.fileDinhKem || null
            };

            formData.append("hopDong", JSON.stringify(hopDongInfo));

            // 2. Chuẩn bị File
            if (fileList.length > 0) {
                const fileToUpload = fileList[0].originFileObj || fileList[0];
                formData.append("file", fileToUpload);
            }

            const config = { headers: { 'Content-Type': undefined } };

            if (editingRecord) {
                await axiosClient.put(`/hop-dong/${editingRecord.id}`, formData, config);
                message.success("Cập nhật thành công");
            } else {
                await axiosClient.post('/hop-dong', formData, config);
                message.success("Tạo hợp đồng thành công");
            }

            setIsModalOpen(false);
            setEditingRecord(null);
            setFileList([]);
            form.resetFields();
            fetchData();
        } catch (e) {
            message.error("Có lỗi xảy ra khi lưu");
        }
    };

    const handleDelete = async (id) => {
        try {
            await hopDongApi.delete(id);
            message.success("Đã xóa hợp đồng");
            fetchData();
        } catch (error) {
            message.error("Xóa thất bại");
        }
    };

    const openEditModal = (record) => {
        setEditingRecord(record);
        setFileList([]);
        form.setFieldsValue({
            ...record,
            nhanVienId: record.nhanVien?.id,
            ngayHieuLuc: record.ngayHieuLuc ? dayjs(record.ngayHieuLuc) : null,
            ngayHetHan: record.ngayHetHan ? dayjs(record.ngayHetHan) : null,
        });
        setIsModalOpen(true);
    };

    const openViewModal = (record) => {
        setViewRecord(record);
        setIsViewModalOpen(true);
    };

    // --- COLUMNS ---
    const columns = [
        {
            title: 'Số HĐ',
            dataIndex: 'soHopDong',
            key: 'soHopDong',
            render: (text, record) => <Button type="link" onClick={() => openViewModal(record)} style={{ padding: 0 }}>{text}</Button>
        },
        {
            title: 'Nhân Viên',
            key: 'nhanVien',
            render: (r) => (
                <div>
                    <div style={{ fontWeight: 'bold' }}>{r.nhanVien?.hoTen || 'N/A'}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>{r.nhanVien?.maNv}</div>
                </div>
            )
        },
        {
            title: 'Loại HĐ',
            dataIndex: 'loaiHopDong',
            render: (type) => {
                let color = type === 'CO_THOI_HAN' ? 'blue' : (type === 'KHONG_THOI_HAN' ? 'green' : 'orange');
                return <Tag color={color}>{type}</Tag>
            }
        },
        {
            title: 'Lương Cơ Bản',
            dataIndex: 'luongCoBan',
            align: 'right',
            render: (val) => formatCurrency(val)
        },
        {
            title: 'Thời Hạn',
            render: (r) => (
                <span>
                    {formatDate(r.ngayHieuLuc)} <br />
                    <span style={{ color: '#999' }}>đến</span> {r.ngayHetHan ? formatDate(r.ngayHetHan) : '...'}
                </span>
            )
        },
        {
            title: 'Hành động',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Button icon={<EyeOutlined />} size="small" onClick={() => openViewModal(record)} />
                    <Button icon={<EditOutlined />} type="primary" ghost size="small" onClick={() => openEditModal(record)} />
                    <Popconfirm title="Xóa hợp đồng này?" onConfirm={() => handleDelete(record.id)} okText="Xóa" cancelText="Hủy">
                        <Button icon={<DeleteOutlined />} danger size="small" />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2>Quản lý Hợp Đồng Lao Động</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                    setEditingRecord(null);
                    setFileList([]);
                    form.resetFields();
                    setIsModalOpen(true);
                }}>
                    Tạo Hợp Đồng
                </Button>
            </div>

            <Table dataSource={data} columns={columns} rowKey="id" loading={loading} bordered />

            {/* --- MODAL CREATE / UPDATE --- */}
            <Modal
                title={editingRecord ? "Cập Nhật Hợp Đồng" : "Tạo Hợp Đồng Mới"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
                width={700}
                maskClosable={false}
            >
                <Form form={form} layout="vertical" onFinish={handleSave}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <Form.Item name="soHopDong" label="Số Hợp Đồng" rules={[{ required: true }]}>
                            <Input placeholder="VD: HĐLĐ-001" />
                        </Form.Item>
                        <Form.Item name="nhanVienId" label="Chọn Nhân Viên" rules={[{ required: true }]}>
                            <Select showSearch placeholder="Tìm nhân viên..." optionFilterProp="children">
                                {nhanViens.map(nv => (
                                    <Select.Option key={nv.id} value={nv.id}>{nv.maNv} - {nv.hoTen}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <Form.Item name="loaiHopDong" label="Loại Hợp Đồng" initialValue="CO_THOI_HAN" rules={[{ required: true }]}>
                            <Select>
                                <Select.Option value="THU_VIEC">Thử Việc</Select.Option>
                                <Select.Option value="CO_THOI_HAN">Có Thời Hạn</Select.Option>
                                <Select.Option value="KHONG_THOI_HAN">Không Thời Hạn</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="luongCoBan" label="Lương Cơ Bản" rules={[{ required: true }]}>
                            <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\$\s?|(,*)/g, '')} addonAfter="VND" />
                        </Form.Item>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <Form.Item name="luongDongBhxh" label="Lương Đóng BHXH">
                            <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\$\s?|(,*)/g, '')} addonAfter="VND" />
                        </Form.Item>

                        <Form.Item label="File Đính Kèm (PDF/Ảnh)">
                            <Upload {...uploadProps} maxCount={1}>
                                <Button icon={<UploadOutlined />}>Chọn File</Button>
                            </Upload>
                            {editingRecord?.fileDinhKem && fileList.length === 0 && (
                                <Button type="link" icon={<FileTextOutlined />} onClick={() => handleViewFile(editingRecord.fileDinhKem)}>
                                    Xem file hiện tại
                                </Button>
                            )}
                        </Form.Item>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <Form.Item name="ngayHieuLuc" label="Ngày Hiệu Lực" rules={[{ required: true }]}>
                            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                        </Form.Item>
                        <Form.Item name="ngayHetHan" label="Ngày Hết Hạn">
                            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="Để trống nếu vô thời hạn" />
                        </Form.Item>
                    </div>
                </Form>
            </Modal>

            {/* --- MODAL VIEW DETAIL --- */}
            <Modal
                title="Chi Tiết Hợp Đồng"
                open={isViewModalOpen}
                onCancel={() => setIsViewModalOpen(false)}
                footer={[
                    <Button key="close" onClick={() => setIsViewModalOpen(false)}>Đóng</Button>,
                    <Button key="edit" type="primary" onClick={() => { setIsViewModalOpen(false); openEditModal(viewRecord); }}>Chỉnh sửa</Button>
                ]}
                width={800}
            >
                {viewRecord && (
                    <>
                        <Descriptions title="Thông tin Hợp Đồng" bordered column={2}>
                            <Descriptions.Item label="Số Hợp Đồng"><b>{viewRecord.soHopDong}</b></Descriptions.Item>
                            <Descriptions.Item label="Loại Hợp Đồng"><Tag color="blue">{viewRecord.loaiHopDong}</Tag></Descriptions.Item>
                            <Descriptions.Item label="Ngày Hiệu Lực">{formatDate(viewRecord.ngayHieuLuc)}</Descriptions.Item>
                            <Descriptions.Item label="Ngày Hết Hạn">{viewRecord.ngayHetHan ? formatDate(viewRecord.ngayHetHan) : <Tag color="green">Vô thời hạn</Tag>}</Descriptions.Item>
                            <Descriptions.Item label="Lương Cơ Bản"><span style={{ color: '#1677ff', fontWeight: 'bold' }}>{formatCurrency(viewRecord.luongCoBan)}</span></Descriptions.Item>
                            <Descriptions.Item label="Lương BHXH">{viewRecord.luongDongBhxh ? formatCurrency(viewRecord.luongDongBhxh) : <i>(Theo lương CB)</i>}</Descriptions.Item>
                            <Descriptions.Item label="File đính kèm" span={2}>
                                {viewRecord.fileDinhKem ? (
                                    <Button type="link" icon={<FileTextOutlined style={{ fontSize: 20 }} />} onClick={() => handleViewFile(viewRecord.fileDinhKem)}>
                                        Bấm để xem file trực tiếp
                                    </Button>
                                ) : "Không có file"}
                            </Descriptions.Item>
                        </Descriptions>
                        <Divider orientation="left">Thông tin Nhân Viên</Divider>
                        <Descriptions bordered column={2}>
                            <Descriptions.Item label="Mã NV">{viewRecord.nhanVien?.maNv}</Descriptions.Item>
                            <Descriptions.Item label="Họ Tên">{viewRecord.nhanVien?.hoTen}</Descriptions.Item>
                        </Descriptions>
                    </>
                )}
            </Modal>
        </div>
    );
};

export default HopDongList;