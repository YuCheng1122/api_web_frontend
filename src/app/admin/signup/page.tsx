"use client"; // 標記為客戶端組件

import React from 'react';
import SignUpForm from './components/SignupFrom'; // 引入表單組件

const SignupPage = () => {
    return (
        <div className="flex flex-col items-center justify-center  h-full w-full min-h-[80vh]">

            <SignUpForm /> {/* 調用表單組件 */}
        </div>
    );
};

export default SignupPage;
