'use client'

import React, { useState } from 'react';
import CustomChat from '@/components/chatbot/CustomChat';
import DashboardSummary from '@/components/chatbot/DashboardSummary';
import useDashboardInfo from '@/hooks/useDashboardInfo';
import RecommendedQuestions from "@/components/chatbot/RecommendedQuestions";

const ChatbotPage = () => {
    const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
    const dashboardInfo = useDashboardInfo();

    const handleQuestionSelect = (question: string) => {
        setSelectedQuestion(question);
    };

    return (
        <div className="flex h-[calc(100vh-64px)] bg-gray-100"> {/* 假設 header 高度為 64px */}
            {/* 左側邊欄：儀表板摘要 */}
            <div className="w-1/4 p-4 overflow-y-auto bg-white shadow-md">
                <h2 className="text-xl font-bold mb-4">儀表板摘要</h2>
                <DashboardSummary dashboardInfo={dashboardInfo} />
            </div>

            {/* 中間：聊天區域 */}
            <div className="flex-1 flex flex-col bg-gray-50">
                <div className="flex-1 overflow-y-auto p-4">
                    <CustomChat
                        dashboardInfo={dashboardInfo}
                        selectedQuestion={selectedQuestion}
                        setSelectedQuestion={setSelectedQuestion}
                    />
                </div>
            </div>

            {/* 右側邊欄：推薦問題 */}
            <div className="w-1/4 p-4 overflow-y-auto bg-white shadow-md">
                <h3 className="text-xl font-bold mb-4">推薦問題</h3>
                <RecommendedQuestions
                    dashboardInfo={dashboardInfo}
                    onQuestionSelect={handleQuestionSelect}
                />
            </div>
        </div>
    );
};

export default ChatbotPage;