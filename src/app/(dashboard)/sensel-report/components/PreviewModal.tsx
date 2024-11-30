'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    pdfUrl: string;
    title: string;
}

export function PreviewModal({ isOpen, onClose, pdfUrl, title }: PreviewModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* PDF Viewer */}
                    <div className="flex-1 p-4 bg-gray-50">
                        <iframe
                            src={`${pdfUrl}#toolbar=0`}
                            className="w-full h-full rounded-lg border shadow-sm"
                            title="PDF Preview"
                        />
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t flex justify-end space-x-2">
                        <a
                            href={pdfUrl}
                            download
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            下載報告
                        </a>
                        <button
                            onClick={onClose}
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
