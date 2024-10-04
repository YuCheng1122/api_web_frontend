import Image from 'next/image'
export default function Card() {
  return (
    <div className="flex flex-col items-center justify-center max-w-96 max-h-60 h-full w-full p-3 space-y-4 bg-white rounded-lg shadow-lg">
        <div className=' w-full bg-slate-200 p-4 rounded-lg'>
            <div className="flex flex-row items-center space-x-4 w-full">
            <Image src="/user.png" width={50} height={50} alt="user" />
            <div>
                <h1>Card Title</h1>
                <p>Card Description</p>
            </div>
        </div>
        <hr className="border-gray-900 mt-3" />

        <div className="text-left flex flex-col pl-20">
            <p>company:{123}</p>
            <p>email:</p>
            <p>license_amount:s</p>
        </div>
        </div>
        <div className="flex justify-end pr-12 w-full my-8">
        <label htmlFor="toggle" className="flex items-center cursor-pointer border-gray-600 ">
            <input type="checkbox" id="toggle" className="sr-only peer " />
            <div className=" block border-gray-600 relative w-20 h-9 p-1 before:absolute before:bg-gray-100 before:w-12 before:h-7 before:p-1 before:rounded-md before:transition-all before:duration-500 before:left-1 peer-checked:before:left-16 peer-checked:before:bg-gray-600">
                <span className="absolute left-16 top-1/2 transform -translate-y-1/2 text-xs text-gray-300 pl-1 ">Unable</span>
                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-700 ">Disable</span>
            </div>
        </label>
      
        </div>
    </div>
  )
}