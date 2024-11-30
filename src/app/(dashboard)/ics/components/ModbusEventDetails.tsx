'use client';

import { useEffect, useState } from 'react';
import { EventDetailsDialog } from './ModbusEventList';
import { EventRow } from '@/features/ics/types';
import { fetchModbusEvents } from '@/features/ics/services/modbusApi';
import { useAuthContext } from '@/core/contexts/AuthContext';
import { Loader2, AlertCircle, ChevronLeft, ChevronRight, Search, Filter, AlertTriangle, Info } from 'lucide-react';

export const EventTable: React.FC = () => {
    const [events, setEvents] = useState<EventRow[] | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<EventRow | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isMobile, setIsMobile] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const { isLogin } = useAuthContext();

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    useEffect(() => {
        const loadEvents = async () => {
            if (!isLogin) {
                setError(new Error('請先登入以查看事件'));
                setLoading(false);
                return;
            }

            try {
                const response = await fetchModbusEvents();
                if (response.success) {
                    setEvents(response.content);
                    if (response.content.length > 0) {
                        const lastEvent = response.content[0];
                        const alertCount = response.content.filter(event => Boolean(event.alert)).length;
                        document.getElementById('lastUpdate')!.textContent = new Date(lastEvent.timestamp).toLocaleTimeString();
                        document.getElementById('activeAlerts')!.textContent = alertCount.toString();
                        document.getElementById('eventRate')!.textContent = Math.round(response.content.length / 5).toString();
                    }
                } else {
                    throw new Error('可能未開通服務、或者是裝置未連接，請聯繫系統管理員');
                }
            } catch (err) {
                setError(new Error('可能未開通服務、或者是裝置未連接，請聯繫系統管理員'));
            } finally {
                setLoading(false);
            }
        };

        loadEvents();
        const interval = setInterval(loadEvents, 30000);

        return () => clearInterval(interval);
    }, [isLogin]);

    const filteredEvents = events?.filter(event => {
        let matchesSearch = true;
        let matchesFilter = true;

        if (searchTerm) {
            matchesSearch =
                event.event_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.device_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.source_ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.destination_ip.toLowerCase().includes(searchTerm.toLowerCase());
        }

        if (filterType !== 'all') {
            matchesFilter = filterType === 'alerts' ? Boolean(event.alert) : !event.alert;
        }

        return matchesSearch && matchesFilter;
    }) || [];

    const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentEvents = filteredEvents.slice(startIndex, endIndex);

    if (!isLogin) {
        return (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                <div className="text-center">
                    <AlertCircle className="mx-auto h-8 w-8 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">需要登入</h3>
                    <p className="mt-1 text-sm text-gray-500">請先登入以查看事件</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <p className="text-sm text-gray-500">載入中...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                <div className="text-center max-w-md mx-auto p-6">
                    <Info className="mx-auto h-8 w-8 text-blue-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">無法取得事件資料</h3>
                    <p className="mt-1 text-sm text-gray-500">{error.message}</p>
                </div>
            </div>
        );
    }

    if (!events || events.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                <div className="text-center">
                    <AlertCircle className="mx-auto h-8 w-8 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">無事件資料</h3>
                    <p className="mt-1 text-sm text-gray-500">目前尚未記錄任何事件</p>
                </div>
            </div>
        );
    }

    // 手機版卡片視圖
    if (isMobile) {
        return (
            <>
                {/* 手機版篩選器 */}
                <div className="sticky top-0 bg-white border-b p-4 space-y-3 z-10">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="搜尋事件..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">所有事件</option>
                            <option value="alerts">僅警告</option>
                            <option value="normal">一般事件</option>
                        </select>
                    </div>
                    <div className="text-sm text-gray-500 text-center">
                        顯示 {filteredEvents.length} 個事件
                    </div>
                </div>

                {/* 事件卡片 */}
                <div className="space-y-4 p-4">
                    {currentEvents.map((event) => (
                        <div
                            key={event.event_id}
                            onClick={() => setSelectedEvent(event)}
                            className="bg-white rounded-lg border shadow-sm p-4 space-y-3 active:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-900">
                                    {event.event_id}
                                </span>
                                {event.alert && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        <AlertTriangle className="w-3 h-3" />
                                        警告
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <p className="text-gray-500">裝置</p>
                                    <p className="font-medium">{event.device_id}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">類型</p>
                                    <p className="font-medium">{event.event_type}</p>
                                </div>
                            </div>

                            <div className="text-xs text-gray-500">
                                <p>來源: {event.source_ip}:{event.source_port}</p>
                                <p>目標: {event.destination_ip}:{event.destination_port}</p>
                            </div>

                            <div className="text-xs text-gray-400">
                                {new Date(event.timestamp).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>

                {/* 手機版分頁 */}
                <div className="sticky bottom-0 bg-white border-t p-4 flex flex-col gap-3">
                    <select
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="w-full border rounded-md px-2 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value={5}>每頁 5 筆</option>
                        <option value={10}>每頁 10 筆</option>
                        <option value={25}>每頁 25 筆</option>
                    </select>

                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 text-sm rounded-md bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="text-sm text-gray-600">
                            第 {currentPage} 頁，共 {totalPages} 頁
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 text-sm rounded-md bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <EventDetailsDialog
                    event={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                />
            </>
        );
    }

    // 桌面版表格視圖
    return (
        <>
            {/* 桌面版篩選器 */}
            <div className="p-4 border-b space-y-4">
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="搜尋 ID、裝置或 IP..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="relative w-48">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">所有事件</option>
                            <option value="alerts">僅警告</option>
                            <option value="normal">一般事件</option>
                        </select>
                    </div>
                </div>
                <div className="text-sm text-gray-500">
                    顯示 {filteredEvents.length} 個事件
                </div>
            </div>

            {/* 表格 */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                事件 ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                裝置 ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                時間戳記
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                事件類型
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                來源
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                目標
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                功能
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                狀態
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentEvents.map((event) => (
                            <tr
                                key={event.event_id}
                                onClick={() => setSelectedEvent(event)}
                                className="hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {event.event_id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {event.device_id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(event.timestamp).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {event.event_type}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {event.source_ip}:{event.source_port}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {event.destination_ip}:{event.destination_port}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {event.modbus_function}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${event.alert
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-green-100 text-green-800'
                                        }`}>
                                        {event.alert ? '警告' : '正常'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 桌面版分頁 */}
            <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <select
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="border rounded-md px-2 py-1 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value={10}>每頁 10 筆</option>
                        <option value={25}>每頁 25 筆</option>
                        <option value={50}>每頁 50 筆</option>
                    </select>
                    <span className="text-sm text-gray-500">
                        顯示第 {startIndex + 1} 至 {Math.min(endIndex, filteredEvents.length)} 筆，共 {filteredEvents.length} 筆
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        上一頁
                    </button>
                    <span className="text-sm text-gray-600">
                        第 {currentPage} 頁，共 {totalPages} 頁
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        下一頁
                    </button>
                </div>
            </div>

            <EventDetailsDialog
                event={selectedEvent}
                onClose={() => setSelectedEvent(null)}
            />
        </>
    );
};
