'use client'

import { NDRDeviceInfo } from '../../../../features/ndr/types/ndr';

interface DeviceInfoCardProps {
    info: NDRDeviceInfo;
}

const DeviceInfoCard = ({ info }: DeviceInfoCardProps) => {
    const getUsageColor = (usage: number) => {
        if (usage >= 80) return 'text-red-600';
        if (usage >= 60) return 'text-yellow-600';
        return 'text-green-600';
    };

    const formatUsage = (usage: number) => {
        // 確保使用率在0-100之間
        const normalizedUsage = Math.min(Math.max(usage, 0), 100);
        return `${normalizedUsage.toFixed(1)}%`;
    };

    const calculateMemoryUsage = (memoryArray: number[]) => {
        if (!memoryArray || memoryArray.length < 2) return 0;
        const totalMemory = memoryArray[0];
        const usedMemory = memoryArray[1];
        if (totalMemory === 0) return 0;
        return (usedMemory / totalMemory) * 100;
    };

    const formatBytes = (bytes: number) => {
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        let value = bytes;
        let unitIndex = 0;
        while (value >= 1024 && unitIndex < units.length - 1) {
            value /= 1024;
            unitIndex++;
        }
        return `${value.toFixed(1)} ${units[unitIndex]}`;
    };

    const UsageIndicator = ({
        label,
        value,
        icon,
        detail
    }: {
        label: string;
        value: number;
        icon: React.ReactNode;
        detail?: string;
    }) => (
        <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
                {icon}
                <span className="text-sm font-medium text-gray-600">{label}</span>
            </div>
            <div className="relative pt-1">
                <div className="flex items-center justify-between">
                    <div>
                        <span className={`text-xl font-bold ${getUsageColor(value)}`}>
                            {formatUsage(value)}
                        </span>
                        {detail && (
                            <span className="ml-2 text-sm text-gray-500">
                                ({detail})
                            </span>
                        )}
                    </div>
                </div>
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-100">
                    <div
                        style={{ width: `${Math.min(value, 100)}%` }}
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${value >= 80 ? 'bg-red-500' :
                            value >= 60 ? 'bg-yellow-500' :
                                'bg-green-500'
                            }`}
                    />
                </div>
            </div>
        </div>
    );

    const VersionInfo = ({ label, version }: { label: string; version: string }) => (
        <div className="space-y-1">
            <span className="text-sm font-medium text-gray-500">{label}</span>
            <p className="text-base text-gray-900">{version}</p>
        </div>
    );

    // 計算CPU和Memory使用率
    const currentCpuUsage = info.cpu_usage[info.cpu_usage.length - 1] || 0;
    const memoryUsage = calculateMemoryUsage(info.memory_usage);
    const memoryDetail = info.memory_usage && info.memory_usage.length >= 2
        ? `${formatBytes(info.memory_usage[1])} / ${formatBytes(info.memory_usage[0])}`
        : undefined;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 space-y-6">
                {/* 使用率指標 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <UsageIndicator
                        label="CPU 使用率"
                        value={currentCpuUsage}
                        icon={
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                            </svg>
                        }
                    />
                    <UsageIndicator
                        label="記憶體使用率"
                        value={memoryUsage}
                        detail={memoryDetail}
                        icon={
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                    />
                </div>

                {/* 版本資訊 */}
                <div className="pt-6 border-t border-gray-200">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">版本資訊</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <VersionInfo label="韌體版本" version={info.device_version} />
                        <VersionInfo label="NIDS 版本" version={info.nids_version} />
                        <VersionInfo label="IOC 版本" version={info.ioc_version} />
                    </div>
                </div>

                {/* 行動版提示 */}
                <div className="md:hidden text-xs text-gray-400 text-center pt-4">
                    左右滑動查看更多詳情
                </div>
            </div>
        </div>
    );
};

export default DeviceInfoCard;
