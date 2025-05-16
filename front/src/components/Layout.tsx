import { cn } from '@/lib/utils';
import { ChevronDown, LayoutDashboard, LogOut, Menu, Newspaper, PlusCircle, X } from 'lucide-react';
import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { AuthContext } from '../context/AuthContext';
import { Button } from './ui/button';

interface LayoutProps {
    children: React.ReactNode;
    title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [location, navigate] = useLocation();
    const { user, logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Mobile backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-800/50 z-40 md:hidden"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar for desktop */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <div className="flex items-center justify-center h-16 border-b border-slate-200">
                    <h1 className="text-xl font-bold text-indigo-600 flex items-center">
                        <Newspaper className="mr-2 h-6 w-6" />
                        News Admin
                    </h1>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                    <Link
                        href="/dashboard"
                        onClick={closeSidebar}
                        className={cn(
                            "group flex items-center px-2 py-2 text-base font-medium rounded-md transition-all",
                            location === '/dashboard'
                                ? "bg-indigo-50 text-indigo-600"
                                : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
                        )}
                    >
                        <LayoutDashboard className="mr-3 h-5 w-5" />
                        Dashboard
                    </Link>
                    <Link
                        href="/news/create"
                        onClick={closeSidebar}
                        className={cn(
                            "group flex items-center px-2 py-2 text-base font-medium rounded-md transition-all",
                            location === '/news/create'
                                ? "bg-indigo-50 text-indigo-600"
                                : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
                        )}
                    >
                        <PlusCircle className="mr-3 h-5 w-5" />
                        Add News
                    </Link>
                </nav>
            </div>

            {/* Main content */}
            <div className="md:pl-64 flex flex-col flex-1">
                {/* Top navigation */}
                <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow-sm">
                    <button
                        type="button"
                        className="px-4 border-r border-slate-200 text-slate-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
                        onClick={toggleSidebar}
                    >
                        {sidebarOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </button>
                    <div className="flex-1 px-4 flex justify-between">
                        <div className="flex-1 flex items-center">
                            <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
                        </div>
                        <div className="ml-4 flex items-center md:ml-6">
                            <div className="ml-3 relative">
                                <div>
                                    <Button
                                        variant="ghost"
                                        className="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    >
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                                                {user?.username.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="ml-2 text-slate-700 font-medium">{user?.username}</span>
                                            <ChevronDown className="ml-1 h-4 w-4 text-slate-500" />
                                        </div>
                                    </Button>
                                </div>
                                {userMenuOpen && (
                                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none animate-scale-in">
                                        <Button
                                            variant="ghost"
                                            onClick={handleLogout}
                                            className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                                        >
                                            <LogOut className="mr-3 h-4 w-4" />
                                            Sign out
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="flex-1">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                            <div className="animate-slide-in">{children}</div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
