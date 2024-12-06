'use client';

import { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';

interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    generatePdf: () => Promise<string | null>;
}

export function PreviewModal({ isOpen, onClose, title, generatePdf }: PreviewModalProps) {
    const [mounted, setMounted] = useState(false);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            loadPdf();
        } else {
            // Clean up URL when modal closes
            if (pdfUrl) {
                window.URL.revokeObjectURL(pdfUrl);
                setPdfUrl(null);
            }
        }
    }, [isOpen]);

    const loadPdf = async () => {
        setIsLoading(true);
        try {
            const url = await generatePdf();
            if (url) {
                setPdfUrl(url);
            }
        } catch (error) {
            console.error('Error loading PDF:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (pdfUrl) {
            window.URL.revokeObjectURL(pdfUrl);
            setPdfUrl(null);
        }
        onClose();
    };

    if (!mounted) return null;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* PDF Viewer */}
                    <div className="flex-1 p-4 bg-gray-50">
                        {isLoading ? (
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="flex flex-col items-center space-y-4">
                                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                                    <p className="text-gray-500">生成報告中...</p>
                                </div>
                            </div>
                        ) : pdfUrl ? (
                            <iframe
                                src={`${pdfUrl}#toolbar=0`}
                                className="w-full h-full rounded-lg border shadow-sm"
                                title="PDF Preview"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <p className="text-gray-500">無法載入報告</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t flex justify-end space-x-2">
                        {pdfUrl && (
                            <a
                                href={pdfUrl}
                                download
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                下載報告
                            </a>
                        )}
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            關閉
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
