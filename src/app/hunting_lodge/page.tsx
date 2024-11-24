import { Suspense } from 'react';
import DashboardContent from '@/app/hunting_lodge/components/DashboardContent';
import Loading from '@/app/hunting_lodge/components/Loading';

// 改回客戶端渲染，但使用 Suspense 和流式渲染
export default function DashboardPage() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Security Dashboard</h1>
            <Suspense fallback={<Loading />}>
                <DashboardContent />
            </Suspense>
        </div>
    );
}
