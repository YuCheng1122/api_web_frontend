'use client'

import { NDRTopBlocking } from '@/features/ndr/types/ndr';
import { useState } from 'react';

interface TopBlockingListProps {
    data: NDRTopBlocking[];
}

type SortField = 'doc_count' | 'black_list' | 'event' | 'category' | 'signature';

const TopBlockingList = ({ data }: TopBlockingListProps) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [sortField, setSortField] = useState<SortField>('doc_count');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    const PAGE_SIZE = 10;

    const handleSort = (field: SortField) => {
        if (field === sortField) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    const sortedData = [...data].sort((a, b) => {
        const direction = sortDirection === 'asc' ? 1 : -1;
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (sortField === 'doc_count') {
            return (a.doc_count - b.doc_count) * direction;
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return aValue.localeCompare(bValue) * direction;
        }

        return 0;
    });

    const totalPages = Math.ceil(sortedData.length / PAGE_SIZE);
    const paginatedData = sortedData.slice(
        currentPage * PAGE_SIZE,
        (currentPage + 1) * PAGE_SIZE
    );

    const SortHeader = ({ field, label }: { field: SortField; label: string }) => (
        <th 
            scope="col" 
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            onClick={() => handleSort(field)}
        >
            <div className="flex items-center space-x-1">
                <span>{label}</span>
                {sortField === field && (
                    <svg 
                        className={`w-4 h-4 transition-transform ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                    </svg>
                )}
            </div>
        </th>
    );

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <SortHeader field="black_list" label="IP Address" />
                            <SortHeader field="doc_count" label="Count" />
                            <SortHeader field="event" label="Event" />
                            <SortHeader field="category" label="Category" />
                            <SortHeader field="signature" label="Signature" />
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedData.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-mono text-gray-900">{item.black_list}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{item.doc_count}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{item.event}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{item.category || 'N/A'}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{item.signature}</div>
                                    {item.signature_id !== 0 && (
                                        <div className="text-xs text-gray-500">ID: {item.signature_id}</div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {totalPages > 1 && (
                <div className="flex justify-center space-x-2 p-4 bg-gray-50 border-t border-gray-200">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                        disabled={currentPage === 0}
                        className="px-3 py-1 rounded-md bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <span className="px-3 py-1 text-sm text-gray-700">
                        Page {currentPage + 1} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                        disabled={currentPage >= totalPages - 1}
                        className="px-3 py-1 rounded-md bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default TopBlockingList;
