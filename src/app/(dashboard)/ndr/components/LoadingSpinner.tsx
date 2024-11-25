'use client'

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="relative">
            <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin border-t-blue-500"></div>
            <div className="mt-4 text-gray-600">Loading data...</div>
        </div>
    </div>
);

export default LoadingSpinner;
