'use client'

import { useState, useEffect } from 'react';
import { NDRAuthState, NDRLoginCredentials } from '../types/ndr';
import { ndrService } from '../services/ndrService';
import { encrypt } from '../utils/encrypt';
import { decrypt } from '../utils/decrypt';

// Create a global state to persist auth state across components
let globalAuthState: NDRAuthState = {
    token: null,
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
            // Check for existing token and credentials in localStorage
            const storedToken = localStorage.getItem('ndrToken');
            
            if (storedToken && !globalAuthState.isAuthenticated) {
                updateGlobalAndLocalState({
                    token: storedToken,
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
        if (newState.token) {
            localStorage.setItem('ndrToken', newState.token);
        } else {
            localStorage.removeItem('ndrToken');
            clearStoredCredentials();
        }
        notifySubscribers(newState);
    };

    const login = async (credentials: NDRLoginCredentials, shouldStoreCredentials: boolean = true) => {
        try {
            updateGlobalAndLocalState({ ...globalAuthState, isLoading: true, error: null });
            const response = await ndrService.login(credentials);
            
            if (shouldStoreCredentials) {
                try {
                    await storeCredentials(credentials);
                } catch (error) {
                    console.error('Failed to store credentials:', error);
                    // Continue with login even if storing credentials fails
                }
            }

            updateGlobalAndLocalState({
                token: response.token,
                isAuthenticated: true,
                isLoading: false,
                error: null
            });
        } catch (error) {
            updateGlobalAndLocalState({
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Login failed'
            });
        }
    };

    const logout = () => {
        updateGlobalAndLocalState({
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
        });
    };

    return {
        ...authState,
        login,
        logout
    };
};
