'use client'

import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from "react-toastify";
import { useDashBoardContext } from "@/contexts/DashBoardContext";
import { fetchAgentData } from '@/utils/dashboard/fetchAgentData';

const DateTimeFilter = () => {
  const { changeDateTimeRange, updateAgentData } = useDashBoardContext();
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

  const handleSubmit = async () => {
    const start = new Date(startDate + 'Z');
    const end = new Date(endDate + 'Z');

    if (start > end) {
      toast.error('Start date must be before end date');
      return;
    }

    setIsLoading(true);
    try {
      const result = await fetchAgentData({ start, end });
      if (result.success) {
        changeDateTimeRange(start, end);
        updateAgentData(result.content);
        toast.success('Data fetched successfully');
      } else {
        toast.error('Failed to fetch data');
      }
    } catch (error) {
      toast.error('An error occurred while fetching data');
    } finally {
      setIsLoading(false);
    }
  };
  const handleNowClick = () => {
    const now = new Date();
    setEndDate(formatToLocalDateTime(now));
  };
  // 輔助函數：將 UTC 日期轉換為本地 datetime-local 格式
  const formatToLocalDateTime = (date: Date) => {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

  return (
    <div className="flex flex-wrap justify-around w-screen ">
      <div className=''>
        <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 px-1 mb-2">開始時間</label>
        <input
          name='start-date'
          className='p-2 rounded-lg shadow-lg border border-gray-300 min-w-80 w-full'
          type='datetime-local'
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>

      <div className=''>
        <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 px-1 mb-2">結束時間</label>
        <input
          name='end-date'
          className=' p-2 rounded-lg shadow-lg border border-gray-300 min-w-80'
          type='datetime-local'
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <button
        type="button"
        onClick={handleNowClick}
        className="mt-5 min-w-20 max-h-10 ml-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
      >
        Now
      </button>

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className={`min-w-48 md:min-w-[600px] px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLoading ? 'Loading...' : '取得數據'}
      </button>
      <ToastContainer />
    </div>
  );
};

export default DateTimeFilter;