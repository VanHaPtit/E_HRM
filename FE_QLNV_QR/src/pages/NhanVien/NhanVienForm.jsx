import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, DatePicker, Select, Upload, Button, Row, Col, message, Divider } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import nhanVienApi from '../../api/nhanVienApi';
import danhMucApi from '../../api/categoryApi';

const { TextArea } = Input;

const NhanVienForm = ({ open, onCancel, onSuccess, initialValues }) => {
    const [form] = Form.useForm();
    const [phongBans, setPhongBans] = useState([]);
    const [chucVus, setChucVus] = useState([]);
    const [fileList, setFileList] = useState([]);

    // Load danh mục
    useEffect(() => {
        const fetchDanhMuc = async () => {
            try {
                const [pbRes, cvRes] = await Promise.all([
                    danhMucApi.getPhongBans(),
                    danhMucApi.getChucVus()
                ]);
                setPhongBans(pbRes);
                setChucVus(cvRes);
            } catch (error) {
                console.error("Lỗi tải danh mục:", error);
            }
        };
        fetchDanhMuc();
    }, []);

    // Fill dữ liệu khi sửa
    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue({
                ...initialValues,
                ngaySinh: initialValues.ngaySinh ? dayjs(initialValues.ngaySinh) : null,
                ngayCap: initialValues.ngayCap ? dayjs(initialValues.ngayCap) : null,
                phongBanId: initialValues.phongBanId || initialValues.phongBan?.id,
                chucVuId: initialValues.chucVuId || initialValues.chucVu?.id,
            });
        } else {
            form.resetFields();
            setFileList([]);
        }
    }, [initialValues, form]);

    const handleFinish = async (values) => {
        try {
            const nhanVienData = {
                ...values,
                phongBan: { id: values.phongBanId },
                chucVu: { id: values.chucVuId },
                ngaySinh: values.ngaySinh ? values.ngaySinh.format('YYYY-MM-DD') : null,
                ngayCap: values.ngayCap ? values.ngayCap.format('YYYY-MM-DD') : null,
            };

            // Xử lý file upload
            const fileNode = fileList.length > 0 ? fileList[0] : null;
            const file = fileNode ? (fileNode.originFileObj || fileNode) : null;

            if (initialValues?.id) {
                await nhanVienApi.update(initialValues.id, nhanVienData, file);
                message.success("Cập nhật thành công!");
            } else {
                await nhanVienApi.create(nhanVienData, file);
                message.success("Thêm mới thành công!");
                form.resetFields();
                setFileList([]);
            }
            onSuccess();
        } catch (error) {
            console.error(error);
            message.error("Có lỗi xảy ra: " + (error.response?.data || error.message));
        }
    };

    const uploadProps = {
        onRemove: () => setFileList([]),
        beforeUpload: (file) => {
            setFileList([file]);
            return false; // Chặn auto upload
        },
        fileList,
    };

    return (
        <Modal
            title={initialValues ? "Cập Nhật Hồ Sơ Nhân Viên" : "Thêm Mới Nhân Viên"}
            open={open}
            onCancel={onCancel}
            onOk={() => form.submit()}
            width={900}
            style={{ top: 20 }}
        >
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Divider orientation="left" style={{ borderColor: '#d9d9d9' }}>Thông Tin Công Việc</Divider>
                <Row gutter={16}>
                    <Col span={6}>
                        <Form.Item name="maNv" label="Mã NV" rules={[{ required: true, message: 'Nhập mã NV' }]}>
                            <Input placeholder="NV001" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="phongBanId" label="Phòng Ban" rules={[{ required: true }]}>
                            <Select placeholder="Chọn phòng ban">
                                {phongBans.map(pb => (
                                    <Select.Option key={pb.id} value={pb.id}>{pb.tenPhongBan}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="chucVuId" label="Chức Vụ" rules={[{ required: true }]}>
                            <Select placeholder="Chọn chức vụ">
                                {chucVus.map(cv => (
                                    <Select.Option key={cv.id} value={cv.id}>{cv.tenChucVu}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="trangThai" label="Trạng Thái" initialValue="DANG_LAM_VIEC">
                            <Select>
                                <Select.Option value="DANG_LAM_VIEC">Đang làm việc</Select.Option>
                                <Select.Option value="THU_VIEC">Thử việc</Select.Option>
                                <Select.Option value="DA_NGHI_VIEC">Đã nghỉ việc</Select.Option>
                                <Select.Option value="TAM_NGHI">Tạm nghỉ</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                {/* --- NHÓM 2: THÔNG TIN CÁ NHÂN --- */}
                <Divider orientation="left" style={{ borderColor: '#d9d9d9' }}>Thông Tin Cá Nhân</Divider>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item name="hoTen" label="Họ Tên" rules={[{ required: true }]}>
                            <Input placeholder="Nguyễn Văn A" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="ngaySinh" label="Ngày Sinh">
                            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="gioiTinh" label="Giới Tính">
                            <Select>
                                <Select.Option value="Nam">Nam</Select.Option>
                                <Select.Option value="Nữ">Nữ</Select.Option>
                                <Select.Option value="Khác">Khác</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item name="cccd" label="CCCD/CMND">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="ngayCap" label="Ngày Cấp">
                            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="noiCap" label="Nơi Cấp">
                            <Input placeholder="Cục CS QLHC..." />
                        </Form.Item>
                    </Col>
                </Row>
                <Divider orientation="left" style={{ borderColor: '#d9d9d9' }}>Liên Lạc</Divider>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item name="soDienThoai" label="Số Điện Thoại">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="emailCongTy" label="Email Công Ty">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="emailCaNhan" label="Email Cá Nhân">
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="diaChiThuongTru" label="Địa Chỉ Thường Trú">
                            <TextArea rows={2} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="diaChiHienTai" label="Địa Chỉ Hiện Tại">
                            <TextArea rows={2} />
                        </Form.Item>
                    </Col>
                </Row>

                {/* --- NHÓM 4: TÀI CHÍNH & KHÁC --- */}
                <Divider orientation="left" style={{ borderColor: '#d9d9d9' }}>Tài Chính & Ảnh</Divider>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item name="maSoThue" label="Mã Số Thuế">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="nganHang" label="Ngân Hàng">
                            <Input placeholder="Vietcombank, Techcombank..." />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="soTaiKhoan" label="Số Tài Khoản">
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item label="Ảnh Đại Diện (Avatar)">
                    <Upload {...uploadProps} maxCount={1} listType="picture">
                        <Button icon={<UploadOutlined />}>Chọn file ảnh</Button>
                    </Upload>
                </Form.Item>

            </Form>
        </Modal>
    );
};

export default NhanVienForm;