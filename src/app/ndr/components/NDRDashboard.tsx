'use client'

import React, { useEffect, useState } from 'react';
import { useNDR } from '@/features/ndr/hooks/useNDR';
import { ndrService } from '@/features/ndr/services/ndrService';
import { NDRDeviceListItem, NDRDeviceInfo, NDREventsResponse, NDREvent } from '@/features/ndr/types/ndr';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import QueryControls from './QueryControls';
import Pagination from './Pagination';
import DeviceCard from './DeviceCard';
import DeviceInfoCard from './DeviceInfoCard';
import EventList from './EventList';

// User preferences type
interface UserPreferences {
    pageSize: number;
    sortField: keyof NDREvent;
    sortDirection: 'asc' | 'desc';
}

// Default preferences
const DEFAULT_PREFERENCES: UserPreferences = {
    pageSize: 20,
    sortField: '@timestamp',
    sortDirection: 'desc'
};

// Load preferences from localStorage
const loadPreferences = (): UserPreferences => {
    if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
    
    const saved = localStorage.getItem('ndrPreferences');
    if (!saved) return DEFAULT_PREFERENCES;
    
    try {
        return JSON.parse(saved);
    } catch {
        return DEFAULT_PREFERENCES;
    }
};

// Save preferences to localStorage
const savePreferences = (preferences: UserPreferences) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('ndrPreferences', JSON.stringify(preferences));
};

const NDRDashboard = () => {
    const { token } = useNDR();
    const [devices, setDevices] = useState<NDRDeviceListItem[]>([]);
    const [deviceInfo, setDeviceInfo] = useState<NDRDeviceInfo | null>(null);
    const [events, setEvents] = useState<NDREventsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load saved preferences
    const [preferences, setPreferences] = useState<UserPreferences>(loadPreferences);

    // Query parameters state
    const [currentPage, setCurrentPage] = useState(0);
    const [fromDate, setFromDate] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        return date.toISOString().slice(0, 16);
    });
    const [toDate, setToDate] = useState(() => {
        return new Date().toISOString().slice(0, 16);
    });
    const [severity, setSeverity] = useState(1);
    const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

    // Update preferences
    const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
        const updated = { ...preferences, ...newPreferences };
        setPreferences(updated);
        savePreferences(updated);
    };

    const handleSort = (field: keyof NDREvent) => {
        const newDirection = 
            preferences.sortField === field && preferences.sortDirection === 'asc'
                ? 'desc'
                : 'asc';
        
        updatePreferences({
            sortField: field,
            sortDirection: newDirection
        });
    };

    const fetchData = async () => {
        if (token) {
            try {
                setLoading(true);
                setError(null);

                const deviceListResponse = await ndrService.listDeviceInfos(token, '98f1ea80-ea48-11ee-bafb-c3b20c389cc4');
                setDevices(deviceListResponse.data);

                if (deviceListResponse.data.length > 0) {
                    const deviceToUse = selectedDevice || deviceListResponse.data[0].name;
                    setSelectedDevice(deviceToUse);

                    const deviceInfoResponse = await ndrService.getDeviceInfo(token, deviceToUse);
                    if (deviceInfoResponse.length > 0) {
                        setDeviceInfo(deviceInfoResponse[0]);
                    }

                    const fromTimestamp = new Date(fromDate).getTime();
                    const toTimestamp = new Date(toDate).getTime();
                    
                    const [eventsResponse, topBlockingResponse] = await Promise.all([
                        ndrService.getEvents(
                            token,
                            deviceToUse,
                            fromTimestamp,
                            toTimestamp,
                            currentPage,
                            preferences.pageSize
                        ),
                        ndrService.getTopBlocking(
                            token,
                            deviceToUse,
                            fromTimestamp,
                            toTimestamp,
                            severity
                        )
                    ]);

                    // Sort events if needed
                    const sortedEvents = {
                        ...eventsResponse,
                        hits: [...eventsResponse.hits].sort((a, b) => {
                            const aValue = a[preferences.sortField];
                            const bValue = b[preferences.sortField];
                            const direction = preferences.sortDirection === 'asc' ? 1 : -1;
                            
                            if (typeof aValue === 'string' && typeof bValue === 'string') {
                                return aValue.localeCompare(bValue) * direction;
                            }
                            if (typeof aValue === 'number' && typeof bValue === 'number') {
                                return (aValue - bValue) * direction;
                            }
                            return 0;
                        })
                    };

                    setEvents(sortedEvents);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch NDR data');
                console.error('Error fetching NDR data:', err);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, [token, currentPage, preferences.pageSize, selectedDevice, preferences.sortField, preferences.sortDirection]);

    const handleDeviceSelect = (deviceName: string) => {
        setSelectedDevice(deviceName);
        setCurrentPage(0); // Reset to first page when changing devices
    };

    const handlePageSizeChange = (newSize: number) => {
        setCurrentPage(0); // Reset to first page when changing page size
        updatePreferences({ pageSize: newSize });
    };

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

                <QueryControls
                    fromDate={fromDate}
                    toDate={toDate}
                    pageSize={preferences.pageSize}
                    severity={severity}
                    onFromDateChange={setFromDate}
                    onToDateChange={setToDate}
                    onPageSizeChange={handlePageSizeChange}
                    onSeverityChange={setSeverity}
                    onRefresh={fetchData}
                />

                <div className="space-y-6">
                    {/* Devices Section */}
                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-4">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                            </svg>
                            Devices
                            <span className="ml-2 text-sm text-gray-500 font-normal">
                                ({selectedDevice ? 'Selected: ' + (devices.find(d => d.name === selectedDevice)?.label || selectedDevice) : 'None selected'})
                            </span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
                            {devices.map((device) => (
                                <DeviceCard
                                    key={device.id.id}
                                    device={device}
                                    isSelected={selectedDevice === device.name}
                                    onSelect={handleDeviceSelect}
                                />
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
                        {events && events.hits.length > 0 ? (
                            <>
                                <EventList 
                                    events={events.hits}
                                    sortField={preferences.sortField}
                                    sortDirection={preferences.sortDirection}
                                    onSort={handleSort}
                                />
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={Math.ceil((events.total || 0) / preferences.pageSize)}
                                    onPageChange={setCurrentPage}
                                />
                            </>
                        ) : (
                            <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
                                No events found for the selected criteria
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default NDRDashboard;
