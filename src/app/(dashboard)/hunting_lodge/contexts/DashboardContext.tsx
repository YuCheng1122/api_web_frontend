'use client';

import { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import type {
    AgentOS,
    AgentSummary,
    Alerts,
    Authentication,
    CveBarchart,
    EventTable,
    MaliciousFile,
    Tactics,
    TtpLinechart
} from '../../../../features/dashboard_v2/types';

interface DashboardContextType {
    agentOS: AgentOS | null;
    agentSummary: AgentSummary | null;
    alerts: Alerts | null;
    authentication: Authentication | null;
    cveBarchart: CveBarchart[] | null;
    eventTable: EventTable | null;
    maliciousFile: MaliciousFile | null;
    tactics: Tactics | null;
    ttpLinechart: TtpLinechart | null;
    setDashboardData: (data: Partial<Omit<DashboardContextType, 'setDashboardData'>>) => void;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error('useDashboard must be used within a DashboardProvider');
    }
    return context;
};

interface DashboardProviderProps {
    children: ReactNode;
    initialData?: Partial<Omit<DashboardContextType, 'setDashboardData'>>;
}

export const DashboardProvider = ({ children, initialData = {} }: DashboardProviderProps) => {
    const [state, setState] = useState<Omit<DashboardContextType, 'setDashboardData'>>({
        agentOS: initialData.agentOS || null,
        agentSummary: initialData.agentSummary || null,
        alerts: initialData.alerts || null,
        authentication: initialData.authentication || null,
        cveBarchart: initialData.cveBarchart || null,
        eventTable: initialData.eventTable || null,
        maliciousFile: initialData.maliciousFile || null,
        tactics: initialData.tactics || null,
        ttpLinechart: initialData.ttpLinechart || null,
    });

    const setDashboardData = useCallback((data: Partial<Omit<DashboardContextType, 'setDashboardData'>>) => {
        setState((prev: Omit<DashboardContextType, 'setDashboardData'>) => ({ ...prev, ...data }));
    }, []);

    return (
        <DashboardContext.Provider value={{ ...state, setDashboardData }}>
            {children}
        </DashboardContext.Provider>
    );
};
