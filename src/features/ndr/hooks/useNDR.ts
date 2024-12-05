'use client'

import { useState, useEffect } from 'react';
import { NDRAuthState, NDRLoginCredentials } from '../types/ndr';
import { ndrService } from '../services/ndrService';
import { encrypt } from '../utils/encrypt';
import { decrypt } from '../utils/decrypt';
import { DecodedToken } from '../utils/jwt';

// Create a global state to persist auth state across components
let globalAuthState: NDRAuthState = {
    token: null,
    decodedToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
};

// Create a list of subscribers to notify when state changes
const subscribers = new Set<(state: NDRAuthState) => void>();

const notifySubscribers = (newState: NDRAuthState) => {
    subscribers.forEach(subscriber => subscriber(newState));
};

const CREDENTIALS_KEY = 'ndr-encrypted-credentials';
const CRYPTO_KEY = 'ndr-crypto-key';
const TOKEN_KEY = 'ndrToken';
const DECODED_TOKEN_KEY = 'ndrDecodedToken';

async function storeCredentials(credentials: NDRLoginCredentials): Promise<void> {
    try {
        const { encryptedData, key } = await encrypt(JSON.stringify(credentials));
        localStorage.setItem(CREDENTIALS_KEY, encryptedData);
        localStorage.setItem(CRYPTO_KEY, key);
    } catch (error) {
        console.error('Failed to store credentials:', error);
        throw new Error('Failed to store credentials');
    }
}

async function retrieveCredentials(): Promise<NDRLoginCredentials | null> {
    try {
        const encryptedData = localStorage.getItem(CREDENTIALS_KEY);
        const key = localStorage.getItem(CRYPTO_KEY);

        if (!encryptedData || !key) {
            return null;
        }

        const decryptedData = await decrypt(encryptedData, key);
        return JSON.parse(decryptedData) as NDRLoginCredentials;
    } catch (error) {
        console.error('Failed to retrieve credentials:', error);
        clearStoredCredentials();
        return null;
    }
}

function clearStoredCredentials(): void {
    localStorage.removeItem(CREDENTIALS_KEY);
    localStorage.removeItem(CRYPTO_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(DECODED_TOKEN_KEY);
}

export const useNDR = () => {
    const [authState, setAuthState] = useState<NDRAuthState>(globalAuthState);

    useEffect(() => {
        // Subscribe to state changes
        const subscriber = (newState: NDRAuthState) => {
            setAuthState(newState);
        };
        subscribers.add(subscriber);

        const attemptAutoLogin = async () => {
            // Check for existing token and decoded token in localStorage
            const storedToken = localStorage.getItem(TOKEN_KEY);
            const storedDecodedToken = localStorage.getItem(DECODED_TOKEN_KEY);
            
            if (storedToken && storedDecodedToken && !globalAuthState.isAuthenticated) {
                updateGlobalAndLocalState({
                    token: storedToken,
                    decodedToken: JSON.parse(storedDecodedToken),
                    isAuthenticated: true,
                    isLoading: false,
                    error: null
                });
            } else if (!globalAuthState.isAuthenticated) {
                // Try to retrieve and use stored credentials
                try {
                    const credentials = await retrieveCredentials();
                    if (credentials) {
                        await login(credentials, false); // Pass false to prevent re-storing credentials
                    }
                } catch (error) {
                    console.error('Failed to auto-login:', error);
                    clearStoredCredentials();
                }
            }
        };

        attemptAutoLogin();

        // Cleanup subscription
        return () => {
            subscribers.delete(subscriber);
        };
    }, []);

    const updateGlobalAndLocalState = (newState: NDRAuthState) => {
        globalAuthState = newState;
        if (newState.token && newState.decodedToken) {
            localStorage.setItem(TOKEN_KEY, newState.token);
            localStorage.setItem(DECODED_TOKEN_KEY, JSON.stringify(newState.decodedToken));
        } else {
            clearStoredCredentials();
        }
        notifySubscribers(newState);
    };

    const login = async (credentials: NDRLoginCredentials, shouldStoreCredentials: boolean = true) => {
        try {
            updateGlobalAndLocalState({ ...globalAuthState, isLoading: true, error: null });
            const { authResponse, decodedToken } = await ndrService.login(credentials);
            
            if (shouldStoreCredentials) {
                try {
                    await storeCredentials(credentials);
                } catch (error) {
                    console.error('Failed to store credentials:', error);
                    // Continue with login even if storing credentials fails
                }
            }

            updateGlobalAndLocalState({
                token: authResponse.token,
                decodedToken,
                isAuthenticated: true,
                isLoading: false,
                error: null
            });
        } catch (error) {
            updateGlobalAndLocalState({
                token: null,
                decodedToken: null,
                isAuthenticated: false,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Login failed'
            });
        }
    };

    const logout = () => {
        updateGlobalAndLocalState({
            token: null,
            decodedToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
        });
    };

    // 新增：獲取當前token
    const getToken = () => {
        return authState.token;
    };

    // 新增：獲取當前認證資訊
    const getCredentials = async (): Promise<NDRLoginCredentials | null> => {
        try {
            return await retrieveCredentials();
        } catch (error) {
            console.error('Failed to get credentials:', error);
            return null;
        }
    };

    // 新增：獲取解碼後的token資訊
    const getDecodedToken = () => {
        return authState.decodedToken;
    };

    return {
        ...authState,
        login,
        logout,
        getToken,         // 導出token獲取方法
        getCredentials,   // 導出認證資訊獲取方法
        getDecodedToken   // 導出解碼後token獲取方法
    };
};
