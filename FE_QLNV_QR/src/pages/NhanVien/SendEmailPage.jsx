import React, { useState, useEffect, useMemo } from 'react';
import { Form, Input, Button, message, TreeSelect, Typography, Card, Spin, Space, Divider, Tag } from 'antd';
import { 
    SendOutlined, ArrowLeftOutlined, BoldOutlined, ItalicOutlined, 
    UnderlineOutlined, UnorderedListOutlined, OrderedListOutlined, 
    PaperClipOutlined, LinkOutlined, FullscreenOutlined, TeamOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import nhanVienApi from '../../api/nhanVienApi';

const { Title, Text } = Typography;

const MockRichTextEditor = ({ value, onChange, placeholder }) => (
    <div style={{ border: '1px solid #d9d9d9', borderRadius: 6, overflow: 'hidden' }}>
        <div style={{ 
            backgroundColor: '#fafafa', 
            borderBottom: '1px solid #d9d9d9', 
            padding: '8px 12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <Space size={16} style={{ color: '#595959', fontSize: 16 }}>
                <BoldOutlined style={{ cursor: 'pointer' }} />
                <ItalicOutlined style={{ cursor: 'pointer' }} />
                <UnderlineOutlined style={{ cursor: 'pointer' }} />
                <Divider type="vertical" style={{ margin: 0, height: 16, borderColor: '#bfbfbf' }} />
                <UnorderedListOutlined style={{ cursor: 'pointer' }} />
                <OrderedListOutlined style={{ cursor: 'pointer' }} />
                <Divider type="vertical" style={{ margin: 0, height: 16, borderColor: '#bfbfbf' }} />
                <PaperClipOutlined style={{ cursor: 'pointer' }} />
                <LinkOutlined style={{ cursor: 'pointer' }} />
            </Space>
            <FullscreenOutlined style={{ color: '#595959', fontSize: 16, cursor: 'pointer' }} />
        </div>
        <Input.TextArea 
            bordered={false}
            rows={12} 
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            style={{ resize: 'none', padding: '16px', boxShadow: 'none' }}
        />
    </div>
);

const SendEmailPage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [fetchingParams, setFetchingParams] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Pre-fill emails if navigated from list with selections
        if (location.state?.selectedEmails) {
            form.setFieldsValue({ toEmails: location.state.selectedEmails });
        }
        
        const fetchEmployees = async () => {
            try {
                const res = await nhanVienApi.getAll();
                // Lọc những nhân viên có email
                const validEmployees = res.filter(nv => nv.emailCongTy || nv.emailCaNhan);
                setEmployees(validEmployees);
            } catch (error) {
                message.error("Lỗi khi tải danh sách nhân viên");
            } finally {
                setFetchingParams(false);
            }
        };
        fetchEmployees();
    }, []);

    // Xử lý dữ liệu nhóm theo Phòng Ban cho TreeSelect
    const treeData = useMemo(() => {
        if (!employees || employees.length === 0) return [];
        
        const deptMap = {};
        employees.forEach(nv => {
            const deptName = nv.tenPhongBan || 'Chưa phân bổ';
            if (!deptMap[deptName]) deptMap[deptName] = [];
            deptMap[deptName].push(nv);
        });

        const tree = Object.keys(deptMap).map(dept => {
            const nvList = deptMap[dept];
            return {
                title: <span style={{ fontWeight: 600 }}>{dept} ({nvList.length} nhân sự)</span>,
                value: `DEPT_${dept}`, // prefix để không bị trùng với email
                key: `DEPT_${dept}`,
                children: nvList.map(nv => {
                    const email = nv.emailCongTy || nv.emailCaNhan;
                    return {
                        title: (
                            <Space>
                                <span style={{ color: '#1f1f1f' }}>{nv.hoTen}</span>
                                <Tag bordered={false} color="default">{nv.maNv}</Tag>
                                <span style={{ color: '#8c8c8c' }}>{email}</span>
                            </Space>
                        ),
                        value: email, // Value thực sự được gửi đi
                        key: email
                    };
                })
            };
        });

        // Tuỳ chọn "Chọn tất cả" ở ngoài cùng
        return [{
            title: <span style={{ fontWeight: 'bold', color: '#1677ff' }}>Toàn bộ công ty ({employees.length} nhân sự)</span>,
            value: 'ALL_COMPANY',
            key: 'ALL_COMPANY',
            children: tree
        }];
    }, [employees]);

    // Custom xử lý khi chọn (lọc bỏ các value là DEPT_ hoặc ALL_)
    // Ant Design TreeSelect tự động chọn children khi cha được tick nếu ta để treeCheckable = true
    // Khi form submit, values.toEmails sẽ chứa tất cả các node được tick (cả node cha và node con)
    // Ta cần lọc ra ở hàm handleSend.

    const handleSend = async () => {
        try {
            const values = await form.validateFields();
            
            // Lọc ra các email thực sự (loại bỏ các node cha DEPT_ và ALL_COMPANY)
            const actualEmails = values.toEmails.filter(val => !val.startsWith('DEPT_') && val !== 'ALL_COMPANY');

            if (actualEmails.length === 0) {
                message.warning('Không tìm thấy địa chỉ email hợp lệ nào!');
                return;
            }

            setLoading(true);
            
            await nhanVienApi.sendEmail({
                toEmails: actualEmails,
                subject: values.subject,
                content: values.content
            });
            
            message.success(`Đã gửi email thành công cho ${actualEmails.length} người nhận!`);
            form.resetFields();
            navigate('/nhan-vien');
        } catch (error) {
            if (error.errorFields) {
                return; // Validation errors
            }
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                const errMsg = errorData.message || errorData;
                message.error('Lỗi: ' + errMsg);
            } else {
                message.error('Gửi email thất bại!');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
            <div style={{ maxWidth: 900, margin: '0 auto' }}>
                <Button 
                    icon={<ArrowLeftOutlined />} 
                    onClick={() => navigate('/nhan-vien')}
                    style={{ marginBottom: 16, border: '1px solid #d9d9d9', color: '#595959', backgroundColor: '#fff' }}
                >
                    Quay lại danh sách
                </Button>
                
                <Card bordered={false} bodyStyle={{ padding: 0 }} style={{ borderRadius: 8, boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)' }}>
                    <div style={{ padding: '24px 24px 16px 24px', borderBottom: '1px solid #f0f0f0' }}>
                        <Title level={3} style={{ margin: 0, color: '#1f1f1f', fontWeight: 600 }}>Soạn Email Nội Bộ</Title>
                        <Text type="secondary" style={{ fontSize: 14 }}>Gửi thông báo, tài liệu hoặc cảnh báo cho nhân viên trong hệ thống.</Text>
                    </div>

                    <Spin spinning={fetchingParams}>
                        <Form form={form} layout="vertical" style={{ padding: '24px' }}>
                            <Form.Item
                                name="toEmails"
                                label={<span style={{ fontWeight: 500 }}>Người nhận</span>}
                                rules={[{ required: true, message: 'Vui lòng chọn ít nhất một nhân viên!' }]}
                            >
                                <TreeSelect
                                    treeData={treeData}
                                    treeCheckable={true}
                                    showCheckedStrategy={TreeSelect.SHOW_ALL}
                                    placeholder="Chọn nhân viên hoặc phòng ban..."
                                    allowClear
                                    style={{ width: '100%' }}
                                    maxTagCount={10}
                                    maxTagPlaceholder={(omittedValues) => (
                                        <Tag color="blue" style={{ margin: 0 }}>
                                            +{omittedValues.length} người khác...
                                        </Tag>
                                    )}
                                    treeDefaultExpandAll={false}
                                    treeNodeFilterProp="title"
                                    showSearch
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item
                                name="subject"
                                label={<span style={{ fontWeight: 500 }}>Tiêu đề</span>}
                                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
                            >
                                <Input placeholder="Nhập tiêu đề email" />
                            </Form.Item>

                            <Form.Item
                                name="content"
                                label={<span style={{ fontWeight: 500 }}>Nội dung</span>}
                                rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
                            >
                                <MockRichTextEditor placeholder="Nhập nội dung thông báo..." />
                            </Form.Item>
                        </Form>
                        
                        {/* Footer Section */}
                        <div style={{ 
                            padding: '16px 24px', 
                            borderTop: '1px solid #f0f0f0', 
                            backgroundColor: '#fafafa', 
                            textAlign: 'right',
                            borderBottomLeftRadius: 8,
                            borderBottomRightRadius: 8
                        }}>
                            <Button 
                                onClick={() => navigate('/nhan-vien')} 
                                style={{ marginRight: 12, height: 40, padding: '0 24px', borderRadius: 6 }}
                            >
                                Hủy bỏ
                            </Button>
                            <Button 
                                type="primary" 
                                icon={<SendOutlined />} 
                                onClick={handleSend} 
                                loading={loading}
                                style={{ height: 40, padding: '0 24px', borderRadius: 6, backgroundColor: '#005bb5' }}
                            >
                                Gửi Email
                            </Button>
                        </div>
                    </Spin>
                </Card>
            </div>
        </div>
    );
};

export default SendEmailPage;
