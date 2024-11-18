'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useAuthContext } from '@/contexts/AuthContext'
import { useState, useEffect } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation'


const Header = () => {
  const { isLogin, username, updateLoginState, isadmin } = useAuthContext()



  const router = useRouter()
  const logout = () => {
    updateLoginState(false, '', null)
    router.push('/')

  }

  useEffect(() => {
    // 您可以在這裡添加與 isadmin 相關的副作用
  }, [isadmin])

  return (
    <header className="bg-white w-full sticky top-0 z-50 ">
      <div className="p-4  ">
        < div className='flex items-center justify-between ' >
          {/* 左側：標題和導航按鈕 */}
          < div className='flex items-center space-x-4' >
            {/* 標題 */}
            < div className="text-3xl font-bold text-black" >
              <Link href={'/'} className='hover-underline-animation'>
                AVOCADO
              </Link>
            </div >

            {/* 導航按鈕 */}
            {
              isLogin && username && (
                <div className='  hidden md:block'>
                  <div className='flex items-center space-x-4'>
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

                      SenseX 聊天機器人
                    </Link>

                    <Link href={'/visionboard'} className='text-xl font-bold p-2 hover-underline-animation'>
                      視覺化儀表板
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
                </div>
              )
            }
          </div >
          <div className='visible md:invisible ' >
            <DropdownMenu >
              <DropdownMenuTrigger>
                {/* menu icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>選單</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href={'/'} className='text-lg font-bold mx-4 hover:text-[#97932D] text-[#423838]'>首頁</Link>
                </DropdownMenuItem>
                {isLogin && username && (<div>


                  <DropdownMenuItem>
                    <Link href={'/graph'} className='text-lg font-bold mx-4 hover:text-[#97932D] text-[#423838]'>威脅獵捕圖</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href={'/dashboard'} className='text-lg font-bold mx-4 hover:text-[#97932D] text-[#423838]'>儀表板</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href={'/agent'} className='text-lg font-bold mx-4 hover:text-[#97932D] text-[#423838]'>代理資訊</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href={'/chatbot'} className='text-lg font-bold mx-4 hover:text-[#97932D] text-[#423838]'>聊天機器人</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href={'/ics'} className='text-lg font-bold mx-4 hover:text-[#97932D] text-[#423838]'>ICS</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href={'/visionboard'} className='text-lg font-bold mx-4 hover:text-[#97932D] text-[#423838]'>視覺化儀表板</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href={'/admin/script'} className='text-lg font-bold mx-4 hover:text-[#97932D] text-[#423838]'>軟體下載</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <div className='text-lg font-bold mx-4 hover:text-[#97932D] text-[#423838]' onClick={logout}>登出</div>
                  </DropdownMenuItem>
                </div>)}
                <DropdownMenuItem>
                  <Link href={'/admin/signup'} className='text-lg font-bold mx-4 hover:text-[#97932D] text-[#423838]'>註冊</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={'/admin/login'} className='text-lg font-bold mx-4 hover:text-[#97932D] text-[#423838]'>登入</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* 右側：用戶賬戶 */}
          <div className='  hidden md:block '>
            <div className='flex items-center space-x-4'>

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
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <div className='flex items-center space-x-2'>
                      <div className='text-xl font-semibold cursor-pointer hover-underline-animation ' title='點擊登出' >
                        {username}
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>帳戶選單</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <div className='text-lg font-bold mx-4 hover:text-[#97932D] text-[#423838]' onClick={logout}>登出</div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

              ) : (
                <Link href={'/admin/login'} className='text-xl font-semibold text-black hover:text-blue-800 '>
                  登入
                </Link>
              )}
            </div>


          </div>
        </div >
      </div >
    </header >
  )
}

export default Header