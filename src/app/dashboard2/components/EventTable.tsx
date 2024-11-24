'use client';

import { useState } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    createColumnHelper,
    flexRender,
    SortingState,
    ColumnDef
} from '@tanstack/react-table';
import type { EventTable, EventTableElement } from '@/features/dashboard2.0/types/generated';

interface Props {
    data: EventTable;
}

const columnHelper = createColumnHelper<EventTableElement>();

const columns = [
    columnHelper.accessor('timestamp', {
        header: 'Timestamp',
        cell: info => new Date(info.getValue()).toLocaleString(),
    }),
    columnHelper.accessor('agent_name', {
        header: 'Agent Name',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('rule_description', {
        header: 'Description',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('rule_mitre_tactic', {
        header: 'MITRE Tactic',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('rule_mitre_id', {
        header: 'MITRE ID',
        cell: info => info.getValue(),
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
    }),
];

export default function EventTableComponent({ data }: Props) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');

    const table = useReactTable({
        data: data.content.event_table,
        columns,
        state: {
            sorting,
            globalFilter,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Security Events</h2>
                <input
                    type="text"
                    value={globalFilter}
                    onChange={e => setGlobalFilter(e.target.value)}
                    placeholder="Search events..."
                    className="px-4 py-2 border rounded-lg"
                />
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
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
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id} className="hover:bg-gray-50">
                                {row.getVisibleCells().map(cell => (
                                    <td
                                        key={cell.id}
                                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
