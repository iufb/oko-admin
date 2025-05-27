import { rCheckToken, rLogin } from '@/api/auth';
import { useToast } from '@/hooks/use-toast';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { AuthContextType, User } from '../types';

// Default admin credentials - in a real app, these would be in a secure database
const DEFAULT_ADMIN: User = {
    username: 'admin',
    password: 'admin123'
};

const defaultAuthContext: AuthContextType = {
    user: null,
    isAuthenticated: false,
    login: async () => false,
    logout: () => { }
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        rCheckToken()
            .then(() => {
                console.log('success check');
                setIsAuthenticated(true);
            })
            .catch((e) => {
                console.log('error check', e);
                setIsAuthenticated(false);
            });
    }, []);

    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            const res = await rLogin({ phone_number: username, password })
            if (res) {
                localStorage.setItem('access', res.access)
                localStorage.setItem('refresh', res.refresh)
                toast({
                    title: "Login successful",
                    description: "Welcome to the admin dashboard",
                    variant: "default",
                });
                setIsAuthenticated(true)
                return true

            } else {
                throw new Error("No tokens")
            }
        }
        catch (e) {
            console.error(e)
            toast({
                title: "Login failed",
                description: "Invalid username or password",
                variant: "destructive",
            });
            return false


        }

    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');

        toast({
            title: "Logout successful",
            description: "You have been logged out",
            variant: "default",
        });
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
