'use client';

import React, { useEffect } from 'react';
import { useNDR } from '../../../../features/ndr/hooks/useNDR';
import { ndrService } from '../../../../features/ndr/services/ndrService';
import { LogOut } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import QueryControls from './QueryControls';
import Pagination from './Pagination';
import DeviceCard from './DeviceCard';
import { default as DeviceInfoCard } from './DeviceInfoCard';
import EventList from './EventList';
import TopBlockingList from './TopBlockingList';
import { useNDRData } from '../contexts/NDRContext';

const NDRDashboard = () => {
    const { token, decodedToken, logout: ndrLogout } = useNDR();
    const {
        devices,
        deviceInfo,
        allEvents,
        totalEvents,
        topBlocking,
        loading,
        error,
        preferences,
        currentPage,
        fromDate,
        toDate,
        selectedDevice,
        setDevices,
        setDeviceInfo,
        setAllEvents,
        setTotalEvents,
        setTopBlocking,
        setLoading,
        setError,
        updatePreferences,
        setCurrentPage,
        setFromDate,
        setToDate,
        setSelectedDevice,
    } = useNDRData();

    const handleNDRLogout = () => {
        ndrLogout();
    };

    const getPaginatedEvents = () => {
        const start = currentPage * preferences.pageSize;
        const end = start + preferences.pageSize;
        return allEvents.slice(start, end);
    };

    const handleSort = (field: keyof typeof allEvents[0]) => {
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
                setError(err instanceof Error ? err.message : '無法獲取 NDR 資料');
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
                        <h1 className="text-2xl font-bold text-gray-900">NDR 儀表板</h1>
                        <div className="flex items-center gap-4">
                            <div className="text-sm text-gray-500 flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                最後更新：{new Date().toLocaleString()}
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

                {/* 查詢控制項 */}
                <div className="mb-6">
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
                            設備
                            <span className="ml-2 text-sm text-gray-500 font-normal">
                                ({selectedDevice ? '已選擇：' + (devices.find(d => d.name === selectedDevice)?.label || selectedDevice) : '未選擇'})
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
                                系統狀態
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
                            阻擋排行
                        </h2>
                        {topBlocking.length > 0 ? (
                            <TopBlockingList data={topBlocking} />
                        ) : (
                            <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
                                在所選條件下未找到阻擋資料
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
                                最近事件
                            </h2>
                            <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                                總計：{totalEvents} 個事件
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
                                在所選條件下未找到事件
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default NDRDashboard;
