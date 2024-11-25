'use client'

import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from "react-toastify";
import { useVisionBoardContext } from '@/features/vision_board/contexts/VisionBoardContext';
import { formatToLocalDateTime } from '@/features/vision_board/utils/dateTime';

export default function TimeRangeFilter() {
    const { changeDateTimeRange } = useVisionBoardContext();
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // 設置默認的時間範圍（使用 UTC 時間）
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        setStartDate(formatToLocalDateTime(oneDayAgo));
        setEndDate(formatToLocalDateTime(now));

        // 更新 context 中的時間範圍（使用 UTC 時間）
        changeDateTimeRange(oneDayAgo, now);
    }, []);

    const handleNowClick = () => {
        const now = new Date();
        setEndDate(formatToLocalDateTime(now));
    };

    const handleSubmit = async () => {
        const start = new Date(startDate + 'Z');
        const end = new Date(endDate + 'Z');

        if (start > end) {
            toast.error('開始時間必須早於結束時間');
            return;
        }

        setIsLoading(true);
        try {
            // 只更新時間範圍，讓各個組件自己重新獲取數據
            changeDateTimeRange(start, end);
            toast.success('時間範圍更新成功');
        } catch (error) {
            console.error('Error updating time range:', error);
            toast.error('時間範圍更新失敗');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-wrap w-full md:gap-12 gap-5">
            <div>
                <label
                    htmlFor="start-date"
                    className="block text-sm font-medium text-gray-700 px-1 mb-2"
                >
                    開始時間
                </label>
                <input
                    name="start-date"
                    className="p-2 rounded-lg shadow-lg border border-gray-300 md:min-w-48 w-full"
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
            </div>

            <div>
                <label
                    htmlFor="end-date"
                    className="block text-sm font-medium text-gray-700 px-1 mb-2"
                >
                    結束時間
                </label>
                <div className="flex items-center">
                    <input
                        name="end-date"
                        className="w-full p-2 rounded-lg shadow-lg border border-gray-300 sm:min-w-48 md:min-w-48"
                        type="datetime-local"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
            </div>

            <div className="h-full flex items-center justify-center">
                <button
                    type="button"
                    onClick={handleNowClick}
                    className="ml-2 px-4 py-2 bg-gray-500 max-h-12 mt-5 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                >
                    現在
                </button>
            </div>

            <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`
                    min-w-48 md:min-w-[600px] px-4 py-2 
                    bg-blue-500 text-white rounded-md 
                    hover:bg-blue-600 focus:outline-none 
                    focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
            >
                {isLoading ? '載入中...' : '取得數據'}
            </button>
            <ToastContainer />
        </div>
    );
}
