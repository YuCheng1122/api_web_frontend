'use client'

import React from 'react';
import CustomChat from './components/CustomChat';

const ChatbotPage = () => {
    return (
        <div className="h-[calc(100vh-64px)] overflow-hidden bg-gray-100">
            <CustomChat />
        </div>
    );
};

export default ChatbotPage;
