import { Suspense } from 'react';
import DashboardContent from './components/DashboardContent';
import Loading from './components/Loading';

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