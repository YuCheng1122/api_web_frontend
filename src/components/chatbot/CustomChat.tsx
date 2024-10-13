import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { sendStreamingMessage } from '@/services/chatService';
import ReactMarkdown from 'react-markdown';

interface Message {
    text: string;
    isUser: boolean;
}

interface CustomChatProps {
    dashboardInfo: {
        totalAgents: number;
        activeAgents: number;
        topAgent: string;
        topEvent: string;
    };
    selectedQuestion: string | null;
    setSelectedQuestion: React.Dispatch<React.SetStateAction<string | null>>;
}

const CustomChat: React.FC<CustomChatProps> = ({ dashboardInfo, selectedQuestion, setSelectedQuestion }) => {
    const [messages, setMessages] = useState<Message[]>([
        { text: "您好！👋 我是 AIXSOAR 助手。今天我能為您提供什麼幫助？", isUser: false }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [streamingMessage, setStreamingMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (selectedQuestion) {
            handleSendMessage(selectedQuestion);
            setSelectedQuestion(null);
        }
    }, [selectedQuestion]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, streamingMessage]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = async (message: string) => {
        if (message.trim() === '' || isLoading) return;

        const newUserMessage = { text: message, isUser: true };
        setMessages(prev => [...prev, newUserMessage]);
        setInputMessage('');
        setIsLoading(true);
        setStreamingMessage('');

        const context = `
<prompt>
    <assistantRole>
        您是安全運營平台的 AI 助手。
    </assistantRole>
    <systemStatus>
        <totalAgents>${dashboardInfo.totalAgents}</totalAgents>
        <activeAgents>${dashboardInfo.activeAgents}</activeAgents>
        <topAgent>${dashboardInfo.topAgent}</topAgent>
        <topEvent>${dashboardInfo.topEvent}</topEvent>
    </systemStatus>
    <userInstructions>
        根據系統狀態資訊，回答安全分析師可能的問題，並提供詳細建議。
    </userInstructions>
    <formatInstructions>
        使用 Markdown 格式組織回答內容。請包括清晰的項目符號、段落和標題（如「**改進建議**」、「**事件重點**」）。
    </formatInstructions>
</prompt>
`;

        try {
            let fullResponse = '';
            await sendStreamingMessage(message, context, messages, (chunk) => {
                fullResponse += chunk;
                setStreamingMessage(prev => prev + chunk);
            });

            const newAssistantMessage = { text: fullResponse, isUser: false };
            setMessages(prev => [...prev, newAssistantMessage]);
        } catch (error) {
            console.error('獲取回應時發生錯誤:', error);
            setMessages(prev => [...prev, { text: "抱歉，我在處理您的請求時遇到了問題。請稍後再試。", isUser: false }]);
        } finally {
            setIsLoading(false);
            setStreamingMessage('');
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow-md">
            <div className="flex-1 overflow-y-auto p-4">
                {messages.map((message, index) => (
                    <div key={index} className={`mb-4 ${message.isUser ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block p-2 rounded-lg ${message.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                            <ReactMarkdown>{message.text}</ReactMarkdown>
                        </div>
                    </div>
                ))}
                {streamingMessage && (
                    <div className="mb-4 text-left">
                        <div className="inline-block p-2 rounded-lg bg-gray-200 text-black">
                            <ReactMarkdown>{streamingMessage}</ReactMarkdown>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="border-t p-4">
                <div className="flex items-center">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputMessage)}
                        placeholder="在此輸入您的訊息..."
                        className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                    />
                    <button
                        onClick={() => handleSendMessage(inputMessage)}
                        className={`bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isLoading}
                    >
                        <FaPaperPlane />
                    </button>
                </div>
                {isLoading && <p className="text-sm text-gray-500 mt-2">AI 正在思考中...</p>}
            </div>
        </div>
    );
};

export default CustomChat;