'use client'

interface QueryControlsProps {
    fromDate: string;
    toDate: string;
    pageSize: number;
    severity?: number;
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
}: QueryControlsProps) => {
    const pageSizeOptions = [10, 20, 50, 100];
    const severityOptions = [
        { value: undefined, label: 'All' },
        { value: 1, label: 'High' },
        { value: 2, label: 'Medium' },
        { value: 3, label: 'Low' }
    ];

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 開始日期 */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        From Date
                    </label>
                    <input
                        type="datetime-local"
                        value={fromDate}
                        onChange={(e) => onFromDateChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                {/* 結束日期 */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        To Date
                    </label>
                    <input
                        type="datetime-local"
                        value={toDate}
                        onChange={(e) => onToDateChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                {/* 頁面大小選擇 */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Page Size
                    </label>
                    <select
                        value={pageSize}
                        onChange={(e) => onPageSizeChange(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        {pageSizeOptions.map((size) => (
                            <option key={size} value={size}>
                                {size} items per page
                            </option>
                        ))}
                    </select>
                </div>

                {/* 嚴重程度選擇 */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Severity
                    </label>
                    <select
                        value={severity === undefined ? 'all' : severity}
                        onChange={(e) => {
                            const value = e.target.value === 'all' ? undefined : Number(e.target.value);
                            onSeverityChange(value);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        {severityOptions.map((option) => (
                            <option 
                                key={option.value === undefined ? 'all' : option.value} 
                                value={option.value === undefined ? 'all' : option.value}
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* 重新整理按鈕 */}
            <div className="mt-4 flex justify-end">
                <button
                    onClick={onRefresh}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                    <svg 
                        className="w-4 h-4 mr-2" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                        />
                    </svg>
                    Refresh
                </button>
            </div>
        </div>
    );
};

export default QueryControls;
