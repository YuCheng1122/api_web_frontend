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
        eventTable: initialData.eventTable ? {
            ...initialData.eventTable,
            content: {
                ...initialData.eventTable.content,
                event_table: [...initialData.eventTable.content.event_table]
            }
        } : null,
        maliciousFile: initialData.maliciousFile || null,
        tactics: initialData.tactics || null,
        ttpLinechart: initialData.ttpLinechart || null,
    });

    const setDashboardData = useCallback((newData: Partial<Omit<DashboardContextType, 'setDashboardData'>>) => {
        setState(prev => {
            const next = { ...prev };

            // 特別處理 eventTable
            if (newData.eventTable) {
                next.eventTable = {
                    ...newData.eventTable,
                    content: {
                        ...newData.eventTable.content,
                        event_table: [...newData.eventTable.content.event_table]
                    }
                };
            }

            // 處理其他字段
            Object.keys(newData).forEach(key => {
                if (key !== 'eventTable') {
                    const value = newData[key as keyof typeof newData];
                    if (value === null) {
                        next[key as keyof typeof next] = null;
                    } else if (Array.isArray(value)) {
                        next[key as keyof typeof next] = [...value] as any;
                    } else if (typeof value === 'object' && value !== null) {
                        next[key as keyof typeof next] = { ...value } as any;
                    } else {
                        next[key as keyof typeof next] = value as any;
                    }
                }
            });

            return next;
        });
    }, []);

    return (
        <DashboardContext.Provider value={{ ...state, setDashboardData }}>
            {children}
        </DashboardContext.Provider>
    );
};
