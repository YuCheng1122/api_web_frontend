import { Suspense } from 'react';
import DashboardContent from '@/app/(dashboard)/hunting_lodge/components/DashboardContent';
import Loading from '@/app/(dashboard)/hunting_lodge/components/Loading';

// 改回客戶端渲染，但使用 Suspense 和流式渲染
export default function DashboardPage() {
    return (
        <div className="container mx-auto p-4">
            <Suspense fallback={<Loading />}>
                <DashboardContent />
            </Suspense>
        </div>
    );
}
