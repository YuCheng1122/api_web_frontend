import Image from 'next/image'
//  props.user type is User
import {updateLicense }from '@/utils/managecenter/updateLicense'
import { ToastContainer, toast } from "react-toastify";
import { updateApprove } from '@/utils/managecenter/updateApprove'
type User = {
  user: {
    username: string
    email: string
    company_name: string
    license_amount: string
    disabled: boolean
    user_id: number
  }
}
export default function Card(props: User) {
  console.log(props.user);
  
  const LicenseOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {    
    try {
      updateLicense(props.user.user_id, e.target.value)
      toast.success("License data updated successfully");
    }
    catch (error) {
      console.error('Error fetching license data:', error);
      toast.error("Error update license data");
    }
  }
    
  const ApproveOnchange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      console.log(props.user.user_id);
      
      updateApprove(props.user.user_id)
      toast.success("Approve data updated successfully");
    }
    catch (error) {
      console.error('Error fetching approve data:', error);
      toast.error("Error update approve data");
    }
  }
  return (
    <div className="flex flex-col items-center justify-center max-w-96 max-h-72 h-full w-full p-3 space-y-4 bg-white rounded-lg shadow-lg">
        <div className=' w-full bg-slate-200 p-4 rounded-lg'>
            <div className="flex flex-row items-center space-x-4 w-full">
            <Image src="/user.png" width={50} height={50} alt="user" />
            <div>
                <p className=' text-xl'>{props.user.username}</p>
                <p className=' text-gray-500'>common user</p>
            </div>
        </div>
        <hr className="border-gray-900 mt-3" />
        <div className="text-left flex flex-col pl-20 mt-2">
            <p className=' text-lg'> Company: <span className=' text-base'>{props.user.company_name}</span></p>
            <p className=' text-lg'> Email: <span className=' text-base'>{props.user.email}</span></p>
            <p className=' text-lg'> License Amount: <input type="number" className="w-20 h-6 border-gray-600 rounded-md" defaultValue={props.user.license_amount} onChange={LicenseOnchange} /></p>
        </div>
        </div>
        <div className="flex justify-end pr-12 w-full my-8">
        <label htmlFor={props.user.email} className="flex items-center cursor-pointer border-gray-600 " >
            <input type="checkbox" id={props.user.email} className="sr-only peer " onChange={ApproveOnchange}  defaultChecked={props.user.disabled?false:true} />
            <div className=" block border-gray-600 relative w-20 h-9 p-1 before:absolute before:bg-gray-100 before:w-14 before:h-7 before:p-1 before:rounded-md before:transition-all before:duration-500 before:left-1 peer-checked:before:left-16 peer-checked:before:bg-gray-600">
                <span className="absolute left-16 top-1/2 transform -translate-y-1/2 text-xs text-gray-300 pl-1 ">Approve</span>
                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-700 ">Disable</span>
            </div>
        </label>  
        </div>
        <ToastContainer />
    </div>
  )
}