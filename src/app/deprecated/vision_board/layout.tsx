'use client'

import { VisionBoardProvider } from "@/features/vision_board/contexts/VisionBoardContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthContext } from "@/features/auth/contexts/AuthContext";

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { isLogin } = useAuthContext();

    useEffect(() => {
        if (isLogin) {
            router.push('/hunting_lodge');
        } else {
            router.push('/admin/login');
        }
    }, [isLogin, router]);

    if (!isLogin) {
        return null;
    }

    return (
        <VisionBoardProvider>
            {children}
        </VisionBoardProvider>
    );
}
