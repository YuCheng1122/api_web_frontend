'use client'

import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2, ChevronRight } from 'lucide-react';

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
    isLoading: boolean;
}

const AgentsDetailsTable = ({ agentsData, isLoading }: AgentsDetailsTableProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isMobile, setIsMobile] = useState(false);
    const totalPages = Math.ceil(agentsData.length / itemsPerPage);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    const currentItems = agentsData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            if (i <= 3 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                pageNumbers.push(
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={`px-3 py-1 rounded-md ${currentPage === i
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        {i}
                    </button>
                );
            } else if (i === 4 && currentPage > 4) {
                pageNumbers.push(<span key="ellipsis-1" className="px-2">...</span>);
            } else if (i === totalPages - 1 && currentPage < totalPages - 3) {
                pageNumbers.push(<span key="ellipsis-2" className="px-2">...</span>);
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

    const getOSIcon = (os: string) => {
        const osType = determineOS(os);
        const iconMap = {
            'linux': '/linux-logo.png',
            'windows': '/windows-logo.png',
            'macos': '/mac-logo.png'
        };
        return iconMap[osType as keyof typeof iconMap] || null;
    };

    const getStatusStyle = (status: string) => {
        const statusLower = status.toLowerCase();
        if (statusLower === 'active') {
            return {
                badge: 'bg-green-100 text-green-800',
                dot: 'bg-green-400'
            };
        } else if (statusLower === 'disconnected') {
            return {
                badge: 'bg-red-100 text-red-800',
                dot: 'bg-red-400'
            };
        } else {
            return {
                badge: 'bg-gray-100 text-gray-800',
                dot: 'bg-gray-400'
            };
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (agentsData.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <div className="text-lg font-medium">No agents found</div>
                <p className="text-sm mt-2">Try adjusting your search or filters</p>
            </div>
        );
    }

    // Mobile Card View
    if (isMobile) {
        return (
            <div className="flex flex-col">
                <div className="space-y-4 p-4">
                    {currentItems.map((item, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-sm border p-4">
                            <div className="flex items-center justify-between mb-3">
                                <Link
                                    href={`/agents/${item.agent_name}`}
                                    className="text-blue-600 font-medium flex items-center"
                                >
                                    {item.agent_name}
                                    <ChevronRight size={16} className="ml-1" />
                                </Link>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(item.agent_status).badge
                                    }`}>
                                    <span className={`w-2 h-2 rounded-full mr-1.5 ${getStatusStyle(item.agent_status).dot
                                        }`}></span>
                                    {item.agent_status}
                                </span>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">IP Address</span>
                                    <span className="font-medium">{item.ip}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">OS</span>
                                    <span className="font-medium flex items-center">
                                        {getOSIcon(item.os) && (
                                            <Image
                                                src={getOSIcon(item.os)!}
                                                alt={item.os}
                                                width={16}
                                                height={16}
                                                className="mr-2"
                                            />
                                        )}
                                        {item.os}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">Last Active</span>
                                    <span className="text-gray-600">{item.last_keep_alive}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">Registered</span>
                                    <span className="text-gray-600">{item.registration_time}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile Pagination */}
                <div className="border-t border-gray-200 px-4 py-3 flex flex-col gap-3">
                    <select
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="w-full border rounded-md px-2 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value={5}>5 per page</option>
                        <option value={10}>10 per page</option>
                        <option value={25}>25 per page</option>
                        <option value={50}>50 per page</option>
                    </select>

                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 text-sm rounded-md bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-600">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 text-sm rounded-md bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Desktop Table View
    return (
        <div className="flex-grow flex flex-col">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 text-left text-gray-600 text-sm">
                            <th className="p-4 font-medium">Agent Name</th>
                            <th className="p-4 font-medium">IP Address</th>
                            <th className="p-4 font-medium">Operating System</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium">Last Keep Alive</th>
                            <th className="p-4 font-medium">Registration Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {currentItems.map((item, index) => (
                            <tr
                                key={index}
                                className="text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <td className="p-4">
                                    <Link
                                        href={`/agents/${item.agent_name}`}
                                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                                    >
                                        {item.agent_name}
                                    </Link>
                                </td>
                                <td className="p-4">{item.ip}</td>
                                <td className="p-4">
                                    <span className="inline-flex items-center">
                                        {getOSIcon(item.os) && (
                                            <Image
                                                src={getOSIcon(item.os)!}
                                                alt={item.os}
                                                width={20}
                                                height={20}
                                                className="mr-2"
                                            />
                                        )}
                                        {item.os}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(item.agent_status).badge
                                        }`}>
                                        <span className={`w-2 h-2 rounded-full mr-1.5 ${getStatusStyle(item.agent_status).dot
                                            }`}></span>
                                        {item.agent_status}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-500">{item.last_keep_alive}</td>
                                <td className="p-4 text-gray-500">{item.registration_time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Desktop Pagination */}
            <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <select
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="border rounded-md px-2 py-1 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value={10}>10 per page</option>
                        <option value={25}>25 per page</option>
                        <option value={50}>50 per page</option>
                        <option value={100}>100 per page</option>
                    </select>
                    <span className="text-sm text-gray-500">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, agentsData.length)} of {agentsData.length} entries
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <div className="flex items-center gap-1">
                        {renderPageNumbers()}
                    </div>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AgentsDetailsTable;
