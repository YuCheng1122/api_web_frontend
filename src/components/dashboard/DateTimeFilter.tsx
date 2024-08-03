'use client'

// third-party
import React, { useState } from 'react';
import { ToastContainer, toast } from "react-toastify";

// contexts
import {useDashBoardContext} from "@/contexts/DashBoardContext";

const DateTimeFilter = () => {
  const {changeDateTimeRange} = useDashBoardContext()
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleSubmit = () => {
    if (startDate && endDate) {
      if(startDate <= endDate){
        changeDateTimeRange(startDate, endDate)
      }else{
        toast.error('Start date must be before end date')
      } 
    }else{
      toast.error('Please select date')
    }
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(new Date(e.target.value))
  }

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(new Date(e.target.value))
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-4 bg-white p-2">
        <div className='w-full'>
          <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 px-1 mb-2">Started Time</label>
          <input name='start-date' className='w-full p-2 rounded-lg shadow-lg border border-gray-300' type='datetime-local' onChange={handleStartDateChange}></input>
        </div>

        <div className='w-full'>
          <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 px-1 mb-2">End Time</label>
          <input name='end-date' className='w-full p-2 rounded-lg shadow-lg border border-gray-300' type='datetime-local' onChange={handleEndDateChange}></input>
        </div>

        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Send
        </button>
      </div>
      <ToastContainer />
    </>
  );
};

export default DateTimeFilter;
