import React from 'react';
import { Modal, Descriptions, Tag, Avatar, Image } from 'antd';
import dayjs from 'dayjs';

const NhanVienDetail = ({ open, onCancel, data }) => {
    if (!data) return null;

    return (
        <Modal
            title="Chi Tiết Nhân Viên"
            open={open}
            onCancel={onCancel}
            footer={null} // Không cần nút OK/Cancel vì chỉ xem
            width={800}
        >
            <div style={{ display: 'flex', marginBottom: 20, gap: 20 }}>
                {/* Hiển thị Avatar lớn */}
                <div>
                    <Image
                        width={150}
                        src={data.avatarUrl || "https://via.placeholder.com/150"}
                        fallback="https://via.placeholder.com/150"
                    />
                </div>

                {/* Thông tin chính dạng bảng */}
                <div style={{ flex: 1 }}>
                    <Descriptions bordered column={2}>
                        <Descriptions.Item label="Mã NV">{data.maNv}</Descriptions.Item>
                        <Descriptions.Item label="Họ Tên">
                            <b>{data.hoTen}</b>
                        </Descriptions.Item>

                        <Descriptions.Item label="Phòng Ban">
                            {data.tenPhongBan || "N/A"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Chức Vụ">
                            {data.tenChucVu || "N/A"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày Sinh">
                            {data.ngaySinh ? dayjs(data.ngaySinh).format('DD/MM/YYYY') : ''}
                        </Descriptions.Item>
                        <Descriptions.Item label="Giới Tính">{data.gioiTinh}</Descriptions.Item>

                        <Descriptions.Item label="Email Cty">{data.emailCongTy}</Descriptions.Item>
                        <Descriptions.Item label="SĐT">{data.soDienThoai}</Descriptions.Item>

                        <Descriptions.Item label="CCCD">{data.cccd}</Descriptions.Item>
                        <Descriptions.Item label="Ngày cấp">
                            {data.ngayCap ? dayjs(data.ngayCap).format('DD/MM/YYYY') : ''}
                        </Descriptions.Item>

                        <Descriptions.Item label="Trạng Thái">
                            <Tag color={data.trangThai === 'DANG_LAM_VIEC' ? 'green' : 'red'}>
                                {data.trangThai}
                            </Tag>
                        </Descriptions.Item>
                    </Descriptions>
                </div>
            </div>

            {/* Thông tin bổ sung */}
            <Descriptions title="Thông tin tài khoản & Địa chỉ" bordered column={1}>
                <Descriptions.Item label="Địa chỉ thường trú">{data.diaChiThuongTru}</Descriptions.Item>
                <Descriptions.Item label="Địa chỉ hiện tại">{data.diaChiHienTai}</Descriptions.Item>
                <Descriptions.Item label="Ngân hàng">
                    {data.nganHang} - STK: {data.soTaiKhoan}
                </Descriptions.Item>
                <Descriptions.Item label="Mã số thuế">{data.maSoThue}</Descriptions.Item>
            </Descriptions>
        </Modal>
    );
};

export default NhanVienDetail;