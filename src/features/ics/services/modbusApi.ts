import axios from 'axios';
import Cookies from 'js-cookie';
import { EventRow } from '../types';

interface ModbusResponse {
    success: boolean;
    content: EventRow[];
}

export const fetchModbusEvents = async (): Promise<ModbusResponse> => {
    const token = Cookies.get('token');
    if (!token) {
        return {
            success: false,
            content: []
        };
    }

    try {
        const response = await axios.get<ModbusResponse>('/api/modbus/events', {
            headers: {
                'Authorization': token
            }
        });

        return response.data;
    } catch (error: any) {
        console.error('Error fetching modbus events:', error);
        return {
            success: false,
            content: []
        };
    }
};
