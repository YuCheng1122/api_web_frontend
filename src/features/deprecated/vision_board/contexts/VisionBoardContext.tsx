'use client'
import React, { createContext, useContext, useState } from "react"

// 內嵌AgentDataType定義
export interface AgentDataType {
    agent_name: string;
    ip: string;
    os: string;
    agent_status: string;
    last_keep_alive: string;
    registration_time: string;
}

type DateTimeRange = {
    start: Date | null;
    end: Date | null;
}

type VisionBoardContextType = {
    dateTimeRange: DateTimeRange;
    changeDateTimeRange: (start: Date, end: Date) => void;
    agentData: AgentDataType[];
    updateAgentData: (newData: AgentDataType[]) => void;
}

export const VisionBoardContext = createContext<VisionBoardContextType | undefined>(undefined);

export const VisionBoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [dateTimeRange, setDateTimeRange] = useState<DateTimeRange>({ start: null, end: null })
    const [agentData, setAgentData] = useState<AgentDataType[]>([]);
    console.log(dateTimeRange);

    const changeDateTimeRange = (start: Date, end: Date) => {
        setDateTimeRange({
            start: start,
            end: end
        })
    }
    const updateAgentData = (newData: AgentDataType[]) => {
        setAgentData(newData);
    }
    return (
        <VisionBoardContext.Provider value={{ dateTimeRange, changeDateTimeRange, agentData, updateAgentData }}>
            {children}
        </VisionBoardContext.Provider>
    )
}

export const useVisionBoardContext = () => {
    const context = useContext(VisionBoardContext);
    if (!context) {
        throw new Error("useVisionBoardContext must be used within a VisionBoardProvider");
    }
    return context;
}
