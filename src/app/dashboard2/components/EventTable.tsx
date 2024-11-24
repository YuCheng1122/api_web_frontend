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
import type { EventTable, EventTableElement } from '@/features/dashboard2.0/types/generated';
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
const ROW_HEIGHT = 48; // 預設行高

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
    const parentRef = useRef<HTMLDivElement>(null);

    // 使用防抖處理搜索
    const debouncedSearch = useCallback(
        debounce((query: string) => {
            setSearchQuery(query);
            setCurrentPage(0);
        }, 300),
        []
    );

    // 過濾和分頁數據
    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            let filtered = data.content.event_table;

            // 搜索過濾
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

            // 計算總頁數
            setTotalPages(Math.ceil(filtered.length / PAGE_SIZE));

            // 分頁
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

    // 虛擬滾動設置
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

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Security Events</h2>
                <div className="flex items-center space-x-4">
                    <input
                        type="text"
                        onChange={e => debouncedSearch(e.target.value)}
                        placeholder="Search events..."
                        className="px-4 py-2 border rounded-lg"
                    />
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                            disabled={currentPage === 0}
                            className="px-3 py-1 border rounded-lg disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-600">
                            Page {currentPage + 1} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                            disabled={currentPage === totalPages - 1}
                            className="px-3 py-1 border rounded-lg disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-[400px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            ) : (
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
            )}
        </div>
    );
}
