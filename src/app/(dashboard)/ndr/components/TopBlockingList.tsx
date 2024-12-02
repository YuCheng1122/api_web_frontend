'use client'

import { NDRTopBlocking } from '@/features/ndr/types/ndr';

interface TopBlockingListProps {
    data: NDRTopBlocking[];
}

const TopBlockingList = ({ data }: TopBlockingListProps) => {
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
            case 1: return 'High';
            case 2: return 'Medium';
            case 3: return 'Low';
            default: return 'Unknown';
        }
    };

    // 找到最大的doc_count用於計算百分比
    const maxCount = Math.max(...data.map(item => item.doc_count));

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* 桌面版表格 */}
            <div className="hidden md:block overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                IP Address
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Event
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Severity
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Count
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Distribution
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {item.black_list}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {item.event}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {item.category || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSeverityColor(item.severity)}`}>
                                        {getSeverityText(item.severity)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {item.doc_count}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="bg-blue-600 h-2.5 rounded-full"
                                            style={{ width: `${(item.doc_count / maxCount) * 100}%` }}
                                        ></div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 行動版卡片列表 */}
            <div className="md:hidden">
                <div className="grid grid-cols-1 gap-4 p-4">
                    {data.map((item, index) => (
                        <div key={index} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <span className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${getSeverityColor(item.severity)}`}>
                                    {getSeverityText(item.severity)}
                                </span>
                                <span className="text-sm font-medium text-gray-900">
                                    {item.doc_count} events
                                </span>
                            </div>
                            <div className="space-y-2">
                                <div>
                                    <span className="text-xs font-medium text-gray-500">IP Address</span>
                                    <p className="text-sm text-gray-900">{item.black_list}</p>
                                </div>
                                <div>
                                    <span className="text-xs font-medium text-gray-500">Event</span>
                                    <p className="text-sm text-gray-900 break-words">{item.event}</p>
                                </div>
                                <div>
                                    <span className="text-xs font-medium text-gray-500">Category</span>
                                    <p className="text-sm text-gray-900">{item.category || '-'}</p>
                                </div>
                                <div>
                                    <span className="text-xs font-medium text-gray-500">Distribution</span>
                                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${(item.doc_count / maxCount) * 100}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {((item.doc_count / maxCount) * 100).toFixed(1)}% of total
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TopBlockingList;
