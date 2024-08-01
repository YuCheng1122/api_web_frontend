'use client'

import { useState } from "react";


const NetworkConnection = () => {
  // 呼叫 API
  const [connectionCount, setConnectionCount] = useState<string>("20,991");
  
  return (
    <>
      <div className="font-bold text-sm">total event (level 8~14)</div>
      <div className="flex-grow flex flex-col items-center justify-center text-gray-700">
        <div className="font-bold text-[65px]">{connectionCount}</div>
        <div className="text-[24px]">Count of records</div>
      </div>
    </>
  )
}

export default NetworkConnection;
