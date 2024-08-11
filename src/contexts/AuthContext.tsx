'use client' 

import React, { createContext, useContext, useState, useEffect } from "react"
import Cookies from "js-cookie"


interface AuthContextType {
  isLogin: boolean
  username: string
  updateLoginState: (isLogin: boolean, username: string, token: string | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [isLogin, setIsLogin] = useState(false)
  const [username, setUsername] = useState('')


  // 用於持續登陸
  useEffect(() => {
    const username = Cookies.get('username')
    const token = Cookies.get('token')
    if(username && token){
      setIsLogin(true)
      setUsername(username)
    }
  }, [])


  const updateLoginState = (isLogin: boolean, username: string, token: string | null) => {
    setIsLogin(isLogin)
    setUsername(username)
    if (isLogin && token) {
      Cookies.set('token', token)
      Cookies.set('username', username)
    }else{
      Cookies.remove('token')
      Cookies.remove('username')
    }
    
  }

  return (
    <AuthContext.Provider value={{isLogin, username, updateLoginState}}>
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
