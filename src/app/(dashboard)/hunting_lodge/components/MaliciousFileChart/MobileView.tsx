'use client';

import { FC } from 'react';
import { FileWarning } from 'lucide-react';
import type { MaliciousFile } from '../../../../../features/dashboard_v2/types';
import { COLORS } from './constants';

interface MobileViewProps {
    files: MaliciousFile['content']['malicious_file_barchart'];
    total: number;
}

export const MobileView: FC<MobileViewProps> = ({ files, total }) => {
    return (
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
};
