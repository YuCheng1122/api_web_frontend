"use client"; // 標記為客戶端組件

import React from 'react';
import ScriptDownloadForm from './components/ScriptDownloadForm'; // 引入表單組件

const SignupPage = () => {
    return (
        <div className="flex flex-col rounded-lg items-center justify-center">
            {/* 直接顯示 ScriptDownloadForm */}
            <ScriptDownloadForm /> 
            {/* 其他代碼已省略 */}
        </div>
    );
};

export default SignupPage;