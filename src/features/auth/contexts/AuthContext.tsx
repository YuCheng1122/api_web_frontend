'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { fetchUser } from '@/features/manage_center/managecenter/fetchUser'

interface AuthContextType {
    isLogin: boolean
    username: string
    updateLoginState: (isLogin: boolean, username: string, token: string | null) => void
    isadmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLogin, setIsLogin] = useState(false)
    const [username, setUsername] = useState('')
    const [isadmin, setIsadmin] = useState(false)
    const [isInitialized, setIsInitialized] = useState(false)
    const router = useRouter()

    // 檢查管理員權限
    const checkAdminStatus = useCallback(async () => {
        if (!isLogin || !username) return;

        try {
            const response = await fetchUser();
            setIsadmin(response.success);
        } catch (error) {
            console.error('Failed to fetch user:', error);
            setIsadmin(false);
        }
    }, [isLogin, username]);

    // 初始化登入狀態
    useEffect(() => {
        if (isInitialized) return;

        const savedUsername = Cookies.get('username')
        const token = Cookies.get('token')

        if (savedUsername && token) {
            setIsLogin(true)
            setUsername(savedUsername)
        }

        setIsInitialized(true)
    }, [isInitialized])

    // 只在初始化完成後檢查管理員狀態
    useEffect(() => {
        if (isInitialized) {
            checkAdminStatus();
        }
    }, [isInitialized, checkAdminStatus]);

    const updateLoginState = useCallback((newIsLogin: boolean, newUsername: string, token: string | null) => {
        setIsLogin(newIsLogin)
        setUsername(newUsername)

        if (newIsLogin && token) {
            Cookies.set('token', token)
            Cookies.set('username', newUsername)
        } else {
            Cookies.remove('token')
            Cookies.remove('username')
            setIsadmin(false)
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isLogin, username, updateLoginState, isadmin }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within a AuthProvider");
    }
    return context;
}
