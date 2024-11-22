'use client'

import React from 'react';
import CustomChat from '@/app/chatbot/components/CustomChat';

const ChatbotPage = () => {
    return (
        <div className="flex h-[calc(100vh-64px)] bg-gray-100"> {/* 假設 header 高度為 64px */}
            {/* 聊天區域 */}
            <div className="flex-1 p-4 bg-gray-50">
                <CustomChat />
            </div>
        </div>
    );
};

export default ChatbotPage;
