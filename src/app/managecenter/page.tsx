'use client'
import Card from '@/components/managecenter/Card'
import { useEffect, useState } from 'react'
import { fetchUser } from '@/utils/managecenter/fetchUser'
import Loading from '@/components/Loading'
type UserDataType = {
    username: string
    email: string
    license_amount: string
    company_name: string
    disabled: boolean
    user_id: number
    }
export default function ManagecenterPage() {
    // fetch user data
    const [usersData, setUsersData] = useState<UserDataType[]>([]);
    // refetch user data

    useEffect(() => {
        fetchUser().then((response) => {
            if (response.success) {
                setUsersData(response.content as unknown as UserDataType[]);
            }
        });
    }, []);
  return (
    <div>
     
        <div className='w-screen flex items-center justify-center'>
        <div className=' flex flex-row flex-wrap space-x-4 space-y-4 w-4/5 '>
            <p></p>
            {
                Array.isArray(usersData) && usersData.length > 0 ? (
                    usersData.map((user,id) => (
                        <Card key={id} user={user} />
                    ))
                ) : (
                    <div className='flex items-center justify-center w-full h-96'>
                    <Loading />
                    </div>
                )
            }
        </div>
        </div>
    </div>
  )
}