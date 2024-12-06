'use client';

import { createContext, useContext, ReactNode, useState, useCallback } from 'react';

export interface EventRow {
    event_id: string;
    device_id: string;
    timestamp: string;
    event_type: string;
    source_ip: string;
    source_port: number;
    destination_ip: string;
    destination_port: number;
    modbus_function: number;
    modbus_data: string;
    alert: string;
    register: number;
    error_code: string;
}

interface ICSContextType {
    events: EventRow[];
    loading: boolean;
    error: string | null;
    eventRate: number;
    activeAlerts: number;
    lastUpdate: string | null;
    setEvents: (events: EventRow[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setEventRate: (rate: number) => void;
    setActiveAlerts: (count: number) => void;
    setLastUpdate: (time: string | null) => void;
}

const ICSContext = createContext<ICSContextType | null>(null);

export const useICS = () => {
    const context = useContext(ICSContext);
    if (!context) {
        throw new Error('useICS must be used within an ICSProvider');
    }
    return context;
};

interface ICSProviderProps {
    children: ReactNode;
}

export const ICSProvider = ({ children }: ICSProviderProps) => {
    const [events, setEvents] = useState<EventRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [eventRate, setEventRate] = useState(0);
    const [activeAlerts, setActiveAlerts] = useState(0);
    const [lastUpdate, setLastUpdate] = useState<string | null>(null);

    return (
        <ICSContext.Provider
            value={{
                events,
                loading,
                error,
                eventRate,
                activeAlerts,
                lastUpdate,
                setEvents,
                setLoading,
                setError,
                setEventRate,
                setActiveAlerts,
                setLastUpdate,
            }}
        >
            {children}
        </ICSContext.Provider>
    );
};
