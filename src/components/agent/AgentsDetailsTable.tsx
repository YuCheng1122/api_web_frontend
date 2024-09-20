'use client'

import Image from 'next/image'; // 確保導入 Image 組件
import { useState } from 'react'; // 新增導入 useState

interface AgentDetails {
  agent_name: string;
  ip: string;
  os: string;
  agent_status: string;
  last_keep_alive: string;
}

interface AgentsDetailsTableProps {
  agentsData: AgentDetails[];
}

const AgentsDetailsTable = ({ agentsData }: AgentsDetailsTableProps) => {
  const [currentPage, setCurrentPage] = useState(1); // 新增狀態管理當前頁碼
  const [itemsPerPage, setItemsPerPage] = useState(10); // 新增狀態管理每頁顯示的資料數量
  const totalPages = Math.ceil(agentsData.length / itemsPerPage); // 計算總頁數

  // 計算當前頁的資料
  const currentItems = agentsData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i <= 5 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
        pageNumbers.push(
          <button 
            key={i} 
            onClick={() => setCurrentPage(i)} 
            className={currentPage === i ? 'font-bold hover-underline-animation' : 'hover-underline-animation'}
          >
            {i}
          </button>
        );
      } else if (i === 6 && currentPage > 5) {
        pageNumbers.push(<span key="ellipsis-1">...</span>); // 加入前刪節號
      } else if (i === totalPages - 1 && currentPage < totalPages - 2) {
        pageNumbers.push(<span key="ellipsis-2">...</span>); // 加入後刪節號
      }
    }
    return pageNumbers;
  };

  const determineOS = (osName: string): string => {
    osName = osName.toLowerCase();
    if (osName.includes('windows') || osName.includes('microsoft')) {
      return 'windows';
    } else if (osName.includes('linux') || osName.includes('ubuntu') || osName.includes('centos') || osName.includes('redhat') || osName.includes('debian')) {
      return 'linux';
    } else if (osName.includes('mac') || osName.includes('darwin')) {
      return 'macos';
    } else {
      return 'other';
    }
  };

  return (
    <div className="flex-grow p-2 overflow-x-auto flex flex-col">
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-700 font-bold border-b border-gray-300">
            <th className="w-[15%] p-2">Agent Name</th>
            <th className="w-[15%] p-2">IP Address</th>
            <th className="w-[20%] p-2">Operating System</th>
            <th className="w-[15%] p-2">Status</th>
            <th className="w-[25%] p-2">Last Keep Alive</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={index} className="text-gray-600 border-b border-gray-300">
              <td className="p-2 text-sm">{item.agent_name}</td>
              <td className="p-2 text-sm">{item.ip}</td>
              <td className="p-2 text-sm">
                <span className="inline-flex">
                  {determineOS(item.os) === 'linux' && (
                    <Image src="/linux-logo.png" alt="Linux" width={20} height={20} className="mr-2" />
                  )}
                  {determineOS(item.os) === 'windows' && (
                    <Image src="/windows-logo.png" alt="Windows" width={20} height={20} className="mr-2" />
                  )}
                  {determineOS(item.os) === 'macos' && (
                    <Image src="/mac-logo.png" alt="macOS" width={20} height={20} className="mr-2" />
                  )}
                  {item.os}
                </span>
              </td>
              <td className="p-2 text-sm">
                <span className="inline-flex">
                  {item.agent_status === "active" ? (
                    <Image src="/green-circle-icon.png" alt="Active" width={20} height={20} className="mr-2" />
                  ) : (
                    <Image src="/red-circle-icon.png" alt="Inactive" width={20} height={20} className="mr-2" />
                  )}
                  {item.agent_status}
                </span>
              </td>
              <td className="p-2 text-sm">{item.last_keep_alive}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between mt-auto">
        <div className="flex items-center">
          <label htmlFor="itemsPerPage" className="mr-2">每頁顯示</label>
          <select 
            id="itemsPerPage" 
            value={itemsPerPage} 
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1); // 重置當前頁碼
            }}
          >
            <option value={1}>1</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={50}>50</option>
          </select>
          <label htmlFor="itemsPerPage" className="ml-2">列</label>
        </div>
        <div className="flex items-center">
          <button 
            className="hover-underline-animation mr-6" 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
            disabled={currentPage === 1}
          >
            &lt; Prev
          </button>
          <div className="flex space-x-2">
            {renderPageNumbers()}
          </div>
          <button 
            className="hover-underline-animation ml-6" 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
            disabled={currentPage === totalPages}
          >
            Next &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentsDetailsTable;