'use client';

import { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import type { NDRDeviceListItem, NDRDeviceInfo, NDREvent, NDRTopBlocking } from '../../../../features/ndr/types/ndr';

interface UserPreferences {
    pageSize: number;
    sortField: keyof NDREvent;
    sortDirection: 'asc' | 'desc';
    severity?: number;
}

interface NDRContextType {
    devices: NDRDeviceListItem[];
    deviceInfo: NDRDeviceInfo | null;
    allEvents: NDREvent[];
    totalEvents: number;
    topBlocking: NDRTopBlocking[];
    loading: boolean;
    error: string | null;
    preferences: UserPreferences;
    currentPage: number;
    fromDate: string;
    toDate: string;
    selectedDevice: string | null;
    setDevices: (devices: NDRDeviceListItem[]) => void;
    setDeviceInfo: (info: NDRDeviceInfo | null) => void;
    setAllEvents: (events: NDREvent[]) => void;
    setTotalEvents: (total: number) => void;
    setTopBlocking: (data: NDRTopBlocking[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    updatePreferences: (newPreferences: Partial<UserPreferences>) => void;
    setCurrentPage: (page: number) => void;
    setFromDate: (date: string) => void;
    setToDate: (date: string) => void;
    setSelectedDevice: (device: string | null) => void;
}

const DEFAULT_PREFERENCES: UserPreferences = {
    pageSize: 20,
    sortField: '@timestamp',
    sortDirection: 'desc'
};

const NDRContext = createContext<NDRContextType | null>(null);

export const useNDRData = () => {
    const context = useContext(NDRContext);
    if (!context) {
        throw new Error('useNDRData must be used within a NDRProvider');
    }
    return context;
};

interface NDRProviderProps {
    children: ReactNode;
}

export const NDRProvider = ({ children }: NDRProviderProps) => {
    const [devices, setDevices] = useState<NDRDeviceListItem[]>([]);
    const [deviceInfo, setDeviceInfo] = useState<NDRDeviceInfo | null>(null);
    const [allEvents, setAllEvents] = useState<NDREvent[]>([]);
    const [totalEvents, setTotalEvents] = useState(0);
    const [topBlocking, setTopBlocking] = useState<NDRTopBlocking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
    const [currentPage, setCurrentPage] = useState(0);
    const [fromDate, setFromDate] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        return date.toISOString().slice(0, 16);
    });
    const [toDate, setToDate] = useState(() => {
        return new Date().toISOString().slice(0, 16);
    });
    const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

    const updatePreferences = useCallback((newPreferences: Partial<UserPreferences>) => {
        setPreferences(prev => ({ ...prev, ...newPreferences }));
    }, []);

    return (
        <NDRContext.Provider
            value={{
                devices,
                deviceInfo,
                allEvents,
                totalEvents,
                topBlocking,
                loading,
                error,
                preferences,
                currentPage,
                fromDate,
                toDate,
                selectedDevice,
                setDevices,
                setDeviceInfo,
                setAllEvents,
                setTotalEvents,
                setTopBlocking,
                setLoading,
                setError,
                updatePreferences,
                setCurrentPage,
                setFromDate,
                setToDate,
                setSelectedDevice,
            }}
        >
            {children}
        </NDRContext.Provider>
    );
};
