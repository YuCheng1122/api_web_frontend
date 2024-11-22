'use client'

import { NDRDeviceInfo } from '@/features/ndr/types/ndr';

interface DeviceInfoCardProps {
    info: NDRDeviceInfo;
}

const DeviceInfoCard = ({ info }: DeviceInfoCardProps) => {
    const cpuUsage = info.cpu_usage[0];
    const usedMemory = info.memory_usage[0];
    const totalMemory = info.memory_usage[1];
    
    const getUsageColor = (usage: number) => {
        if (usage > 80) return 'bg-red-500';
        if (usage > 60) return 'bg-yellow-500';
        return 'bg-blue-500';
    };

    const formatMemorySize = (bytes: number) => {
        const mb = bytes / 1024 / 1024;
        if (mb < 1024) {
            return `${mb.toFixed(2)} MB`;
        }
        return `${(mb / 1024).toFixed(2)} GB`;
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-lg mb-6">System Metrics</h3>
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 space-y-6">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600">CPU Usage</span>
                            <span className={`text-lg font-semibold ${Number(cpuUsage) > 80 ? 'text-red-600' : ''}`}>
                                {cpuUsage}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div 
                                className={`${getUsageColor(Number(cpuUsage))} rounded-full h-2 transition-all`}
                                style={{ width: `${cpuUsage}%` }}
                            ></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Memory Usage</span>
                            <span className="text-lg font-semibold">
                                {formatMemorySize(usedMemory)} / {formatMemorySize(totalMemory)}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex-1 space-y-6">
                    <div>
                        <span className="text-gray-600 block mb-2">Device Version</span>
                        <div className="font-mono text-sm bg-gray-50 p-2 rounded">
                            {info.device_version}
                        </div>
                    </div>
                    <div>
                        <span className="text-gray-600 block mb-2">NIDS Version</span>
                        <div className="font-mono text-sm bg-gray-50 p-2 rounded">
                            {info.nids_version}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeviceInfoCard;
