'use client'

import { NDREvent } from '../../../../features/ndr/types/ndr';

interface EventListProps {
    events: NDREvent[];
    sortField: keyof NDREvent;
    sortDirection: 'asc' | 'desc';
    onSort: (field: keyof NDREvent) => void;
}

const EventList = ({ events, sortField, sortDirection, onSort }: EventListProps) => {
    const formatDate = (timestamp: string) => {
        return new Date(timestamp).toLocaleString();
    };

    const getSeverityColor = (severity: number) => {
        switch (severity) {
            case 1: return 'bg-red-100 text-red-800';
            case 2: return 'bg-yellow-100 text-yellow-800';
            case 3: return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getSeverityText = (severity: number) => {
        switch (severity) {
            case 1: return '高';
            case 2: return '中';
            case 3: return '低';
            default: return '未知';
        }
    };

    const SortIcon = ({ field }: { field: keyof NDREvent }) => {
        if (field !== sortField) {
            return (
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
            );
        }
        return sortDirection === 'asc' ? (
            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
            </svg>
        ) : (
            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
        );
    };

    const SortButton = ({ field, label }: { field: keyof NDREvent; label: string }) => (
        <button
            onClick={() => onSort(field)}
            className="flex items-center space-x-1 hover:text-indigo-600 transition-colors duration-200"
        >
            <span>{label}</span>
            <SortIcon field={field} />
        </button>
    );

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* 桌面版表格 */}
            <div className="hidden md:block">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <SortButton field="@timestamp" label="時間戳記" />
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <SortButton field="severity" label="嚴重程度" />
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <SortButton field="event_type" label="事件類型" />
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <SortButton field="src_ip" label="來源 IP" />
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <SortButton field="dest_ip" label="目標 IP" />
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {events.map((event, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatDate(event['@timestamp'])}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(event.severity)}`}>
                                        {getSeverityText(event.severity)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {event.event_type}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {event.src_ip}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {event.dest_ip}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 行動版卡片列表 */}
            <div className="md:hidden">
                <div className="grid grid-cols-1 gap-4 p-4">
                    {events.map((event, index) => (
                        <div key={index} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(event.severity)}`}>
                                    {getSeverityText(event.severity)}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {formatDate(event['@timestamp'])}
                                </span>
                            </div>
                            <div className="space-y-2">
                                <div>
                                    <span className="text-xs font-medium text-gray-500">事件類型</span>
                                    <p className="text-sm text-gray-900">{event.event_type}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <span className="text-xs font-medium text-gray-500">來源 IP</span>
                                        <p className="text-sm text-gray-900">{event.src_ip}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs font-medium text-gray-500">目標 IP</span>
                                        <p className="text-sm text-gray-900">{event.dest_ip}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EventList;
