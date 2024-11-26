'use client'

import React, { useEffect, useState } from 'react';
import { useNDR } from '@/features/ndr/hooks/useNDR';
import { ndrService } from '@/features/ndr/services/ndrService';
import { NDRDeviceListItem, NDRDeviceInfo, NDREvent, NDRTopBlocking } from '@/features/ndr/types/ndr';
import { LogOut } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import QueryControls from './QueryControls';
import Pagination from './Pagination';
import DeviceCard from './DeviceCard';
import { default as DeviceInfoCard } from './DeviceInfoCard';
import EventList from './EventList';
import TopBlockingList from './TopBlockingList';

interface UserPreferences {
    pageSize: number;
    sortField: keyof NDREvent;
    sortDirection: 'asc' | 'desc';
    severity?: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
    pageSize: 20,
    sortField: '@timestamp',
    sortDirection: 'desc'
};

const loadPreferences = (): UserPreferences => {
    if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
    const saved = localStorage.getItem('ndrPreferences');
    if (!saved) return DEFAULT_PREFERENCES;
    try {
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) };
    } catch {
        return DEFAULT_PREFERENCES;
    }
};

const savePreferences = (preferences: UserPreferences) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('ndrPreferences', JSON.stringify(preferences));
};

const NDRDashboard = () => {
    const { token, decodedToken, logout: ndrLogout } = useNDR();
    const [devices, setDevices] = useState<NDRDeviceListItem[]>([]);
    const [deviceInfo, setDeviceInfo] = useState<NDRDeviceInfo | null>(null);
    const [allEvents, setAllEvents] = useState<NDREvent[]>([]);
    const [totalEvents, setTotalEvents] = useState(0);
    const [topBlocking, setTopBlocking] = useState<NDRTopBlocking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [preferences, setPreferences] = useState<UserPreferences>(loadPreferences);
    const [currentPage, setCurrentPage] = useState(0);
    const [fromDate, setFromDate] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        return date.toISOString().slice(0, 16);
    });
    const [toDate, setToDate] = useState(() => {
        return new Date().toISOString().slice(0, 16);
    });
    const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
    const [isFilterVisible, setIsFilterVisible] = useState(false);

    const handleNDRLogout = () => {
        ndrLogout();
    };

    const getPaginatedEvents = () => {
        const start = currentPage * preferences.pageSize;
        const end = start + preferences.pageSize;
        return allEvents.slice(start, end);
    };

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

        const sortedEvents = [...allEvents].sort((a, b) => {
            const aValue = a[field];
            const bValue = b[field];
            const direction = newDirection === 'asc' ? 1 : -1;

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return aValue.localeCompare(bValue) * direction;
            }
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return (aValue - bValue) * direction;
            }
            return 0;
        });

        setAllEvents(sortedEvents);
    };

    const handleSeverityChange = (severity: number | undefined) => {
        updatePreferences({ severity });
        setCurrentPage(0);
    };

    const fetchData = async () => {
        if (token && decodedToken?.customerId) {
            try {
                setLoading(true);
                setError(null);

                const deviceListResponse = await ndrService.listDeviceInfos(token, decodedToken.customerId);
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
                            0,
                            1000,
                            preferences.severity
                        ),
                        ndrService.getTopBlocking(
                            token,
                            deviceToUse,
                            fromTimestamp,
                            toTimestamp,
                            preferences.severity || 1
                        )
                    ]);

                    const sortedEvents = [...eventsResponse.hits].sort((a, b) => {
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
                    });

                    setAllEvents(sortedEvents);
                    setTotalEvents(eventsResponse.total);
                    setTopBlocking(topBlockingResponse);
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
    }, [token, decodedToken, selectedDevice, preferences.severity, fromDate, toDate]);

    const handleDeviceSelect = (deviceName: string) => {
        setSelectedDevice(deviceName);
        setCurrentPage(0);
    };

    const handlePageSizeChange = (newSize: number) => {
        setCurrentPage(0);
        updatePreferences({ pageSize: newSize });
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorMessage message={error} />;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="p-4">
                {/* 標題和更新時間 */}
                <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <h1 className="text-2xl font-bold text-gray-900">NDR Dashboard</h1>
                        <div className="flex items-center gap-4">
                            <div className="text-sm text-gray-500 flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Last updated: {new Date().toLocaleString()}
                            </div>
                            <button
                                onClick={handleNDRLogout}
                                className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:text-red-800 transition-colors"
                            >
                                <LogOut size={16} />
                                <span>NDR登出</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 篩選器切換按鈕（行動裝置） */}
                <div className="md:hidden mb-4">
                    <button
                        onClick={() => setIsFilterVisible(!isFilterVisible)}
                        className="w-full bg-white p-3 rounded-lg shadow-sm text-gray-700 font-medium flex items-center justify-center"
                    >
                        <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                            />
                        </svg>
                        {isFilterVisible ? '隱藏篩選器' : '顯示篩選器'}
                    </button>
                </div>

                {/* 查詢控制項 */}
                <div className={`md:block ${isFilterVisible ? 'block' : 'hidden'}`}>
                    <QueryControls
                        fromDate={fromDate}
                        toDate={toDate}
                        pageSize={preferences.pageSize}
                        severity={preferences.severity}
                        onFromDateChange={setFromDate}
                        onToDateChange={setToDate}
                        onPageSizeChange={handlePageSizeChange}
                        onSeverityChange={handleSeverityChange}
                        onRefresh={fetchData}
                    />
                </div>

                <div className="space-y-6">
                    {/* 設備選擇 */}
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

                    {/* 設備資訊 */}
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

                    {/* Top Blocking */}
                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-4">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Top Blocking
                        </h2>
                        {topBlocking.length > 0 ? (
                            <TopBlockingList data={topBlocking} />
                        ) : (
                            <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
                                No blocking data found for the selected criteria
                            </div>
                        )}
                    </section>

                    {/* Events */}
                    <section>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Recent Events
                            </h2>
                            <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                                Total: {totalEvents} events
                            </span>
                        </div>
                        {allEvents.length > 0 ? (
                            <>
                                <EventList
                                    events={getPaginatedEvents()}
                                    sortField={preferences.sortField}
                                    sortDirection={preferences.sortDirection}
                                    onSort={handleSort}
                                />
                                <div className="mt-4">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={Math.ceil(allEvents.length / preferences.pageSize)}
                                        onPageChange={setCurrentPage}
                                    />
                                </div>
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
