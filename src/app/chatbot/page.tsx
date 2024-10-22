'use client'

import React from 'react';
import CustomChat from '../../components/chatbot/CustomChat';
import DashboardSummary from '../../components/chatbot/DashboardSummary';
import useDashboardInfo from '../../hooks/useDashboardInfo';

const ChatbotPage = () => {
    const dashboardInfo = useDashboardInfo();

    return (
        <div className="flex h-[calc(100vh-64px)] bg-gray-100"> {/* 假設 header 高度為 64px */}
            {/* 左側邊欄：儀表板摘要 */}
            <div className="w-1/4 p-4 overflow-y-auto bg-white shadow-md">
                <h2 className="text-xl font-bold mb-4">儀表板摘要</h2>
                <DashboardSummary dashboardInfo={dashboardInfo} />
            </div>

            {/* 聊天區域 */}
            <div className="flex-1 p-4 bg-gray-50">
                <CustomChat dashboardInfo={dashboardInfo} />
            </div>
        </div>
    );
};

export default ChatbotPage;
