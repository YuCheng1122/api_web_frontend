'use client';

import { useEffect, useState } from 'react';
import { useAuthContext } from '@/core/contexts/AuthContext';
import { Card, CardContent } from '@/app/(dashboard)/sensel-report/components/ui/card';
import { ReportCard } from './components/ReportCard';
import { ReportHeader } from './components/ReportHeader';
import { AlertCircle } from 'lucide-react';

interface ReportInfo {
    exists: boolean;
    size?: string;
}

interface ReportFiles {
    daily?: ReportInfo;
    weekly?: ReportInfo;
    monthly?: ReportInfo;
}

export default function SenseLReport() {
    const { username, isLogin } = useAuthContext();
    const [reports, setReports] = useState<ReportFiles | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkReports = async () => {
            if (!username || !isLogin) {
                setReports(null);
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/check-reports?username=${username}`);
                const data = await response.json();
                setReports(data);
            } catch (error) {
                console.error('Error checking reports:', error);
                setReports(null);
            } finally {
                setLoading(false);
            }
        };

        checkReports();
    }, [username, isLogin]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500">載入報告中...</p>
                </div>
            </div>
        );
    }

    if (!reports || Object.keys(reports).length === 0) {
        return (
            <div className="container mx-auto p-6 space-y-6">
                <ReportHeader totalReports={0} />
                <Card className="mt-8 bg-gradient-to-br from-gray-50 to-white">
                    <CardContent className="p-12">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="p-4 bg-yellow-50 rounded-full">
                                <AlertCircle className="w-8 h-8 text-yellow-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">尚未開通服務</h3>
                            <p className="text-gray-500 max-w-md">
                                您目前尚未開通 SenseL 分析報告服務。此服務能為您提供詳細的安全分析、威脅評估和改善建議，
                                幫助您的企業建立更強大的資安防護。
                            </p>
                            <button className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                聯絡我們開通服務
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const totalReports = Object.values(reports).filter(report => report?.exists).length;
    const lastUpdateDate = new Date().toLocaleDateString('zh-TW');

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <div className="container mx-auto p-6 space-y-8">
                <ReportHeader totalReports={totalReports} lastUpdateDate={lastUpdateDate} />

                <div className="grid gap-6 mt-8">
                    {reports.daily?.exists && (
                        <ReportCard
                            title="每日安全分析報告"
                            description="詳細記錄過去24小時內的所有安全事件、威脅偵測和系統狀態，協助您及時掌握企業的資安狀況。"
                            lastUpdate={lastUpdateDate}
                            frequency="每日更新"
                            downloadUrl={`/report/${username}/${username}_daily.pdf`}
                            type="daily"
                            fileSize={reports.daily.size}
                        />
                    )}

                    {reports.weekly?.exists && (
                        <ReportCard
                            title="週度趨勢分析報告"
                            description="匯總一週內的安全趨勢、威脅模式和防護效能，提供中期安全策略建議和改善方向。"
                            lastUpdate={lastUpdateDate}
                            frequency="每週更新"
                            downloadUrl={`/report/${username}/${username}_weekly.pdf`}
                            type="weekly"
                            fileSize={reports.weekly.size}
                        />
                    )}

                    {reports.monthly?.exists && (
                        <ReportCard
                            title="月度綜合評估報告"
                            description="全面分析月度資安表現，包含詳細的統計數據、長期趨勢分析和策略性建議，幫助您制定完善的資安政策。"
                            lastUpdate={lastUpdateDate}
                            frequency="每月更新"
                            downloadUrl={`/report/${username}/${username}_monthly.pdf`}
                            type="monthly"
                            fileSize={reports.monthly.size}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
