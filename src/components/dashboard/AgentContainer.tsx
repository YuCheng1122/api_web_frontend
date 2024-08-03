'use client'

import { useState, useEffect } from "react";
import Agent from "@/components/dashboard/Agent";
import Loading from "@/components/Loading";
import { useDashBoardContext } from "@/contexts/DashBoardContext";
import { initData, AgentDataType, fetchAgentData, fetchAgentDataResponse } from "@/utils/dashboard/fetchAgentData";
import ErrorDisplayer from "@/components/Error";

const AgentContainer = () => {
  const { dateTimeRange } = useDashBoardContext()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [agentData, setAgentData] = useState<AgentDataType[]>(initData);
  const [error, setError] = useState<string | null>(null)


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isLoading) return
        setIsLoading(true)
        if (dateTimeRange?.start && dateTimeRange?.end) {
          const result: fetchAgentDataResponse = await fetchAgentData({ start: dateTimeRange?.start, end: dateTimeRange?.end })
          if (result.success) {
            setAgentData(result.content)
          } else {
            throw new Error("Error fetching agent data")
          }
        }
      } catch (error) {
        console.log(error)
        setError("Failed to fetch agent data 😢. Please try again later.")
        setTimeout(() => {
          setError(null)
        }, 3000)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [dateTimeRange])

  return (
    <div className="w-full h-full relative">
      {error && <ErrorDisplayer errorMessage={error} setError={setError} /> }
      {
        isLoading ? <Loading /> :
          <div className="h-full w-full grid grid-cols-8 gap-4">
            {
              agentData.map((agent: any) => (
                <Agent key={agent.id} agent={agent} />
              ))
            }
          </div>
      }
    </div>
  )
}

export default AgentContainer
