import Cookies from 'js-cookie';
import axios, { AxiosRequestConfig } from 'axios';

class AvocadoClient {
    private baseURL: string;

    constructor() {
        const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
        
        // Validate HTTPS
        if (!baseURL.startsWith('https://')) {
            throw new Error('AvocadoClient requires HTTPS URL for security');
        }
        
        // Remove trailing slash from baseURL if it exists
        this.baseURL = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
    }

    private getHeaders() {
        return {
            'Authorization': Cookies.get('token'),
        };
    }

    private getFullUrl(endpoint: string): string {
        // Ensure endpoint starts with slash
        const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        return `${this.baseURL}${normalizedEndpoint}`;
    }

    async get<T = any>(endpoint: string, config: AxiosRequestConfig = {}) {
        const response = await axios.get<T>(
            this.getFullUrl(endpoint),
            {
                ...config,
                headers: {
                    ...this.getHeaders(),
                    ...config.headers,
                },
            }
        );
        return response.data;
    }

    async post<T = any>(endpoint: string, data?: any, config: AxiosRequestConfig = {}) {
        const response = await axios.post<T>(
            this.getFullUrl(endpoint),
            data,
            {
                ...config,
                headers: {
                    ...this.getHeaders(),
                    ...config.headers,
                },
            }
        );
        return response.data;
    }

    async put<T = any>(endpoint: string, data?: any, config: AxiosRequestConfig = {}) {
        const response = await axios.put<T>(
            this.getFullUrl(endpoint),
            data,
            {
                ...config,
                headers: {
                    ...this.getHeaders(),
                    ...config.headers,
                },
            }
        );
        return response.data;
    }

    async delete<T = any>(endpoint: string, config: AxiosRequestConfig = {}) {
        const response = await axios.delete<T>(
            this.getFullUrl(endpoint),
            {
                ...config,
                headers: {
                    ...this.getHeaders(),
                    ...config.headers,
                },
            }
        );
        return response.data;
    }
}

// Export a singleton instance
export const avocadoClient = new AvocadoClient();
