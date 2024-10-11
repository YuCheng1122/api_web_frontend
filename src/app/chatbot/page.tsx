'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';
import { FaFileUpload, FaTrash, FaEdit, FaPlus } from 'react-icons/fa';

interface ChatHistory {
    id: number;
    title: string;
    timestamp: string;
}

const ChatbotPage = () => {
    const [contextFiles, setContextFiles] = useState<File[]>([]);
    const [ragFiles, setRagFiles] = useState<File[]>([]);
    const [chatHistory, setChatHistory] = useState<ChatHistory[]>([
        { id: 1, title: 'Previous Chat 1', timestamp: '2024-10-08 14:30' },
        { id: 2, title: 'Previous Chat 2', timestamp: '2024-10-08 16:45' },
    ]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState('');

    useEffect(() => {
        createChat({
            webhookUrl: `${process.env.N8N_LOCALHOST}`,
            mode: 'fullscreen',
            target: '#n8n-chat',
            showWelcomeScreen: true,
            showWindowCloseButton: true,
            loadPreviousSession:true,
            defaultLanguage: 'en',
            allowFileUploads: true,
            initialMessages: [
                'Hi there! 👋',
                'My name is AIXSOAR Assistant. How can I assist you today?'
            ],
            i18n: {
                en: {
                    title: 'AIXSOAR Assistant',
                    subtitle: "Start a chat. We're here to help you 24/7.",
                    footer: '',
                    getStarted: 'New Conversation',
                    inputPlaceholder: 'Type your question...',
                    closeButtonTooltip: ''
                },
            },
        });
    }, []);

    const onDropContext = useCallback((acceptedFiles: File[]) => {
        setContextFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
    }, []);

    const onDropRag = useCallback((acceptedFiles: File[]) => {
        setRagFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
    }, []);

    const { getRootProps: getContextRootProps, getInputProps: getContextInputProps, isDragActive: isContextDragActive } = useDropzone({ onDrop: onDropContext });
    const { getRootProps: getRagRootProps, getInputProps: getRagInputProps, isDragActive: isRagDragActive } = useDropzone({ onDrop: onDropRag });

    const handleContextFileDelete = useCallback((index: number) => {
        setContextFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    }, []);

    const handleRagFileDelete = useCallback((index: number) => {
        setRagFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    }, []);

    const handleNewConversation = () => {
        const newId = Math.max(...chatHistory.map(chat => chat.id), 0) + 1;
        const newChat = {
            id: newId,
            title: `New Chat ${newId}`,
            timestamp: new Date().toLocaleString(),
        };
        setChatHistory([newChat, ...chatHistory]);
    };

    const handleEditStart = (id: number, title: string) => {
        setEditingId(id);
        setEditTitle(title);
    };

    const handleEditSave = (id: number) => {
        setChatHistory(chatHistory.map(chat =>
            chat.id === id ? { ...chat, title: editTitle } : chat
        ));
        setEditingId(null);
    };

    const handleDelete = (id: number) => {
        setChatHistory(chatHistory.filter(chat => chat.id !== id));
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* 左侧：对话记录 */}
            <div className="w-1/5 bg-white p-4 overflow-y-auto">
                <button
                    className="w-full bg-blue-500 text-white p-2 rounded mb-4 hover:bg-blue-600 transition duration-300 flex items-center justify-center"
                    onClick={handleNewConversation}
                >
                    <FaPlus className="mr-2" />
                    New Chat
                </button>
                <div className="space-y-2">
                    {chatHistory.map((chat) => (
                        <div key={chat.id} className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-300">
                            <div className="flex items-center justify-between">
                                {editingId === chat.id ? (
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        onBlur={() => handleEditSave(chat.id)}
                                        autoFocus
                                        className="flex-grow mr-2 p-1 border rounded"
                                    />
                                ) : (
                                    <span className="font-medium flex-grow">{chat.title}</span>
                                )}
                                <div className="flex items-center">
                                    <button onClick={() => handleEditStart(chat.id, chat.title)} className="text-blue-500 hover:text-blue-700 mr-2">
                                        <FaEdit />
                                    </button>
                                    <button onClick={() => handleDelete(chat.id)} className="text-red-500 hover:text-red-700">
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{chat.timestamp}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 中间：n8n Embedded Chat */}
            <div id="n8n-chat" className="flex-1 h-full"></div>

            {/* 右侧：In context 和 RAG */}
            <div className="w-1/5 bg-white p-4 space-y-4 overflow-y-auto">
                <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="font-bold mb-2 flex items-center">
                        <FaFileUpload className="mr-2 text-blue-500" />
                        In context
                    </h3>
                    <div
                        {...getContextRootProps()}
                        className={`border-2 border-dashed border-gray-300 p-4 text-center cursor-pointer rounded-lg transition duration-300 ${
                            isContextDragActive ? 'border-blue-500 bg-blue-50' : 'hover:border-blue-500 hover:bg-gray-50'
                        }`}
                    >
                        <input {...getContextInputProps()} />
                        <p>Drop PDFs or documents here to add context, or click to select files</p>
                    </div>
                    <div className="mt-2 space-y-2">
                        {contextFiles.map((file, index) => (
                            <div key={index} className="flex justify-between items-center bg-white p-2 rounded-lg shadow">
                                <span className="truncate">{file.name}</span>
                                <button
                                    onClick={() => handleContextFileDelete(index)}
                                    className="text-red-500 hover:text-red-700 transition duration-300"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="font-bold mb-2 flex items-center">
                        <FaFileUpload className="mr-2 text-green-500" />
                        RAG
                    </h3>
                    <div
                        {...getRagRootProps()}
                        className={`border-2 border-dashed border-gray-300 p-4 text-center cursor-pointer rounded-lg transition duration-300 ${
                            isRagDragActive ? 'border-green-500 bg-green-50' : 'hover:border-green-500 hover:bg-gray-50'
                        }`}
                    >
                        <input {...getRagInputProps()} />
                        <p>Drop or generate data for Retrieval-Augmented Generation</p>
                    </div>
                    <div className="mt-2 space-y-2">
                        {ragFiles.map((file, index) => (
                            <div key={index} className="flex justify-between items-center bg-white p-2 rounded-lg shadow">
                                <span className="truncate">{file.name}</span>
                                <button
                                    onClick={() => handleRagFileDelete(index)}
                                    className="text-red-500 hover:text-red-700 transition duration-300"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatbotPage;