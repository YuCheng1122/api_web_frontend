import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

interface ChatHistoryProps {
    chatHistory: Array<{ id: number; title: string; timestamp: string }>;
    setChatHistory: React.Dispatch<React.SetStateAction<Array<{ id: number; title: string; timestamp: string }>>>;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ chatHistory, setChatHistory }) => {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState('');

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
    );
};

export default ChatHistory;