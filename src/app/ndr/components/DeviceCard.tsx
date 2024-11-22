'use client'

import { NDRDeviceListItem } from '@/features/ndr/types/ndr';

interface DeviceCardProps {
    device: NDRDeviceListItem;
    isSelected: boolean;
    onSelect: (deviceName: string) => void;
}

const DeviceCard = ({ device, isSelected, onSelect }: DeviceCardProps) => (
    <div
        onClick={() => onSelect(device.name)}
        className={`h-full cursor-pointer transition-all duration-200 ${
            isSelected 
                ? 'transform scale-[1.02]' 
                : 'hover:scale-[1.01]'
        }`}
    >
        <div className={`
            relative h-full bg-white rounded-lg shadow-md p-6 
            transition-all duration-200
            ${isSelected 
                ? 'ring-2 ring-blue-500 shadow-lg border-l-4 border-blue-500' 
                : 'hover:shadow-lg border-l-4 border-transparent hover:border-gray-200'
            }
        `}>
            {/* Selection Indicator */}
            {isSelected && (
                <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <h3 className={`font-semibold text-lg transition-colors truncate max-w-[70%] ${
                    isSelected ? 'text-blue-600' : 'text-gray-900'
                }`}>
                    {device.label || device.name}
                </h3>
                <span className={`
                    px-3 py-1 rounded-full text-xs font-medium transition-colors
                    ${device.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }
                `}>
                    {device.active ? 'Active' : 'Inactive'}
                </span>
            </div>

            {/* Device Info */}
            <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                    <span className="text-sm truncate">{device.type}</span>
                </div>

                {/* Device Details */}
                <div className="pt-3 border-t border-gray-100 space-y-2">
                    <div className="flex items-center text-xs text-gray-500">
                        <svg className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        <span className="truncate">ID: {device.id.id}</span>
                    </div>
                    {device.customerTitle && (
                        <div className="flex items-center text-xs text-gray-500">
                            <svg className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span className="truncate">Customer: {device.customerTitle}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Selection Hint */}
            <div className={`
                absolute bottom-2 right-2 text-xs
                transition-opacity duration-200
                ${isSelected ? 'opacity-0' : 'opacity-50 group-hover:opacity-100'}
            `}>
                Click to select
            </div>
        </div>
    </div>
);

export default DeviceCard;
