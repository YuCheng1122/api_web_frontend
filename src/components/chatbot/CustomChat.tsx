import React, { useEffect, useRef, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { DashboardInfo } from "@/types/chat";
import { useChat } from "@/hooks/useChat";
import { MessageFormatter } from "./MessageFormatter";
import { DynamicQuestions } from "./DynamicQuestions";

interface CustomChatComponentProps {
    dashboardInfo: DashboardInfo;
}

const INITIAL_MESSAGE = {
    text: "您好！👋 我是 AIXSOAR 助手。今天我能為您提供什麼幫助？",
    isUser: false,
    timestamp: new Date()
};

const CustomChat: React.FC<CustomChatComponentProps> = ({
    dashboardInfo,
}) => {
    const {
        messages,
        isLoading,
        error,
        streamingMessage,
        sendMessage
    } = useChat({
        dashboardInfo,
        initialMessages: [INITIAL_MESSAGE]
    });

    const [inputMessage, setInputMessage] = useState("");
    const [shouldGenerateNew, setShouldGenerateNew] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages, streamingMessage]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = async (message: string) => {
        if (message.trim() === "" || isLoading) return;
        setInputMessage("");
        await sendMessage(message);
        // 當回答完成後，觸發新問題生成
        setShouldGenerateNew(true);
    };

    const handleQuestionSelect = (question: string) => {
        handleSendMessage(question);
    };

    const handleGenerationComplete = () => {
        setShouldGenerateNew(false);
    };

    return (
        <div className="flex h-full gap-4">
            <div className="flex-1 flex flex-col bg-white rounded-lg shadow-md">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message, index: number) => (
                        <div
                            key={index}
                            className={`${message.isUser ? "text-right" : "text-left"}`}
                        >
                            <div
                                className={`inline-block p-3 rounded-lg ${message.isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                                    }`}
                            >
                                {message.isUser ? (
                                    <p>{message.text}</p>
                                ) : (
                                    <MessageFormatter content={message.text} />
                                )}
                            </div>
                        </div>
                    ))}
                    {streamingMessage && (
                        <div className="text-left">
                            <div className="inline-block p-3 rounded-lg bg-gray-200 text-black">
                                <MessageFormatter content={streamingMessage} />
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
                            onKeyPress={(e) => e.key === "Enter" && handleSendMessage(inputMessage)}
                            placeholder="在此輸入您的訊息..."
                            className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isLoading}
                        />
                        <button
                            onClick={() => handleSendMessage(inputMessage)}
                            className={`bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                            disabled={isLoading}
                        >
                            <FaPaperPlane />
                        </button>
                    </div>
                    {isLoading && <p className="text-sm text-gray-500 mt-2">AI 正在思考中...</p>}
                    {error && (
                        <p className="text-sm text-red-500 mt-2">
                            發生錯誤: {error.message}
                        </p>
                    )}
                </div>
            </div>
            <div className="w-80 bg-white rounded-lg shadow-md p-4 overflow-y-auto">
                <DynamicQuestions
                    dashboardInfo={dashboardInfo}
                    messages={messages}
                    onQuestionSelect={handleQuestionSelect}
                    shouldGenerateNew={shouldGenerateNew}
                    onGenerationComplete={handleGenerationComplete}
                />
            </div>
        </div>
    );
};

export default CustomChat;
