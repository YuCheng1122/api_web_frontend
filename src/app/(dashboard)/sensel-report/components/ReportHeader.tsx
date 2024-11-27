import { BarChart2, FileText, Clock, Shield, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/app/(dashboard)/sensel-report/components/ui/card';
import { useEffect, useState } from 'react';

interface ReportHeaderProps {
    totalReports: number;
    lastUpdateDate?: string;
}

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    bgColor: string;
    iconColor: string;
}

function StatCard({ icon, label, value, bgColor, iconColor }: StatCardProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <Card className="transform transition-all duration-500 hover:shadow-lg hover:-translate-y-1">
            <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                    <div className={`p-4 ${bgColor} rounded-lg`}>
                        <div className={`w-6 h-6 ${iconColor}`}>
                            {icon}
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">{label}</p>
                        <h3 className={`text-xl font-semibold text-gray-900 transition-all duration-1000 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'
                            }`}>
                            {value}
                        </h3>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function ReportHeader({ totalReports, lastUpdateDate }: ReportHeaderProps) {
    return (
        <div className="space-y-8">
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-lg opacity-50" />
                <div className="relative p-8 space-y-4">
                    <div className="flex items-center space-x-4">
                        <div className="p-4 bg-blue-500 rounded-lg">
                            <BarChart2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">SenseL 分析報告</h1>
                            <p className="text-gray-600 mt-2 max-w-3xl leading-relaxed">
                                全方位的安全分析報告，為您的企業提供深入的威脅洞察和安全建議。
                                我們的報告系統自動整合並分析所有安全事件，幫助您做出明智的資安決策。
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={<FileText />}
                    label="可用報告"
                    value={`${totalReports} 份`}
                    bgColor="bg-blue-50"
                    iconColor="text-blue-500"
                />

                <StatCard
                    icon={<Clock />}
                    label="最後更新"
                    value={lastUpdateDate || '尚無更新'}
                    bgColor="bg-purple-50"
                    iconColor="text-purple-500"
                />

                <StatCard
                    icon={<Shield />}
                    label="安全評分"
                    value="98%"
                    bgColor="bg-green-50"
                    iconColor="text-green-500"
                />

                <StatCard
                    icon={<AlertTriangle />}
                    label="待處理警告"
                    value="0"
                    bgColor="bg-amber-50"
                    iconColor="text-amber-500"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="p-3 bg-white/50 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-blue-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">安全趨勢</h3>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                            根據最新的分析數據，您的系統安全狀態持續維持在良好水平。
                            建議定期查看報告以掌握最新的安全動態。
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="p-3 bg-white/50 rounded-lg">
                                <Shield className="w-5 h-5 text-purple-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">安全建議</h3>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                            您的安全防護措施執行良好。建議持續關注每日報告，
                            及時發現並處理潛在的安全威脅。
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
