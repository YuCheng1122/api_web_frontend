'use client'

import Image from 'next/image'
import Link from 'next/link'

const Header = () => {
   
  return (
      <div className="h-[72px] bg-blue-500 text-white px-10 w-full rounded-lg shadow-lg sticky top-0 z-10">
        <div className='h-full grid grid-cols-3 items-center'>
          {/* path */}
          <div className='w-fit'>
            <div className=''>
            <Link href={'/graph'} className='text-xl font-bold p-2 hover:text-2xl'>
              Graph
            </Link>
            <Link href={'/dashboard'} className='text-xl font-bold p-2 hover:text-2xl'>
              Dashboard
            </Link>
            </div>
            
          </div>

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
            {/* <Link href={'/user/login'} className='text-xl font-semibold'>
              Login
            </Link> */}
            <div className='text-xl font-semibold' >
              Login
            </div>
          </div>

        </div>       
      </div>
    )
}

export default Header;
