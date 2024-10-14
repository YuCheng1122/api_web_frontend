interface DateTimeFilterProps {
  handleStartDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleEndDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: () => void
}


const DateTimeFilter = ({handleStartDateChange, handleEndDateChange, handleSubmit}: DateTimeFilterProps) => {
  return (
    <div className="grid grid-cols-3 gap-4 p-2">
    <div className='w-full'>
      <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 px-1 mb-2">開始時間</label>
      <input name='start-date' className='w-full p-2 rounded-lg shadow-lg border border-gray-300' type='datetime-local' onChange={handleStartDateChange}></input>
    </div>

    <div className='w-full'>
      <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 px-1 mb-2">結束時間</label>
      <input name='end-date' className='w-full p-2 rounded-lg shadow-lg border border-gray-300' type='datetime-local' onChange={handleEndDateChange}></input>
    </div>

    <button
      onClick={handleSubmit}
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    >
      傳送
    </button>
  </div>
  )
}

export default DateTimeFilter
