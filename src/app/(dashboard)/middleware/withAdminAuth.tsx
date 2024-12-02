'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/features/auth/contexts/AuthContext';

export function withAdminAuth(WrappedComponent: React.ComponentType<any>) {
    return function AdminProtectedRoute(props: any) {
        const { isadmin } = useAuthContext();
        const router = useRouter();

        useEffect(() => {
            if (!isadmin) {
                alert('This page is only available for administrators');
                router.push('/hunting_lodge/events');
            }
        }, [isadmin, router]);

        if (!isadmin) {
            return null;
        }

        return <WrappedComponent {...props} />;
    };
}
