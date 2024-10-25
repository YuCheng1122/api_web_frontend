'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardProvider } from "@/contexts/DashBoardContext";
import { useAuthContext } from "@/contexts/AuthContext";

const DashboardLayout: React.FC<{children: React.ReactNode}> = ({children}) => {
  const router = useRouter();
  const { isLogin } = useAuthContext();
  console.log(isLogin)

  if (!isLogin) {
    return <div>請重新登入</div>; // 可以保持這行，避免在重定向前渲染組件
  } 

  return (
    <DashboardProvider>
      {children}
    </DashboardProvider>
  )
}

export default DashboardLayout;
