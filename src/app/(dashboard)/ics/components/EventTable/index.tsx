'use client';

import { useEffect, useState } from 'react';
import { EventDetailsDialog } from '../EventDetailsDialog';
import { EventRow } from '@/features/ics/types';
import { fetchModbusEvents } from '@/features/ics/services/modbusApi';
import { useAuthContext } from '@/features/auth/contexts/AuthContext';
import { Loader2, AlertCircle, ChevronLeft, ChevronRight, Search, Filter, AlertTriangle } from 'lucide-react';

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
                setError(new Error('Please login to view events'));
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
                    setError(new Error('Failed to fetch events'));
                }
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch events'));
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
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Authentication Required</h3>
                    <p className="mt-1 text-sm text-gray-500">Please login to view events</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <p className="text-sm text-gray-500">Loading events...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg">
                <div className="text-center">
                    <AlertCircle className="mx-auto h-8 w-8 text-red-400" />
                    <h3 className="mt-2 text-sm font-medium text-red-800">Error</h3>
                    <p className="mt-1 text-sm text-red-500">{error.message}</p>
                </div>
            </div>
        );
    }

    if (!events || events.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
                <div className="text-center">
                    <AlertCircle className="mx-auto h-8 w-8 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No Events</h3>
                    <p className="mt-1 text-sm text-gray-500">No events have been recorded yet</p>
                </div>
            </div>
        );
    }

    // Mobile Card View
    if (isMobile) {
        return (
            <>
                {/* Mobile Filters */}
                <div className="sticky top-0 bg-white border-b p-4 space-y-3 z-10">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search events..."
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
                            <option value="all">All Events</option>
                            <option value="alerts">Alerts Only</option>
                            <option value="normal">Normal Events</option>
                        </select>
                    </div>
                    <div className="text-sm text-gray-500 text-center">
                        Showing {filteredEvents.length} events
                    </div>
                </div>

                {/* Event Cards */}
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
                                        Alert
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <p className="text-gray-500">Device</p>
                                    <p className="font-medium">{event.device_id}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Type</p>
                                    <p className="font-medium">{event.event_type}</p>
                                </div>
                            </div>

                            <div className="text-xs text-gray-500">
                                <p>From: {event.source_ip}:{event.source_port}</p>
                                <p>To: {event.destination_ip}:{event.destination_port}</p>
                            </div>

                            <div className="text-xs text-gray-400">
                                {new Date(event.timestamp).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile Pagination */}
                <div className="sticky bottom-0 bg-white border-t p-4 flex flex-col gap-3">
                    <select
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="w-full border rounded-md px-2 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value={5}>5 per page</option>
                        <option value={10}>10 per page</option>
                        <option value={25}>25 per page</option>
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
                            Page {currentPage} of {totalPages}
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

    // Desktop Table View
    return (
        <>
            {/* Desktop Filters */}
            <div className="p-4 border-b space-y-4">
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by ID, device, or IP..."
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
                            <option value="all">All Events</option>
                            <option value="alerts">Alerts Only</option>
                            <option value="normal">Normal Events</option>
                        </select>
                    </div>
                </div>
                <div className="text-sm text-gray-500">
                    Showing {filteredEvents.length} events
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Event ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Device ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Timestamp
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Event Type
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Source
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Destination
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Function
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
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
                                        {event.alert ? 'Alert' : 'Normal'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Desktop Pagination */}
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
                        <option value={10}>10 per page</option>
                        <option value={25}>25 per page</option>
                        <option value={50}>50 per page</option>
                    </select>
                    <span className="text-sm text-gray-500">
                        Showing {startIndex + 1} to {Math.min(endIndex, filteredEvents.length)} of {filteredEvents.length} events
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
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
