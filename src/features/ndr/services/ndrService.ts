import { NDRAuthResponse, NDRLoginCredentials, NDRDeviceInfo, NDREventsResponse, NDRDeviceListResponse } from '../types/ndr';
import { decodeJWT, DecodedToken } from '../utils/jwt';

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
    login: async (credentials: NDRLoginCredentials): Promise<{ authResponse: NDRAuthResponse; decodedToken: DecodedToken }> => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_NDR_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(credentials),
        });

        const authResponse = await handleResponse(response);
        const decodedToken = decodeJWT(authResponse.token);
        
        return { authResponse, decodedToken };
    },

    getDeviceInfo: async (token: string, deviceUuid: string): Promise<NDRDeviceInfo[]> => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_NDR_BASE_URL}/security/device/info?deviceUuid=${deviceUuid}`, {
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
        let url = `${process.env.NEXT_PUBLIC_NDR_BASE_URL}/security/events/nids?deviceUuid=${deviceUuid}&from=${from}&to=${to}&page=${page}&size=${size}`;
        if (severity !== undefined) {
            url += `&severity=${severity}`;
        }

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        });

        return handleResponse(response);
    },

    getTopBlocking: async (
        token: string,
        deviceUuid: string,
        from: number,
        to: number,
        severity?: number
    ): Promise<any[]> => {
        let url = `${process.env.NEXT_PUBLIC_NDR_BASE_URL}/security/topblocking?deviceUuid=${deviceUuid}&from=${from}&to=${to}`;
        if (severity !== undefined) {
            url += `&severity=${severity}`;
        }

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        });

        return handleResponse(response);
    },

    listDeviceInfos: async (
        token: string,
        customerId: string,
        pageSize: number = 10,
        page: number = 0
    ): Promise<NDRDeviceListResponse> => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_NDR_BASE_URL}/customer/${customerId}/deviceInfos?pageSize=${pageSize}&page=${page}`,
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
