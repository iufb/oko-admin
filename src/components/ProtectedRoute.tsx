import { toast } from '@/hooks/use-toast';
import React, { useContext, useEffect } from 'react';
import { useLocation } from 'wouter';
import { AuthContext } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);
    const [location, navigate] = useLocation();

    useEffect(() => {
        if (!isAuthenticated) {
            toast({
                title: "Authentication required",
                description: "Please log in to access this page",
                variant: "destructive",
            });
            navigate('/login');
        }
    }, [isAuthenticated, navigate, location]);

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
