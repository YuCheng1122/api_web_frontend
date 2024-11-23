'use client'

import { useState, useEffect } from 'react';
import { NDRAuthState, NDRLoginCredentials } from '../types/ndr';
import { ndrService } from '../services/ndrService';
import { encryptData, decryptData } from '../utils/encryption';

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
            const encryptedCredentials = localStorage.getItem(CREDENTIALS_KEY);

            if (storedToken && !globalAuthState.isAuthenticated) {
                updateGlobalAndLocalState({
                    token: storedToken,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null
                });
            } else if (encryptedCredentials && !globalAuthState.isAuthenticated) {
                // Auto-login with stored credentials
                try {
                    const decryptedCredentials = await decryptData(encryptedCredentials);
                    const credentials: NDRLoginCredentials = JSON.parse(decryptedCredentials);
                    await login(credentials, false); // Pass false to prevent re-storing credentials
                } catch (error) {
                    console.error('Failed to auto-login:', error);
                    // Clear invalid stored credentials
                    localStorage.removeItem(CREDENTIALS_KEY);
                    localStorage.removeItem('ndr-crypto-key');
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
            localStorage.removeItem(CREDENTIALS_KEY);
            localStorage.removeItem('ndr-crypto-key');
        }
        notifySubscribers(newState);
    };

    const login = async (credentials: NDRLoginCredentials, storeCredentials: boolean = true) => {
        try {
            updateGlobalAndLocalState({ ...globalAuthState, isLoading: true, error: null });
            const response = await ndrService.login(credentials);
            
            if (storeCredentials) {
                try {
                    // Encrypt and store credentials
                    const encryptedCredentials = await encryptData(JSON.stringify(credentials));
                    localStorage.setItem(CREDENTIALS_KEY, encryptedCredentials);
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
