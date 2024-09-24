'use client'

import React, { useState, useRef, useEffect } from 'react';
import { IoSend, IoSettingsSharp, IoClose, IoAdd } from "react-icons/io5";
import { LLMFactory } from './llmFactory';
import { LLMService, LLMType, LLMConfig, Message } from './types';

interface ChatMessage extends Message {
    timestamp: Date;
}

interface Conversation {
    id: string;
    title: string;
    messages: ChatMessage[];
}

const LLMPage: React.FC = () => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
    const [inputMessage, setInputMessage] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [llmConfig, setLlmConfig] = useState<LLMConfig>({ type: LLMType.ChatGPT });
    const [showSettings, setShowSettings] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [llmService, setLlmService] = useState<LLMService | null>(null);

    useEffect(() => {
        try {
            const service = LLMFactory.createLLMService(llmConfig);
            setLlmService(service);
        } catch (error) {
            console.error('Failed to create LLM service:', error);
            setLlmService(null);
        }
    }, [llmConfig]);

    useEffect(() => {
        if (conversations.length === 0) {
            createNewConversation();
        }
    }, [conversations]);

    const createNewConversation = () => {
        const newConversation: Conversation = {
            id: Date.now().toString(),
            title: `New Conversation ${conversations.length + 1}`,
            messages: []
        };
        setConversations([...conversations, newConversation]);
        setCurrentConversationId(newConversation.id);
    };

    const getCurrentConversation = () => {
        return conversations.find(conv => conv.id === currentConversationId) || conversations[0];
    };

    const handleSendMessage = async () => {
        if (inputMessage.trim() !== '' && llmService) {
            const currentConversation = getCurrentConversation();
            const newMessage: ChatMessage = { role: 'user', content: inputMessage, timestamp: new Date() };

            setConversations(prevConversations =>
                prevConversations.map(conv =>
                    conv.id === currentConversation.id
                        ? { ...conv, messages: [...conv.messages, newMessage] }
                        : conv
                )
            );

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

                setConversations(prevConversations =>
                    prevConversations.map(conv =>
                        conv.id === currentConversation.id
                            ? { ...conv, messages: [...conv.messages, botResponse] }
                            : conv
                    )
                );
            } catch (error) {
                console.error('Error generating response:', error);
                const errorMessage: ChatMessage = { role: 'assistant', content: "Sorry, I couldn't generate a response. Please try again.", timestamp: new Date() };

                setConversations(prevConversations =>
                    prevConversations.map(conv =>
                        conv.id === currentConversation.id
                            ? { ...conv, messages: [...conv.messages, errorMessage] }
                            : conv
                    )
                );
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

    const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value === 'chatgpt' ? LLMType.ChatGPT : LLMType.LocalModel;
        setLlmConfig({ ...llmConfig, type: newType });
    };

    const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newApiKey = e.target.value;
        setLlmConfig(prevConfig => ({ ...prevConfig, apiKey: newApiKey }));
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversations]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [inputMessage]);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 p-4">
                <button
                    onClick={createNewConversation}
                    className="w-full bg-blue-500 text-white p-2 rounded-lg mb-4 flex items-center justify-center"
                >
                    <IoAdd size={20} className="mr-2" />
                    New Conversation
                </button>
                <div className="space-y-2">
                    {conversations.map(conv => (
                        <button
                            key={conv.id}
                            onClick={() => setCurrentConversationId(conv.id)}
                            className={`w-full text-left p-2 rounded-lg ${
                                currentConversationId === conv.id
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'hover:bg-gray-100'
                            }`}
                        >
                            {conv.title}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">AIXSOAR LLM Assistant</h1>
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <IoSettingsSharp size={24} />
                    </button>
                </div>

                {/* Messages Area */}
                <div className="flex-grow overflow-auto p-4 space-y-4 bg-gray-50">
                    {getCurrentConversation()?.messages.map((message, index) => (
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

                {/* Input Area */}
                <div className="bg-white p-4 border-t border-gray-200">
                    <div className="flex items-end space-x-2">
                        <textarea
                            ref={textareaRef}
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            placeholder="Type your message here..."
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
            </div>

            {/* Settings Panel (Slide-out) */}
            {showSettings && (
                <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-lg p-4 transform transition-transform duration-300 ease-in-out">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Settings</h2>
                        <button onClick={() => setShowSettings(false)} className="text-gray-500 hover:text-gray-700">
                            <IoClose size={24} />
                        </button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
                            <select
                                value={llmConfig.type === LLMType.ChatGPT ? 'chatgpt' : 'local'}
                                onChange={handleModeChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="chatgpt">ChatGPT</option>
                                <option value="local">Local Model</option>
                            </select>
                        </div>
                        {llmConfig.type === LLMType.ChatGPT && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                                <input
                                    type="password"
                                    value={llmConfig.apiKey || ''}
                                    onChange={handleApiKeyChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your API key"
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LLMPage;