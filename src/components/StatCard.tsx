import React from "react";
import {Card, Statistic} from "antd";

export const StatCard: React.FC<{
    title: string;
    value: number;
    prefix: React.ReactNode;
    suffix?: string;
    color?: string;
    loading?: boolean;
    precision:number
}> = ({ title, value, prefix, suffix, color, loading,precision }) => (
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
            precision={precision}
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
