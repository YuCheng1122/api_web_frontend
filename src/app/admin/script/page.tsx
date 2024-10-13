"use client"; // 標記為客戶端組件

import React from 'react';
import ScriptDownloadForm from '../../../components/admin/script/ScriptDownloadForm'; // 引入表單組件

const SignupPage = () => {
    return (
        <div className="flex flex-col rounded-lg items-center justify-center">
            <ScriptDownloadForm /> 
        </div>
    );
};

export default SignupPage;
