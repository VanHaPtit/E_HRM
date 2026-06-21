import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Statistic, Spin, Typography, List, Tag, Avatar, Table, Divider } from 'antd';
import { 
    TeamOutlined, 
    DollarCircleOutlined, 
    SolutionOutlined, 
    ClockCircleOutlined,
    WarningOutlined,
    UserDeleteOutlined,
    CalendarOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';

import nhanVienApi from '../api/nhanVienApi';
import hopDongApi from '../api/hopDongApi';
import donXinPhepApi from '../api/donXinPhepApi';
import luongApi from '../api/luongApi';
import chamCongChiTietApi from '../api/chamCongChiTietApi';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const Dashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalEmployees: 0,
        activeEmployees: 0,
        probationEmployees: 0,
        quittedEmployees: 0,
        expiringContracts: 0,
        totalPayroll: 0,
        lateToday: 0
    });
    
    const [pendingLeaves, setPendingLeaves] = useState([]);
    const [expiringContractsList, setExpiringContractsList] = useState([]);

    const fetchData = async () => {
        try {
            setLoading(true);
            
            // Gọi nhiều API cùng lúc để tổng hợp bức tranh toàn cảnh HR
            const [nvRes, hdRes, leaveRes, luongRes, chamCongRes] = await Promise.all([
                nhanVienApi.getAll().catch(() => []),
                hopDongApi.getAll().catch(() => []),
                donXinPhepApi.getAll().catch(() => []),
                luongApi.getAll().catch(() => []),
                chamCongChiTietApi.getAll().catch(() => [])
            ]);

            const employees = Array.isArray(nvRes) ? nvRes : (nvRes?.data || []);
            const contracts = Array.isArray(hdRes) ? hdRes : (hdRes?.data || []);
            const leaves = Array.isArray(leaveRes) ? leaveRes : (leaveRes?.data || []);
            const payrolls = Array.isArray(luongRes) ? luongRes : (luongRes?.data || []);
            const attendance = Array.isArray(chamCongRes) ? chamCongRes : (chamCongRes?.data || []);

            const todayStr = dayjs().format('YYYY-MM-DD');
            const currentMonth = dayjs().month() + 1;
            const currentYear = dayjs().year();

            // 1. Phân tích Nhân Sự
            const active = employees.filter(e => e.trangThai === 'DANG_LAM_VIEC').length;
            const probation = employees.filter(e => e.trangThai === 'THU_VIEC').length;
            const quitted = employees.filter(e => e.trangThai === 'DA_NGHI_VIEC').length;

            // 2. Phân tích Hợp Đồng (Hết hạn trong vòng 30 ngày)
            const thirtyDaysFromNow = dayjs().add(30, 'day');
            const expiringList = contracts.filter(c => {
                if (!c.ngayKetThuc) return false;
                const end = dayjs(c.ngayKetThuc);
                return end.isAfter(dayjs()) && end.isBefore(thirtyDaysFromNow);
            });

            // 3. Phân tích Lương (Tổng quỹ lương tháng hiện tại)
            const currentMonthPayroll = payrolls
                .filter(p => p.thang === currentMonth && p.nam === currentYear)
                .reduce((sum, p) => sum + (p.thucLinh || 0), 0);

            // 4. Phân tích Chấm Công (Hôm nay có ai đi trễ không)
            const lateTodayCount = attendance.filter(a => {
                const isToday = dayjs(a.ngay).format('YYYY-MM-DD') === todayStr;
                return isToday && a.soPhutDiTre > 0;
            }).length;

            // 5. Phân tích Đơn Xin Phép (CHỈ LẤY CHỜ DUYỆT)
            const pendingList = leaves.filter(l => l.trangThai === 'CHO_DUYET')
                                      .sort((a, b) => dayjs(b.ngayTao || b.id).valueOf() - dayjs(a.ngayTao || a.id).valueOf());

            setStats({
                totalEmployees: employees.length,
                activeEmployees: active,
                probationEmployees: probation,
                quittedEmployees: quitted,
                expiringContracts: expiringList.length,
                totalPayroll: currentMonthPayroll,
                lateToday: lateTodayCount
            });

            setPendingLeaves(pendingList);
            setExpiringContractsList(expiringList.slice(0, 5)); // Lấy 5 hợp đồng sắp hết hạn tiêu biểu

        } catch (error) {
            console.error("Lỗi khi tải dữ liệu Dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    // Columns cho bảng Đơn xin phép chờ duyệt
    const leaveColumns = [
        {
            title: 'Nhân Viên',
            dataIndex: ['nhanVien', 'hoTen'],
            key: 'tenNhanVien',
            render: (text) => <b>{text || 'Không rõ'}</b>
        },
        {
            title: 'Thời gian nghỉ',
            key: 'thoiGian',
            render: (_, r) => (
                <span>
                    Từ <b>{dayjs(r.ngayBatDau).format('DD/MM/YYYY')}</b> đến <b>{dayjs(r.ngayKetThuc).format('DD/MM/YYYY')}</b>
                </span>
            )
        },
        {
            title: 'Lý do',
            dataIndex: 'lyDo',
            key: 'lyDo',
            ellipsis: true
        },
        {
            title: 'Trạng thái',
            key: 'trangThai',
            render: () => <Tag color="orange">Chờ duyệt</Tag>
        }
    ];

    return (
        <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
            <div style={{ marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0 }}>Trung Tâm Điều Hành Nhân Sự (HR Dashboard)</Title>
                <Text type="secondary">Số liệu được tổng hợp trực tiếp theo thời gian thực | Cập nhật lúc: {dayjs().format('HH:mm DD/MM/YYYY')}</Text>
            </div>

            <Spin spinning={loading} size="large">
                
                {/* --- HÀNG 1: THỐNG KÊ TÀI CHÍNH & HOẠT ĐỘNG --- */}
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8}>
                        <Card variant="borderless" style={{ borderRadius: 10, borderLeft: '5px solid #1890ff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            <Statistic
                                title="Tổng Nhân Viên"
                                value={stats.totalEmployees}
                                prefix={<TeamOutlined />}
                                styles={{ content: { color: '#1890ff', fontWeight: 'bold' } }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Card bordered={false} style={{ borderRadius: 10, borderLeft: '5px solid #52c41a', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            <Statistic 
                                title={`Quỹ Lương Tháng ${dayjs().month() + 1}`} 
                                value={stats.totalPayroll} 
                                formatter={formatCurrency}
                                prefix={<DollarCircleOutlined style={{ color: '#52c41a' }} />} 
                                valueStyle={{ color: '#52c41a', fontWeight: 'bold' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Card bordered={false} style={{ borderRadius: 10, borderLeft: '5px solid #faad14', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            <Statistic 
                                title="Đi Trễ / Vắng Mặt Hôm Nay" 
                                value={stats.lateToday} 
                                suffix="người"
                                prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />} 
                                valueStyle={{ color: '#faad14', fontWeight: 'bold' }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* --- HÀNG 2: THỐNG KÊ CHI TIẾT NHÂN SỰ --- */}
                <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                    <Col xs={24} sm={12} md={8}>
                        <Card variant="borderless" style={{ borderRadius: 10, borderLeft: '5px solid #52c41a', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            <Statistic
                                title="Đang Làm Việc"
                                value={stats.activeEmployees}
                                prefix={<CheckCircleOutlined />}
                                styles={{ content: { color: '#52c41a', fontWeight: 'bold' } }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Card variant="borderless" style={{ borderRadius: 10, borderLeft: '5px solid #faad14', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            <Statistic
                                title="Hợp Đồng Sắp Hết Hạn"
                                value={stats.expiringContracts}
                                prefix={<ClockCircleOutlined />}
                                styles={{ content: { color: '#faad14', fontWeight: 'bold' } }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Card variant="borderless" style={{ borderRadius: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            <Statistic
                                title="Đã Nghỉ Việc"
                                value={stats.quittedEmployees}
                                prefix={<CloseCircleOutlined />}
                                styles={{ content: { color: '#f5222d', fontWeight: 'bold' } }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* --- HÀNG 3: BẢNG DỮ LIỆU --- */}
                <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                    
                    {/* BẢNG ĐƠN XIN PHÉP CHỜ DUYỆT */}
                    <Col xs={24} md={16}>
                        <Card 
                            title={
                                <div 
                                    onClick={() => navigate('/don-xin-phep')} 
                                    style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', transition: 'color 0.3s' }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#1890ff'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}
                                    title="Nhấn để đi đến Quản Lý Đơn Xin Phép"
                                >
                                    <CalendarOutlined style={{ color: '#faad14', marginRight: 8 }}/> 
                                    <span>Đơn Xin Nghỉ Phép Cần Duyệt Gấp ({pendingLeaves.length})</span>
                                </div>
                            } 
                            bordered={false} 
                            style={{ borderRadius: 10, height: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                        >
                            <Table 
                                columns={leaveColumns} 
                                dataSource={pendingLeaves} 
                                rowKey="id" 
                                pagination={{ pageSize: 5 }}
                                size="middle"
                            />
                        </Card>
                    </Col>

                    {/* DANH SÁCH HỢP ĐỒNG SẮP HẾT HẠN */}
                    <Col xs={24} md={8}>
                        <Card 
                            title="Danh sách Hợp đồng sắp hết hạn (30 ngày tới)" 
                            variant="borderless" 
                            style={{ borderRadius: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', height: '100%' }}
                        >
                            <List
                                itemLayout="horizontal"
                                dataSource={expiringContractsList}
                                renderItem={item => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<Avatar style={{ backgroundColor: '#eb2f96' }}>{item.hoTen ? item.hoTen.charAt(0) : (item.nhanVien?.hoTen ? item.nhanVien.hoTen.charAt(0) : '!')}</Avatar>}
                                            title={<b>{item.hoTen || item.nhanVien?.hoTen || "Không rõ"}</b>}
                                            description={
                                                <div>
                                                    <span style={{ color: '#888' }}>Số HĐ: {item.soHopDong}</span><br/>
                                                    <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
                                                        Hết hạn: {dayjs(item.ngayKetThuc).format('DD/MM/YYYY')}
                                                    </span>
                                                </div>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                            {expiringContractsList.length === 0 && <Text type="secondary">Không có hợp đồng nào sắp hết hạn.</Text>}
                        </Card>
                    </Col>
                </Row>
            </Spin>
        </div>
    );
};

export default Dashboard;