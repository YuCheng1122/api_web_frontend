'use client';

import { useAuthContext } from '@/core/contexts/AuthContext';
import { Card, CardContent } from './components/ui/card';
import { ReportCard } from './components/ReportCard';
import { ReportHeader } from './components/ReportHeader';
import { AlertCircle } from 'lucide-react';

export default function SenseLReport() {
    const { username, isLogin } = useAuthContext();

    if (!username || !isLogin) {
        return (
            <div className="container mx-auto p-6 space-y-6">
                <ReportHeader totalReports={0} />
                <Card className="mt-8 bg-gradient-to-br from-gray-50 to-white">
                    <CardContent className="p-12">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="p-4 bg-yellow-50 rounded-full">
                                <AlertCircle className="w-8 h-8 text-yellow-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">請先登入</h3>
                            <p className="text-gray-500 max-w-md">
                                您需要先登入才能使用 SenseL 分析報告服務。
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const lastUpdateDate = new Date().toLocaleDateString('zh-TW');

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <div className="container mx-auto p-6 space-y-8">
                <ReportHeader totalReports={3} lastUpdateDate={lastUpdateDate} />

                <div className="grid gap-6 mt-8">
                    <ReportCard
                        title="每日安全分析報告"
                        description="詳細記錄過去24小時內的所有安全事件、威脅偵測和系統狀態，協助您及時掌握企業的資安狀況。"
                        lastUpdate={lastUpdateDate}
                        frequency="每日更新"
                        username={username}
                        type="daily"
                    />

                    <ReportCard
                        title="週度趨勢分析報告"
                        description="匯總一週內的安全趨勢、威脅模式和防護效能，提供中期安全策略建議和改善方向。"
                        lastUpdate={lastUpdateDate}
                        frequency="每週更新"
                        username={username}
                        type="weekly"
                    />

                    <ReportCard
                        title="月度綜合評估報告"
                        description="全面分析月度資安表現，包含詳細的統計數據、長期趨勢分析和策略性建議，幫助您制定完善的資安政策。"
                        lastUpdate={lastUpdateDate}
                        frequency="每月更新"
                        username={username}
                        type="monthly"
                    />
                </div>
            </div>
        </div>
    );
}
