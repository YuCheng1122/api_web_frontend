'use client'

import Image from 'next/image'; // 確保導入 Image 組件

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
  return (
    <div className="flex-grow p-2 overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-700 font-bold border-b border-gray-300">
            <th className="w-[15%] p-2">Agent Name</th>
            <th className="w-[15%] p-2">IP Address</th>
            <th className="w-[15%] p-2">Operating System</th>
            <th className="w-[15%] p-2">Status</th>
            <th className="w-[30%] p-2">Last Keep Alive</th>
          </tr>
        </thead>
        <tbody>
          {agentsData.map((item, index) => (
            <tr key={index} className="text-gray-600 border-b border-gray-300">
              <td className="p-2 text-sm">{item.agent_name}</td>
              <td className="p-2 text-sm">{item.ip}</td>
              <td className="p-2 text-sm">
                <span className="inline-flex">
                  {item.os === 'Linux' && (
                    <Image src="/linux-logo.png" alt="Linux" width={20} height={20} className="mr-2" />
                  )}
                  {item.os === 'Windows' && (
                    <Image src="/windows-logo.png" alt="Windows" width={20} height={20} className="mr-2" />
                  )}
                  {item.os === 'macOS' && (
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
    </div>
  );
};

export default AgentsDetailsTable;