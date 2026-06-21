import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Popconfirm, message, Tag, Avatar, Tooltip, Input, Typography, Row, Col, Card } from 'antd';
import { 
    PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, EyeOutlined,
    TeamOutlined, UserAddOutlined, SolutionOutlined, UserDeleteOutlined, MailOutlined
} from '@ant-design/icons';
import nhanVienApi from '../../api/nhanVienApi';
import NhanVienForm from './NhanVienForm';
import NhanVienDetail from './NhanVienDetail';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const NhanVienList = () => {
    // --- STATE QUẢN LÝ DỮ LIỆU ---
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');

    // --- STATE QUẢN LÝ MODAL ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);

    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [detailRecord, setDetailRecord] = useState(null);

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const navigate = useNavigate();

    // --- HÀM TẢI DANH SÁCH (MẶC ĐỊNH) ---
    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await nhanVienApi.getAll();
            setData(res);
        } catch (error) {
            message.error("Lỗi tải danh sách nhân viên");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- HÀM XEM CHI TIẾT ---
    const handleViewDetail = async (id) => {
        try {
            const res = await nhanVienApi.getById(id);
            setDetailRecord(res);
            setIsDetailOpen(true);
        } catch (error) {
            message.error("Không tải được thông tin chi tiết");
        }
    };

    // --- HÀM XÓA ---
    const handleDelete = async (id) => {
        try {
            await nhanVienApi.delete(id);
            message.success("Xóa thành công");
            fetchData();
        } catch (error) {
            message.error("Xóa thất bại");
        }
    };

    // --- CẤU HÌNH CỘT BẢNG ---
    const columns = [
        {
            title: 'AVATAR',
            dataIndex: 'avatarUrl',
            key: 'avatar',
            align: 'center',
            width: 80,
            render: (url) => <Avatar src={url} shape="square" size={40} style={{ borderRadius: 8, backgroundColor: '#f0f2f5' }} icon={<UserOutlined style={{ color: '#bfbfbf' }} />} />
        },
        {
            title: 'MÃ NV',
            dataIndex: 'maNv',
            key: 'maNv',
            width: 100,
            render: (text, record) => (
                <a onClick={() => handleViewDetail(record.id)} style={{ color: '#1677ff', fontWeight: 600 }}>
                    {text}
                </a>
            )
        },
        { 
            title: 'HỌ TÊN', 
            dataIndex: 'hoTen', 
            key: 'hoTen',
            width: 180,
            render: (text) => <span style={{ color: '#333', fontWeight: 500 }}>{text}</span>
        },
        {
            title: 'PHÒNG BAN',
            dataIndex: 'tenPhongBan',
            key: 'phongBan',
            width: 150,
            render: (text) => <span style={{ color: '#595959' }}>{text || '—'}</span>
        },
        {
            title: 'CHỨC VỤ',
            dataIndex: 'tenChucVu',
            key: 'chucVu',
            width: 150,
            render: (text) => <span style={{ color: '#595959' }}>{text || '—'}</span>
        },
        {
            title: 'TRẠNG THÁI',
            dataIndex: 'trangThai',
            key: 'trangThai',
            align: 'center',
            width: 140,
            render: (status) => {
                const isWorking = status === 'DANG_LAM_VIEC';
                return (
                    <span style={{ 
                        background: isWorking ? '#e6f4ff' : '#fff1f0', 
                        color: isWorking ? '#52c41a' : '#f5222d',
                        padding: '4px 12px', 
                        borderRadius: '20px', 
                        fontSize: '12px', 
                        fontWeight: 600,
                        textTransform: 'uppercase'
                    }}>
                        {status || 'THU_VIEC'}
                    </span>
                );
            }
        },
        {
            title: 'HÀNH ĐỘNG',
            key: 'action',
            align: 'center',
            width: 120,
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Gửi Email">
                        <MailOutlined style={{ color: '#1677ff', cursor: 'pointer', fontSize: 16 }} onClick={() => navigate('/send-email', { state: { selectedEmails: [record.emailCongTy || record.emailCaNhan] } })} />
                    </Tooltip>
                    <Tooltip title="Chi tiết">
                        <EyeOutlined style={{ color: '#595959', cursor: 'pointer', fontSize: 16 }} onClick={() => handleViewDetail(record.id)} />
                    </Tooltip>
                    <Tooltip title="Sửa">
                        <EditOutlined style={{ color: '#595959', cursor: 'pointer', fontSize: 16 }} onClick={() => { setEditingRecord(record); setIsModalOpen(true); }} />
                    </Tooltip>
                    <Popconfirm title="Chắc chắn xóa?" onConfirm={() => handleDelete(record.id)}>
                        <Tooltip title="Xóa">
                            <DeleteOutlined style={{ color: '#595959', cursor: 'pointer', fontSize: 16 }} />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // Tính toán thống kê
    const totalEmployees = data.length;
    const probationEmployees = data.filter(nv => nv.trangThai === 'THU_VIEC').length;
    const resignedEmployees = data.filter(nv => nv.trangThai === 'DA_NGHI_VIEC' || nv.trangThai === 'NGHI_VIEC').length;
    // Mock số lượng mới trong tháng
    const newInMonth = Math.min(24, totalEmployees); 

    // Lọc dữ liệu theo SearchText
    const filteredData = data.filter(nv => {
        if (!searchText) return true;
        const lower = searchText.toLowerCase();
        const matchName = nv.hoTen && nv.hoTen.toLowerCase().includes(lower);
        const matchCode = nv.maNv && nv.maNv.toLowerCase().includes(lower);
        return matchName || matchCode;
    });

    return (
        <div style={{ padding: '24px', backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
            <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #f0f0f0' }}>
                
                {/* Header Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                    <div>
                        <Title level={3} style={{ margin: 0, fontWeight: 700, color: '#1f1f1f' }}>Danh Sách Nhân Viên</Title>
                        <Text style={{ color: '#595959', fontSize: 14 }}>Quản lý và theo dõi thông tin hồ sơ nhân sự hệ thống.</Text>
                    </div>
                    <Space>
                        <Input.Search
                            placeholder="Tìm theo mã NV, họ tên..."
                            allowClear
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ width: 300, height: 40 }}
                            size="large"
                        />
                        <Button
                            icon={<MailOutlined />}
                            onClick={() => {
                                const selectedEmails = data.filter(nv => selectedRowKeys.includes(nv.id)).map(nv => nv.emailCongTy || nv.emailCaNhan).filter(e => e);
                                navigate('/send-email', { state: { selectedEmails } });
                            }}
                            style={{ height: 40, borderRadius: 6, fontWeight: 500, padding: '0 20px', borderColor: '#1677ff', color: '#1677ff' }}
                        >
                            Gửi Email {selectedRowKeys.length > 0 ? `(${selectedRowKeys.length})` : ''}
                        </Button>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => { setEditingRecord(null); setIsModalOpen(true); }}
                            style={{ height: 40, borderRadius: 6, fontWeight: 500, padding: '0 20px' }}
                        >
                            Thêm Nhân Viên
                        </Button>
                    </Space>
                </div>

                {/* Data Table */}
                <Table
                    rowSelection={{
                        selectedRowKeys,
                        onChange: (newSelectedRowKeys) => setSelectedRowKeys(newSelectedRowKeys),
                    }}
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="id"
                    loading={loading}
                    pagination={{ 
                        pageSize: 10,
                        showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} trong số ${total} nhân viên`,
                        placement: ['bottomRight']
                    }}
                    style={{ marginBottom: 24 }}
                    bordered={true}
                />

                {/* Statistics Cards */}
                <Row gutter={16}>
                    <Col span={6}>
                        <Card bordered={true} style={{ borderRadius: 8, borderColor: '#e8e8e8' }} bodyStyle={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#e6f7ff', color: '#1890ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                                <TeamOutlined />
                            </div>
                            <div>
                                <div style={{ color: '#595959', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>TỔNG NHÂN VIÊN</div>
                                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1f1f1f', lineHeight: 1 }}>{totalEmployees.toLocaleString()}</div>
                            </div>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card bordered={true} style={{ borderRadius: 8, borderColor: '#e8e8e8' }} bodyStyle={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#f6ffed', color: '#52c41a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                                <UserAddOutlined />
                            </div>
                            <div>
                                <div style={{ color: '#595959', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>MỚI TRONG THÁNG</div>
                                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1f1f1f', lineHeight: 1 }}>{newInMonth}</div>
                            </div>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card bordered={true} style={{ borderRadius: 8, borderColor: '#e8e8e8' }} bodyStyle={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#fff7e6', color: '#fa8c16', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                                <SolutionOutlined />
                            </div>
                            <div>
                                <div style={{ color: '#595959', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>ĐANG THỬ VIỆC</div>
                                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1f1f1f', lineHeight: 1 }}>{probationEmployees}</div>
                            </div>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card bordered={true} style={{ borderRadius: 8, borderColor: '#e8e8e8' }} bodyStyle={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#fff1f0', color: '#f5222d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                                <UserDeleteOutlined />
                            </div>
                            <div>
                                <div style={{ color: '#595959', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>ĐÃ NGHỈ VIỆC</div>
                                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1f1f1f', lineHeight: 1 }}>{resignedEmployees}</div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* Modal Thêm/Sửa */}
            <NhanVienForm
                key={editingRecord ? editingRecord.id : 'new-form'}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onSuccess={() => { setIsModalOpen(false); fetchData(); }}
                initialValues={editingRecord}
            />

            {/* Modal Xem chi tiết */}
            <NhanVienDetail
                open={isDetailOpen}
                onCancel={() => setIsDetailOpen(false)}
                data={detailRecord}
            />
        </div>
    );
};

export default NhanVienList;