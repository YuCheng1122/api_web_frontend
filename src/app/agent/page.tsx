'use client'

// third-party
import {useState, useEffect} from 'react'
import Loading from '@/components/Loading'
import ErrorDisplayer from '@/components/Error'
import {fetchAgentDetails} from "@/app/agent/utils/fetchAgentDetails";
import AgentsDetailsTable from "@/app/agent/components/AgentsDetailsTable"; // 導入 AgentsTable 組件


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
