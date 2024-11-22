'use client'

import React, { useEffect, useState } from 'react';
import { useNDR } from '@/features/ndr/hooks/useNDR';
import { ndrService } from '@/features/ndr/services/ndrService';
import { NDRDeviceListItem, NDRDeviceInfo, NDREventsResponse } from '@/features/ndr/types/ndr';

const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-8">
        <div className="w-8 h-8 border-t-2 border-blue-500 rounded-full animate-spin"></div>
    </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
    <div className="p-4 bg-red-100 text-red-700 rounded-lg shadow">
        <p className="font-semibold">Error</p>
        <p>{message}</p>
    </div>
);

const DeviceCard = ({ device }: { device: NDRDeviceListItem }) => (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
        <h3 className="font-semibold text-lg mb-2">{device.label || device.name}</h3>
        <div className="space-y-1 text-sm text-gray-600">
            <p>Type: {device.type}</p>
            <p>Status: <span className={`font-semibold ${device.active ? 'text-green-600' : 'text-red-600'}`}>
                {device.active ? 'Active' : 'Inactive'}
            </span></p>
            <p className="text-xs text-gray-500">ID: {device.id.id}</p>
        </div>
    </div>
);

const DeviceInfoCard = ({ info }: { info: NDRDeviceInfo }) => (
    <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="font-semibold text-lg mb-3">Device Information</h3>
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <div>
                    <p className="text-sm text-gray-600">CPU Usage</p>
                    <p className="font-semibold">{info.cpu_usage[0]}%</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Memory Usage</p>
                    <p className="font-semibold">{(info.memory_usage[0] / 1024 / 1024).toFixed(2)} MB</p>
                </div>
            </div>
            <div className="space-y-2">
                <div>
                    <p className="text-sm text-gray-600">Device Version</p>
                    <p className="font-semibold">{info.device_version}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">NIDS Version</p>
                    <p className="font-semibold">{info.nids_version}</p>
                </div>
            </div>
        </div>
    </div>
);

const EventCard = ({ event }: { event: any }) => (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-2">
            <div className="flex items-center">
                <span className={`w-2 h-2 rounded-full mr-2 ${
                    event.severity === 1 ? 'bg-red-500' :
                    event.severity === 2 ? 'bg-yellow-500' :
                    'bg-blue-500'
                }`}></span>
                <h4 className="font-semibold">{event.eventname}</h4>
            </div>
            <span className="text-xs text-gray-500">
                {new Date(event['@timestamp']).toLocaleString()}
            </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
                <p className="text-gray-600">Source</p>
                <p>{event.src_ip}:{event.src_port}</p>
            </div>
            <div>
                <p className="text-gray-600">Destination</p>
                <p>{event.dest_ip}:{event.dest_port}</p>
            </div>
            <div>
                <p className="text-gray-600">Protocol</p>
                <p>{event.proto}</p>
            </div>
            <div>
                <p className="text-gray-600">Category</p>
                <p>{event.category}</p>
            </div>
        </div>
        {event.signature && (
            <div className="mt-2 text-sm">
                <p className="text-gray-600">Signature</p>
                <p className="text-xs bg-gray-50 p-1 rounded">{event.signature}</p>
            </div>
        )}
    </div>
);

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
        <div className="container mx-auto p-4 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">NDR Dashboard</h1>
                <div className="text-sm text-gray-500">
                    Last updated: {new Date().toLocaleString()}
                </div>
            </div>

            {/* Devices Grid */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Devices</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {devices.map((device, index) => (
                        <DeviceCard key={device.id.id} device={device} />
                    ))}
                </div>
            </div>

            {/* Device Info */}
            {deviceInfo && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">System Status</h2>
                    <DeviceInfoCard info={deviceInfo} />
                </div>
            )}

            {/* Events Section */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Recent Events</h2>
                    <span className="text-sm text-gray-500">
                        Total: {events?.total || 0} events
                    </span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {events?.hits.map((event, index) => (
                        <EventCard key={index} event={event} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NDRDashboard;
