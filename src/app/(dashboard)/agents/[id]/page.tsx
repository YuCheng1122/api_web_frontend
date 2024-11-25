'use client'

import { usePathname } from 'next/navigation';
import { useEffect, useState } from "react";
import { Loader2, AlertCircle } from 'lucide-react';
import AgentInfo from "../components/AgentInfo";
import { fetchAgentInfo } from "@/features/agents/api/fetchAgentInfo";
import { fetchMitreData } from "@/features/agents/api/fetchMitreData";
import { AgentDashboardDetailType, MitreDisplayData } from "@/features/agents/types/agent";

export default function AgentDashboardPage() {
    const pathname = usePathname();
    const [agentData, setAgentData] = useState<AgentDashboardDetailType | null>(null);
    const [error, setError] = useState<any>(null);
    const [mitreData, setMitreData] = useState<MitreDisplayData[] | null>(null);
    const [mitreError, setMitreError] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    useEffect(() => {
        async function fetchData(agentId: string) {
            setLoading(true);
            try {
                const [agentResponse, mitreResponse] = await Promise.all([
                    fetchAgentInfo({ id: agentId }),
                    fetchMitreData({ id: agentId })
                ]);

                if (agentResponse.success) {
                    setAgentData(agentResponse.content);
                } else {
                    throw new Error('Failed to fetch agent info');
                }

                if (mitreResponse.success) {
                    setMitreData(mitreResponse.content);
                }
            } catch (err: any) {
                setError(err.message || 'Failed to fetch agent data');
            } finally {
                setLoading(false);
            }
        }

        if (pathname) {
            const agentId = pathname.split('/').pop();
            if (agentId) {
                fetchData(agentId);
            }
        }
    }, [pathname]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    <p className="text-gray-500">Loading agent information...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-red-50 text-red-800 rounded-lg p-6 max-w-md">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-5 h-5" />
                        <h3 className="text-lg font-semibold">Error Loading Data</h3>
                    </div>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        );
    }

    if (!agentData) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-yellow-50 text-yellow-800 rounded-lg p-6 max-w-md">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-5 h-5" />
                        <h3 className="text-lg font-semibold">No Data Available</h3>
                    </div>
                    <p className="text-sm">Could not find agent information</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6 space-y-6">
            {/* Agent Info Section */}
            <div className="w-full">
                <AgentInfo data={agentData} />
            </div>

            {/* Security Overview Section */}
            <div className={`grid gap-6 ${isMobile
                    ? 'grid-cols-1'
                    : 'grid-cols-1 lg:grid-cols-2'
                }`}>
                {/* MITRE ATT&CK Overview */}
                {mitreData && mitreData.length > 0 && (
                    <div className="bg-white shadow-sm border rounded-lg overflow-hidden">
                        <div className="border-b px-6 py-4">
                            <h2 className="text-lg font-semibold text-gray-900">Security Events</h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {mitreData.map((event, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between py-3 border-b last:border-b-0"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
                                                {event.count}
                                            </span>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {event.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    MITRE ATT&CK Technique
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Agent Activity Timeline */}
                <div className="bg-white shadow-sm border rounded-lg overflow-hidden">
                    <div className="border-b px-6 py-4">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Last Keep Alive</p>
                                    <p className="text-xs text-gray-500">{agentData.last_keep_alive}</p>
                                </div>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${agentData.agent_status.toLowerCase() === 'active'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                    {agentData.agent_status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error Messages */}
            {mitreError && (
                <div className="bg-yellow-50 text-yellow-800 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        <p className="text-sm">Failed to load security events: {mitreError}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
