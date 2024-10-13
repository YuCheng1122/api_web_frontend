import React, { useState, useRef, useEffect } from 'react';
import { IoSend, IoSettingsSharp } from "react-icons/io5";
import { LLMService, Message } from '../types';

interface ChatMessage extends Message {
    timestamp: Date;
}

interface ChatAreaProps {
    currentConversation: { messages: ChatMessage[] } | undefined;
    onSendMessage: (message: ChatMessage) => void;
    llmService: LLMService | null;
    onOpenSettings: () => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({
                                               currentConversation,
                                               onSendMessage,
                                               llmService,
                                               onOpenSettings
                                           }) => {
    const [inputMessage, setInputMessage] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentConversation?.messages]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [inputMessage]);

    const handleSendMessage = async () => {
        if (inputMessage.trim() !== '' && llmService && currentConversation) {
            const newMessage: ChatMessage = { role: 'user', content: inputMessage, timestamp: new Date() };
            onSendMessage(newMessage);
            setInputMessage('');
            setIsThinking(true);

            try {
                const conversationHistory: Message[] = currentConversation.messages.map(({ role, content }) => ({ role, content }));
                conversationHistory.push({ role: 'user', content: inputMessage });

                const response = await llmService.generateResponse(conversationHistory);
                if (response.error) {
                    throw new Error(response.error);
                }
                const botResponse: ChatMessage = { role: 'assistant', content: response.content, timestamp: new Date() };
                onSendMessage(botResponse);
            } catch (error) {
                console.error('Error generating response:', error);
                const errorMessage: ChatMessage = { role: 'assistant', content: "Sorry, I couldn't generate a response. Please try again.", timestamp: new Date() };
                onSendMessage(errorMessage);
            } finally {
                setIsThinking(false);
            }
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <>
            <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">AIXSOAR LLM Assistant</h1>
                <button
                    onClick={onOpenSettings}
                    className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                    <IoSettingsSharp size={24} />
                </button>
            </div>
            <div className="flex-grow overflow-auto p-4 space-y-4 bg-gray-50">
                {currentConversation?.messages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-3 rounded-lg ${
                            message.role === 'user'
                                ? 'bg-blue-500 text-white'
                                : 'bg-white text-gray-800 border border-gray-200'
                        }`}>
                            <p>{message.content}</p>
                            <div className={`text-xs mt-1 ${
                                message.role === 'user' ? 'text-blue-200' : 'text-gray-500'
                            }`}>
                                {message.timestamp.toLocaleTimeString()}
                            </div>
                        </div>
                    </div>
                ))}
                {isThinking && (
                    <div className="flex justify-start">
                        <div className="bg-white p-3 rounded-lg border border-gray-200 animate-pulse">
                            Thinking...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="bg-white p-4 border-t border-gray-200">
                <div className="flex items-end space-x-2">
                    <textarea
                        ref={textareaRef}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        placeholder="在這裡輸入您的消息..."
                        rows={1}
                    />
                    <button
                        onClick={handleSendMessage}
                        className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isThinking || !llmService}
                    >
                        <IoSend size={24} />
                    </button>
                </div>
            </div>
        </>
    );
};

export default ChatArea;