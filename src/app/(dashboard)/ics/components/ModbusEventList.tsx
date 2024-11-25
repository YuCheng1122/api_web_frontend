'use client';

import { EventRow } from '@/features/ics/types';
import { AlertTriangle, Clock, Server, Network, Activity, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface EventDetailsDialogProps {
    event: EventRow | null;
    onClose: () => void;
}

export const EventDetailsDialog = ({ event, onClose }: EventDetailsDialogProps) => {
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
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    if (!event) return null;

    // Mobile Dialog
    if (isMobile) {
        return (
            <div className="fixed inset-0 z-50">
                {/* Backdrop with click handler */}
                <div
                    className="absolute inset-0 bg-black bg-opacity-25 transition-opacity"
                    onClick={onClose}
                />

                {/* Dialog Container */}
                <div className="fixed inset-x-4 bottom-4 transform transition-transform">
                    <div className="bg-white rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto mx-auto max-w-lg">
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Activity className="w-5 h-5 text-gray-500" />
                                <h2 className="text-lg font-semibold text-gray-900">Event Details</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 -mr-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="divide-y divide-gray-100">
                            {/* Basic Info */}
                            <div className="px-6 py-4 space-y-3">
                                <div>
                                    <label className="text-xs font-medium text-gray-500">Event ID</label>
                                    <p className="mt-1 text-sm font-medium text-gray-900">{event.event_id}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500">Device ID</label>
                                    <p className="mt-1 text-sm font-medium text-gray-900">{event.device_id}</p>
                                </div>
                            </div>

                            {/* Timing Info */}
                            <div className="px-6 py-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <h3 className="text-sm font-medium text-gray-900">Timing</h3>
                                </div>
                                <div className="ml-6">
                                    <label className="text-xs font-medium text-gray-500">Timestamp</label>
                                    <p className="mt-1 text-sm font-medium text-gray-900">
                                        {new Date(event.timestamp).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {/* Network Info */}
                            <div className="px-6 py-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Network className="w-4 h-4 text-gray-400" />
                                    <h3 className="text-sm font-medium text-gray-900">Network</h3>
                                </div>
                                <div className="ml-6 space-y-4">
                                    <div>
                                        <h4 className="text-xs font-medium text-gray-500">Source</h4>
                                        <p className="mt-1 text-sm font-medium text-gray-900">
                                            {event.source_ip}:{event.source_port}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-medium text-gray-500">Destination</h4>
                                        <p className="mt-1 text-sm font-medium text-gray-900">
                                            {event.destination_ip}:{event.destination_port}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Modbus Info */}
                            <div className="px-6 py-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Server className="w-4 h-4 text-gray-400" />
                                    <h3 className="text-sm font-medium text-gray-900">Modbus</h3>
                                </div>
                                <div className="ml-6 space-y-4">
                                    <div>
                                        <label className="text-xs font-medium text-gray-500">Function</label>
                                        <p className="mt-1 text-sm font-medium text-gray-900">{event.modbus_function}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500">Event Type</label>
                                        <p className="mt-1 text-sm font-medium text-gray-900">{event.event_type}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500">Data</label>
                                        <p className="mt-1 text-sm font-mono bg-gray-50 p-2 rounded-md break-all">
                                            {event.modbus_data}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Alert Status */}
                            {event.alert && (
                                <div className="px-6 py-4">
                                    <div className="flex items-center gap-3 bg-red-50 px-4 py-3 rounded-lg">
                                        <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                        <div>
                                            <h3 className="text-sm font-medium text-red-800">Alert Detected</h3>
                                            <p className="text-sm text-red-600 mt-1">
                                                This event requires attention
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Desktop Dialog remains unchanged
    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
                className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
                onClick={onClose}
            />

            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                        <div className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-gray-500" />
                            <h2 className="text-lg font-semibold text-gray-900">Event Details</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs text-gray-500">Event ID</label>
                                <p className="text-sm font-medium text-gray-900">{event.event_id}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-gray-500">Device ID</label>
                                <p className="text-sm font-medium text-gray-900">{event.device_id}</p>
                            </div>
                        </div>

                        {/* Timing Info */}
                        <div className="border-t pt-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <h3 className="text-sm font-medium text-gray-900">Timing Information</h3>
                            </div>
                            <div className="pl-6">
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-500">Timestamp</label>
                                    <p className="text-sm font-medium text-gray-900">
                                        {new Date(event.timestamp).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Network Info */}
                        <div className="border-t pt-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Network className="w-4 h-4 text-gray-400" />
                                <h3 className="text-sm font-medium text-gray-900">Network Information</h3>
                            </div>
                            <div className="pl-6 grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-xs font-medium text-gray-700 mb-2">Source</h4>
                                    <div className="space-y-2">
                                        <div>
                                            <label className="text-xs text-gray-500">IP Address</label>
                                            <p className="text-sm font-medium text-gray-900">{event.source_ip}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">Port</label>
                                            <p className="text-sm font-medium text-gray-900">{event.source_port}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-xs font-medium text-gray-700 mb-2">Destination</h4>
                                    <div className="space-y-2">
                                        <div>
                                            <label className="text-xs text-gray-500">IP Address</label>
                                            <p className="text-sm font-medium text-gray-900">{event.destination_ip}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500">Port</label>
                                            <p className="text-sm font-medium text-gray-900">{event.destination_port}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modbus Info */}
                        <div className="border-t pt-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Server className="w-4 h-4 text-gray-400" />
                                <h3 className="text-sm font-medium text-gray-900">Modbus Information</h3>
                            </div>
                            <div className="pl-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-500">Function</label>
                                        <p className="text-sm font-medium text-gray-900">{event.modbus_function}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-500">Event Type</label>
                                        <p className="text-sm font-medium text-gray-900">{event.event_type}</p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs text-gray-500">Data</label>
                                    <p className="text-sm font-mono bg-gray-50 p-2 rounded-md break-all">
                                        {event.modbus_data}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Alert Status */}
                        {event.alert && (
                            <div className="border-t pt-4">
                                <div className="flex items-center gap-2 bg-red-50 p-4 rounded-lg">
                                    <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                                    <div>
                                        <h3 className="text-sm font-medium text-red-800">Alert Detected</h3>
                                        <p className="text-sm text-red-600 mt-1">
                                            This event has triggered a security alert and requires attention.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
