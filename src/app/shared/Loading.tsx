import React from 'react';

const Loading: React.FC = () => {
    return (
        <div className="h-full flex justify-center items-center">
            Loading
            <svg
                className='w-[30px] h-[30px] animate-spin'
                viewBox='0 0 40 40'
                xmlns="http://www.w3.org/2000/svg"
            >
                <rect
                    x="10"
                    y="10"
                    className='opacity-80 h-[20px] w-[20px]'
                />
            </svg>
        </div>
    );
};

export default Loading;
