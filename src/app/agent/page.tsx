'use client'

// third-party
import {useState, useEffect} from 'react'
import Loading from '@/components/Loading'
import ErrorDisplayer from '@/components/Error'
import AgentsDetailsTable from '@/components/agent/AgentsDetailsTable' // 導入 AgentsTable 組件

// utils
import {fetchAgentDetails} from '@/utils/agent/fetchAgentDetails' // 導入 fetchAgentDetails 函數

// 模擬的代理資料
const mockAgentsData = [
  {
    agent_name: "Agent 1",
    ip: "192.168.0.1",
    os: "Linux",
    status_code: 2,
    last_keep_alive: "2024-09-01 12:30:45",
    registration_time: "2024-09-01 12:00:00"
  },
  {
    agent_name: "Agent 2",
    ip: "192.168.0.2",
    os: "Windows",
    status_code: 0,
    last_keep_alive: "2024-09-01 12:25:30",
    registration_time: "2024-09-01 12:00:00"
  },
  {
    agent_name: "Agent 3",
    ip: "192.168.0.3",
    os: "macOS",
    status_code: 1,
    last_keep_alive: "2024-09-01 12:20:15",
    registration_time: "2024-09-01 12:00:00"
  }
];

const AgentsInfo = () => {
  const [agentsData, setAgentsData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const result = await fetchAgentDetails() // 調用 fetchAgentDetails 函數

        if (result.success) {
          setAgentsData(result.content) // 設置獲取的代理資料
        } else {
          throw new Error('Failed to fetch agents info')
        }
      } catch (error) {
        console.log(error)
        // 使用範例資料作為後備
        setAgentsData(mockAgentsData); // 設置範例資料
        setError("Failed to fetch agents info 😢. Using mock data instead.")
        setTimeout(() => {
          setError(null)
        }, 3000)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <>
      <div className='h-[90vh] p-3 bg-gray-100 rounded-lg'>
        <div className="h-full w-full relative bg-white flex flex-col gap-2">
          {error && <ErrorDisplayer errorMessage={error} setError={setError} />}
          {isLoading ? (
            <Loading />
          ) : (
            <AgentsDetailsTable agentsData={agentsData} /> // 使用 AgentsTable 組件
          )}
        </div>
      </div>
    </>
  )
}

export default AgentsInfo;
