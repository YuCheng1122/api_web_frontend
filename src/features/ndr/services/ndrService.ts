import { NDRAuthResponse, NDRLoginCredentials, NDRDeviceInfo, NDREventsResponse, NDRDeviceListResponse, NDREvent } from '../types/ndr';

const NDR_API_BASE = 'https://iacast.wnc.com.tw/api';

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem('ndrToken');
            throw new Error('Authentication failed');
        }
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Request failed');
    }
    return response.json();
};

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

        return handleResponse(response);
    },

    getDeviceInfo: async (token: string, deviceUuid: string): Promise<NDRDeviceInfo[]> => {
        const response = await fetch(`${NDR_API_BASE}/security/device/info?deviceUuid=${deviceUuid}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        });

        return handleResponse(response);
    },

    getEvents: async (
        token: string, 
        deviceUuid: string, 
        from: number, 
        to: number, 
        page: number = 0, 
        size: number = 20,
        severity?: number
    ): Promise<NDREventsResponse> => {
        let url = `${NDR_API_BASE}/security/events/nids?deviceUuid=${deviceUuid}&from=${from}&to=${to}&page=${page}&size=${size}`;
        if (severity) {
            url += `&severity=${severity}`;
        }

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        });

        const data = await handleResponse(response);
        
        // If severity is specified, filter the results client-side as well
        if (severity && data.hits) {
            const filteredHits = data.hits.filter((event: NDREvent) => event.severity === severity);
            return {
                ...data,
                hits: filteredHits,
                total: filteredHits.length
            };
        }

        return data;
    },

    getTopBlocking: async (
        token: string, 
        deviceUuid: string, 
        from: number, 
        to: number, 
        severity: number
    ): Promise<any[]> => {
        const response = await fetch(
            `${NDR_API_BASE}/security/topblocking?deviceUuid=${deviceUuid}&from=${from}&to=${to}&severity=${severity}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
            }
        );

        return handleResponse(response);
    },

    listDeviceInfos: async (
        token: string, 
        customerId: string, 
        pageSize: number = 10, 
        page: number = 0
    ): Promise<NDRDeviceListResponse> => {
        const response = await fetch(
            `${NDR_API_BASE}/customer/${customerId}/deviceInfos?pageSize=${pageSize}&page=${page}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
            }
        );

        return handleResponse(response);
    }
};
