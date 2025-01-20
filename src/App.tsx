import React, { useState, useEffect } from 'react';
import {
    Table,
    Card,
    Row,
    Col,
    Tag,
    Input,
    Space,
    Typography,
    Statistic
} from 'antd';
import {
    SearchOutlined,
    DollarCircleOutlined,
    CheckCircleOutlined,
    SyncOutlined,
    RiseOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

interface ProjectData {
    projectId: string;
    projectName: string;
    clientName: string;
    projectCost: string;
    profitMargin: string;
    paymentAmount: string;
    profit: string;
    paymentReceived: string;
    outstanding: string;
    paymentStatus: string;
    notes: string;
}

const StatCard: React.FC<{
    title: string;
    value: number;
    prefix: React.ReactNode;
    suffix?: string;
    color?: string;
    loading?: boolean;
}> = ({ title, value, prefix, suffix, color, loading }) => (
    <Card
        hoverable
        className="stat-card"
        style={{
            borderRadius: '12px',
            transition: 'all 0.3s ease',
        }}
    >
        <Statistic
            title={<span style={{ fontSize: '16px', color: '#666' }}>{title}</span>}
            value={value}
            precision={2}
            prefix={prefix}
            suffix={suffix}
            loading={loading}
            valueStyle={{
                color: color || '#1890ff',
                fontSize: '24px',
                fontWeight: 'bold',
            }}
        />
    </Card>
);

const App: React.FC = () => {
    const [data, setData] = useState<ProjectData[]>([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch data from the Google Apps Script endpoint
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('https://script.google.com/macros/s/AKfycbxIyVGZGNKY7uQZvrfBzyDenFg_aJtd3eMoGLr47hzkSWYSmyNmIOuncNrk5_5f3JzJDg/exec');
                const result = await response.json();

                if (response.ok) {
                    setData(result);
                } else {
                    throw new Error(result.message || 'Failed to fetch data');
                }
            } catch (err: any) {
                setError(err.message || 'An error occurred while fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Calculate totals
    const totalProfit = data.reduce((acc, curr) =>
        acc + Number(curr.profit.replace('Rs.', '').replace(',', '').replace('.00', '')), 0
    );

    const totalOutstanding = data.reduce((acc, curr) =>
        acc + Number(curr.outstanding.replace('Rs.', '').replace(',', '').replace('.00', '')), 0
    );

    const totalBusiness = data.reduce((acc, curr) =>
        acc + Number(curr.paymentAmount.replace('Rs.', '').replace(',', '').replace('.00', '')), 0
    );

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid':
                return 'success';
            case 'partial':
                return 'warning';
            case 'pending':
                return 'error';
            default:
                return 'default';
        }
    };

    const columns: ColumnsType<ProjectData> = [
        {
            title: 'Project ID',
            dataIndex: 'projectId',
            key: 'projectId',
            fixed: 'left',
            width: 100,
        },
        {
            title: 'Project Name',
            dataIndex: 'projectName',
            key: 'projectName',
            filteredValue: [searchText],
            onFilter: (value, record) => {
                return String(record.projectName)
                        .toLowerCase()
                        .includes(String(value).toLowerCase()) ||
                    String(record.clientName)
                        .toLowerCase()
                        .includes(String(value).toLowerCase());
            },
        },
        {
            title: 'Client',
            dataIndex: 'clientName',
            key: 'clientName',
        },
        {
            title: 'Cost',
            dataIndex: 'projectCost',
            key: 'projectCost',
            responsive: ['md'],
        },
        {
            title: 'Profit(%)',
            dataIndex: 'profitMargin',
            key: 'profitMargin',
            responsive: ['lg'],
        },
        {
            title: 'Profit',
            dataIndex: 'profit',
            key: 'profit',
            responsive: ['lg'],
        },
        {
            title: 'Received',
            dataIndex: 'paymentReceived',
            key: 'paymentReceived',
        },
        {
            title: 'Outstanding',
            dataIndex: 'outstanding',
            key: 'outstanding',
        },
        {
            title: 'Status',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
            render: (status: string) => (
                <Tag color={getStatusColor(status)}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
    ];

    return (
        <div style={{ padding: '16px' }}>
            <Title level={2}>Project Dashboard</Title>

            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title="Total Projects"
                        value={data.length}
                        prefix={<CheckCircleOutlined style={{ fontSize: '24px' }} />}
                        color="#1890ff"
                        loading={loading}
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title="Total Business"
                        value={totalBusiness}
                        prefix={<RiseOutlined style={{ fontSize: '24px' }} />}
                        color="#52c41a"
                        loading={loading}
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title="Total Profit"
                        value={totalProfit}
                        prefix={<DollarCircleOutlined style={{ fontSize: '24px' }} />}
                        color="#722ed1"
                        loading={loading}
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title="Total Outstanding"
                        value={totalOutstanding}
                        prefix={<SyncOutlined style={{ fontSize: '24px' }} />}
                        color={totalOutstanding > 0 ? '#cf1322' : '#3f8600'}
                        loading={loading}
                    />
                </Col>
            </Row>

            {error && <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}

            <Space direction="vertical" style={{ width: '100%' }}>
                <Input
                    placeholder="Search projects or clients..."
                    prefix={<SearchOutlined />}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ marginBottom: '16px' }}
                />

                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="projectId"
                    scroll={{ x: 'max-content' }}
                    pagination={{
                        responsive: true,
                        position: ['bottomCenter'],
                        pageSize: 5,
                    }}
                />
            </Space>

            <style>
                {`
          .stat-card {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            border: none;
          }
          
          .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          }
          
          .ant-statistic-title {
            margin-bottom: 8px !important;
          }
          
          .ant-card-body {
            padding: 24px !important;
          }
          
          @media (max-width: 576px) {
            .ant-card-body {
              padding: 16px !important;
            }
            
            .ant-statistic-content-value {
              font-size: 20px !important;
            }
          }
        `}
            </style>
        </div>
    );
};

export default App;
