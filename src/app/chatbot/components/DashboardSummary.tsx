import React from 'react';
import { FaUsers, FaUserCheck, FaChartLine, FaExclamationTriangle } from 'react-icons/fa';
import {DashboardInfo} from "@/features/chatbot/types/chat";

interface DashboardSummaryProps {
    dashboardInfo: DashboardInfo;
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ dashboardInfo }) => {
    const { totalAgents, activeAgents, topAgent, topEvent } = dashboardInfo;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">儀表板摘要</h2>

            <div className="grid grid-cols-1 gap-4 mb-6">
                <div className="flex items-center">
                    <FaUsers className="text-blue-500 mr-2" />
                    <span>總代理數：{totalAgents}</span>
                </div>
                <div className="flex items-center">
                    <FaUserCheck className="text-green-500 mr-2" />
                    <span>活躍代理數：{activeAgents}</span>
                </div>
                <div className="flex items-center">
                    <FaChartLine className="text-purple-500 mr-2" />
                    <span>最活躍代理：{topAgent}</span>
                </div>
                <div className="flex items-center">
                    <FaExclamationTriangle className="text-yellow-500 mr-2" />
                    <span>最常見事件：{topEvent}</span>
                </div>
            </div>
        </div>
    );
};

export default DashboardSummary;
