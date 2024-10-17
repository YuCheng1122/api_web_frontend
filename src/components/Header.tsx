'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useAuthContext } from '@/contexts/AuthContext'
import { useEffect } from 'react'

const Header = () => {
  const { isLogin, username, updateLoginState, isadmin } = useAuthContext()

  const logout = () => {
    updateLoginState(false, '', null)
  }

  useEffect(() => {
    // 您可以在這裡添加與 isadmin 相關的副作用
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
                  SenseX
                </Link>
                {isadmin && (
                  <Link href={'/managecenter'} className='text-xl font-bold p-2 hover-underline-animation'>
                    管理中心
                  </Link>
                )}
                <Link href={'/ics'} className='text-xl font-bold p-2 hover-underline-animation'>
                  ICS
                </Link>
              </div>
            )}
          </div>

          {/* 右側：用戶賬戶 */}
          <div className='flex items-center space-x-2'>
            {isLogin && username ? (
              <Link href={'/admin/script'} className='text-xl font-bold p-2 hover-underline-animation'>
                軟體下載
              </Link>
            ) : (
              <Link href={'/admin/signup'} className='text-xl font-bold p-2 hover-underline-animation'>
                註冊
              </Link>
            )}

            <Image
              src={'/user.png'}
              height={30}
              width={30}
              alt='使用者圖片'
              className='p-[1px]'
            />
            {isLogin && username ? (
              <div className='text-xl font-semibold cursor-pointer hover-underline-animation' title='點擊登出' onClick={logout}>
                {username}
              </div>
            ) : (
              <Link href={'/admin/login'} className='text-xl font-semibold text-black hover:text-blue-800'>
                登入
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header