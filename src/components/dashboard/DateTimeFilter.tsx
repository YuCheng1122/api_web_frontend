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
    // 設置默認的時間範圍
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    setStartDate(oneDayAgo.toISOString().slice(0, 16));
    setEndDate(now.toISOString().slice(0, 16));
    
    // 只更新 context 中的時間範圍，不觸發數據獲取
    changeDateTimeRange(oneDayAgo, now);
  }, []);

  const handleSubmit = async () => {
    const start = new Date(startDate);
    const end = new Date(endDate);

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

  return (
    <div className="grid grid-cols-3 gap-4 p-2">
      <div className='w-full'>
        <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 px-1 mb-2">Start Time</label>
        <input 
          name='start-date' 
          className='w-full p-2 rounded-lg shadow-lg border border-gray-300' 
          type='datetime-local' 
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>

      <div className='w-full'>
        <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 px-1 mb-2">End Time</label>
        <input 
          name='end-date' 
          className='w-full p-2 rounded-lg shadow-lg border border-gray-300' 
          type='datetime-local' 
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLoading ? 'Loading...' : 'Fetch Data'}
      </button>
      <ToastContainer />
    </div>
  );
};

export default DateTimeFilter;