// import React, { useEffect, useState } from 'react';
// import { Table, Button, Modal, Form, Input, TimePicker, message, InputNumber, Popconfirm } from 'antd';
// import { PlusOutlined } from '@ant-design/icons';
// import dayjs from 'dayjs';
// import categoryApi from '../../api/categoryApi';

// const CaLamViecPage = () => {
//     const [data, setData] = useState([]);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [form] = Form.useForm();

//     const fetchData = async () => {
//         const res = await categoryApi.getCaLamViecs();
//         setData(res);
//     };

//     useEffect(() => { fetchData(); }, []);

//     const handleFinish = async (values) => {
//         // Convert DayJS object sang string HH:mm:ss để gửi về BE (LocalTime)
//         const payload = {
//             ...values,
//             gioVao: values.gioVao.format('HH:mm:ss'),
//             gioRa: values.gioRa.format('HH:mm:ss'),
//             nghiTruaBatDau: values.nghiTruaBatDau.format('HH:mm:ss'),
//             nghiTruaKetThuc: values.nghiTruaKetThuc.format('HH:mm:ss'),
//         };
//         await categoryApi.createCaLamViec(payload);
//         message.success("Lưu thành công");
//         setIsModalOpen(false);
//         fetchData();
//     };

//     const columns = [
//         { title: 'Tên Ca', dataIndex: 'tenCa', key: 'tenCa' },
//         { title: 'Giờ Vào', dataIndex: 'gioVao', key: 'gioVao' },
//         { title: 'Giờ Ra', dataIndex: 'gioRa', key: 'gioRa' },
//         { title: 'Nghỉ Trưa', key: 'nghi', render: (r) => `${r.nghiTruaBatDau} - ${r.nghiTruaKetThuc}` },
//         { title: 'Công Chuẩn', dataIndex: 'soCongChuan', key: 'soCongChuan' },
//         {
//             title: 'Hành động',
//             render: (r) => (
//                 <Popconfirm title="Xóa?" onConfirm={async () => {
//                     await categoryApi.deleteCaLamViec(r.id);
//                     fetchData();
//                 }}>
//                     <Button danger size="small">Xóa</Button>
//                 </Popconfirm>
//             )
//         }
//     ];

//     return (
//         <div>
//             <div style={{ marginBottom: 16 }}>
//                 <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
//                     Tạo Ca Mới
//                 </Button>
//             </div>
//             <Table dataSource={data} columns={columns} rowKey="id" />

//             <Modal title="Cấu hình Ca Làm Việc" open={isModalOpen} onCancel={() => setIsModalOpen(false)} onOk={() => form.submit()}>
//                 <Form form={form} layout="vertical" onFinish={handleFinish}>
//                     <Form.Item name="tenCa" label="Tên Ca" rules={[{ required: true }]}>
//                         <Input />
//                     </Form.Item>
//                     <div style={{ display: 'flex', gap: 10 }}>
//                         <Form.Item name="gioVao" label="Giờ Vào" rules={[{ required: true }]}>
//                             <TimePicker format="HH:mm" />
//                         </Form.Item>
//                         <Form.Item name="gioRa" label="Giờ Ra" rules={[{ required: true }]}>
//                             <TimePicker format="HH:mm" />
//                         </Form.Item>
//                     </div>
//                     <div style={{ display: 'flex', gap: 10 }}>
//                         <Form.Item name="nghiTruaBatDau" label="Nghỉ trưa từ">
//                             <TimePicker format="HH:mm" />
//                         </Form.Item>
//                         <Form.Item name="nghiTruaKetThuc" label="Đến">
//                             <TimePicker format="HH:mm" />
//                         </Form.Item>
//                     </div>
//                     <Form.Item name="soCongChuan" label="Số công tính (ví dụ 1.0)">
//                         <InputNumber step={0.1} style={{ width: '100%' }} />
//                     </Form.Item>
//                 </Form>
//             </Modal>
//         </div>
//     );
// };

// export default CaLamViecPage;




import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, TimePicker, message, InputNumber, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import categoryApi from '../../api/categoryApi';

const CaLamViecPage = () => {
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const fetchData = async () => {
        try {
            const res = await categoryApi.getCaLamViecs();
            setData(Array.isArray(res) ? res : []); // Kiểm tra an toàn mảng
        } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleFinish = async (values) => {
        // --- HÀM SỬA LỖI ---
        // Chỉ format nếu giá trị tồn tại và hợp lệ
        const safeFormat = (timeObj) => {
            if (timeObj && dayjs.isDayjs(timeObj) && timeObj.isValid()) {
                return timeObj.format('HH:mm:ss');
            }
            return null; // Trả về null nếu không chọn giờ
        };

        const payload = {
            ...values,
            gioVao: safeFormat(values.gioVao),
            gioRa: safeFormat(values.gioRa),
            nghiTruaBatDau: safeFormat(values.nghiTruaBatDau),
            nghiTruaKetThuc: safeFormat(values.nghiTruaKetThuc),
        };

        try {
            await categoryApi.createCaLamViec(payload);
            message.success("Lưu thành công");
            setIsModalOpen(false);
            form.resetFields(); // Reset form sau khi lưu thành công
            fetchData();
        } catch (error) {
            message.error("Lỗi khi lưu ca làm việc");
            console.error(error);
        }
    };

    const columns = [
        { title: 'Tên Ca', dataIndex: 'tenCa', key: 'tenCa' },
        { title: 'Giờ Vào', dataIndex: 'gioVao', key: 'gioVao' },
        { title: 'Giờ Ra', dataIndex: 'gioRa', key: 'gioRa' },
        {
            title: 'Nghỉ Trưa',
            key: 'nghi',
            render: (r) => (r.nghiTruaBatDau && r.nghiTruaKetThuc) ? `${r.nghiTruaBatDau} - ${r.nghiTruaKetThuc}` : '-'
        },
        { title: 'Công Chuẩn', dataIndex: 'soCongChuan', key: 'soCongChuan' },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, r) => (
                <Popconfirm title="Xóa?" onConfirm={async () => {
                    try {
                        await categoryApi.deleteCaLamViec(r.id);
                        message.success("Đã xóa");
                        fetchData();
                    } catch (e) {
                        message.error("Lỗi khi xóa");
                    }
                }}>
                    <Button danger size="small">Xóa</Button>
                </Popconfirm>
            )
        }
    ];

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                    setIsModalOpen(true);
                    form.resetFields(); // Reset form khi mở modal mới
                }}>
                    Tạo Ca Mới
                </Button>
            </div>
            <Table dataSource={data} columns={columns} rowKey="id" />

            <Modal
                title="Cấu hình Ca Làm Việc"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
            >
                <Form form={form} layout="vertical" onFinish={handleFinish}>
                    <Form.Item name="tenCa" label="Tên Ca" rules={[{ required: true, message: 'Vui lòng nhập tên ca' }]}>
                        <Input />
                    </Form.Item>

                    <div style={{ display: 'flex', gap: 10 }}>
                        <Form.Item name="gioVao" label="Giờ Vào" rules={[{ required: true, message: 'Chọn giờ vào' }]}>
                            <TimePicker format="HH:mm" style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item name="gioRa" label="Giờ Ra" rules={[{ required: true, message: 'Chọn giờ ra' }]}>
                            <TimePicker format="HH:mm" style={{ width: '100%' }} />
                        </Form.Item>
                    </div>

                    <div style={{ display: 'flex', gap: 10 }}>
                        <Form.Item name="nghiTruaBatDau" label="Nghỉ trưa từ">
                            <TimePicker format="HH:mm" style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item name="nghiTruaKetThuc" label="Đến">
                            <TimePicker format="HH:mm" style={{ width: '100%' }} />
                        </Form.Item>
                    </div>

                    <Form.Item name="soCongChuan" label="Số công tính (ví dụ 1.0)">
                        <InputNumber step={0.1} style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CaLamViecPage;