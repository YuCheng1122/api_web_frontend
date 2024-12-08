import { NDRAuthResponse, NDRLoginCredentials, NDRDeviceInfo, NDREventsResponse, NDRDeviceListResponse } from '../types/ndr';
import { decodeJWT, DecodedToken } from '../utils/jwt';
import { decrypt } from '../utils/decrypt';

const CREDENTIALS_KEY = 'ndr-encrypted-credentials';
const CRYPTO_KEY = 'ndr-crypto-key';

const handleResponse = async (response: Response, retryCount = 0) => {
    if (!response.ok) {
        if (response.status === 401 && retryCount < 1) {
            // 嘗試使用儲存的憑證重新登入
            const encryptedData = localStorage.getItem(CREDENTIALS_KEY);
            const key = localStorage.getItem(CRYPTO_KEY);

            if (encryptedData && key) {
                try {
                    const decryptedData = await decrypt(encryptedData, key);
                    const credentials = JSON.parse(decryptedData) as NDRLoginCredentials;
                    
                    // 重新登入
                    const loginResponse = await ndrService.login(credentials);
                    
                    // 使用新token重試原始請求
                    const retryResponse = await fetch(response.url, {
                        ...response,
                        headers: {
                            ...response.headers,
                            'Authorization': `Bearer ${loginResponse.authResponse.token}`
                        }
                    });
                    
                    return handleResponse(retryResponse, retryCount + 1);
                } catch (error) {
                    console.error('Auto re-login failed:', error);
                    localStorage.removeItem('ndrToken');
                    throw new Error('Authentication failed');
                }
            }
            
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
