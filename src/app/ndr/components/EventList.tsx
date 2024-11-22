'use client'

import { NDREvent } from '@/features/ndr/types/ndr';
import { useState } from 'react';

interface EventListProps {
    events: NDREvent[];
    onSort: (field: keyof NDREvent) => void;
    sortField: keyof NDREvent;
    sortDirection: 'asc' | 'desc';
}

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

const SortHeader = ({ 
    label, 
    field, 
    currentSortField, 
    sortDirection, 
    onSort 
}: { 
    label: string;
    field: keyof NDREvent;
    currentSortField: keyof NDREvent;
    sortDirection: 'asc' | 'desc';
    onSort: (field: keyof NDREvent) => void;
}) => {
    const isActive = field === currentSortField;
    
    return (
        <th 
            scope="col" 
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            onClick={() => onSort(field)}
        >
            <div className="flex items-center space-x-1">
                <span>{label}</span>
                {isActive && (
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
};

const EventList = ({ events, onSort, sortField, sortDirection }: EventListProps) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <SortHeader label="Severity" field="severity" currentSortField={sortField} sortDirection={sortDirection} onSort={onSort} />
                    <SortHeader label="Event Name" field="eventname" currentSortField={sortField} sortDirection={sortDirection} onSort={onSort} />
                    <SortHeader label="Source" field="src_ip" currentSortField={sortField} sortDirection={sortDirection} onSort={onSort} />
                    <SortHeader label="Destination" field="dest_ip" currentSortField={sortField} sortDirection={sortDirection} onSort={onSort} />
                    <SortHeader label="Protocol" field="proto" currentSortField={sortField} sortDirection={sortDirection} onSort={onSort} />
                    <SortHeader label="Timestamp" field="@timestamp" currentSortField={sortField} sortDirection={sortDirection} onSort={onSort} />
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <div className={`${getSeverityColor(event.severity)} w-2.5 h-2.5 rounded-full mr-2`}></div>
                                <span className="text-sm text-gray-900">{getSeverityText(event.severity)}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{event.eventname}</div>
                            {event.signature && (
                                <div className="text-xs text-gray-500 mt-1">{event.signature}</div>
                            )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-mono">
                                {event.src_ip}:{event.src_port}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-mono">
                                {event.dest_ip}:{event.dest_port}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{event.proto}</div>
                            {event.category && (
                                <div className="text-xs text-gray-500">{event.category}</div>
                            )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(event['@timestamp']).toLocaleString()}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default EventList;
