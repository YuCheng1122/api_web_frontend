'use client' 

import React, { createContext, useContext, useState } from "react"


interface DateTimeRange {
  start: Date | null;
  end: Date | null;
}

interface DashboardContextType {
    dateTimeRange: DateTimeRange | null;
    changeDateTimeRange: (start: Date, end: Date) => void;
}


const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [dateTimeRange, setDateTimeRange] = useState<DateTimeRange>({start: null, end: null})
  
  // 更新 API 呼叫時間
  const changeDateTimeRange = (start: Date, end: Date) => {
    setDateTimeRange({
      start: start,
      end: end
    })
  }

  return (
    <DashboardContext.Provider value={{dateTimeRange, changeDateTimeRange}}>
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
