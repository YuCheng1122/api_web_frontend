'use client'

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import { login } from "@/features/auth/api/login";
import { useAuthContext } from "@/features/auth/contexts/AuthContext";

const LoginPage = () => {
    const [isMaintenanceMode, setIsMaintenanceMode] = useState(false)
    const { updateLoginState } = useAuthContext()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)

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
                toast.success(`${response.message} 😊 \n Redirecting to Dashboard...`)
                const token = `${response.content.token_type} ${response.content.access_token}`
                updateLoginState(true, username, token)

                setTimeout(() => {
                    router.push('/hunting_lodge')
                }, 3000)
            } else {
                throw new Error(response.message)
            }
        } catch (error) {
            console.log(error);
            toast.error('Login failed 😢')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <div className='flex flex-col items-center justify-center h-[90vh]'>
                <div className="min-w-[350px] min-h-[400px] bg-white rounded-lg shadow-lg flex flex-col items-center p-4">
                    {/* Title */}
                    <div className="text-3xl text-gray-700 font-bold">
                        {"登入 🏳️‍🌈"}
                    </div>

                    {/* Input */}
                    <div className="flex-grow flex flex-col items-center justify-center w-full gap-10">
                        <div className="w-full">
                            <input
                                type="text"
                                placeholder="使用者名稱"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-gray-500"
                                tabIndex={1}
                            />
                        </div>

                        <div className="w-full">
                            <input
                                type="password"
                                placeholder="密碼"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-gray-500"
                                tabIndex={2}
                            />
                        </div>
                    </div>

                    {/* Button */}
                    <div className="w-full flex flex-col items-center justify-center gap-2">
                        <button
                            className={`w-full px-3 py-2 bg-blue-500 text-center text-white font-bold rounded-lg shadow-lg cursor-pointer ${isLoading ? 'animate-pulse' : ''} hover:bg-blue-600`}
                            onClick={handleLogin}
                            type="button"
                            tabIndex={3}
                        >
                            登入
                        </button>

                        <div className="text-center text-gray-500 text-sm">
                            如果你沒有帳號, 請 <Link href={'/auth/signup'} className="text-blue-500 font-bold hover:text-blue-600" tabIndex={4}>註冊</Link>
                        </div>
                    </div>

                    {/* Maintenance Mode */}
                    {isMaintenanceMode && (
                        <div className="bg-yellow-100 border-yellow-400 border-l-4 p-4 mt-4">
                            <p className="font-bold text-yellow-700">系統維護 🛠️</p>
                            <p className="text-yellow-700">
                                系統目前正在維護中。請稍後再試。
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <ToastContainer />
        </>
    )
}

export default LoginPage;
