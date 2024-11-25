'use client'

import { useState, useEffect } from 'react'
import { fetchAgentDetails } from "@/features/agents/api/fetchAgentDetails"
import AgentsDetailsTable from "./components/AgentsDetailsTable"
import { Search, Filter, RefreshCw } from 'lucide-react'

const AgentsInfo = () => {
    const [agentsData, setAgentsData] = useState<any[]>([])
    const [filteredData, setFilteredData] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedStatus, setSelectedStatus] = useState('all')
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const result = await fetchAgentDetails()

            if (result.success) {
                setAgentsData(result.content)
                setFilteredData(result.content)
            } else {
                throw new Error('Failed to fetch agents info')
            }
        } catch (error) {
            console.log(error)
            setError("Failed to fetch agents info")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        let filtered = agentsData

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(agent =>
                agent.agent_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                agent.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
                agent.os.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Apply status filter
        if (selectedStatus !== 'all') {
            filtered = filtered.filter(agent =>
                agent.agent_status.toLowerCase() === selectedStatus.toLowerCase()
            )
        }

        setFilteredData(filtered)
    }, [searchTerm, selectedStatus, agentsData])

    const getStatusCounts = () => {
        const counts = agentsData.reduce((acc, agent) => {
            const status = agent.agent_status.toLowerCase();
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            active: counts['active'] || 0,
            disconnected: counts['disconnected'] || 0
        };
    }

    const { active, disconnected } = getStatusCounts()

    return (
        <div className={`space-y-4 sm:space-y-6 p-4 ${isMobile ? 'pb-20' : 'sm:p-6'}`}>
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Agent Management</h1>
                <button
                    onClick={fetchData}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm bg-white border rounded-lg hover:bg-gray-50 transition-colors sm:ml-auto"
                >
                    <RefreshCw size={16} />
                    <span>Refresh</span>
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
                    <h3 className="text-sm font-medium text-gray-500">Total Agents</h3>
                    <p className="mt-2 text-2xl sm:text-3xl font-semibold text-gray-900">{agentsData.length}</p>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
                    <h3 className="text-sm font-medium text-gray-500">Active Agents</h3>
                    <p className="mt-2 text-2xl sm:text-3xl font-semibold text-green-600">{active}</p>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
                    <h3 className="text-sm font-medium text-gray-500">Disconnected Agents</h3>
                    <p className="mt-2 text-2xl sm:text-3xl font-semibold text-red-600">{disconnected}</p>
                </div>
            </div>

            {/* Filters Section - Mobile */}
            {isMobile && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-10 space-y-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search agents..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="disconnected">Disconnected</option>
                        </select>
                    </div>
                    <div className="text-sm text-gray-500 text-center">
                        Showing {filteredData.length} of {agentsData.length} agents
                    </div>
                </div>
            )}

            {/* Filters Section - Desktop */}
            {!isMobile && (
                <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by name, IP, or OS..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="relative min-w-[200px]">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="disconnected">Disconnected</option>
                            </select>
                        </div>
                    </div>

                    {/* Results count */}
                    <div className="text-sm text-gray-500">
                        Showing {filteredData.length} of {agentsData.length} agents
                    </div>
                </div>
            )}

            {/* Table Section */}
            <div className="bg-white rounded-lg shadow-sm border">
                {error ? (
                    <div className="p-6 text-center">
                        <p className="text-red-500">{error}</p>
                        <button
                            onClick={fetchData}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <AgentsDetailsTable
                        agentsData={filteredData}
                        isLoading={isLoading}
                    />
                )}
            </div>
        </div>
    )
}

export default AgentsInfo
