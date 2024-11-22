'use client'

import React, { useEffect, useState } from 'react';
import { useNDR } from '@/features/ndr/hooks/useNDR';
import { ndrService } from '@/features/ndr/services/ndrService';
import { NDRDeviceListItem, NDRDeviceInfo, NDREventsResponse } from '@/features/ndr/types/ndr';

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="relative">
            <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin border-t-blue-500"></div>
            <div className="mt-4 text-gray-600">Loading data...</div>
        </div>
    </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
    <div className="p-6 bg-red-50 rounded-lg shadow-sm border border-red-100 mx-auto max-w-2xl mt-8">
        <div className="flex items-center mb-3">
            <svg className="w-6 h-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-red-700">Error</h3>
        </div>
        <p className="text-red-600">{message}</p>
    </div>
);

const DeviceCard = ({ device }: { device: NDRDeviceListItem }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all border-l-4 border-blue-500 group cursor-pointer">
        <div className="flex justify-between items-start mb-4">
            <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
                {device.label || device.name}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium transition-colors
                ${device.active 
                    ? 'bg-green-100 text-green-800 group-hover:bg-green-200' 
                    : 'bg-red-100 text-red-800 group-hover:bg-red-200'}`}>
                {device.active ? 'Active' : 'Inactive'}
            </span>
        </div>
        <div className="space-y-2">
            <div className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-2 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
                <span className="text-sm">{device.type}</span>
            </div>
            <div className="text-xs text-gray-500 mt-2 pt-2 border-t">
                ID: {device.id.id}
            </div>
        </div>
    </div>
);

const DeviceInfoCard = ({ info }: { info: NDRDeviceInfo }) => {
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
                {/* Left Column - Usage Metrics */}
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

                {/* Right Column - Version Info */}
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

const EventCard = ({ event }: { event: any }) => {
    const getSeverityColor = (severity: number) => {
        switch (severity) {
            case 1: return 'bg-red-500';
            case 2: return 'bg-yellow-500';
            case 3: return 'bg-blue-500';
            default: return 'bg-gray-500';
        }
    };

    const getSeverityText = (severity: number) => {
        switch (severity) {
            case 1: return 'High';
            case 2: return 'Medium';
            case 3: return 'Low';
            default: return 'Unknown';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all border-l-4 border-gray-200 group">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <span className={`w-3 h-3 rounded-full ${getSeverityColor(event.severity)} group-hover:animate-pulse`}></span>
                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {getSeverityText(event.severity)}
                        </span>
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{event.eventname}</h4>
                        <p className="text-xs text-gray-500">{new Date(event['@timestamp']).toLocaleString()}</p>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="bg-gray-50 p-2 rounded group-hover:bg-gray-100 transition-colors">
                    <p className="text-xs text-gray-500 mb-1">Source</p>
                    <p className="text-sm font-mono">{event.src_ip}:{event.src_port}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded group-hover:bg-gray-100 transition-colors">
                    <p className="text-xs text-gray-500 mb-1">Destination</p>
                    <p className="text-sm font-mono">{event.dest_ip}:{event.dest_port}</p>
                </div>
            </div>
            <div className="flex justify-between text-sm">
                <div>
                    <span className="text-gray-500 mr-2">Protocol:</span>
                    <span className="font-medium">{event.proto}</span>
                </div>
                <div>
                    <span className="text-gray-500 mr-2">Category:</span>
                    <span className="font-medium">{event.category || 'N/A'}</span>
                </div>
            </div>
            {event.signature && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Signature</p>
                    <p className="text-sm bg-gray-50 p-2 rounded font-mono group-hover:bg-gray-100 transition-colors">{event.signature}</p>
                </div>
            )}
        </div>
    );
};

const NDRDashboard = () => {
    const { token } = useNDR();
    const [devices, setDevices] = useState<NDRDeviceListItem[]>([]);
    const [deviceInfo, setDeviceInfo] = useState<NDRDeviceInfo | null>(null);
    const [events, setEvents] = useState<NDREventsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (token) {
                try {
                    setLoading(true);
                    setError(null);

                    const deviceListResponse = await ndrService.listDeviceInfos(token, '98f1ea80-ea48-11ee-bafb-c3b20c389cc4');
                    setDevices(deviceListResponse.data);

                    if (deviceListResponse.data.length > 0) {
                        const firstDevice = deviceListResponse.data[0];
                        const deviceInfoResponse = await ndrService.getDeviceInfo(token, firstDevice.name);
                        if (deviceInfoResponse.length > 0) {
                            setDeviceInfo(deviceInfoResponse[0]);
                        }

                        const now = Date.now();
                        const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
                        
                        const eventsResponse = await ndrService.getEvents(
                            token,
                            firstDevice.name,
                            thirtyDaysAgo,
                            now
                        );
                        setEvents(eventsResponse);
                    }
                } catch (err) {
                    setError(err instanceof Error ? err.message : 'Failed to fetch NDR data');
                    console.error('Error fetching NDR data:', err);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [token]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-100 overflow-auto">
            <div className="max-w-[1600px] mx-auto px-4 py-6">
                <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900">NDR Dashboard</h1>
                        <div className="text-sm text-gray-500 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Last updated: {new Date().toLocaleString()}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Devices Section */}
                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-4">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                            </svg>
                            Devices
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {devices.map((device, index) => (
                                <DeviceCard key={device.id.id} device={device} />
                            ))}
                        </div>
                    </section>

                    {/* Device Info Section */}
                    {deviceInfo && (
                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-4">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                System Status
                            </h2>
                            <DeviceInfoCard info={deviceInfo} />
                        </section>
                    )}

                    {/* Events Section */}
                    <section>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Recent Events
                            </h2>
                            <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                                Total: {events?.total || 0} events
                            </span>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {events?.hits.map((event, index) => (
                                <EventCard key={index} event={event} />
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default NDRDashboard;
