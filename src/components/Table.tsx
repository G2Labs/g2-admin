import React, {useState} from 'react';
import {Input, Table, Tag} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import {SearchOutlined} from "@ant-design/icons";
import {ProjectInterface} from "../types/ProjectInterface.ts";


const ProjectTable: React.FC<{ data: ProjectInterface[]; loading: boolean }> = ({data, loading}) => {

    const [searchText, setSearchText] = useState('');
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

    const columns: ColumnsType<ProjectInterface> = [
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
            title: 'Payment',
            dataIndex: 'paymentAmount',
            key: 'paymentAmount',
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
        <>
            <Input
                placeholder="Search projects or clients..."
                prefix={<SearchOutlined/>}
                onChange={(e) => setSearchText(e.target.value)}
                style={{marginBottom: '16px'}}
            />

            <Table
                columns={columns}
                dataSource={data}
                rowKey="projectId"
                scroll={{x: 'max-content'}}
                pagination={{
                    responsive: true,
                    position: ['bottomCenter'],
                    pageSize: 5,
                }}
                loading={loading}
            />

        </>


        // <Table
        //     columns={columns}
        //     dataSource={data}
        //     rowKey="projectId"
        //     scroll={{ x: 'max-content' }}
        //     pagination={{ responsive: true, position: ['bottomCenter'], pageSize: 5 }}
        //     loading={loading}
        // />
    );
}

export default ProjectTable;
