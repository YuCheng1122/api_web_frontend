'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    createColumnHelper,
    flexRender,
    SortingState,
    ColumnDef
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { EventTable, EventTableElement } from '@/features/dashboard_v2/types';
import { Search, ChevronLeft, ChevronRight, AlertTriangle, Clock, Shield } from 'lucide-react';
import debounce from 'lodash/debounce';

interface Props {
    data: EventTable;
}

interface VirtualItem {
    index: number;
    start: number;
    end: number;
    size: number;
}

const PAGE_SIZE = 50;
const ROW_HEIGHT = 48;

const columnHelper = createColumnHelper<EventTableElement>();

const columns = [
    columnHelper.accessor('timestamp', {
        header: 'Timestamp',
        cell: info => new Date(info.getValue()).toLocaleString(),
        size: 200,
    }),
    columnHelper.accessor('agent_name', {
        header: 'Agent Name',
        cell: info => info.getValue(),
        size: 150,
    }),
    columnHelper.accessor('rule_description', {
        header: 'Description',
        cell: info => info.getValue(),
        size: 300,
    }),
    columnHelper.accessor('rule_mitre_tactic', {
        header: 'MITRE Tactic',
        cell: info => info.getValue(),
        size: 150,
    }),
    columnHelper.accessor('rule_mitre_id', {
        header: 'MITRE ID',
        cell: info => info.getValue(),
        size: 120,
    }),
    columnHelper.accessor('rule_level', {
        header: 'Level',
        cell: info => {
            const level = info.getValue();
            let color = 'bg-green-100 text-green-800';
            if (level >= 10) color = 'bg-red-100 text-red-800';
            else if (level >= 7) color = 'bg-orange-100 text-orange-800';
            else if (level >= 4) color = 'bg-yellow-100 text-yellow-800';

            return (
                <span className={`px-2 py-1 rounded-full text-sm ${color}`}>
                    {level}
                </span>
            );
        },
        size: 100,
    }),
];

export default function EventTableComponent({ data }: Props) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [displayData, setDisplayData] = useState<EventTableElement[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const parentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    const debouncedSearch = useCallback(
        debounce((query: string) => {
            setSearchQuery(query);
            setCurrentPage(0);
        }, 300),
        []
    );

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            let filtered = data.content.event_table;

            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                filtered = filtered.filter(item =>
                    Object.values(item).some(
                        value =>
                            value &&
                            value.toString().toLowerCase().includes(query)
                    )
                );
            }

            setTotalPages(Math.ceil(filtered.length / PAGE_SIZE));
            const start = currentPage * PAGE_SIZE;
            const paged = filtered.slice(start, start + PAGE_SIZE);

            setDisplayData(paged);
            setIsLoading(false);
        }, 0);

        return () => clearTimeout(timer);
    }, [data, searchQuery, currentPage]);

    const table = useReactTable({
        data: displayData,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
    });

    const { rows } = table.getRowModel();
    const virtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => ROW_HEIGHT,
        overscan: 10,
    });

    const virtualRows = virtualizer.getVirtualItems();
    const totalSize = virtualizer.getTotalSize();
    const paddingTop = virtualRows.length > 0 ? virtualRows[0].start : 0;
    const paddingBottom = virtualRows.length > 0
        ? totalSize - virtualRows[virtualRows.length - 1].end
        : 0;

    const renderMobileCard = (event: EventTableElement) => (
        <div className="bg-white rounded-lg shadow-sm border p-4 space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                        {new Date(event.timestamp).toLocaleString()}
                    </span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${event.rule_level >= 10 ? 'bg-red-100 text-red-800' :
                        event.rule_level >= 7 ? 'bg-orange-100 text-orange-800' :
                            event.rule_level >= 4 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                    }`}>
                    Level {event.rule_level}
                </span>
            </div>

            <div className="space-y-2">
                <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="text-sm font-medium text-gray-900">{event.agent_name}</p>
                        <p className="text-sm text-gray-600 mt-1">{event.rule_description}</p>
                    </div>
                </div>
            </div>

            {(event.rule_mitre_tactic || event.rule_mitre_id) && (
                <div className="flex flex-wrap gap-2 pt-2 border-t">
                    {event.rule_mitre_tactic && (
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                            {event.rule_mitre_tactic}
                        </span>
                    )}
                    {event.rule_mitre_id && (
                        <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs">
                            {event.rule_mitre_id}
                        </span>
                    )}
                </div>
            )}
        </div>
    );

    const renderSearchAndPagination = () => (
        <div className={`flex ${isMobile ? 'flex-col gap-4' : 'justify-between items-center'}`}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    onChange={e => debouncedSearch(e.target.value)}
                    placeholder="Search events..."
                    className="pl-10 pr-4 py-2 border rounded-lg w-full"
                />
            </div>

            <div className={`flex items-center ${isMobile ? 'justify-between' : 'space-x-2'}`}>
                <button
                    onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                    className="p-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-600 px-2">
                    Page {currentPage + 1} of {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={currentPage === totalPages - 1}
                    className="p-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    // Mobile View
    if (isMobile) {
        return (
            <div className="space-y-4">
                {renderSearchAndPagination()}

                <div className="space-y-4">
                    {displayData.map((event, index) => (
                        <div key={index}>
                            {renderMobileCard(event)}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Desktop View
    return (
        <div className="space-y-4">
            {renderSearchAndPagination()}

            <div
                ref={parentRef}
                className="overflow-auto"
                style={{ height: '600px' }}
            >
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        style={{ width: header.getSize() }}
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                        {{
                                            asc: ' 🔼',
                                            desc: ' 🔽',
                                        }[header.column.getIsSorted() as string] ?? null}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paddingTop > 0 && (
                            <tr>
                                <td style={{ height: `${paddingTop}px` }} />
                            </tr>
                        )}
                        {virtualRows.map((virtualRow: VirtualItem) => {
                            const row = rows[virtualRow.index];
                            return (
                                <tr key={row.id} className="hover:bg-gray-50">
                                    {row.getVisibleCells().map(cell => (
                                        <td
                                            key={cell.id}
                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                            style={{ width: cell.column.getSize() }}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                        {paddingBottom > 0 && (
                            <tr>
                                <td style={{ height: `${paddingBottom}px` }} />
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
