import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Briefcase, Users, Shield, AlertCircle,
    LogOut, Menu, X, Clock
} from 'lucide-react';
import { supabase } from '../../supabaseClient';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const navItems = [
        { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
        { to: '/admin/jobs', icon: Briefcase, label: 'Görev Yönetimi' },
        { to: '/admin/users', icon: Users, label: 'Kullanıcı Yönetimi' },
        { to: '/admin/disputes', icon: AlertCircle, label: 'Şikayet Yönetimi' },
        { to: '/admin/security', icon: Shield, label: 'Güvenlik & Loglar' },
    ];

    const formatTurkeyTime = (date: Date) => {
        return new Intl.DateTimeFormat('tr-TR', {
            timeZone: 'Europe/Istanbul',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        }).format(date);
    };

    const formatTurkeyDate = (date: Date) => {
        return new Intl.DateTimeFormat('tr-TR', {
            timeZone: 'Europe/Istanbul',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:relative lg:translate-x-0`}
            >
                <div className="h-full flex flex-col">
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                        <div>
                            <h1 className="text-xl font-bold text-white">Admin Paneli</h1>
                            <div className="flex items-center text-slate-400 text-xs mt-2" title="Sunucu Saati (Türkiye)">
                                <Clock className="w-3 h-3 mr-1" />
                                <span>{formatTurkeyDate(currentTime)} {formatTurkeyTime(currentTime)}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="lg:hidden text-slate-400 hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <nav className="flex-1 p-4 space-y-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                className={({ isActive }) =>
                                    `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`
                                }
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-slate-800">
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
                        >
                            <LogOut className="w-5 h-5 mr-3" />
                            Çıkış Yap
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <header className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <span className="ml-4 font-semibold text-gray-900">Admin Paneli</span>
                    </div>
                    <div className="flex items-center text-gray-500 text-xs text-right">
                        <Clock className="w-3 h-3 mr-1" />
                        <div className="flex flex-col">
                            <span>{formatTurkeyTime(currentTime)}</span>
                            <span className="text-[10px]">{formatTurkeyDate(currentTime)}</span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
