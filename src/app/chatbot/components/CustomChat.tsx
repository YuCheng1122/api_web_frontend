'use client'

import React, { useEffect, useRef, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { useChat } from "@/features/chatbot/hooks/useChat";
import { MessageFormatter } from "./MessageFormatter";
import { DynamicQuestions } from "./DynamicQuestions";

const INITIAL_MESSAGE = {
    text: "您好！👋 我是 SenseLLM Copilot 助手。今天我能為您提供什麼幫助？",
    isUser: false,
    timestamp: new Date()
};

const CustomChat: React.FC = () => {
    const {
        messages,
        isLoading,
        error,
        streamingMessage,
        sendMessage
    } = useChat({
        initialMessages: [INITIAL_MESSAGE]
    });

    const [inputMessage, setInputMessage] = useState("");
    const [shouldGenerateNew, setShouldGenerateNew] = useState(true);
    const [showSuggestions, setShowSuggestions] = useState(false);
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
        setShowSuggestions(false);
        await sendMessage(message);
        setShouldGenerateNew(true);
    };

    const handleQuestionSelect = (question: string) => {
        handleSendMessage(question);
        setShowSuggestions(false);
    };

    const handleGenerationComplete = () => {
        setShouldGenerateNew(false);
    };

    return (
        <div className="h-full p-4">
            <div className="flex h-full gap-4">
                {/* 主聊天區域 */}
                <div className="flex-1 flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
                    {/* 聊天記錄 */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-4 space-y-4">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[85%] p-3 rounded-lg ${
                                            message.isUser 
                                                ? "bg-blue-500 text-white rounded-br-none" 
                                                : "bg-gray-100 text-black rounded-bl-none"
                                        }`}
                                    >
                                        <div className="break-words">
                                            {message.isUser ? (
                                                <p>{message.text}</p>
                                            ) : (
                                                <MessageFormatter content={message.text} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {streamingMessage && (
                                <div className="flex justify-start">
                                    <div className="max-w-[85%] p-3 rounded-lg bg-gray-100 text-black rounded-bl-none">
                                        <div className="break-words">
                                            <MessageFormatter content={streamingMessage} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* 輸入區域 */}
                    <div className="flex-shrink-0 border-t bg-white">
                        <div className="px-4 py-3">
                            <div className="flex items-center gap-2">
                                {/* 行動版建議問題切換按鈕 */}
                                <button
                                    onClick={() => setShowSuggestions(!showSuggestions)}
                                    className="lg:hidden p-2 text-gray-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </button>

                                <div className="flex-1 flex items-center">
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
                                        className={`bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            isLoading ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                        disabled={isLoading}
                                    >
                                        <FaPaperPlane />
                                    </button>
                                </div>
                            </div>
                            {isLoading && <p className="text-sm text-gray-500 mt-2">AI 正在思考中...</p>}
                            {error && (
                                <p className="text-sm text-red-500 mt-2">
                                    發生錯誤: {error.message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* 建議問題面板 - 桌面版 */}
                <div className="hidden lg:block w-80 bg-white rounded-lg shadow-md p-4 overflow-y-auto">
                    <DynamicQuestions
                        messages={messages}
                        onQuestionSelect={handleQuestionSelect}
                        shouldGenerateNew={shouldGenerateNew}
                        onGenerationComplete={handleGenerationComplete}
                    />
                </div>

                {/* 建議問題面板 - 行動版 */}
                <div 
                    className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-50 ${
                        showSuggestions ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                    onClick={() => setShowSuggestions(false)}
                >
                    <div 
                        className={`fixed inset-y-0 right-0 w-80 bg-white shadow-lg transform transition-transform duration-300 ${
                            showSuggestions ? 'translate-x-0' : 'translate-x-full'
                        }`}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="h-full flex flex-col">
                            <div className="p-4 border-b flex justify-between items-center">
                                <h3 className="text-lg font-semibold">建議問題</h3>
                                <button 
                                    onClick={() => setShowSuggestions(false)}
                                    className="p-2 text-gray-600 hover:text-blue-500 focus:outline-none"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4">
                                <DynamicQuestions
                                    messages={messages}
                                    onQuestionSelect={handleQuestionSelect}
                                    shouldGenerateNew={shouldGenerateNew}
                                    onGenerationComplete={handleGenerationComplete}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomChat;
