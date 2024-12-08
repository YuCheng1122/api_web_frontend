'use client';

import { FC } from 'react';
import { FileWarning, AlertTriangle, FileText } from 'lucide-react';
import { useDashboard } from '../../contexts/DashboardContext';
import type { MaliciousFile } from '../../../../../features/dashboard_v2/types';

// Enhanced color configuration with gradients
const COLORS = [
    {
        base: 'hsl(210, 85%, 50%)',  // Vibrant blue
        gradient: 'linear-gradient(45deg, hsl(210, 85%, 50%), hsl(220, 85%, 55%))'
    },
    {
        base: 'hsl(340, 75%, 50%)',  // Rose pink
        gradient: 'linear-gradient(45deg, hsl(340, 75%, 50%), hsl(350, 75%, 55%))'
    },
    {
        base: 'hsl(150, 75%, 40%)',  // Rich green
        gradient: 'linear-gradient(45deg, hsl(150, 75%, 40%), hsl(160, 75%, 45%))'
    },
    {
        base: 'hsl(280, 70%, 45%)',  // Royal purple
        gradient: 'linear-gradient(45deg, hsl(280, 70%, 45%), hsl(290, 70%, 50%))'
    },
    {
        base: 'hsl(25, 85%, 55%)',   // Warm orange
        gradient: 'linear-gradient(45deg, hsl(25, 85%, 55%), hsl(35, 85%, 60%))'
    }
] as const;

const MaliciousFileChart: FC = () => {
    const { maliciousFile } = useDashboard();

    if (!maliciousFile) {
        return (
            <div className="w-full h-full bg-card rounded-lg shadow-sm p-3 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-card-foreground">惡意檔案分佈</h2>
                <div className="flex items-center justify-center h-[calc(100%-2rem)]">
                    <span className="text-sm text-muted-foreground">無資料</span>
                </div>
            </div>
        );
    }

    const files = maliciousFile.content.malicious_file_barchart;
    const total = files.reduce((sum, item) => sum + item.count, 0);
    const maxCount = Math.max(...files.map(item => item.count));

    return (
        <div className="w-full h-full bg-card rounded-lg shadow-sm p-3 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-card-foreground">惡意檔案分佈</h2>

            {/* 統計卡片 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
                <div className="bg-accent/50 backdrop-blur-sm p-4 rounded-lg hover:bg-accent/70 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                        <FileText className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: COLORS[0].base }} />
                        <span className="text-sm font-medium text-card-foreground">檔案總數</span>
                    </div>
                    <div className="text-2xl font-bold" style={{ color: COLORS[0].base }}>{total}</div>
                    <div className="mt-2 text-sm" style={{ color: COLORS[0].base }}>
                        已偵測到的惡意檔案
                    </div>
                </div>
                <div className="bg-accent/50 backdrop-blur-sm p-4 rounded-lg hover:bg-accent/70 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: COLORS[1].base }} />
                        <span className="text-sm font-medium text-card-foreground">檔案類型</span>
                    </div>
                    <div className="text-2xl font-bold" style={{ color: COLORS[1].base }}>{files.length}</div>
                    <div className="mt-2 text-sm" style={{ color: COLORS[1].base }}>
                        獨特檔案類別
                    </div>
                </div>
            </div>

            {/* 檔案列表 */}
            <div className="space-y-3 sm:space-y-4">
                {files.map((item, index) => {
                    const color = COLORS[index % COLORS.length];
                    const relativeWidth = maxCount > 0 ? (item.count / maxCount) * 100 : 0;

                    return (
                        <div
                            key={item.name}
                            className="relative overflow-hidden bg-accent/50 backdrop-blur-sm rounded-lg transition-all duration-300 hover:scale-[1.02] hover:bg-accent/70 group"
                            style={{ borderLeft: `4px solid ${color.base}` }}
                        >
                            {/* Progress bar background */}
                            <div
                                className="absolute inset-0 opacity-10 transition-all duration-300 group-hover:opacity-20"
                                style={{
                                    background: color.gradient,
                                    width: `${Math.max(relativeWidth, 5)}%`
                                }}
                            />

                            {/* Content */}
                            <div className="relative p-4">
                                <div className="flex items-start gap-3 mb-3">
                                    <FileWarning
                                        className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5"
                                        style={{ color: color.base }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div
                                            className="text-sm font-medium text-card-foreground line-clamp-2"
                                            title={item.name}
                                        >
                                            {item.name}
                                        </div>
                                    </div>
                                    <div
                                        className="text-lg font-bold flex-shrink-0 ml-2"
                                        style={{ color: color.base }}
                                    >
                                        {item.count}
                                    </div>
                                </div>

                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{
                                            background: color.gradient,
                                            width: `${Math.max(relativeWidth, 5)}%`,
                                            boxShadow: `0 0 8px ${color.base}40`
                                        }}
                                    />
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
