import React, { useState } from 'react';
import { signup } from '../utils/admin/signup'; // 導入 signup 函數

const SignUpForm = ({ className }: { className?: string }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        company_name: ''
    });

    const [message, setMessage] = useState(''); // 用來存儲提示信息
    const [messageType, setMessageType] = useState(''); // 'success' 或 'error'

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // 防止頁面重新加載

        try {
            const result = await signup(formData); // 調用 signup 函數送出表單

            // 如果 signup 返回的 success 為 false，顯示錯誤信息
            if (!result.success) {
                setMessage(`Signup Failed: ${result.message}`);
                setMessageType('error');
                // 設定 3 秒後清除訊息
                setTimeout(() => {
                    setMessage('');
                }, 3000);
            } else {
                setMessage('Signup Success! Redirecting to login page.');
                setMessageType('success');
                // 設定延遲後跳轉
                setTimeout(() => {
                    window.location.href = '/admin/login'; // 跳轉到登入頁面
                }, 3000); // 延遲3秒
            }
        } catch (error) {
            console.error('Signup Failed:', error); // 捕捉到異常時的錯誤處理
            setMessage('Signup Failed: An error occurred');
            setMessageType('error');
            // 設定 3 秒後清除訊息
            setTimeout(() => {
                setMessage('');
            }, 3000);
        }
    };

    return (
        <div className="bg-white rounded-lg p-6 shadow-md w-[50vw] h-[54vh]"> {/* 修改寬高 */}
            {/* 使用 flexbox 將左側表單和右側按鈕分開 */}
            <form onSubmit={handleSubmit} className="flex justify-between items-start h-full">
                {/* 左邊部分 - 表單 */}
                <div className="flex flex-col w-1/2 pr-4 justify-start space-y-4"> {/* 使用 space-y-4 加入欄位間空隙 */}
                    <h2 className="text-4xl font-bold mb-6">Sign up</h2> {/* 修改底部間距為 mb-6 */}
                    
                    {/* 使用者名稱 */}
                    <div className="flex flex-col">
                        <input 
                            type="text" 
                            name="username" 
                            placeholder="使用者名稱"
                            onChange={handleChange} 
                            required
                            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                    </div>

                    {/* 密碼 */}
                    <div className="flex flex-col"> 
                        <input 
                            type="password" 
                            name="password" 
                            placeholder="密碼"
                            onChange={handleChange} 
                            required
                            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                    </div>

                    {/* 電子信箱 */}
                    <div className="flex flex-col"> 
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="電子信箱"
                            onChange={handleChange} 
                            required
                            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                    </div>

                    {/* 公司名稱 */}
                    <div className="flex flex-col"> 
                        <input 
                            type="text" 
                            name="company_name" 
                            placeholder="公司名稱"
                            onChange={handleChange} 
                            required
                            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                    </div>
                </div>

                {/* 右邊部分 - 按鈕 */}
                <div className="flex flex-col justify-center items-center w-1/2 h-full"> {/* 使按鈕居中 */}
                    <button 
                        type="submit" 
                        className="bg-blue-500 text-white rounded-full py-7 px-20 text-lg font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Next →
                    </button>
                    <div className="mt-4 text-sm text-center">
                        Already have an account? <a href="/admin/login" className="text-blue-500 hover:underline">Log in</a>
                    </div>
                </div>
            </form>

            {/* 顯示成功或錯誤訊息 */}
            {message && (
                <div 
                    className={`fixed bottom-4 right-4 p-4 z-50 shadow-lg rounded-lg ${
                        messageType === 'success' 
                            ? 'bg-green-100 border-l-4 border-green-500 text-green-700' 
                            : 'bg-red-100 border-l-4 border-red-500 text-red-700'
                    }`} 
                    role="alert"
                >
                    <p>{message}</p>
                </div>
            )}
        </div>
    );
};

export default SignUpForm;
