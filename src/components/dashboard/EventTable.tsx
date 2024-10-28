'use client'

// third-party
import { useState, useEffect } from 'react'

// components
import Loading from '@/components/Loading'
import ErrorDisplayer from '@/components/Error'

// context
import { useDashBoardContext } from '@/contexts/DashBoardContext'

// utils
import { initData, EventTableDataType, fetchEventTableData } from '@/utils/dashboard/fetchEventTableData'


const EventTable = () => {
  const { dateTimeRange } = useDashBoardContext()
  const [useSampleData, setUseSampleData] = useState<boolean>(false); // 新增變數來決定資料來源(測試用)
  const [eventTableData, setEventTableData] = useState<EventTableDataType[]>([
    { id: 1, time: '2023-10-01 10:00', agent_name: 'Agent 1', rule_description: 'Description 1', rule_mitre_tactic: 'Tactic 1', rule_mitre_id: 'ID 1', rule_level: 14 },
    { id: 2, time: '2023-10-01 10:05', agent_name: 'Agent 2', rule_description: 'Description 2', rule_mitre_tactic: 'Tactic 2', rule_mitre_id: 'ID 2', rule_level: 2 },
    { id: 3, time: '2023-10-01 10:10', agent_name: 'Agent 3', rule_description: 'Description 3', rule_mitre_tactic: 'Tactic 3', rule_mitre_id: 'ID 3', rule_level: 1 },
    { id: 4, time: '2023-10-01 10:15', agent_name: 'Agent 4', rule_description: 'Description 4', rule_mitre_tactic: 'Tactic 4', rule_mitre_id: 'ID 4', rule_level: 3 },
    { id: 5, time: '2023-10-01 10:20', agent_name: 'Agent 5', rule_description: 'Description 5', rule_mitre_tactic: 'Tactic 5', rule_mitre_id: 'ID 5', rule_level: 2 },
    { id: 6, time: '2023-10-01 10:25', agent_name: 'Agent 6', rule_description: 'Description 6', rule_mitre_tactic: 'Tactic 6', rule_mitre_id: 'ID 6', rule_level: 1 },
    { id: 7, time: '2023-10-01 10:30', agent_name: 'Agent 7', rule_description: 'Description 7', rule_mitre_tactic: 'Tactic 7', rule_mitre_id: 'ID 7', rule_level: 15 },
    { id: 8, time: '2023-10-01 10:35', agent_name: 'Agent 8', rule_description: 'Description 8', rule_mitre_tactic: 'Tactic 8', rule_mitre_id: 'ID 8', rule_level: 10 },
    { id: 9, time: '2023-10-01 10:40', agent_name: 'Agent 9', rule_description: 'Description 9', rule_mitre_tactic: 'Tactic 9', rule_mitre_id: 'ID 9', rule_level: 1 },
    { id: 10, time: '2023-10-01 10:45', agent_name: 'Agent 10', rule_description: 'Description 10', rule_mitre_tactic: 'Tactic 10', rule_mitre_id: 'ID 10', rule_level: 15 },
    { id: 11, time: '2023-10-01 10:50', agent_name: 'Agent 11', rule_description: 'Description 11', rule_mitre_tactic: 'Tactic 11', rule_mitre_id: 'ID 11', rule_level: 5 },
    { id: 12, time: '2023-10-01 10:55', agent_name: 'Agent 12', rule_description: 'Description 12', rule_mitre_tactic: 'Tactic 12', rule_mitre_id: 'ID 12', rule_level: 1 },
    { id: 13, time: '2023-10-01 11:00', agent_name: 'Agent 13', rule_description: 'Description 13', rule_mitre_tactic: 'Tactic 13', rule_mitre_id: 'ID 13', rule_level: 10 },
    { id: 14, time: '2023-10-01 11:05', agent_name: 'Agent 14', rule_description: 'Description 14', rule_mitre_tactic: 'Tactic 14', rule_mitre_id: 'ID 14', rule_level: 5 },
  ])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1); // 新增狀態管理當前頁碼
  const itemsPerPage = 5; // 固定每頁顯示5列
  const totalPages = Math.ceil(eventTableData.length / itemsPerPage); // 計算總頁數

  // 計算當前頁的資料
  const currentItems = eventTableData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    const fetchData = async () => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        if (!useSampleData && dateTimeRange?.start && dateTimeRange?.end) {
          const result = await fetchEventTableData({ id: 0, start: dateTimeRange?.start, end: dateTimeRange?.end });
          if (result.success) {
            setEventTableData(result.content.datas);
          } else {
            throw new Error('Failed to fetch event table data');
          }
        }
      } catch (error) {
        console.log(error);
        setError("Failed to fetch event table data 😢. Please try again later.");
        setTimeout(() => {
          setError(null);
        }, 3000);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [dateTimeRange, useSampleData]); // 添加 useSampleData 作為依賴

  const adjustTime = (timeString: string) => {
    const date = new Date(timeString);
    date.setHours(date.getHours() + 8);
    return date.toISOString().replace('T', ' ').slice(0, 19);
  };

  return (
    <div className="h-full   bg-white flex flex-col gap-2 ">
      {error && <ErrorDisplayer errorMessage={error} setError={setError} />}
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="h-fit text-sm font-bold">等級大於12的wazuh事件</div>

          <div className="flex-grow p-2 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-700 font-bold border-b border-gray-300">
                  <th className="w-[15%] p-2">時間</th>
                  <th className="w-[15%] p-2">代理名字</th>
                  <th className="w-[40%] p-2">規則描述</th>
                  <th className="w-[10%] p-2">Rule Mitre Tactic</th>
                  <th className="w-[10%] p-2">Rule Mitre ID</th>
                  <th className="w-[10%] p-2">規則等級</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={index} className="text-gray-600 border-b border-gray-300">
                    <td className="p-2 text-sm">{adjustTime(item.time)}</td>
                    <td className="p-2 text-sm">{item.agent_name}</td>
                    <td className="p-2 text-sm">{item.rule_description}</td>
                    <td className="p-2 text-sm">{item.rule_mitre_tactic}</td>
                    <td className="p-2 text-sm">{item.rule_mitre_id}</td>
                    <td className="p-2 text-sm">{item.rule_level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between mt-auto text-gray-500">
            <div className="flex items-center">
              <span>每頁顯示5列</span>
            </div>
            <div className="flex items-center">
              <button
                className="hover-underline-animation mr-6"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                &lt; 上一頁
              </button>
              <div className="flex space-x-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={currentPage === i + 1 ? 'font-bold hover-underline-animation' : 'hover-underline-animation'}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                className="hover-underline-animation ml-6"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                下一頁 &gt;
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}


export default EventTable;