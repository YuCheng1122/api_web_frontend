import { FileText, Download, Calendar, Clock, FileIcon, Eye, Loader2 } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { useState } from 'react';
import { PreviewModal } from './PreviewModal';

interface ReportCardProps {
    title: string;
    description: string;
    lastUpdate?: string;
    frequency: string;
    username: string;
    type: 'daily' | 'weekly' | 'monthly';
}

const typeColors = {
    daily: {
        bg: 'bg-blue-50',
        text: 'text-blue-500',
        hover: 'hover:bg-blue-600',
        border: 'border-blue-100',
    },
    weekly: {
        bg: 'bg-purple-50',
        text: 'text-purple-500',
        hover: 'hover:bg-purple-600',
        border: 'border-purple-100',
    },
    monthly: {
        bg: 'bg-green-50',
        text: 'text-green-500',
        hover: 'hover:bg-green-600',
        border: 'border-green-100',
    },
};

export function ReportCard({
    title,
    description,
    lastUpdate,
    frequency,
    username,
    type
}: ReportCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const colors = typeColors[type];

    const generateAndDownloadReport = async () => {
        try {
            setIsGenerating(true);
            const response = await fetch(`/api/generate-report?username=${username}&report_type=${type}`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('Failed to generate report');
            }

            // Get the blob from the response
            const blob = await response.blob();

            // Create a URL for the blob
            const url = window.URL.createObjectURL(blob);

            // Create a temporary link and click it to download
            const a = document.createElement('a');
            a.href = url;
            a.download = `${username}_${type}.pdf`;
            document.body.appendChild(a);
            a.click();

            // Clean up
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error generating report:', error);
            alert('報告生成失敗，請稍後再試');
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePreview = async () => {
        try {
            setIsGenerating(true);
            const response = await fetch(`/api/generate-report?username=${username}&report_type=${type}`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error('Failed to generate report');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            setIsPreviewOpen(true);
            return url;
        } catch (error) {
            console.error('Error generating report for preview:', error);
            alert('報告預覽生成失敗，請稍後再試');
            return null;
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <>
            <Card
                className={`transform transition-all duration-300 hover:shadow-xl border-l-4 ${colors.border}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <CardContent className="p-8">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-6">
                            <div className={`p-4 ${colors.bg} rounded-lg transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
                                <FileText className={`w-7 h-7 ${colors.text}`} />
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">{description}</p>
                                </div>
                                <div className="flex items-center flex-wrap gap-4 text-sm text-gray-500">
                                    {lastUpdate && (
                                        <div className="flex items-center space-x-2">
                                            <Clock className="w-4 h-4" />
                                            <span>最後更新：{lastUpdate}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>{frequency}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setIsPreviewOpen(true)}
                                disabled={isGenerating}
                                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed`}
                                title="預覽報告"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>生成中...</span>
                                    </>
                                ) : (
                                    <>
                                        <Eye className="w-4 h-4" />
                                        <span>預覽</span>
                                    </>
                                )}
                            </button>
                            <button
                                onClick={generateAndDownloadReport}
                                disabled={isGenerating}
                                className={`flex items-center space-x-2 px-4 py-2.5 ${colors.bg} ${colors.text} rounded-lg ${colors.hover} hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>生成中...</span>
                                    </>
                                ) : (
                                    <>
                                        <Download className={`w-4 h-4 ${isHovered ? 'animate-bounce' : ''}`} />
                                        <span>生成報告</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <PreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                title={title}
                generatePdf={handlePreview}
            />
        </>
    );
}
