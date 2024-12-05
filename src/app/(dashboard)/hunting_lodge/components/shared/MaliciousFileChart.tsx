'use client';

import { FC } from 'react';
import { FileWarning, AlertTriangle, FileText } from 'lucide-react';
import type { MaliciousFile } from '../../../../../features/dashboard_v2/types';

// 原 constants.ts 中的顏色配置
const COLORS = [
    'hsl(var(--chart-1))', // blue
    'hsl(var(--chart-2))', // emerald
    'hsl(var(--chart-3))', // amber
    'hsl(var(--chart-4))', // indigo
    'hsl(var(--chart-5))', // pink
] as const;

interface Props {
    data: MaliciousFile;
}

const MaliciousFileChart: FC<Props> = ({ data }) => {
    const files = data.content.malicious_file_barchart;
    const total = files.reduce((sum, item) => sum + item.count, 0);

    return (
        <div className="w-full h-full bg-card rounded-lg shadow-sm p-3 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-card-foreground">惡意檔案分佈</h2>

            {/* 響應式統計區塊 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="bg-accent p-3 sm:p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-1 sm:mb-2">
                        <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-chart-1" />
                        <span className="text-sm font-medium text-card-foreground">檔案總數</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-chart-1">{total}</div>
                    <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-chart-1">
                        已偵測到的惡意檔案
                    </div>
                </div>
                <div className="bg-accent p-3 sm:p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-1 sm:mb-2">
                        <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-chart-3" />
                        <span className="text-sm font-medium text-card-foreground">檔案類型</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-chart-3">{files.length}</div>
                    <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-chart-3">
                        獨特檔案類別
                    </div>
                </div>
            </div>

            {/* 響應式檔案列表 */}
            <div className="space-y-2 sm:space-y-3">
                {files.map((item, index) => {
                    const color = COLORS[index % COLORS.length];
                    const percentage = total > 0 ? ((item.count / total) * 100).toFixed(1) : '0';

                    return (
                        <div
                            key={item.name}
                            className="flex items-start p-2 sm:p-3 rounded-lg transition-transform hover:scale-[1.01] bg-accent"
                        >
                            <div className="flex-shrink-0 mr-3 sm:mr-4 mt-0.5 sm:mt-1">
                                <FileWarning
                                    className="w-5 h-5 sm:w-6 sm:h-6"
                                    style={{ color }}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 sm:gap-4">
                                    <div className="min-w-0 flex-1">
                                        <div
                                            className="text-xs sm:text-sm font-medium text-card-foreground line-clamp-2"
                                            title={item.name}
                                        >
                                            {item.name}
                                        </div>
                                    </div>
                                    <div
                                        className="flex-shrink-0 text-xs sm:text-sm font-medium"
                                        style={{ color }}
                                    >
                                        {percentage}%
                                    </div>
                                </div>
                                <div className="mt-1.5 sm:mt-2 flex items-center gap-2 sm:gap-4">
                                    <div className="flex-shrink-0 text-xs sm:text-sm text-muted-foreground min-w-[80px] sm:min-w-[100px]">
                                        數量：{item.count}
                                    </div>
                                    <div className="flex-1 h-1 sm:h-1.5 bg-muted rounded-full overflow-hidden">
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
};

export default MaliciousFileChart;
