'use client';

import { FC } from 'react';
import { ShieldAlert, AlertTriangle, Shield } from 'lucide-react';
import type { CveBarchart } from '../../../../../features/dashboard_v2/types';

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

interface Props {
    data: CveBarchart[];
}

const CveChart: FC<Props> = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    const maxCount = Math.max(...data.map(item => item.count));

    return (
        <div className="w-full bg-card rounded-lg shadow-sm p-3 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-4 text-card-foreground">CVE 分析</h2>

            {/* 統計卡片 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <div className="bg-accent/50 backdrop-blur-sm p-4 rounded-lg hover:bg-accent/70 transition-colors">
                    <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: COLORS[0].base }} />
                        <div className="flex-1">
                            <div className="text-sm font-medium text-card-foreground mb-1">漏洞總數</div>
                            <div className="text-2xl font-bold" style={{ color: COLORS[0].base }}>{total}</div>
                        </div>
                    </div>
                </div>
                <div className="bg-accent/50 backdrop-blur-sm p-4 rounded-lg hover:bg-accent/70 transition-colors">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: COLORS[1].base }} />
                        <div className="flex-1">
                            <div className="text-sm font-medium text-card-foreground mb-1">漏洞類型</div>
                            <div className="text-2xl font-bold" style={{ color: COLORS[1].base }}>{data.length}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CVE 列表 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.map((item, index) => {
                    const color = COLORS[index % COLORS.length];
                    const relativeWidth = maxCount > 0 ? (item.count / maxCount) * 100 : 0;

                    return (
                        <div
                            key={item.cve_name}
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
                            <div className="relative p-3 flex items-center gap-3">
                                <ShieldAlert
                                    className="w-5 h-5 flex-shrink-0"
                                    style={{ color: color.base }}
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-card-foreground truncate" title={item.cve_name}>
                                        {item.cve_name}
                                    </div>
                                </div>
                                <div className="text-lg font-bold" style={{ color: color.base }}>
                                    {item.count}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CveChart;
