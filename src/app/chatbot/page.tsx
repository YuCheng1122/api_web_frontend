'use client'

import React, { useState } from 'react';
import FileUploadSection from '@/components/chatbot/FileUploadSection';
import CustomChat from '@/components/chatbot/CustomChat';
import DashboardSummary from '@/components/chatbot/DashboardSummary';
import useDashboardInfo from '@/hooks/useDashboardInfo';
import RecommendedQuestions from "@/components/chatbot/RecommendedQuestions";

const ChatbotPage = () => {
    const [contextFiles, setContextFiles] = useState<File[]>([]);
    const [ragFiles, setRagFiles] = useState<File[]>([]);
    const dashboardInfo = useDashboardInfo();
    const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

    const handleQuestionSelect = (question: string) => {
        setSelectedQuestion(question);
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Left sidebar for dashboard summary */}
            <div className="w-1/4 p-4 overflow-y-auto">
                <DashboardSummary dashboardInfo={dashboardInfo} />
            </div>

            {/* Main chat area */}
            <div className="flex-1 flex flex-col">
                {/* Chat component */}
                <div className="flex-1 overflow-y-auto">
                    <CustomChat
                        dashboardInfo={dashboardInfo}
                        selectedQuestion={selectedQuestion}
                        setSelectedQuestion={setSelectedQuestion}
                    />
                </div>
            </div>

            {/* Right sidebar for file uploads and recommended questions */}
            <div className="w-1/4 p-4 overflow-y-auto flex flex-col">
                <FileUploadSection
                    contextFiles={contextFiles}
                    setContextFiles={setContextFiles}
                    ragFiles={ragFiles}
                    setRagFiles={setRagFiles}
                />
                <div className="mt-4">
                    <h3 className="text-xl font-bold mb-2">推薦問題</h3>
                    <RecommendedQuestions
                        dashboardInfo={dashboardInfo}
                        onQuestionSelect={handleQuestionSelect}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChatbotPage;