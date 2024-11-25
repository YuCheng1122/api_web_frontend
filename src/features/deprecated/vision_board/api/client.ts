'use client'

import axios, { AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { ENDPOINTS } from './endpoints';

interface ApiRequestConfig extends AxiosRequestConfig {
    params?: {
        start_time?: string;
        end_time?: string;
        [key: string]: any;
    };
}

function normalizeUrl(baseUrl: string, endpoint: string): string {
    // 移除 baseUrl 結尾的斜線（如果有）
    const normalizedBase = baseUrl.replace(/\/+$/, '');
    // 確保 endpoint 以單個斜線開始
    const normalizedEndpoint = endpoint.replace(/^\/+/, '/');
    return `${normalizedBase}${normalizedEndpoint}`;
}

export async function apiRequest<T>(endpoint: string, config: ApiRequestConfig = {}): Promise<T> {
    const token = Cookies.get('token');
    
    // 如果沒有 token，拋出錯誤
    if (!token) {
        throw new Error('No authentication token found');
    }
    
    const headers = {
        ...config.headers,
        'Authorization': token
    };

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    const url = normalizeUrl(baseUrl, endpoint);

    try {
        const response = await axios({
            ...config,
            url,
            headers,
        });

        return response.data;
    } catch (error) {
        console.error(`API request failed for endpoint ${endpoint}:`, error);
        throw error;
    }
}

// Helper function for making dashboard requests
export async function makeDashboardRequest<T>(
    endpoint: string, 
    startTime: Date, 
    endTime: Date
): Promise<T> {
    return apiRequest<T>(endpoint, {
        params: {
            start_time: startTime.toISOString(),
            end_time: endTime.toISOString(),
        }
    });
}

// Export endpoints for easy access
export { ENDPOINTS };
