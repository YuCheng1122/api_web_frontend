import Cookies from 'js-cookie';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { login } from '../auth/api/login';
import { decrypt } from '../auth/utils/crypto';

class AvocadoClient {
    private baseURL: string;
    private isRefreshing: boolean = false;
    private failedQueue: Array<{
        resolve: (value?: any) => void;
        reject: (reason?: any) => void;
        config: AxiosRequestConfig;
    }> = [];

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

    private async refreshToken(): Promise<boolean> {
        try {
            // 從 sessionStorage 獲取加密的憑證
            const encryptedCredentials = sessionStorage.getItem('auth_credentials');
            if (!encryptedCredentials) {
                return false;
            }

            // 解密憑證
            const credentials = JSON.parse(await decrypt(encryptedCredentials));
            const { username, password } = credentials;

            // 使用憑證重新登入
            const response = await login(username, password);
            if (response.success) {
                const token = `${response.content.token_type} ${response.content.access_token}`;
                Cookies.set('token', token);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Token refresh failed:', error);
            return false;
        }
    }

    private async processQueue(success: boolean, error: any = null) {
        this.failedQueue.forEach((promise) => {
            if (success) {
                const retryConfig = {
                    ...promise.config,
                    headers: {
                        ...promise.config.headers,
                        Authorization: Cookies.get('token'),
                    },
                };
                promise.resolve(axios(retryConfig));
            } else {
                promise.reject(error);
            }
        });
        this.failedQueue = [];
    }

    private async handleRequest<T>(
        requestConfig: AxiosRequestConfig,
        requestMethod: (config: AxiosRequestConfig) => Promise<any>
    ): Promise<T> {
        try {
            const response = await requestMethod(requestConfig);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 401) {
                if (!this.isRefreshing) {
                    this.isRefreshing = true;
                    try {
                        const refreshSuccess = await this.refreshToken();
                        this.isRefreshing = false;
                        await this.processQueue(refreshSuccess);
                        
                        if (refreshSuccess) {
                            // 重試原始請求
                            const retryConfig = {
                                ...requestConfig,
                                headers: {
                                    ...requestConfig.headers,
                                    Authorization: Cookies.get('token'),
                                },
                            };
                            const retryResponse = await requestMethod(retryConfig);
                            return retryResponse.data;
                        } else {
                            // 如果重新登入失敗，清除憑證
                            sessionStorage.removeItem('auth_credentials');
                            Cookies.remove('token');
                            Cookies.remove('username');
                            // 重定向到登入頁面
                            window.location.href = '/auth/login';
                        }
                    } catch (refreshError) {
                        this.isRefreshing = false;
                        await this.processQueue(false, refreshError);
                        throw refreshError;
                    }
                }

                // 如果已經在刷新中，將請求加入隊列
                return new Promise((resolve, reject) => {
                    this.failedQueue.push({
                        resolve,
                        reject,
                        config: requestConfig,
                    });
                });
            }
            throw error;
        }
    }

    async get<T = any>(endpoint: string, config: AxiosRequestConfig = {}) {
        const requestConfig = {
            ...config,
            headers: {
                ...this.getHeaders(),
                ...config.headers,
            },
        };
        return this.handleRequest<T>(
            requestConfig,
            (config) => axios.get(this.getFullUrl(endpoint), config)
        );
    }

    async post<T = any>(endpoint: string, data?: any, config: AxiosRequestConfig = {}) {
        const requestConfig = {
            ...config,
            headers: {
                ...this.getHeaders(),
                ...config.headers,
            },
        };
        return this.handleRequest<T>(
            requestConfig,
            (config) => axios.post(this.getFullUrl(endpoint), data, config)
        );
    }

    async put<T = any>(endpoint: string, data?: any, config: AxiosRequestConfig = {}) {
        const requestConfig = {
            ...config,
            headers: {
                ...this.getHeaders(),
                ...config.headers,
            },
        };
        return this.handleRequest<T>(
            requestConfig,
            (config) => axios.put(this.getFullUrl(endpoint), data, config)
        );
    }

    async delete<T = any>(endpoint: string, config: AxiosRequestConfig = {}) {
        const requestConfig = {
            ...config,
            headers: {
                ...this.getHeaders(),
                ...config.headers,
            },
        };
        return this.handleRequest<T>(
            requestConfig,
            (config) => axios.delete(this.getFullUrl(endpoint), config)
        );
    }
}

// Export a singleton instance
export const avocadoClient = new AvocadoClient();
