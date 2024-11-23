import { useEffect, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { EventDetailsDialog } from '../EventDetailsDialog';
import { useAuthContext } from '@/contexts/AuthContext';
import {EventRow} from "@/features/ics/types";
import {fetchModbusEvents} from "@/features/ics/services/modbusApi";

export const EventTable = () => {
    const [events, setEvents] = useState<EventRow[] | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<EventRow | null>(null);
    const { isLogin } = useAuthContext();

    useEffect(() => {
        const loadEvents = async () => {
            if (!isLogin) {
                setError(new Error('Please login to view events'));
                return;
            }

            try {
                const response = await fetchModbusEvents();
                if (response.success) {
                    setEvents(response.content);
                } else {
                    setError(new Error('Failed to fetch events'));
                }
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch events'));
            }
        };

        loadEvents();
    }, [isLogin]);

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

    if (!isLogin) {
        return <div className="text-center p-4">Please login to view events</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 p-4">Error: {error.message}</div>;
    }

    if (!events) {
        return <div className="text-center p-4">Loading...</div>;
    }

    return (
        <>
            <DataTable
                columns={columns}
                data={events}
                pagination
                onRowClicked={setSelectedEvent}
            />
            <EventDetailsDialog 
                event={selectedEvent} 
                onClose={() => setSelectedEvent(null)} 
            />
        </>
    );
};
