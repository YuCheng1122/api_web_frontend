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
      <div className="h-[72px] bg-blue-500 text-white px-10 w-full rounded-lg shadow-lg sticky top-0 z-10">
        <div className='h-full grid grid-cols-3 items-center'>
          {/* path */}
          {
            isLogin && username ?
              <div className='w-fit'>            
                <div>
                  <Link href={'/graph'} className='text-xl font-bold p-2 hover:text-2xl'>
                    Graph
                  </Link>
                  <Link href={'/dashboard'} className='text-xl font-bold p-2 hover:text-2xl'>
                    Dashboard
                  </Link>
                </div>
              </div>
            :
              <div></div>
          }


          {/* title */}
          <div className="text-3xl font-bold text-center">
            <Link href={'/'} className='hover:text-4xl'>
              AIXSOAR
            </Link>
          </div>

          {/* account */}
          <div className='flex flex-col items-center justify-self-end p-2'>
            <Image 
              src={'/user.png'}
              height={30}
              width={30}
              alt='user picture'
              className='p-[1px]'
            />
            {
              isLogin && username ?
                <div className='text-xl font-semibold cursor-pointer' title='Clicked for logout' onClick={logout}>
                  {username}
                </div>
              :
                <Link href={'/admin/login'} className='text-xl font-semibold'>
                  Login
                </Link>
            }
          </div>
        </div>       
      </div>
    )
}

export default Header;
