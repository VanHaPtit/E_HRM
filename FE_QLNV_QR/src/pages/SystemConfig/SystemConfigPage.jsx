import React, { useEffect, useState } from 'react';
import { Card, Form, InputNumber, Button, message, Row, Col, Divider, Spin, TimePicker } from 'antd';
import { SaveOutlined, SettingOutlined } from '@ant-design/icons';
import systemConfigApi from '../../api/systemConfigApi';
import dayjs from 'dayjs';

const SystemConfigPage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        setLoading(true);
        try {
            const data = await systemConfigApi.getConfig();
            form.setFieldsValue({
                ...data,
                gioVaoLam: data.gioVaoLam ? dayjs(data.gioVaoLam, 'HH:mm:ss') : null,
                gioRaLam: data.gioRaLam ? dayjs(data.gioRaLam, 'HH:mm:ss') : null,
            });
        } catch (error) {
            message.error("Lỗi khi tải cấu hình hệ thống");
        }
        setLoading(false);
    };

    const handleSave = async (values) => {
        setSaving(true);
        try {
            const payload = {
                ...values,
                gioVaoLam: values.gioVaoLam ? values.gioVaoLam.format('HH:mm:ss') : null,
                gioRaLam: values.gioRaLam ? values.gioRaLam.format('HH:mm:ss') : null,
            };
            await systemConfigApi.updateConfig(payload);
            message.success("Lưu cấu hình thành công!");
        } catch (error) {
            message.error("Lỗi khi lưu cấu hình");
        }
        setSaving(false);
    };

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: 100 }}><Spin size="large" /></div>;
    }

    return (
        <div style={{ padding: 20, maxWidth: 1000, margin: '0 auto' }}>
            <Card title={<span><SettingOutlined /> Cài đặt Tham số Tính lương & Chấm công</span>} bordered={false}>
                <Form form={form} layout="vertical" onFinish={handleSave}>
                    
                    <Divider orientation="left">1. Cấu hình Công Chuẩn</Divider>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="soNgayCongChuan" label="Số ngày công chuẩn/tháng" rules={[{ required: true }]}>
                                <InputNumber min={1} max={31} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="soGioMotNgay" label="Số giờ làm việc/ngày" rules={[{ required: true }]}>
                                <InputNumber min={1} max={24} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="heSoOtNgayThuong" label="Hệ số OT ngày thường" rules={[{ required: true }]}>
                                <InputNumber min={1} step={0.1} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="gioVaoLam" label="Giờ Bắt Đầu Làm Việc (Mặc định)" rules={[{ required: true }]}>
                                <TimePicker format="HH:mm" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="gioRaLam" label="Giờ Kết Thúc Làm Việc (Mặc định)" rules={[{ required: true }]}>
                                <TimePicker format="HH:mm" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left">2. Cấu hình Mức Phạt (VNĐ)</Divider>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="tien_phat_tre_it_hon_15p" label="Phạt đi trễ < 15 phút" rules={[{ required: true }]}>
                                <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="tien_phat_tre_nhieu_hon_15p" label="Phạt đi trễ >= 15 phút" rules={[{ required: true }]}>
                                <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="tienPhatVeSom" label="Phạt về sớm" rules={[{ required: true }]}>
                                <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="tien_phat_nghi_khong_phep" label="Phạt nghỉ không phép (1 ngày)" rules={[{ required: true }]}>
                                <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left">3. Cấu hình Bảo Hiểm & Thuế</Divider>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="bhxhPercent" label="% Trừ BHXH" rules={[{ required: true }]}>
                                <InputNumber min={0} max={1} step={0.01} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="bhytPercent" label="% Trừ BHYT" rules={[{ required: true }]}>
                                <InputNumber min={0} max={1} step={0.01} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="bhtnPercent" label="% Trừ BHTN" rules={[{ required: true }]}>
                                <InputNumber min={0} max={1} step={0.01} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="giamTruBanThan" label="Giảm trừ gia cảnh bản thân (VNĐ)" rules={[{ required: true }]}>
                                <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="giamTruNguoiPhuThuoc" label="Giảm trừ gia cảnh / 1 Người phụ thuộc (VNĐ)" rules={[{ required: true }]}>
                                <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item style={{ textAlign: 'right', marginTop: 20 }}>
                        <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={saving}>
                            Lưu Cấu Hình
                        </Button>
                    </Form.Item>

                </Form>
            </Card>
        </div>
    );
};

export default SystemConfigPage;
