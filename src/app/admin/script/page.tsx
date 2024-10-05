"use client"; // 標記為客戶端組件

import React, { useState } from 'react';
import ScriptDownloadForm from '../../../components/admin/script/ScriptDownloadForm'; // 引入表單組件
import LicensePage from '../../../components/admin/script/License'; // 引入表單組件

const SignupPage = () => {
    const [isLicenseValid, setIsLicenseValid] = useState(false); // 狀態來控制是否驗證成功

    const handleLicenseValidation = (isValid: boolean) => {
        setIsLicenseValid(isValid); // 更新狀態，依據 License 驗證結果決定是否顯示 ScriptDownloadForm
    };

    return (
        <div className="flex flex-col rounded-lg items-center justify-center">
            {!isLicenseValid ? (
                <div>
                    <div className="h-[18vh]"></div>
                    <LicensePage onLicenseValidated={handleLicenseValidation} /> {/*傳遞回調函數*/}
                </div>
                
            ) : (
                <ScriptDownloadForm /> // License 驗證通過後顯示表單
            )}
        </div>
    );
};

export default SignupPage;
