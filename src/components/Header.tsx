'use client'

// third-party
import Image from 'next/image'
import Link from 'next/link'

// context
import { useAuthContext } from '@/contexts/AuthContext'


const Header = () => {

  const {isLogin, username, updateLoginState} = useAuthContext()
   

  const logout = () => {
    updateLoginState(false, '', null)
  }

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
                    Graph
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
