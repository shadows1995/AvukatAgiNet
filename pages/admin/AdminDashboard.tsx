import React, { useEffect, useState } from 'react';
import {
    Briefcase, CheckCircle, Users, TrendingUp,
    Activity, AlertCircle, Bot, Power
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';

interface DashboardStats {
    today: {
        jobsCreated: number;
        jobsCompleted: number;
        newUsers: number;
        activeUsers: number;
    };
    totals: {
        totalUsers: number;
        totalJobs: number;
        activeJobs: number;
        premiumUsers: number;
        openDisputes: number;
    };
}

const AdminDashboard = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [botEnabled, setBotEnabled] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [togglingBot, setTogglingBot] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, botData] = await Promise.all([
                    adminApi.getDashboardStats(),
                    adminApi.getBotStatus()
                ]);
                setStats(statsData);
                setBotEnabled(botData.enabled);
            } catch (err) {
                console.error(err);
                setError('Veriler yüklenirken hata oluştu.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleToggleBot = async () => {
        if (botEnabled === null) return;
        setTogglingBot(true);
        try {
            const newState = !botEnabled;
            await adminApi.updateBotStatus(newState);
            setBotEnabled(newState);
        } catch (err) {
            console.error("Error toggling bot:", err);
            alert("Bot durumu değiştirilemedi.");
        } finally {
            setTogglingBot(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Yükleniyor...</div>;
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500">Sistemin genel durumuna hızlı bakış</p>
                </div>

                {/* Bot Control Panel */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${botEnabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                        <Bot className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Otomatik Görev Botu</h3>
                        <p className="text-xs text-gray-500">
                            {botEnabled ? 'Aktif - Görev oluşturuyor' : 'Pasif - Devre dışı'}
                        </p>
                    </div>
                    <button
                        onClick={handleToggleBot}
                        disabled={togglingBot}
                        className={`ml-4 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${botEnabled ? 'bg-green-500' : 'bg-gray-200'}`}
                    >
                        <span className="sr-only">Botu Aç/Kapat</span>
                        <span
                            aria-hidden="true"
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${botEnabled ? 'translate-x-5' : 'translate-x-0'}`}
                        />
                    </button>
                </div>
            </div>

            {/* Today's Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Bugün Açılan Görev</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-2">{stats.today.jobsCreated}</h3>
                        </div>
                        <div className="p-3 bg-indigo-50 rounded-lg">
                            <Briefcase className="w-6 h-6 text-indigo-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Bugün Tamamlanan</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-2">{stats.today.jobsCompleted}</h3>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Aktif Kullanıcılar</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-2">{stats.today.activeUsers}</h3>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Yeni Üyeler</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-2">{stats.today.newUsers}</h3>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Total Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-gray-500" />
                    Genel İstatistikler
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                        <p className="text-sm text-gray-500 mb-1">Toplam Kullanıcı</p>
                        <p className="text-xl font-bold text-gray-900">{stats.totals.totalUsers}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                        <p className="text-sm text-gray-500 mb-1">Premium Üye</p>
                        <p className="text-xl font-bold text-amber-600">{stats.totals.premiumUsers}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                        <p className="text-sm text-gray-500 mb-1">Toplam Görev</p>
                        <p className="text-xl font-bold text-gray-900">{stats.totals.totalJobs}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                        <p className="text-sm text-gray-500 mb-1">Açık Görevler</p>
                        <p className="text-xl font-bold text-green-600">{stats.totals.activeJobs}</p>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg text-center cursor-pointer hover:bg-red-100 transition" onClick={() => window.location.hash = '#/admin/disputes'}>
                        <p className="text-sm text-red-600 mb-1 flex items-center justify-center font-medium">
                            <AlertCircle className="w-4 h-4 mr-1" /> Açık Şikayetler
                        </p>
                        <p className="text-xl font-bold text-red-700">{stats.totals.openDisputes || 0}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
