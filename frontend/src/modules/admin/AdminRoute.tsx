import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!user?.roles?.includes('ROLE_ADMIN')) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
