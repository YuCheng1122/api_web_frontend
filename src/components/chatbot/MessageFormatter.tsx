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
                        <p key={index} className="my-2 pl-4">
                            {numberMatch[1]}. {numberMatch[2]}
                        </p>
                    );
                }

                return (
                    <p key={index} className="my-2">
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
                            <h3 key={key++} className="text-xl font-bold my-4 text-gray-800">
                                {currentContent.trim()}
                            </h3>
                        );
                        break;
                    case 'highlight':
                        formattedParts.push(
                            <div key={key++} className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
                                {currentContent.split('\n').map((line, i) => (
                                    line.trim() && (
                                        <p key={i} className="text-blue-700">
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
                            <ul key={key++} className="list-disc pl-6 my-3 space-y-2">
                                {items.map((item, i) => (
                                    <li key={i} className="text-gray-700">
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
                            <ol key={key++} className="list-decimal pl-6 my-3 space-y-2">
                                {numberedItems.map((item, i) => (
                                    <li key={i} className="text-gray-700">
                                        {item.replace(/^\d+\.\s*/, '')}
                                    </li>
                                ))}
                            </ol>
                        );
                        break;
                    case 'code':
                        formattedParts.push(
                            <pre key={key++} className="bg-gray-100 p-4 rounded-lg my-3 overflow-x-auto font-mono text-sm">
                                <code>{currentContent.trim()}</code>
                            </pre>
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
