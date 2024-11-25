'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { signup } from '@/features/auth/api/signup';
import type { SignupFormData } from '@/features/auth/types';

const SignUpForm = ({ className }: { className?: string }) => {
    const router = useRouter();
    const [formData, setFormData] = useState<SignupFormData>({
        username: '',
        password: '',
        email: '',
        company_name: '',
        license_amount: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading) return;

        setIsLoading(true);
        try {
            const response = await signup(formData);
            if (response.success) {
                toast.success('註冊成功！ 😊');
                setTimeout(() => {
                    router.push('/auth/login');
                }, 2000);
            } else {
                throw new Error(response.message);
            }
        } catch (error: any) {
            console.error('Signup error:', error);
            toast.error(error.message || '註冊失敗 😢');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className={`w-full max-w-md p-6 bg-white rounded-lg shadow-lg ${className}`}>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">註冊帳號 🎉</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">使用者名稱</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">密碼</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">電子郵件</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">公司名稱</label>
                    <input
                        type="text"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">授權數量</label>
                    <input
                        type="number"
                        name="license_amount"
                        value={formData.license_amount}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    disabled={isLoading}
                >
                    {isLoading ? '處理中...' : '註冊'}
                </button>

                <div className="text-center text-gray-500 text-sm">
                    已有帳號？<a href="/auth/login" className="text-blue-500 hover:underline">登入</a>
                </div>
            </form>
        </div>
    );
};

export default SignUpForm;
