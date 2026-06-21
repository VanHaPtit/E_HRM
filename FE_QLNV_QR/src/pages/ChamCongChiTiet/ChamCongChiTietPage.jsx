// import React, { useEffect, useState } from 'react';
// import {
//     Table, Button, Modal, Form, Select, DatePicker, TimePicker,
//     message, Popconfirm, Space, Tag, Card, Row, Col, InputNumber
// } from 'antd';
// import { PlusOutlined, EditOutlined, DeleteOutlined, SyncOutlined } from '@ant-design/icons';
// import dayjs from 'dayjs';

// import chamCongChiTietApi from '../../api/chamCongChiTietApi';
// import nhanVienApi from '../../api/nhanVienApi';
// // Không cần caLamViecApi nữa vì DB không có trường này

// const ChamCongChiTietPage = () => {
//     const [data, setData] = useState([]);
//     const [nhanViens, setNhanViens] = useState([]);
//     const [loading, setLoading] = useState(false);

//     // State Modal
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [editingRecord, setEditingRecord] = useState(null);

//     // Filters
//     const [filterMonth, setFilterMonth] = useState(null);
//     const [filterNhanVien, setFilterNhanVien] = useState(null);

//     const [form] = Form.useForm();

//     // --- HELPER FORMAT ---
//     // Format giờ từ chuỗi HH:mm:ss hoặc Date object
//     const formatTimeDisplay = (val) => {
//         if (!val) return '-';
//         if (dayjs.isDayjs(val)) return val.format('HH:mm');
//         if (typeof val === 'string') {
//             // Cắt chuỗi HH:mm:ss -> HH:mm cho gọn
//             return val.substring(0, 5);
//         }
//         return '-';
//     };

//     const formatSafeTimeSubmit = (val) => {
//         return (val && dayjs.isDayjs(val) && val.isValid()) ? val.format('HH:mm:ss') : null;
//     };

//     // --- FETCH DATA ---
//     const fetchData = async () => {
//         setLoading(true);
//         try {
//             // Load danh sách nhân viên để chọn
//             if (nhanViens.length === 0) {
//                 const nvRes = await nhanVienApi.getAll();
//                 setNhanViens(Array.isArray(nvRes) ? nvRes : []);
//             }

//             const res = await chamCongChiTietApi.getAll();
//             let list = Array.isArray(res) ? res : [];

//             // Filter Client-side
//             if (filterMonth) {
//                 list = list.filter(item => dayjs(item.ngay).isSame(filterMonth, 'month'));
//             }
//             if (filterNhanVien) {
//                 list = list.filter(item => item.nhanVien?.id === filterNhanVien);
//             }

//             setData(list);
//         } catch (error) {
//             console.error("Fetch error:", error);
//             message.error("Lỗi tải dữ liệu chấm công");
//         }
//         setLoading(false);
//     };

//     useEffect(() => {
//         fetchData();
//     }, [filterMonth, filterNhanVien]);

//     // --- SAVE ---
//     const handleSave = async (values) => {
//         try {
//             const payload = {
//                 // Mapping các trường theo đúng DB
//                 nhanVien: { id: values.nhanVienId },
//                 ngay: values.ngay ? values.ngay.format('YYYY-MM-DD') : null,

//                 gioCheckIn: formatSafeTimeSubmit(values.gioCheckIn),
//                 gioCheckOut: formatSafeTimeSubmit(values.gioCheckOut),

//                 loaiNgay: values.loaiNgay, // ENUM
//                 congThuong: values.congThuong || 0,
//                 gioTangCa: values.gioTangCa || 0,

//                 soPhutDiTre: values.soPhutDiTre || 0,
//                 soPhutVeSom: values.soPhutVeSom || 0,
//             };

//             if (editingRecord) {
//                 await chamCongChiTietApi.update(editingRecord.id, payload);
//                 message.success("Cập nhật thành công");
//             } else {
//                 await chamCongChiTietApi.create(payload);
//                 message.success("Thêm mới thành công");
//             }

//             setIsModalOpen(false);
//             setEditingRecord(null);
//             form.resetFields();
//             fetchData();
//         } catch (error) {
//             console.error(error);
//             message.error("Lỗi khi lưu dữ liệu");
//         }
//     };

//     const handleDelete = async (id) => {
//         try {
//             await chamCongChiTietApi.delete(id);
//             message.success("Đã xóa");
//             fetchData();
//         } catch (error) {
//             message.error("Xóa thất bại");
//         }
//     };

//     const openEditModal = (record) => {
//         setEditingRecord(record);
//         // Fill data vào form
//         form.setFieldsValue({
//             nhanVienId: record.nhanVien?.id,
//             ngay: record.ngay ? dayjs(record.ngay) : null,

//             // Xử lý TimePicker
//             gioCheckIn: record.gioCheckIn ? dayjs(record.gioCheckIn, 'HH:mm:ss') : null,
//             gioCheckOut: record.gioCheckOut ? dayjs(record.gioCheckOut, 'HH:mm:ss') : null,

//             loaiNgay: record.loaiNgay,
//             congThuong: record.congThuong,
//             gioTangCa: record.gioTangCa,
//             soPhutDiTre: record.soPhutDiTre,
//             soPhutVeSom: record.soPhutVeSom,
//         });
//         setIsModalOpen(true);
//     };

//     // --- COLUMNS ---
//     const columns = [
//         {
//             title: 'Ngày',
//             dataIndex: 'ngay',
//             width: 100,
//             render: (txt) => txt ? dayjs(txt).format('DD/MM/YYYY') : '-'
//         },
//         {
//             title: 'Nhân viên',
//             key: 'nhanVien',
//             width: 180,
//             render: (r) => (
//                 <div>
//                     <b>{r.nhanVien?.hoTen}</b>
//                     <div style={{ fontSize: 12, color: '#888' }}>{r.nhanVien?.maNv}</div>
//                 </div>
//             )
//         },
//         {
//             title: 'Loại ngày',
//             dataIndex: 'loaiNgay',
//             width: 120,
//             render: (val) => {
//                 let color = 'default';
//                 if (val === 'NGAY_LE' || val === 'NGAY_TET') color = 'red';
//                 if (val === 'NGAY_NGHI') color = 'orange';
//                 if (val === 'NGAY_THUONG') color = 'blue';
//                 return <Tag color={color}>{val}</Tag>
//             }
//         },
//         {
//             title: 'Thời gian',
//             children: [
//                 {
//                     title: 'In',
//                     dataIndex: 'gioCheckIn',
//                     width: 80,
//                     align: 'center',
//                     render: (t) => <span style={{ color: 'green' }}>{formatTimeDisplay(t)}</span>
//                 },
//                 {
//                     title: 'Out',
//                     dataIndex: 'gioCheckOut',
//                     width: 80,
//                     align: 'center',
//                     render: (t) => <span style={{ color: '#faad14' }}>{formatTimeDisplay(t)}</span>
//                 }
//             ]
//         },
//         {
//             title: 'Công',
//             children: [
//                 { title: 'Công', dataIndex: 'congThuong', width: 60, align: 'center' },
//                 { title: 'OT', dataIndex: 'gioTangCa', width: 60, align: 'center' },
//             ]
//         },
//         {
//             title: 'Vi phạm (phút)',
//             children: [
//                 {
//                     title: 'Trễ',
//                     dataIndex: 'soPhutDiTre',
//                     width: 60,
//                     align: 'center',
//                     render: (v) => v > 0 ? <Tag color="error">{v}</Tag> : '-'
//                 },
//                 {
//                     title: 'Sớm',
//                     dataIndex: 'soPhutVeSom',
//                     width: 60,
//                     align: 'center',
//                     render: (v) => v > 0 ? <Tag color="warning">{v}</Tag> : '-'
//                 }
//             ]
//         },
//         {
//             title: 'Hành động',
//             key: 'action',
//             width: 100,
//             align: 'center',
//             render: (_, record) => (
//                 <Space size="small">
//                     <Button icon={<EditOutlined />} type="primary" ghost size="small" onClick={() => openEditModal(record)} />
//                     <Popconfirm title="Xóa?" onConfirm={() => handleDelete(record.id)}>
//                         <Button icon={<DeleteOutlined />} danger size="small" />
//                     </Popconfirm>
//                 </Space>
//             )
//         }
//     ];

//     return (
//         <div style={{ padding: 20 }}>
//             <Card title="Chi Tiết Chấm Công" variant="borderless">
//                 {/* FILTER TOOLBAR */}
//                 <Row gutter={16} style={{ marginBottom: 16 }}>
//                     <Col span={6}>
//                         <DatePicker picker="month" style={{ width: '100%' }} placeholder="Lọc theo tháng" value={filterMonth} onChange={setFilterMonth} />
//                     </Col>
//                     <Col span={8}>
//                         <Select
//                             allowClear showSearch optionFilterProp="children"
//                             placeholder="Lọc theo nhân viên" style={{ width: '100%' }}
//                             onChange={setFilterNhanVien}
//                         >
//                             {nhanViens.map(nv => (
//                                 <Select.Option key={nv.id} value={nv.id}>{nv.maNv} - {nv.hoTen}</Select.Option>
//                             ))}
//                         </Select>
//                     </Col>
//                     <Col span={10} style={{ textAlign: 'right' }}>
//                         <Space>
//                             {/* Nút Thêm mới */}
//                             <Button
//                                 type="primary"
//                                 icon={<PlusOutlined />}
//                                 onClick={() => {
//                                     setEditingRecord(null);
//                                     form.resetFields();
//                                     form.setFieldsValue({
//                                         ngay: dayjs(),
//                                         loaiNgay: 'NGAY_THUONG',
//                                         congThuong: 1,
//                                         gioTangCa: 0,
//                                         soPhutDiTre: 0,
//                                         soPhutVeSom: 0
//                                     });
//                                     setIsModalOpen(true);
//                                 }}
//                             >
//                                 Thêm mới
//                             </Button>

//                             {/* Nút Tạo phiên điểm danh mới */}
//                             <Button
//                                 icon={<SyncOutlined />}
//                                 onClick={() => {
//                                     // Xử lý logic tạo phiên mới tại đây
//                                     console.log("Tạo phiên điểm danh mới");
//                                     // handleCreateSession(); // Giả sử bạn có hàm này
//                                 }}
//                             >
//                                 Tạo phiên điểm danh mới
//                             </Button>
//                         </Space>
//                     </Col>
//                 </Row>

//                 <Table
//                     dataSource={data}
//                     columns={columns}
//                     rowKey="id"
//                     loading={loading}
//                     bordered
//                     scroll={{ x: 1000 }} // Cho phép cuộn ngang vì bảng nhiều cột
//                     pagination={{ pageSize: 10 }}
//                 />
//             </Card>

//             {/* MODAL FORM */}
//             <Modal
//                 open={isModalOpen}
//                 title={editingRecord ? "Cập nhật dữ liệu" : "Thêm dữ liệu chấm công"}
//                 onCancel={() => setIsModalOpen(false)}
//                 onOk={() => form.submit()}
//                 width={800}
//             >
//                 <Form form={form} layout="vertical" onFinish={handleSave}>
//                     <Row gutter={16}>
//                         <Col span={12}>
//                             <Form.Item name="nhanVienId" label="Nhân viên" rules={[{ required: true, message: 'Chọn nhân viên' }]}>
//                                 <Select showSearch optionFilterProp="children">
//                                     {nhanViens.map(nv => (
//                                         <Select.Option key={nv.id} value={nv.id}>{nv.maNv} - {nv.hoTen}</Select.Option>
//                                     ))}
//                                 </Select>
//                             </Form.Item>
//                         </Col>
//                         <Col span={12}>
//                             <Form.Item name="ngay" label="Ngày" rules={[{ required: true }]}>
//                                 <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
//                             </Form.Item>
//                         </Col>
//                     </Row>

//                     <Row gutter={16}>
//                         <Col span={8}>
//                             <Form.Item name="loaiNgay" label="Loại ngày" rules={[{ required: true }]}>
//                                 <Select>
//                                     <Select.Option value="NGAY_THUONG">Ngày thường</Select.Option>
//                                     <Select.Option value="NGAY_NGHI">Ngày nghỉ</Select.Option>
//                                     <Select.Option value="NGAY_LE">Ngày lễ</Select.Option>
//                                     <Select.Option value="NGAY_TET">Ngày tết</Select.Option>
//                                 </Select>
//                             </Form.Item>
//                         </Col>
//                         <Col span={8}>
//                             <Form.Item name="gioCheckIn" label="Check In">
//                                 <TimePicker style={{ width: '100%' }} format="HH:mm:ss" />
//                             </Form.Item>
//                         </Col>
//                         <Col span={8}>
//                             <Form.Item name="gioCheckOut" label="Check Out">
//                                 <TimePicker style={{ width: '100%' }} format="HH:mm:ss" />
//                             </Form.Item>
//                         </Col>
//                     </Row>

//                     <Row gutter={16}>
//                         <Col span={6}>
//                             <Form.Item name="congThuong" label="Công thường">
//                                 <InputNumber style={{ width: '100%' }} step={0.5} min={0} />
//                             </Form.Item>
//                         </Col>
//                         <Col span={6}>
//                             <Form.Item name="gioTangCa" label="Giờ tăng ca">
//                                 <InputNumber style={{ width: '100%' }} step={0.5} min={0} />
//                             </Form.Item>
//                         </Col>
//                         <Col span={6}>
//                             <Form.Item name="soPhutDiTre" label="Phút đi trễ">
//                                 <InputNumber style={{ width: '100%' }} min={0} />
//                             </Form.Item>
//                         </Col>
//                         <Col span={6}>
//                             <Form.Item name="soPhutVeSom" label="Phút về sớm">
//                                 <InputNumber style={{ width: '100%' }} min={0} />
//                             </Form.Item>
//                         </Col>
//                     </Row>
//                 </Form>
//             </Modal>
//         </div>
//     );
// };

// export default ChamCongChiTietPage;







import React, { useEffect, useState } from 'react';
import {
    Table, Button, Modal, Form, Select, DatePicker, TimePicker,
    message, Popconfirm, Space, Tag, Card, Row, Col, InputNumber,
    Avatar, Breadcrumb, Typography
} from 'antd';
import {
    PlusOutlined, EditOutlined, DeleteOutlined,
    SyncOutlined, QrcodeOutlined, WifiOutlined
} from '@ant-design/icons';

const getInitials = (name) => {
    if (!name) return 'NV';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};
import dayjs from 'dayjs';
import axios from 'axios'; // Đảm bảo đã cài axios: npm install axios

import chamCongChiTietApi from '../../api/chamCongChiTietApi';
import nhanVienApi from '../../api/nhanVienApi';

const ChamCongChiTietPage = () => {
    const [data, setData] = useState([]);
    const [nhanViens, setNhanViens] = useState([]);
    const [loading, setLoading] = useState(false);

    // State cho CRUD thông thường
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);

    // --- STATE MỚI CHO QR CODE ---
    const [isSessionModalOpen, setIsSessionModalOpen] = useState(false); // Modal nhập giờ
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);           // Modal hiện QR (Cho Admin)
    const [qrImage, setQrImage] = useState("");                          // Lưu chuỗi Base64
    const [sessionForm] = Form.useForm();                                // Form riêng cho session

    const [isScanModalOpen, setIsScanModalOpen] = useState(false);       // Modal quét QR (Cho User)
    const [scanToken, setScanToken] = useState("");                      // Lưu Token quét được
    const [scanningLoading, setScanningLoading] = useState(false);

    const [filterMonth, setFilterMonth] = useState(null);
    const [filterNhanVien, setFilterNhanVien] = useState(null);
    const [form] = Form.useForm();

    const userRoles = JSON.parse(localStorage.getItem("user_roles") || "[]");
    const isAdminOrHR = userRoles.includes("ADMIN") || userRoles.includes("HR");

    // Xác định trạng thái Check-in / Check-out hôm nay (Lấy bản ghi mới nhất trong ngày)
    const currentUserId = localStorage.getItem("user_id");
    const todayRecord = [...data].reverse().find(item => 
        dayjs(item.ngay).isSame(dayjs(), 'day') && 
        (item.nhanVienId === Number(currentUserId) || item.nhanVien?.id === Number(currentUserId))
    );
    const isCheckedIn = todayRecord && todayRecord.gioCheckIn && !todayRecord.gioCheckOut;

    // --- LOGIC QR CODE & SESSION ---

    // 1. Gửi cấu hình phiên lên Server
    const handleStartSession = async (values) => {
        const token = localStorage.getItem('token');
        console.log("Token kiểm tra trước khi gửi:", token);

        if (!token) {
            message.error("Không tìm thấy mã xác thực. Hãy đăng nhập lại!");
            return;
        }

        try {
            const payload = {
                gioBatDauCauHinh: values.gioBatDau.format('HH:mm:ss'),
                gioKetThucCauHinh: values.gioKetThuc.format('HH:mm:ss'),
                loaiNgay: values.loaiNgay,
            };

            // Gửi bằng axios kèm Header thủ công
            await axios.post('http://localhost:8080/api/attendance/start', payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            message.success("Đã mở phiên thành công!");
            setIsSessionModalOpen(false);
            setIsQRModalOpen(true);
        } catch (error) {
            console.error("Chi tiết lỗi 401:", error.response);
            message.error("Bạn không có quyền Admin hoặc Token hết hạn!");
        }
    };

    // 2. Lấy mã QR từ Server
    // 2. Lấy mã QR từ Server
    const fetchQRCode = async () => {
        try {
            // Lấy token ra
            const token = localStorage.getItem('token');

            // KIỂM TRA: Nếu không có token thì không gọi API để tránh lỗi 401
            if (!token) {
                console.error("Token bị null, hãy đăng nhập lại!");
                return;
            }

            // Gửi request phải kèm theo headers giống như handleStartSession
            const res = await axios.get('http://localhost:8080/api/attendance/get-qr', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Backend trả về chuỗi Base64 trực tiếp
            setQrImage(`data:image/png;base64,${res.data}`);

        } catch (err) {
            console.error("Không thể lấy mã QR", err);
            if (err.response?.status === 401) {
                message.error("Phiên đăng nhập hết hạn (QR)");
            }
        }
    };

    // 3. Tự động làm mới QR mỗi 7 giây khi Modal đang mở
    useEffect(() => {
        let interval;
        if (isQRModalOpen) {
            fetchQRCode();
            interval = setInterval(fetchQRCode, 7000);
        }
        return () => clearInterval(interval);
    }, [isQRModalOpen]);

    // 4. Xử lý khi quét được QR (cho Nhân viên)
    const handleScanQRSubmit = async () => {
        if (!scanToken) {
            message.warning("Vui lòng nhập mã quét được từ QR");
            return;
        }
        setScanningLoading(true);
        try {
            const userId = localStorage.getItem('user_id');
            if(!userId) {
                message.error("Vui lòng đăng nhập lại để sử dụng tính năng này!");
                return;
            }
            await chamCongChiTietApi.scanQR(userId, scanToken);
            message.success("Chấm công bằng QR thành công!");
            setIsScanModalOpen(false);
            setScanToken("");
            fetchData();
        } catch (error) {
            message.error(error?.response?.data?.message || "Lỗi chấm công QR");
        }
        setScanningLoading(false);
    };

    // 5. Tự động load thư viện quét QR Camera từ CDN khi mở Modal
    useEffect(() => {
        if (isScanModalOpen) {
            if (!window.Html5QrcodeScanner) {
                const script = document.createElement("script");
                script.src = "https://unpkg.com/html5-qrcode";
                script.async = true;
                script.onload = () => initScanner();
                document.body.appendChild(script);
            } else {
                initScanner();
            }
        } else {
            // Khi đóng modal, dọn dẹp scanner
            if (window.html5QrcodeScanner) {
                window.html5QrcodeScanner.clear().catch(e => console.error("Lỗi khi tắt camera:", e));
            }
        }
    }, [isScanModalOpen]);

    const initScanner = () => {
        if (document.getElementById("qr-reader")) {
            window.html5QrcodeScanner = new window.Html5QrcodeScanner(
                "qr-reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
                false
            );
            window.html5QrcodeScanner.render(
                (decodedText) => {
                    setScanToken(decodedText);
                    // Có thể auto submit ở đây luôn:
                    // handleAutoSubmit(decodedText);
                    message.success("Đã quét mã thành công, vui lòng bấm Gửi!");
                    if (window.html5QrcodeScanner) {
                        window.html5QrcodeScanner.clear();
                    }
                },
                (error) => {
                    // Ignore error khi đang tìm mã
                }
            );
        }
    };

    // --- LOGIC CRUD CŨ (GIỮ NGUYÊN) ---
    const formatTimeDisplay = (val) => {
        if (!val) return '-';
        if (dayjs.isDayjs(val)) return val.format('HH:mm');
        if (typeof val === 'string') return val.substring(0, 5);
        return '-';
    };

    const formatSafeTimeSubmit = (val) => {
        return (val && dayjs.isDayjs(val) && val.isValid()) ? val.format('HH:mm:ss') : null;
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            if (nhanViens.length === 0) {
                const nvRes = await nhanVienApi.getAll();
                setNhanViens(Array.isArray(nvRes) ? nvRes : []);
            }
            const res = await chamCongChiTietApi.getAll();
            let list = Array.isArray(res) ? res : [];
            if (filterMonth) list = list.filter(item => dayjs(item.ngay).isSame(filterMonth, 'month'));
            if (filterNhanVien) list = list.filter(item => item.nhanVien?.id === filterNhanVien);
            setData(list);
        } catch (error) {
            message.error("Lỗi tải dữ liệu chấm công");
        }
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, [filterMonth, filterNhanVien]);

    const handleSave = async (values) => {
        try {
            const payload = {
                nhanVien: { id: values.nhanVienId },
                ngay: values.ngay ? values.ngay.format('YYYY-MM-DD') : null,
                gioCheckIn: formatSafeTimeSubmit(values.gioCheckIn),
                gioCheckOut: formatSafeTimeSubmit(values.gioCheckOut),
                loaiNgay: values.loaiNgay,
                congThuong: values.congThuong || 0,
                gioTangCa: values.gioTangCa || 0,
                soPhutDiTre: values.soPhutDiTre || 0,
                soPhutVeSom: values.soPhutVeSom || 0,
            };
            if (editingRecord) {
                await chamCongChiTietApi.update(editingRecord.id, payload);
                message.success("Cập nhật thành công");
            } else {
                await chamCongChiTietApi.create(payload);
                message.success("Thêm mới thành công");
            }
            setIsModalOpen(false);
            setEditingRecord(null);
            form.resetFields();
            fetchData();
        } catch (error) {
            message.error("Lỗi khi lưu dữ liệu");
        }
    };

    const handleDelete = async (id) => {
        try {
            await chamCongChiTietApi.delete(id);
            message.success("Đã xóa");
            fetchData();
        } catch (error) {
            message.error("Xóa thất bại");
        }
    };

    const openEditModal = (record) => {
        setEditingRecord(record);
        form.setFieldsValue({
            nhanVienId: record.nhanVienId || record.nhanVien?.id,
            ngay: record.ngay ? dayjs(record.ngay) : null,
            gioCheckIn: record.gioCheckIn ? dayjs(record.gioCheckIn, 'HH:mm:ss') : null,
            gioCheckOut: record.gioCheckOut ? dayjs(record.gioCheckOut, 'HH:mm:ss') : null,
            loaiNgay: record.loaiNgay,
            congThuong: record.congThuong,
            gioTangCa: record.gioTangCa,
            soPhutDiTre: record.soPhutDiTre,
            soPhutVeSom: record.soPhutVeSom,
        });
        setIsModalOpen(true);
    };

    const columns = [
        {
            title: 'NGÀY',
            dataIndex: 'ngay',
            width: 100,
            render: (txt) => txt ? dayjs(txt).format('DD/MM/YYYY') : '—'
        },
        {
            title: 'NHÂN VIÊN',
            key: 'nhanVien',
            width: 220,
            render: (r) => {
                const name = r.hoTen || r.nhanVien?.hoTen;
                const code = r.maNv || r.nhanVien?.maNv;
                const initials = name ? getInitials(name) : 'NV';
                let color = '#1890ff';
                if (initials.includes('H')) color = '#1890ff';
                if (initials.includes('V')) color = '#52c41a';
                if (initials.includes('C')) color = '#fa8c16';
                
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Avatar style={{ backgroundColor: color, color: '#fff', flexShrink: 0 }}>{initials}</Avatar>
                        <div style={{ minWidth: 0 }}>
                            <div style={{ color: '#333', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
                            <div style={{ fontSize: '12px', color: '#1890ff' }}>{code}</div>
                        </div>
                    </div>
                );
            }
        },
        {
            title: 'LOẠI NGÀY',
            dataIndex: 'loaiNgay',
            width: 130,
            render: (val) => {
                let bg = '#f5f5f5';
                let color = '#595959';
                if (val === 'NGAY_LE') { bg = '#fff1f0'; color = '#f5222d'; }
                if (val === 'NGAY_TET') { bg = '#fff7e6'; color = '#fa8c16'; }
                if (val === 'NGAY_NGHI') { bg = '#fffbe6'; color = '#faad14'; }
                if (val === 'NGAY_THUONG') { bg = '#e6f7ff'; color = '#1890ff'; }
                return <span style={{ background: bg, color: color, padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>{val}</span>;
            }
        },
        {
            title: 'THỜI GIAN',
            children: [
                {
                    title: 'In',
                    dataIndex: 'gioCheckIn',
                    width: 80,
                    align: 'center',
                    render: (t) => t ? <span style={{ color: '#52c41a', fontWeight: 500 }}>{formatTimeDisplay(t)}</span> : '—'
                },
                {
                    title: 'Out',
                    dataIndex: 'gioCheckOut',
                    width: 80,
                    align: 'center',
                    render: (t) => t ? <span style={{ color: '#fa8c16', fontWeight: 500 }}>{formatTimeDisplay(t)}</span> : '—'
                }
            ]
        },
        {
            title: 'CÔNG',
            dataIndex: 'congThuong',
            width: 80,
            align: 'center',
            render: (v) => v || '—'
        },
        {
            title: 'VI PHẠM (PHÚT)',
            children: [
                {
                    title: 'Trễ',
                    dataIndex: 'soPhutDiTre',
                    width: 70,
                    align: 'center',
                    render: (v) => v > 0 ? <span style={{ color: '#f5222d' }}>{v}</span> : '—'
                },
                {
                    title: 'Sớm',
                    dataIndex: 'soPhutVeSom',
                    width: 70,
                    align: 'center',
                    render: (v) => v > 0 ? <span style={{ color: '#f5222d' }}>{v}</span> : '—'
                }
            ]
        }
    ];

    if (isAdminOrHR) {
        columns.push({
            title: 'HÀNH ĐỘNG',
            key: 'action',
            width: 100,
            align: 'center',
            render: (_, record) => (
                <Space size="middle">
                    <EditOutlined style={{ color: '#1890ff', cursor: 'pointer', fontSize: '16px' }} onClick={() => openEditModal(record)} />
                    <Popconfirm title="Xóa?" onConfirm={() => handleDelete(record.id)}>
                        <DeleteOutlined style={{ color: '#ff4d4f', cursor: 'pointer', fontSize: '16px' }} />
                    </Popconfirm>
                </Space>
            )
        });
    }

    return (
        <div style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
            <div style={{ background: '#fff', borderRadius: '8px', padding: '24px', minHeight: 'calc(100vh - 48px)' }}>
                {/* HEADER ROW */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                    <div>
                        <Breadcrumb
                            items={[
                                { title: 'Dashboard' },
                                { title: <span style={{ color: '#1890ff' }}>Chi Tiết Chấm Công</span> },
                            ]}
                            style={{ marginBottom: '8px' }}
                        />
                        <Typography.Title level={2} style={{ margin: 0, fontWeight: 600 }}>
                            Chi Tiết Chấm Công
                        </Typography.Title>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-end' }}>
                        <Space>
                            {isAdminOrHR && (
                                <>
                                    <Button
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        onClick={() => {
                                            setEditingRecord(null);
                                            form.resetFields();
                                            form.setFieldsValue({
                                                ngay: dayjs(),
                                                loaiNgay: 'NGAY_THUONG',
                                                congThuong: 1,
                                                gioTangCa: 0,
                                                soPhutDiTre: 0,
                                                soPhutVeSom: 0
                                            });
                                            setIsModalOpen(true);
                                        }}
                                        style={{ fontWeight: 500 }}
                                    >
                                        Thêm mới
                                    </Button>
                                    <Button
                                        icon={<SyncOutlined />}
                                        onClick={() => setIsSessionModalOpen(true)}
                                        style={{ color: '#1890ff', borderColor: '#1890ff', fontWeight: 500 }}
                                    >
                                        Tạo phiên điểm danh mới
                                    </Button>
                                </>
                            )}
                            <Button
                                type={isCheckedIn ? "primary" : "default"}
                                danger={isCheckedIn}
                                icon={<QrcodeOutlined />}
                                onClick={() => setIsScanModalOpen(true)}
                                style={{ fontWeight: 500 }}
                            >
                                Quét mã QR {isCheckedIn ? "Check Out" : "Check In"}
                            </Button>
                        </Space>
                        <Button
                            type="primary"
                            style={isCheckedIn ? { backgroundColor: '#faad14', borderColor: '#faad14', fontWeight: 500 } : { backgroundColor: '#237804', borderColor: '#237804', fontWeight: 500 }}
                            icon={<WifiOutlined />}
                            onClick={async () => {
                                try {
                                    const userId = localStorage.getItem('user_id');
                                    if(!userId) {
                                        message.error("Vui lòng đăng nhập lại để sử dụng tính năng này!");
                                        return;
                                    }
                                    await chamCongChiTietApi.ipCheckin(userId);
                                    message.success(`Đã ${isCheckedIn ? 'Check Out' : 'Check In'} bằng IP thành công!`);
                                    fetchData();
                                } catch (error) {
                                    message.error(error?.response?.data?.message || "Lỗi chấm công IP");
                                }
                            }}
                        >
                            {isCheckedIn ? "Check Out bằng WIFI" : "Check In bằng WIFI"}
                        </Button>
                    </div>
                </div>

                {/* FILTER TOOLBAR */}
                <div style={{ border: '1px solid #d9d9d9', borderRadius: '8px', padding: '16px 24px', marginBottom: '24px' }}>
                    <Row gutter={24} align="bottom">
                        <Col span={6}>
                            <div style={{ marginBottom: 8, color: '#595959', fontSize: 13 }}>Lọc theo tháng</div>
                            <DatePicker picker="month" style={{ width: '100%', borderRadius: 6 }} placeholder="Tháng 01/2025" value={filterMonth} onChange={setFilterMonth} format="[Tháng] MM/YYYY" />
                        </Col>
                        {isAdminOrHR && (
                            <Col span={8}>
                                <div style={{ marginBottom: 8, color: '#595959', fontSize: 13 }}>Lọc theo nhân viên</div>
                                <Select
                                    allowClear showSearch optionFilterProp="children"
                                    placeholder="Tất cả nhân viên" style={{ width: '100%', borderRadius: 6 }}
                                    onChange={setFilterNhanVien}
                                    value={filterNhanVien}
                                >
                                    {nhanViens.map(nv => (
                                        <Select.Option key={nv.id} value={nv.id}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span>{nv.hoTen}</span>
                                                <span style={{ color: '#888', fontSize: 12 }}>{nv.maNv}</span>
                                            </div>
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Col>
                        )}
                        <Col span={10}>
                            <Button type="link" onClick={() => { setFilterMonth(null); setFilterNhanVien(null); }} style={{ padding: 0, marginBottom: 4 }}>
                                Xóa lọc
                            </Button>
                        </Col>
                    </Row>
                </div>

                <Table
                    dataSource={data}
                    columns={columns}
                    rowKey="id"
                    loading={loading}
                    bordered
                    scroll={{ x: 1000 }}
                    pagination={{ pageSize: 10, showTotal: (total, range) => `Hiển thị ${range[0]} - ${range[1]} của ${total} bản ghi` }}
                />
            </div>

            {/* MODAL 1: SETUP PHIÊN (Giờ vào/ra) */}
            <Modal
                title="Cấu hình phiên điểm danh QR"
                open={isSessionModalOpen}
                onCancel={() => setIsSessionModalOpen(false)}
                onOk={() => sessionForm.submit()}
                okText="Bắt đầu tạo QR"
            >
                <Form form={sessionForm} layout="vertical" onFinish={handleStartSession}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="gioBatDau" label="Giờ vào quy định" rules={[{ required: true }]}>
                                <TimePicker format="HH:mm" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="gioKetThuc" label="Giờ ra quy định" rules={[{ required: true }]}>
                                <TimePicker format="HH:mm" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="loaiNgay" label="Loại ngày phiên" initialValue="NGAY_THUONG">
                        <Select>
                            <Select.Option value="NGAY_THUONG">Ngày thường</Select.Option>
                            <Select.Option value="NGAY_LE">Ngày lễ</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            {/* MODAL 2: HIỂN THỊ QR ĐỘNG (Cho Admin) */}
            <Modal
                title={<span><QrcodeOutlined /> Mã QR Điểm Danh (Làm mới sau 7s)</span>}
                open={isQRModalOpen}
                onCancel={() => setIsQRModalOpen(false)}
                footer={[<Button key="close" onClick={() => setIsQRModalOpen(false)}>Đóng</Button>]}
                centered
            >
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    {qrImage ? (
                        <img src={qrImage} alt="QR" style={{ width: 300, border: '1px solid #f0f0f0' }} />
                    ) : "Đang tải mã..."}
                    <div style={{ marginTop: 10, color: '#888' }}>Vui lòng dùng điện thoại quét mã này</div>
                </div>
            </Modal>

            {/* MODAL 3: NHẬP MÃ QR CAMERA (Cho Nhân viên) */}
            <Modal
                title={<span><QrcodeOutlined /> Quét Mã QR Qua Camera</span>}
                open={isScanModalOpen}
                onCancel={() => setIsScanModalOpen(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsScanModalOpen(false)}>Hủy</Button>,
                    <Button key="submit" type="primary" loading={scanningLoading} onClick={handleScanQRSubmit}>Gửi</Button>
                ]}
                centered
            >
                <div style={{ padding: '10px 0', textAlign: 'center' }}>
                    <div id="qr-reader" style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}></div>
                    <p style={{ color: '#888', marginTop: 15 }}>
                        Hãy hướng camera vào mã QR hiển thị trên màn hình của Quản lý / Máy tính.
                    </p>
                    {scanToken && (
                        <div style={{ marginTop: 15, padding: 10, background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 4 }}>
                            <b style={{ color: '#52c41a' }}>Đã quét thành công!</b>
                            <div style={{ fontSize: 12, color: '#888', wordBreak: 'break-all' }}>{scanToken}</div>
                        </div>
                    )}
                </div>
            </Modal>

            {/* MODAL CRUD FORM CŨ (GIỮ NGUYÊN) */}
            <Modal
                open={isModalOpen}
                title={editingRecord ? "Cập nhật dữ liệu" : "Thêm dữ liệu chấm công"}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
                width={800}
            >
                <Form form={form} layout="vertical" onFinish={handleSave}>
                    {/* ... các Form Item cũ của bạn ... */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="nhanVienId" label="Nhân viên" rules={[{ required: true, message: 'Chọn nhân viên' }]}>
                                <Select showSearch optionFilterProp="children">
                                    {nhanViens.map(nv => (
                                        <Select.Option key={nv.id} value={nv.id}>{nv.maNv} - {nv.hoTen}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="ngay" label="Ngày" rules={[{ required: true }]}>
                                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="loaiNgay" label="Loại ngày" rules={[{ required: true }]}>
                                <Select>
                                    <Select.Option value="NGAY_THUONG">Ngày thường</Select.Option>
                                    <Select.Option value="NGAY_NGHI">Ngày nghỉ</Select.Option>
                                    <Select.Option value="NGAY_LE">Ngày lễ</Select.Option>
                                    <Select.Option value="NGAY_TET">Ngày tết</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="gioCheckIn" label="Check In">
                                <TimePicker style={{ width: '100%' }} format="HH:mm:ss" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="gioCheckOut" label="Check Out">
                                <TimePicker style={{ width: '100%' }} format="HH:mm:ss" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={6}>
                            <Form.Item name="congThuong" label="Công thường">
                                <InputNumber style={{ width: '100%' }} step={0.5} min={0} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="gioTangCa" label="Giờ tăng ca">
                                <InputNumber style={{ width: '100%' }} step={0.5} min={0} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="soPhutDiTre" label="Phút đi trễ">
                                <InputNumber style={{ width: '100%' }} min={0} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="soPhutVeSom" label="Phút về sớm">
                                <InputNumber style={{ width: '100%' }} min={0} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default ChamCongChiTietPage;