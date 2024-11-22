'use client'

interface QueryControlsProps {
    fromDate: string;
    toDate: string;
    pageSize: number;
    severity: number | undefined;
    onFromDateChange: (date: string) => void;
    onToDateChange: (date: string) => void;
    onPageSizeChange: (size: number) => void;
    onSeverityChange: (severity: number | undefined) => void;
    onRefresh: () => void;
}

const QueryControls = ({ 
    fromDate,
    toDate,
    pageSize,
    severity,
    onFromDateChange,
    onToDateChange,
    onPageSizeChange,
    onSeverityChange,
    onRefresh
}: QueryControlsProps) => (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                <input
                    type="datetime-local"
                    value={fromDate}
                    onChange={(e) => onFromDateChange(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                <input
                    type="datetime-local"
                    value={toDate}
                    onChange={(e) => onToDateChange(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Page Size</label>
                <select
                    value={pageSize}
                    onChange={(e) => onPageSizeChange(Number(e.target.value))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                <select
                    value={severity === undefined ? 'all' : severity}
                    onChange={(e) => onSeverityChange(e.target.value === 'all' ? undefined : Number(e.target.value))}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                    <option value="all">All</option>
                    <option value={1}>High</option>
                    <option value={2}>Medium</option>
                    <option value={3}>Low</option>
                </select>
            </div>
            <div className="flex items-end">
                <button
                    onClick={onRefresh}
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                    Refresh Data
                </button>
            </div>
        </div>
    </div>
);

export default QueryControls;
