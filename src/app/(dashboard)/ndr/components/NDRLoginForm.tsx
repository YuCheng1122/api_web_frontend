'use client'

import React, { useState } from 'react';
import { useNDR } from '../../../../features/ndr/hooks/useNDR';

const NDRLoginForm = () => {
    const { login, isLoading, error } = useNDR();
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await login(credentials);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">NDR 登入</h2>
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded animate-shake">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                            使用者名稱
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={credentials.username}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="請輸入使用者名稱"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            密碼
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="請輸入密碼"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 px-4 rounded-md font-semibold text-white transition-all
                            ${isLoading
                                ? 'bg-blue-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'}`}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                                登入中...
                            </div>
                        ) : (
                            '登入 NDR'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NDRLoginForm;
