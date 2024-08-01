'use client'

import { useState } from "react";
import Agent from "@/components/dashboard/Agent";

export interface AgentDataType {
  id: number
  agent_name: string
  data: any
}


const AgentContainer = () => {
  // 呼叫 API 獲取 agent 資料，沒有資料用預設就可以
  const [agentData, setAgentData] = useState<AgentDataType[]>(
    [
      {
        id: 1,
        agent_name: "Active agents",
        data: null,
      },
      {
        id: 2,
        agent_name: "Total agents",
        data: null,
      },
      {
        id: 3,
        agent_name: "Active Windows agents",
        data: null,
      },
      {
        id: 4,
        agent_name: "Windows agents",
        data: null,
      },
      {
        id: 5,
        agent_name: "Active Linux agents",
        data: null,
      },
      {
        id: 6,
        agent_name: "Linux agents",
        data: null,
      },
      {
        id: 7,
        agent_name: "Active MacOS agents",
        data: null,
      },
      {
        id: 8,
        agent_name: "MacOs agents",
        data: null,
      },
    ]
  );


  return (
    <>
      {
        agentData.map((agent: any) => (
          <Agent key={agent.id} agent={agent} />
        ))
      }
    </>
  )
}

export default AgentContainer
