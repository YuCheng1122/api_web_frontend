'use client';

import { FC } from 'react';
import { Shield, AlertTriangle } from 'lucide-react';

interface DesktopViewProps {
    connected_agents: number;
    disconnected_agents: number;
    total: number;
}

export const DesktopView: FC<DesktopViewProps> = ({
    connected_agents,
    disconnected_agents,
    total
}) => {
    return (
        <div className="space-y-6">
            {/* 圓環圖 */}
            <div className="flex justify-center">
                <div className="relative w-48 h-48">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                        {/* 背景圓環 */}
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="12"
                        />
                        {/* 數據圓環 */}
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#10B981"
                            strokeWidth="12"
                            strokeDasharray={`${(connected_agents / total) * 251.2} 251.2`}
                            transform="rotate(-90 50 50)"
                            strokeLinecap="round"
                        />
                        {/* 中心文字 */}
                        <text
                            x="50"
                            y="45"
                            textAnchor="middle"
                            className="text-2xl font-bold"
                            fill="#111827"
                        >
                            {total}
                        </text>
                        <text
                            x="50"
                            y="60"
                            textAnchor="middle"
                            className="text-sm"
                            fill="#6B7280"
                        >
                            總計
                        </text>
                    </svg>
                </div>
            </div>

            {/* 詳細資訊 */}
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-gray-700">已連接代理</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600 mb-1">
                        {connected_agents}
                    </div>
                    <div className="text-sm text-gray-500">
                        佔總數的 {((connected_agents / total) * 100).toFixed(1)}%
                    </div>
                    <div className="mt-2 text-sm text-green-600">
                        運作中並回報中
                    </div>
                </div>

                <div className="bg-red-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <span className="text-sm font-medium text-gray-700">已斷開代理</span>
                    </div>
                    <div className="text-2xl font-bold text-red-600 mb-1">
                        {disconnected_agents}
                    </div>
                    <div className="text-sm text-gray-500">
                        佔總數的 {((disconnected_agents / total) * 100).toFixed(1)}%
                    </div>
                    <div className="mt-2 text-sm text-red-600">
                        需要注意
                    </div>
                </div>
            </div>
        </div>
    );
};
