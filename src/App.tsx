import React, { useState, useEffect } from 'react';
import {
    Row,
    Col,
    Space,
    Typography,
} from 'antd';
import {
    DollarCircleOutlined,
    CheckCircleOutlined,
    SyncOutlined,
    RiseOutlined
} from '@ant-design/icons';
import './App.css'
import { StatCard } from "./components/StatCard.tsx";
import ProjectTable from "./components/Table.tsx";
import { ProjectInterface } from "./types/ProjectInterface.ts";

const { Title } = Typography;

const App: React.FC = () => {
    const [data, setData] = useState<ProjectInterface[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch data from the Google Apps Script endpoint
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('https://script.google.com/macros/s/AKfycbx6LZtblbYf7oDxzVBd45pAhoEqpjRH9VIz_Sq8s_qvMcu8YCw9tFp8Axad4VvR2DUHhw/exec');
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

    // Function to remove non-numeric characters and convert to number
    const parseCurrency = (value: string): number => {
        return parseFloat(value.replace('Rs.', '').replace(',', '').replace('.00', '').trim());
    };

    // Calculate totals
    const totalOutstanding = data.reduce((acc, curr) => acc + parseCurrency(curr.outstanding), 0);
    const totalBusiness = data.reduce((acc, curr) => acc + parseCurrency(curr.paymentAmount), 0);

    // Calculate Current Profit (only for projects where outstanding is Rs. 0)
    const currentProfit = data
        .filter((project) => parseCurrency(project.outstanding) === 0)
        .reduce((acc, project) => acc + parseCurrency(project.profit), 0);

    // Calculate Projected Profit (for all projects)
    const projectedProfit = data.reduce((acc, project) => acc + parseCurrency(project.profit), 0);

    return (
        <div style={{ padding: '16px' }}>
            <Title level={2}>Project Dashboard</Title>

            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                {/* Total Projects */}
                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title="Total Projects"
                        value={data.length}
                        prefix={<CheckCircleOutlined style={{ fontSize: '24px' }} />}
                        color="#1890ff"
                        loading={loading}
                        precision={0}
                    />
                </Col>

                {/* Total Business */}
                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title="Total Business"
                        value={totalBusiness}
                        prefix={<RiseOutlined style={{ fontSize: '24px' }} />}
                        color="#52c41a"
                        loading={loading}
                        precision={2}
                    />
                </Col>

                {/* Current Profit */}
                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title="Current Profit"
                        value={currentProfit}
                        prefix={<DollarCircleOutlined style={{ fontSize: '24px' }} />}
                        color="#2db7f5"
                        loading={loading}
                        precision={2}
                    />
                </Col>

                {/* Projected Profit */}
                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title="Projected Profit"
                        value={projectedProfit}
                        prefix={<DollarCircleOutlined style={{ fontSize: '24px' }} />}
                        color="#faad14"
                        loading={loading}
                        precision={2}
                    />
                </Col>

                {/* Total Outstanding */}
                <Col xs={24} sm={12} lg={6}>
                    <StatCard
                        title="Total Outstanding"
                        value={totalOutstanding}
                        prefix={<SyncOutlined style={{ fontSize: '24px' }} />}
                        color={totalOutstanding > 0 ? '#cf1322' : '#3f8600'}
                        loading={loading}
                        precision={2}
                    />
                </Col>


            </Row>


            {/*{error && <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}*/}

            <Space direction="vertical" style={{ width: '100%' }}>
                <ProjectTable data={data} loading={loading} />
            </Space>

        </div>
    );
};

export default App;
