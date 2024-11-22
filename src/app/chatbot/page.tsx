'use client'

import React from 'react';
import CustomChat from './components/CustomChat';

const ChatbotPage = () => {
    return (
        <div className="fixed inset-x-0 top-[64px] bottom-0 bg-gray-100">
            <CustomChat />
        </div>
    );
};

export default ChatbotPage;
