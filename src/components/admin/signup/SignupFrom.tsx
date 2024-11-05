import React, { useState } from 'react';
import { signup } from '../../../utils/admin/signup'; // 導入 signup 函數

const SignUpForm = ({ className }: { className?: string }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        company_name: '',
        license_amount: ''
    });

    const [message, setMessage] = useState(''); // 用來存儲提示信息
    const [messageType, setMessageType] = useState(''); // 'success' 或 'error'

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // 防止頁面重新加載

        // 驗證使用者名稱
        const usernameRegex = /^[a-zA-Z0-9]{1,16}$/; // 只允許字母和數字，且長度不超過8字元
        if (!usernameRegex.test(formData.username)) {
            setMessage('使用者名稱只能包含字母和數字，且不得超過16字元');
            setMessageType('error');
            setTimeout(() => setMessage(''), 3000); // 3秒後清除訊息
            return; // 如果不符合規則，則不提交表單
        }

        // 驗證密碼（例如：至少8個字元，包含字母和數字）
        if (formData.password.length < 8) {
            setMessage('密碼必須至少8個字元');
            setMessageType('error');
            setTimeout(() => setMessage(''), 3000); // 3秒後清除訊息
            return; // 如果不符合規則，則不提交表單
        }

        // 驗證電子信箱格式
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 簡單的電子信箱格式驗證
        if (!emailRegex.test(formData.email)) {
            setMessage('請輸入有效的電子信箱');
            setMessageType('error');
            setTimeout(() => setMessage(''), 3000); // 3秒後清除訊息
            return; // 如果不符合規則，則不提交表單
        }

        // 驗證公司名稱（可根據需求添加規則）
        if (formData.company_name.trim() === '') {
            setMessage('公司名稱不得為空');
            setMessageType('error');
            setTimeout(() => setMessage(''), 3000); // 3秒後清除訊息
            return; // 如果不符合規則，則不提交表單
        }

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
                    <h2 className="text-4xl font-bold mb-6">註冊</h2> {/* 修改底部間距為 mb-6 */}
                    
                    {/* 使用者名稱 */}
                    <div className="flex flex-col">
                        <input 
                            type="text" 
                            name="username" 
                            placeholder="使用者名稱 (僅限英數且不得超過16字元)"
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
                            placeholder="密碼 (至少8個字元)"
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

                    {/* 憑證數量 */}
                    <div className="flex flex-col"> 
                        <input 
                            type="text" 
                            name="license_amount" 
                            placeholder="憑證數量"
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
                        下一步 →
                    </button>
                    <div className="mt-4 text-sm text-center">
                        已有帳號？<a href="/admin/login" className="text-blue-500 hover:underline">登入</a>
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
