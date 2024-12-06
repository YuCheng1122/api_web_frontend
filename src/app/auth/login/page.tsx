'use client'

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { login } from "@/features/auth/api/login";
import { useAuthContext } from "@/core/contexts/AuthContext";
import { encrypt } from "@/features/auth/utils/crypto";

const LoginPage = () => {
    const [isMaintenanceMode, setIsMaintenanceMode] = useState(false)
    const { updateLoginState } = useAuthContext()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isRedirecting, setIsRedirecting] = useState(false)

    const router = useRouter()

    useEffect(() => {
        setIsMaintenanceMode(process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true')
    }, [])

    const handleLogin = async () => {
        if (isMaintenanceMode) {
            toast.warning('System is currently under maintenance. Please try again later. 🛠️')
            return
        }

        if (isLoading || !username || !password) return
        setIsLoading(true)
        try {
            const response = await login(username, password)
            if (response.success) {
                const token = `${response.content.token_type} ${response.content.access_token}`
                updateLoginState(true, username, token)

                // 加密並存儲憑證
                const credentials = JSON.stringify({ username, password });
                const encryptedCredentials = await encrypt(credentials);
                sessionStorage.setItem('auth_credentials', encryptedCredentials);

                // 開始重定向動畫
                setIsRedirecting(true)
                
                // 延遲重定向，等待動畫完成
                setTimeout(() => {
                    router.push('/hunting_lodge')
                }, 1500)
            } else {
                throw new Error(response.message)
            }
        } catch (error) {
            console.error('Login failed:', error);
            toast.error('Login failed 😢')
            // 確保清除任何可能的舊憑證
            sessionStorage.removeItem('auth_credentials');
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <AnimatePresence>
                {isRedirecting ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-500/90 to-purple-600/90 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ 
                                duration: 0.5,
                                ease: "easeOut"
                            }}
                            className="text-center"
                        >
                            <motion.div
                                animate={{ 
                                    rotate: 360,
                                    transition: { duration: 2, repeat: Infinity, ease: "linear" }
                                }}
                                className="w-16 h-16 mb-4 mx-auto"
                            >
                                <img src="/logo.webp" alt="Logo" className="w-full h-full object-contain" />
                            </motion.div>
                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-2xl font-bold text-white mb-2"
                            >
                                登入成功！
                            </motion.h2>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-white/80"
                            >
                                正在前往儀表板...
                            </motion.p>
                        </motion.div>
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden'
                    >
                        {/* 背景動態效果 */}
                        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 animate-pulse"></div>
                        
                        {/* 登入卡片 */}
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="min-w-[350px] min-h-[400px] bg-white/80 backdrop-blur-sm rounded-lg shadow-xl 
                                    flex flex-col items-center p-8 space-y-6
                                    hover:shadow-2xl transition-all duration-300"
                        >
                            {/* Logo */}
                            <motion.div 
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="w-20 h-20 mb-4"
                            >
                                <img src="/logo.webp" alt="Logo" className="w-full h-full object-contain" />
                            </motion.div>

                            {/* Title */}
                            <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="text-3xl text-gray-700 font-bold tracking-wide"
                            >
                                登入系統
                            </motion.div>

                            {/* Input */}
                            <div className="flex-grow flex flex-col items-center justify-center w-full gap-6">
                                <motion.div 
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                    className="w-full transform transition-all duration-300 hover:scale-105"
                                >
                                    <input
                                        type="text"
                                        placeholder="使用者名稱"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 
                                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                               bg-white/50 backdrop-blur-sm transition-all duration-300"
                                        tabIndex={1}
                                    />
                                </motion.div>

                                <motion.div 
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                    className="w-full transform transition-all duration-300 hover:scale-105"
                                >
                                    <input
                                        type="password"
                                        placeholder="密碼"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 
                                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                               bg-white/50 backdrop-blur-sm transition-all duration-300"
                                        tabIndex={2}
                                    />
                                </motion.div>
                            </div>

                            {/* Button */}
                            <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                                className="w-full flex flex-col items-center justify-center gap-4"
                            >
                                <button
                                    className={`w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 
                                            text-center text-white font-bold rounded-lg shadow-lg 
                                            transform transition-all duration-300
                                            hover:from-blue-600 hover:to-blue-700 hover:scale-105
                                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                                            ${isLoading ? 'animate-shimmer bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400 bg-[length:200%_100%]' : ''}`}
                                    onClick={handleLogin}
                                    disabled={isLoading}
                                    type="button"
                                    tabIndex={3}
                                >
                                    {isLoading ? '登入中...' : '登入'}
                                </button>

                                <div className="text-center text-gray-600 text-sm">
                                    如果你沒有帳號, 請 
                                    <Link 
                                        href={'/auth/signup'} 
                                        className="text-blue-500 font-bold hover:text-blue-700 transition-colors duration-300"
                                        tabIndex={4}
                                    >
                                        註冊
                                    </Link>
                                </div>
                            </motion.div>

                            {/* Maintenance Mode */}
                            {isMaintenanceMode && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-yellow-100/80 backdrop-blur-sm border-yellow-400 border-l-4 p-4 mt-4 rounded-r-lg
                                            animate-pulse"
                                >
                                    <p className="font-bold text-yellow-700">系統維護 🛠️</p>
                                    <p className="text-yellow-700">
                                        系統目前正在維護中。請稍後再試。
                                    </p>
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <ToastContainer />

            {/* 添加新的樣式 */}
            <style jsx global>{`
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite linear;
                }
                .bg-grid-pattern {
                    background-image: linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                                    linear-gradient(to bottom, #e5e7eb 1px, transparent 1px);
                    background-size: 20px 20px;
                }
            `}</style>
        </>
    )
}

export default LoginPage;
