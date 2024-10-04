'use client'
import Card from '@/components/managecenter/Card'

export default function  managecenterPage() {
  return (
    <div>
      <h1>Manage Center</h1>
        <div className='w-screen flex items-center justify-center'>
        <div className=' flex flex-row flex-wrap space-x-4 space-y-4 w-4/5 '>
            <p></p>
            <Card />
            <Card/>
            <Card />
            <Card />
            
        </div>
        </div>
    </div>
  )
}