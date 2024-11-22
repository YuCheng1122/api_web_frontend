import { useState, useEffect } from 'react';
import { NDRAuthState, NDRLoginCredentials } from '../types/ndr';
import { ndrService } from '../services/ndrService';

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

export const useNDR = () => {
    const [authState, setAuthState] = useState<NDRAuthState>(globalAuthState);

    useEffect(() => {
        // Subscribe to state changes
        const subscriber = (newState: NDRAuthState) => {
            setAuthState(newState);
        };
        subscribers.add(subscriber);

        // Cleanup subscription
        return () => {
            subscribers.delete(subscriber);
        };
    }, []);

    const updateGlobalAndLocalState = (newState: NDRAuthState) => {
        globalAuthState = newState;
        notifySubscribers(newState);
    };

    const login = async (credentials: NDRLoginCredentials) => {
        try {
            updateGlobalAndLocalState({ ...globalAuthState, isLoading: true, error: null });
            const response = await ndrService.login(credentials);
            
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
