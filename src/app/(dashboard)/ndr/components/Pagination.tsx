'use client'

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => (
    <div className="flex justify-center space-x-2 mt-4">
        <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            Previous
        </button>
        <span className="px-3 py-1 bg-gray-100 rounded-md">
            Page {currentPage + 1} of {Math.max(1, totalPages)}
        </span>
        <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            Next
        </button>
    </div>
);

export default Pagination;
