'use client';
import React, { use } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { Fetchmobus } from '@/utils/cs/fetchmobus';
import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"


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
    const [datas, setDatas] = useState<EventRow[] | null>(null);
    const [error, setError] = useState<any>(null);
    const [selectedRow, setSelectedRow] = useState<EventRow | null>(null); // Store selected row

    useEffect(() => {
        Fetchmobus()
            .then(response => setDatas(response.content))
            .catch(err => setError(err));
    }, []);

    const columns: TableColumn<EventRow>[] = [
        {
            name: 'Event ID',
            selector: (row) => row.event_id,
            sortable: true,
            width: '150px',
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

    if (error) return <div>Error: {error.message}</div>;
    if (!datas) return <div>Loading...</div>;

    return (
        <>
            <DataTable
                columns={columns}
                data={datas}
                pagination
                onRowClicked={(row) => setSelectedRow(row)} // Set the clicked row
            />

            {/* Dialog to display selected row details */}
            {selectedRow && (
                <Dialog open={Boolean(selectedRow)} onOpenChange={() => setSelectedRow(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Event Details</DialogTitle>
                        </DialogHeader>
                        <DialogDescription>
                            <p><strong>Event ID:</strong> {selectedRow.event_id}</p>
                            <p><strong>Device ID:</strong> {selectedRow.device_id}</p>
                            <p><strong>Timestamp:</strong> {selectedRow.timestamp}</p>
                            <p><strong>Event Type:</strong> {selectedRow.event_type}</p>
                            <p><strong>Source IP:</strong> {selectedRow.source_ip}</p>
                            <p><strong>Destination IP:</strong> {selectedRow.destination_ip}</p>
                            <p><strong>Modbus Function:</strong> {selectedRow.modbus_function}</p>
                            <p><strong>Modbus Data:</strong> {selectedRow.modbus_data}</p>
                            <p><strong>Alert:</strong> {selectedRow.alert}</p>
                            {/* Add other fields as necessary */}
                        </DialogDescription>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}
