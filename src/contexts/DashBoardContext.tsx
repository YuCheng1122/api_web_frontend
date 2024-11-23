'use client' 

import React, { createContext, useContext, useState } from "react"
import { AgentDataType } from '@/app/agentdashboard/utils/agentdashboard/fetchAgentData';

interface DateTimeRange {
  start: Date | null;
  end: Date | null;
}

interface DashboardContextType {
  dateTimeRange: DateTimeRange;
  changeDateTimeRange: (start: Date, end: Date) => void;
  agentData: AgentDataType[];
  updateAgentData: (newData: AgentDataType[]) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [dateTimeRange, setDateTimeRange] = useState<DateTimeRange>({start: null, end: null})
  const [agentData, setAgentData] = useState<AgentDataType[]>([]);
  
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
    <DashboardContext.Provider value={{dateTimeRange, changeDateTimeRange, agentData, updateAgentData}}>
      {children}
    </DashboardContext.Provider>
  )
}

export const useDashBoardContext = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashBoardContext must be used within a DashBoardProvider");
  }
  return context;
}