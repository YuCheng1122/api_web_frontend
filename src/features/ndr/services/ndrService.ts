import { 
    NDRAuthResponse, 
    NDRLoginCredentials, 
    NDRDeviceInfo, 
    NDREventsResponse, 
    NDRDeviceListResponse,
    NDRTopBlocking
} from '../types/ndr';

const NDR_API_BASE = 'https://iacast.wnc.com.tw/api';

export const ndrService = {
    login: async (credentials: NDRLoginCredentials): Promise<NDRAuthResponse> => {
        const response = await fetch(`${NDR_API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        return response.json();
    },

    getDeviceInfo: async (token: string, deviceUuid: string): Promise<NDRDeviceInfo[]> => {
        const response = await fetch(`${NDR_API_BASE}/security/device/info?deviceUuid=${deviceUuid}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch device info');
        }

        return response.json();
    },

    getEvents: async (token: string, deviceUuid: string, from: number, to: number, page: number = 0, size: number = 20): Promise<NDREventsResponse> => {
        const response = await fetch(
            `${NDR_API_BASE}/security/events/nids?deviceUuid=${deviceUuid}&from=${from}&to=${to}&page=${page}&size=${size}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch events');
        }

        return response.json();
    },

    getTopBlocking: async (token: string, deviceUuid: string, from: number, to: number, severity: number): Promise<NDRTopBlocking[]> => {
        const response = await fetch(
            `${NDR_API_BASE}/security/topblocking?deviceUuid=${deviceUuid}&from=${from}&to=${to}&severity=${severity}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch top blocking');
        }

        return response.json();
    },

    listDeviceInfos: async (token: string, customerId: string, pageSize: number = 10, page: number = 0): Promise<NDRDeviceListResponse> => {
        const response = await fetch(
            `${NDR_API_BASE}/customer/${customerId}/deviceInfos?pageSize=${pageSize}&page=${page}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch device infos');
        }

        return response.json();
    }
};
