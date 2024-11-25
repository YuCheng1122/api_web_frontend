import React from 'react';

interface MessageFormatterProps {
    content: string;
}

export const MessageFormatter: React.FC<MessageFormatterProps> = ({ content }) => {
    const formatMessage = (text: string) => {
        // 處理舊格式（向後兼容）
        let processedText = text
            .replace(/title_start/g, '<title>')
            .replace(/title_end/g, '</title>')
            .replace(/highlight_start/g, '<highlight>')
            .replace(/highlight_end/g, '</highlight>')
            .replace(/list_start/g, '<list>')
            .replace(/list_end/g, '</list>')
            .replace(/code_start/g, '<code>')
            .replace(/code_end/g, '</code>');

        // 分割並處理標籤
        const parts = processedText.split(/(<\/?(?:title|highlight|list|code|numbered)>)/);

        const formattedParts: JSX.Element[] = [];
        let currentTag = '';
        let currentContent = '';
        let key = 0;

        const formatPlainText = (text: string) => {
            const lines = text.split('\n');
            return lines.map((line, index) => {
                const trimmedLine = line.trim();
                if (!trimmedLine) return null;

                // 檢查是否為獨立的數字列表項目（不在 <numbered> 標籤內）
                const numberMatch = trimmedLine.match(/^(\d+)\.\s*(.*)/);
                if (numberMatch) {
                    return (
                        <p key={index} className="my-2 pl-4 text-gray-800">
                            {numberMatch[1]}. {numberMatch[2]}
                        </p>
                    );
                }

                return (
                    <p key={index} className="my-2 text-gray-800 break-words">
                        {trimmedLine}
                    </p>
                );
            }).filter(Boolean);
        };

        parts.forEach((part) => {
            if (part.startsWith('</')) {
                // 結束標籤
                switch (currentTag) {
                    case 'title':
                        formattedParts.push(
                            <h3 key={key++} className="text-lg md:text-xl font-bold my-3 md:my-4 text-gray-900">
                                {currentContent.trim()}
                            </h3>
                        );
                        break;
                    case 'highlight':
                        formattedParts.push(
                            <div key={key++} className="bg-blue-50 border-l-4 border-blue-500 p-3 md:p-4 my-3 md:my-4 rounded-r">
                                {currentContent.split('\n').map((line, i) => (
                                    line.trim() && (
                                        <p key={i} className="text-blue-700 break-words">
                                            {line.trim()}
                                        </p>
                                    )
                                ))}
                            </div>
                        );
                        break;
                    case 'list':
                        const items = currentContent
                            .split('\n')
                            .map(item => item.trim())
                            .filter(item => item && !item.match(/^list/i));
                        formattedParts.push(
                            <ul key={key++} className="list-disc pl-4 md:pl-6 my-3 space-y-2">
                                {items.map((item, i) => (
                                    <li key={i} className="text-gray-700 break-words">
                                        {item.replace(/^-\s*/, '')}
                                    </li>
                                ))}
                            </ul>
                        );
                        break;
                    case 'numbered':
                        const numberedItems = currentContent
                            .split('\n')
                            .map(item => item.trim())
                            .filter(item => item);
                        formattedParts.push(
                            <ol key={key++} className="list-decimal pl-4 md:pl-6 my-3 space-y-2">
                                {numberedItems.map((item, i) => (
                                    <li key={i} className="text-gray-700 break-words">
                                        {item.replace(/^\d+\.\s*/, '')}
                                    </li>
                                ))}
                            </ol>
                        );
                        break;
                    case 'code':
                        formattedParts.push(
                            <div key={key++} className="relative group">
                                <pre className="bg-gray-100 p-3 md:p-4 rounded-lg my-3 overflow-x-auto font-mono text-sm text-gray-800">
                                    <code className="break-words whitespace-pre-wrap">
                                        {currentContent.trim()}
                                    </code>
                                </pre>
                                <button
                                    onClick={() => navigator.clipboard.writeText(currentContent.trim())}
                                    className="absolute top-2 right-2 p-2 bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    title="複製代碼"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                    </svg>
                                </button>
                            </div>
                        );
                        break;
                }
                currentTag = '';
                currentContent = '';
            } else if (part.startsWith('<')) {
                // 開始標籤
                currentTag = part.replace(/[<>]/g, '');
                currentContent = '';
            } else if (currentTag) {
                // 標籤內容
                currentContent += part;
            } else if (part.trim()) {
                // 普通文本
                formattedParts.push(
                    <div key={key++} className="my-2">
                        {formatPlainText(part)}
                    </div>
                );
            }
        });

        return formattedParts;
    };

    return <div className="space-y-2">{formatMessage(content)}</div>;
};

export default MessageFormatter;
