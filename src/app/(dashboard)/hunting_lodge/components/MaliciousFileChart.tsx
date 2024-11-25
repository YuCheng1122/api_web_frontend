'use client';

import { useState, useEffect } from 'react';
import { FileWarning, AlertTriangle, FileText } from 'lucide-react';
import type { MaliciousFile } from '@/features/dashboard_v2/types';

interface Props {
    data: MaliciousFile;
}

const COLORS = [
    '#3B82F6', // blue-500
    '#10B981', // emerald-500
    '#F59E0B', // amber-500
    '#6366F1', // indigo-500
    '#EC4899', // pink-500
];

export default function MaliciousFileChart({ data }: Props) {
    const [isMobile, setIsMobile] = useState(false);
    const files = data.content.malicious_file_barchart;
    const total = files.reduce((sum, item) => sum + item.count, 0);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);

        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    // 移動端視圖
    const MobileView = () => (
        <div className="space-y-2">
            {files.map((item, index) => {
                const color = COLORS[index % COLORS.length];
                const percentage = total > 0 ? ((item.count / total) * 100).toFixed(1) : '0';

                return (
                    <div
                        key={item.name}
                        className="flex items-center p-2 rounded-lg transition-transform hover:scale-[1.02]"
                        style={{ backgroundColor: `${color}10` }}
                    >
                        <div className="flex-shrink-0 mr-3">
                            <FileWarning
                                className="w-5 h-5"
                                style={{ color }}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div
                                className="text-xs text-gray-600 line-clamp-1"
                                title={item.name}
                            >
                                {item.name}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                                {percentage}% of total
                            </div>
                        </div>
                        <div
                            className="flex-shrink-0 text-lg font-bold ml-3"
                            style={{ color }}
                        >
                            {item.count}
                        </div>
                    </div>
                );
            })}
        </div>
    );

    // 桌面端視圖
    const DesktopView = () => (
        <div className="space-y-6">
            {/* 摘要統計 */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">Total Files</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{total}</div>
                    <div className="mt-2 text-sm text-blue-600">
                        Malicious files detected
                    </div>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                        <span className="text-sm font-medium text-gray-700">File Types</span>
                    </div>
                    <div className="text-2xl font-bold text-amber-600">{files.length}</div>
                    <div className="mt-2 text-sm text-amber-600">
                        Unique file categories
                    </div>
                </div>
            </div>

            {/* 詳細列表 */}
            <div className="space-y-3">
                {files.map((item, index) => {
                    const color = COLORS[index % COLORS.length];
                    const percentage = total > 0 ? ((item.count / total) * 100).toFixed(1) : '0';

                    return (
                        <div
                            key={item.name}
                            className="flex items-start p-3 rounded-lg transition-transform hover:scale-[1.02]"
                            style={{ backgroundColor: `${color}10` }}
                        >
                            <div className="flex-shrink-0 mr-4 mt-1">
                                <FileWarning
                                    className="w-6 h-6"
                                    style={{ color }}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0 flex-1">
                                        <div
                                            className="text-sm font-medium text-gray-900 line-clamp-2"
                                            title={item.name}
                                        >
                                            {item.name}
                                        </div>
                                    </div>
                                    <div
                                        className="flex-shrink-0 text-sm font-medium"
                                        style={{ color }}
                                    >
                                        {percentage}%
                                    </div>
                                </div>
                                <div className="mt-2 flex items-center gap-4">
                                    <div className="flex-shrink-0 text-sm text-gray-500 min-w-[100px]">
                                        Count: {item.count}
                                    </div>
                                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{
                                                backgroundColor: color,
                                                width: `${percentage}%`
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="w-full h-full bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Malicious File Distribution</h2>
            {isMobile ? <MobileView /> : <DesktopView />}
        </div>
    );
}
