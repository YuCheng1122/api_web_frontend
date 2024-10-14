'use client'

// third-party
import Image from 'next/image'
import Link from 'next/link'

// context
import { useAuthContext } from '@/contexts/AuthContext'
import { use, useEffect } from 'react'




const Header = () => {

  const { isLogin, username, updateLoginState, isadmin } = useAuthContext()

  const logout = () => {
    updateLoginState(false, '', null)
  }
  useEffect(() => {
    isadmin
  }, [isadmin])
  return (

      <header className="bg-white w-full">
        <div className="mx-auto px-4 py-4">
          <div className='flex items-center justify-between'>
            {/* 左側：標題和導航按鈕 */}
            <div className='flex items-center space-x-4'>
              {/* 標題 */}
              <div className="text-3xl font-bold text-black">
                <Link href={'/'} className='hover-underline-animation'>
                  AIXSOAR
                </Link>
              </div>
              
              {/* 導航按鈕 */}
              {isLogin && username && (
                <div className='flex space-x-2'>
                  <Link href={'/graph'} className='text-xl font-bold p-2 hover-underline-animation'>
                    威脅獵捕圖
                  </Link>
                  <Link href={'/dashboard'} className='text-xl font-bold p-2 hover-underline-animation'>
                    儀表板
                  </Link>
                  <Link href={'/agent'} className='text-xl font-bold p-2 hover-underline-animation'>
                    代理資訊  
                  </Link>
                  <Link href={'/chatbot'} className='text-xl font-bold p-2 hover-underline-animation'>
                    聊天機器人
                  </Link>
                  <Link href={'/managecenter'} className='text-xl font-bold p-2 hover-underline-animation'>
                    管理中心
                  </Link>
                </div>
              )}
            </div>

            {/* 右側：用戶賬戶 */}
            <div className='flex items-center space-x-2'>
              {/* 左側：註冊連結 */}
              {isLogin && username ? (
                <Link href={'/admin/script'} className='text-xl font-bold p-2 hover-underline-animation'>
                  軟體下載
                </Link>
              ) : (
                <Link href={'/admin/signup'} className='text-xl font-bold p-2 hover-underline-animation'>
                  註冊
                </Link>
              )}



              {/* 右側：用戶賬戶 */}
              <Image 
                src={'/user.png'}
                height={30}
                width={30}
                alt='user picture'
                className='p-[1px]'
              />
              {isLogin && username ? (
                <div className='text-xl font-semibold cursor-pointer hover-underline-animation' title='Clicked for logout' onClick={logout}>
                  {username}
                </div>
              ) : (
                <Link href={'/admin/login'} className='text-xl font-semibold text-black hover:text-blue-800'>
                  登入

                </Link>
                <Link href={'/dashboard'} className='text-xl font-bold p-2 hover-underline-animation'>
                  Dashboard
                </Link>
                <Link href={'/agent'} className='text-xl font-bold p-2 hover-underline-animation'>
                  Agent Info
                </Link>
                <Link href={'/llm'} className='text-xl font-bold p-2 hover-underline-animation'>
                  LLM Page
                </Link>
                {
                  isadmin && (
                    <Link href={'/managecenter'} className='text-xl font-bold p-2 hover-underline-animation'>
                      Manage Center
                    </Link>
                  )
                }
              </div>
            )}
          </div>

          {/* 右側：用戶賬戶 */}
          <div className='flex items-center space-x-2'>
            <Image
              src={'/user.png'}
              height={30}
              width={30}
              alt='user picture'
              className='p-[1px]'
            />
            {isLogin && username ? (
              <div className='text-xl font-semibold cursor-pointer hover-underline-animation' title='Clicked for logout' onClick={logout}>
                {username}
              </div>
            ) : (
              <Link href={'/admin/login'} className='text-xl font-semibold text-black hover:text-blue-800'>
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header;
