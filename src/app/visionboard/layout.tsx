'use client'

import { VisionBoardProvider } from "@/components/VisionBoardContext";
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/components/AuthContext"
import { useEffect } from "react"

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { isLogin } = useAuthContext()
    useEffect(() => {

        if (isLogin) {
            router.push('/visionboard');
        }
        else {
            router.push('/admin/login');
        }
    }
        , [isLogin, router]);


    if (!isLogin) {
        return null;
    }
    return (
        <VisionBoardProvider>
            {children}
        </VisionBoardProvider>
    )
}