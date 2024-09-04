'use client'

// third-party
import {useState, useEffect} from 'react'

// components
import Loading from '@/components/Loading'
import ErrorDisplayer from '@/components/Error'

// context
import {useDashBoardContext} from '@/contexts/DashBoardContext'

// utils
import {initData, EventTableDataType, fetchEventTableData} from '@/utils/dashboard/fetchEventTableData'


const EventTable = () => {
  const {dateTimeRange} = useDashBoardContext()
  const [eventTableData, setEventTableData] = useState<EventTableDataType[]>(initData.datas)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [total, setTotal] = useState<number>(initData.total)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if(isLoading) return
      setIsLoading(true)
      try{
        if(dateTimeRange?.start && dateTimeRange?.end){
          const result = await fetchEventTableData({id: 0,start: dateTimeRange?.start, end: dateTimeRange?.end})
          if(result.success){
            setEventTableData(result.content.datas)
          }else{
            throw new Error('Failed to fetch event table data')
          }
        }
      }catch(error){
        console.log(error)
        setError("Failed to fetch event table data 😢. Please try again later.")
        setTimeout(() => {
          setError(null)
        }, 3000)
      }finally{
        setIsLoading(false)
      }
    }
    fetchData()
  }, [dateTimeRange])



  return (
    <div className="h-full w-full relative bg-white flex flex-col gap-2">
      {error && <ErrorDisplayer errorMessage={error} setError={setError} />}
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="h-fit text-sm font-bold">wazuh_event_up_to_12</div>

          <div className="flex-grow p-2 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-700 font-bold border-b border-gray-300">
                  <th className="w-[15%] p-2">Time</th>
                  <th className="w-[15%] p-2">Agent ID</th>
                  <th className="w-[40%] p-2">Rule Description</th>
                  <th className="w-[10%] p-2">Rule Mitre Tactic</th>
                  <th className="w-[10%] p-2">Rule Mitre ID</th>
                  <th className="w-[10%] p-2">Rule Level</th>
                </tr>
              </thead>
              <tbody>
                {eventTableData.map((item, index) => (
                  <tr key={index} className="text-gray-600 border-b border-gray-300">
                    <td className="p-2 text-sm">{item.time}</td>
                    <td className="p-2 text-sm">{item.agent_id}</td>
                    <td className="p-2 text-sm">{item.rule_description}</td>
                    <td className="p-2 text-sm">{item.rule_mitre_tactic}</td>
                    <td className="p-2 text-sm">{item.rule_mitre_id}</td>
                    <td className="p-2 text-sm">{item.rule_level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-500 mt-2">顯示前5筆資料</p>
        </>
      )}
    </div>
  )
}


export default EventTable;
