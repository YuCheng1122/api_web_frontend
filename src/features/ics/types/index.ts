export interface EventRow {
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
