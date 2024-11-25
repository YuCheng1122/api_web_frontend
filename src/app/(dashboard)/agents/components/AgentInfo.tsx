'use client'

import Image from 'next/image';
import { AgentDashboardDetailType } from '@/features/agents/types/agent';

interface AgentInfoProps {
    data: AgentDashboardDetailType;
}

export default function AgentInfo({ data }: AgentInfoProps) {
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

    return (
        <div className="bg-white shadow-sm border rounded-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                {/* Basic Info */}
                <div className="p-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-4">Basic Information</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs text-gray-500">Agent ID</label>
                            <p className="text-sm font-medium text-gray-900">{data.agent_id}</p>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500">Status</label>
                            <div className="mt-1">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(data.agent_status).badge
                                    }`}>
                                    <span className={`w-2 h-2 rounded-full mr-1.5 ${getStatusStyle(data.agent_status).dot
                                        }`}></span>
                                    {data.agent_status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Network Info */}
                <div className="p-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-4">Network Information</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs text-gray-500">IP Address</label>
                            <p className="text-sm font-medium text-gray-900 font-mono">{data.ip}</p>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500">Agent Name</label>
                            <p className="text-sm font-medium text-gray-900">{data.agent_name}</p>
                        </div>
                    </div>
                </div>

                {/* System Info */}
                <div className="p-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-4">System Information</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs text-gray-500">Operating System</label>
                            <div className="mt-1 flex items-center">
                                {getOSIcon(data.os) && (
                                    <Image
                                        src={getOSIcon(data.os)!}
                                        alt={data.os}
                                        width={16}
                                        height={16}
                                        className="mr-2"
                                    />
                                )}
                                <span className="text-sm font-medium text-gray-900">{data.os}</span>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500">Version</label>
                            <p className="text-sm font-medium text-gray-900">{data.os_version}</p>
                        </div>
                    </div>
                </div>

                {/* Activity Info */}
                <div className="p-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-4">Activity Information</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs text-gray-500">Last Keep Alive</label>
                            <p className="text-sm font-medium text-gray-900">{data.last_keep_alive}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
