'use client'

const ErrorMessage = ({ message }: { message: string }) => (
    <div className="p-6 bg-red-50 rounded-lg shadow-sm border border-red-100 mx-auto max-w-2xl mt-8">
        <div className="flex items-center mb-3">
            <svg className="w-6 h-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-red-700">Error</h3>
        </div>
        <p className="text-red-600">{message}</p>
    </div>
);

export default ErrorMessage;
