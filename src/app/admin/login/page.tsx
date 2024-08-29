'use client'

// third-party
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";

// utils
import { login } from "@/utils/admin/login";

// context
import { useAuthContext } from "@/contexts/AuthContext";


const LoginPage = () => {
  const {updateLoginState} = useAuthContext()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const handleLogin = async () => {
    if(isLoading || !username || !password) return
    setIsLoading(true)
    try{
      const response = await login(username, password)
      console.log(response);
      if(response.success){
        
        // 登入成功後儲存 token 並更新登入狀態        
        toast.success(`${response.message} 😊 \n Redirecting to home page...`)
        const token = `${response.content.token_type} ${response.content.access_token}`
        updateLoginState(true, username, token)
        
        setTimeout(() => {
          router.push('/')
        }, 3000)

      }else{
        throw new Error(response.message)
      }
    }catch(error){
      console.log(error);
      toast.error('Login failed 😢')
    }finally{
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className='flex flex-col items-center justify-center h-full'>
        <div className="min-w-[350px] min-h-[400px] bg-white rounded-lg shadow-lg flex flex-col items-center p-4">
          
          {/* Title */}
          <div className="text-3xl text-gray-700 font-bold">
            {"Login 🏳️‍🌈"}
          </div>

          {/* Input */}
          <div className="flex-grow flex flex-col items-center justify-center w-full gap-10">

            <div className="w-full">
              <input 
                type="text" 
                placeholder="Username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-gray-500" 
              />
            </div>

            <div className="w-full">
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-gray-500" 
              />
            </div> 
          </div>

          {/* Button */}
          <div className="w-full flex flex-col items-center justify-center gap-2">
            <div className={`w-full px-3 py-2 bg-blue-500 text-center text-white font-bold rounded-lg shadow-lg cursor-pointer ${isLoading ? 'animate-pulse' : ''} hover:bg-blue-600`} onClick={handleLogin}>
              Login
            </div>
            <div className="text-center text-gray-500 text-sm">
              If you don&apos;t have an account, please <Link href={'/admin/register'} className="text-blue-500 font-bold hover:text-blue-600">Register</Link>
            </div>
          </div>
          

        </div>
      </div>
      <ToastContainer />
    </>
  )
}

export default LoginPage;
