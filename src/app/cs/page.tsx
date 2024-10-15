'use client';
import React, { use } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { Fetchmobus } from '@/utils/cs/fetchmobus';
import { useEffect, useState } from 'react';

interface EventRow {
    event_id: string;
    device_id: string;
    timestamp: string;
    event_type: string;
    source_ip: string;
    source_port: number;
    destination_ip: string;
    destination_port: number;
    modbus_function: number;
    modbus_data: string;
    alert: string;
    register: number;
    error_code: string;
}

export default function EventTable() {
    const columns: TableColumn<EventRow>[] = [
        {
            name: 'Event ID',
            selector: (row) => row.event_id,
            sortable: true,
            width: '150px', // 控制寬度
        },
        {
            name: 'Device ID',
            selector: (row) => row.device_id,
            sortable: true,
            width: '120px',
        },
        {
            name: 'Timestamp',
            selector: (row) => row.timestamp,
            sortable: true,
            width: '180px',
        },
        {
            name: 'Event Type',
            selector: (row) => row.event_type,
            sortable: true,
            width: '120px',
        },
        {
            name: 'Source IP',
            selector: (row) => row.source_ip,
            sortable: true,
            width: '120px',
        },
        {
            name: 'Source Port',
            selector: (row) => row.source_port,
            sortable: true,
            right: true,
            width: '100px',
        },
        {
            name: 'Destination IP',
            selector: (row) => row.destination_ip,
            sortable: true,
            width: '100px',
        },
        {
            name: 'Destination Port',
            selector: (row) => row.destination_port,
            sortable: true,
            right: true,
            width: '100px',
        },
        {
            name: 'Modbus Function',
            selector: (row) => row.modbus_function,
            sortable: true,
            width: '100px',
        },
        {
            name: 'Modbus Data',
            selector: (row) => row.modbus_data,
            sortable: true,
            width: '100px',
        },
        {
            name: 'Alert',
            selector: (row) => row.alert,
            sortable: true,
            width: '100px',
        },

    ];
    const [datas, setDatas] = useState<EventRow[] | null>(null);
    const [error, setError] = useState<any>(null);
    useEffect(() => {
        Fetchmobus()
            .then(response => setDatas(response.content))
            .catch(err => setError(err));

    }, []);
    if (error) return <div>Error: {error.message}</div>;
    if (!datas) return <div>Loading...</div>;
    //

    const data: EventRow[] = [
        {
            event_id: "1udlhZIBNMPh6DH01RV5",
            device_id: "device123",
            timestamp: "2024-10-10T00:00:00+00:00",
            event_type: "modbus",
            source_ip: "192.168.1.10",
            source_port: 502,
            destination_ip: "192.168.1.100",
            destination_port: 502,
            modbus_function: 3,
            modbus_data: "0x001F",
            alert: "Modbus Unauthorized Access",
            register: 40001,
            error_code: "ILLEGAL_DATA_VALUE",
        },
    ];

    return (
        <DataTable
            columns={columns}
            data={datas}
            pagination
        />
    );
}
