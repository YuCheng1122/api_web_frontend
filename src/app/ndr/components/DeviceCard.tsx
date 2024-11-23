'use client'

import { NDRDeviceListItem } from '@/features/ndr/types/ndr';

interface DeviceCardProps {
    device: NDRDeviceListItem;
    isSelected: boolean;
    onSelect: (deviceName: string) => void;
}

const DeviceCard = ({ device, isSelected, onSelect }: DeviceCardProps) => {
    const getStatusColor = (active: boolean) => {
        return active
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800';
    };

    const getStatusText = (active: boolean) => {
        return active ? 'Active' : 'Inactive';
    };

    return (
        <button
            onClick={() => onSelect(device.name)}
            className={`w-full text-left transition-all duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                isSelected 
                    ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500' 
                    : 'bg-white border-gray-200 hover:border-indigo-300'
            } border rounded-lg shadow-sm p-4`}
        >
            <div className="space-y-3">
                {/* 標題和狀態 */}
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                            {device.label || device.name}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2">
                            {device.additionalInfo?.description || 'No description available'}
                        </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(device.active)}`}>
                        {getStatusText(device.active)}
                    </span>
                </div>

                {/* 設備詳情 */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                        <p className="text-xs font-medium text-gray-500">Device Type</p>
                        <p className="text-sm text-gray-900 truncate">{device.type}</p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500">Profile</p>
                        <p className="text-sm text-gray-900 truncate">{device.deviceProfileName}</p>
                    </div>
                </div>

                {/* 選擇指示器 */}
                {isSelected && (
                    <div className="absolute top-2 right-2">
                        <svg 
                            className="w-5 h-5 text-indigo-600" 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                        >
                            <path 
                                fillRule="evenodd" 
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                                clipRule="evenodd" 
                            />
                        </svg>
                    </div>
                )}

                {/* 觸控提示（僅在行動裝置顯示） */}
                <div className="md:hidden mt-2 text-xs text-gray-400 text-center">
                    Tap to select
                </div>
            </div>
        </button>
    );
};

export default DeviceCard;
