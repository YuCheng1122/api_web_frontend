'use client'

import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AgentDetailType } from '@/features/agents/types/agent';

interface AgentDetails {
    agent_name: string;
    ip: string;
    os: string;
    agent_status: string;
    last_keep_alive: string;
    registration_time: string;
}

interface AgentsDetailsTableProps {
    agentsData: AgentDetails[];
}

const AgentsDetailsTable = ({ agentsData }: AgentsDetailsTableProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const totalPages = Math.ceil(agentsData.length / itemsPerPage);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowTooltip(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

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
                pageNumbers.push(<span key="ellipsis-1">...</span>);
            } else if (i === totalPages - 1 && currentPage < totalPages - 2) {
                pageNumbers.push(<span key="ellipsis-2">...</span>);
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
            {showTooltip && (
                <div className="absolute bottom-4 left-4 bg-gray-700 text-white p-2 rounded flex items-center">
                    <span>所有代理名稱皆可點擊以查看更多資訊</span>
                    <button
                        className="ml-2 text-white hover:underline"
                        onClick={() => setShowTooltip(false)}
                    >
                        ×
                    </button>
                </div>
            )}
            <table className="w-full">
                <thead>
                    <tr className="text-left text-gray-700 font-bold border-b border-gray-300">
                        <th className="w-[10%] p-2">代理名稱</th>
                        <th className="w-[10%] p-2">IP 地址</th>
                        <th className="w-[12%] p-2">作業系統</th>
                        <th className="w-[8%] p-2">狀態</th>
                        <th className="w-[14%] p-2">最後保持活躍</th>
                        <th className="w-[14%] p-2">註冊時間</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((item, index) => (
                        <tr key={index} className="text-gray-600 border-b border-gray-300">
                            <td className="p-2 text-sm">
                                <Link href={`/src/app/(dashboard)/agents/${item.agent_name}`}>
                                    <p className="hover:underline" title="點擊以查看更多資訊">{item.agent_name}</p>
                                </Link>
                            </td>
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
                            <td className="p-2 text-sm">{item.registration_time}</td>
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
                            setCurrentPage(1);
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
                        &lt; 上一頁
                    </button>
                    <div className="flex space-x-2">
                        {renderPageNumbers()}
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
        </div>
    );
};

export default AgentsDetailsTable;
