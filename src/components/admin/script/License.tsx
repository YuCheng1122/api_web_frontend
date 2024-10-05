import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { getTotalAgentsAndLicense } from '../../../utils/admin/TotalLicenseAgent';

const LicensePage = ({ onLicenseValidated }: { onLicenseValidated: (isValid: boolean) => void }) => {
    const [license, setLicense] = useState('');
    const [isMounted, setIsMounted] = useState(false);

    const router = useRouter();

    useEffect(() => {
        setIsMounted(true); // 確保組件已掛載
    }, []);

    const handleLicenseSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await getTotalAgentsAndLicense();
            console.log('Total License:', response.total_license);
            if (response.total_license === Number(license)) {
                onLicenseValidated(true); // 通知父組件驗證成功
            } else {
                alert('License 驗證失敗');
                onLicenseValidated(false); // 驗證失敗
            }
        } catch (error) {
            console.error(error);
            alert('驗證過程中出現錯誤');
            onLicenseValidated(false); // 出現錯誤時也算驗證失敗
        }
    };

    if (!isMounted) {
        return null; // 在掛載之前不渲染任何內容
    }

    return (
        <div className="bg-gray-100 flex items-center justify-center rounded-lg">
            {/* 主介面部分 */}
            <div className="bg-white rounded-lg p-6 w-full max-w-7xl border border-gray-300"> 
                <form onSubmit={handleLicenseSubmit} className="flex flex-col space-y-6">
                    <input 
                        type="text" 
                        value={license} 
                        onChange={(e) => setLicense(e.target.value)} 
                        placeholder="請輸入 License" 
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />

                    {/* 驗證 License 按鈕 */}
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                    >
                        驗證 License
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LicensePage;
