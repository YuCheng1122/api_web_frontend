"use client"; // 標記為客戶端組件

import React from 'react';
import SignUpForm from '../../../components/signupFrom'; // 引入表單組件

const SignupPage = () => {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="h-[18vh]"></div>
            <SignUpForm /> {/* 調用表單組件 */}
        </div>
    );
};

export default SignupPage;
