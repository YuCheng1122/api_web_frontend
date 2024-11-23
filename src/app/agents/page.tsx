'use client'

import { useState, useEffect } from 'react'
import { fetchAgentDetails } from "@/features/agents/api/fetchAgentDetails"
import AgentsDetailsTable from "./components/AgentsDetailsTable"
import ErrorDisplayer from '@/app/ui/Error'
import Loading from '@/app/ui/Loading'

const AgentsInfo = () => {
    const [agentsData, setAgentsData] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const result = await fetchAgentDetails()

                if (result.success) {
                    setAgentsData(result.content)
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
                        <AgentsDetailsTable agentsData={agentsData} />
                    )}
                </div>
            </div>
        </>
    )
}

export default AgentsInfo;
