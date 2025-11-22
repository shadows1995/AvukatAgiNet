import React, { useEffect, useState } from 'react';
import {
    Briefcase, CheckCircle, Users, TrendingUp,
    Activity, AlertCircle
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
    };
}

const AdminDashboard = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await adminApi.getDashboardStats();
                setStats(data);
            } catch (err) {
                console.error(err);
                setError('İstatistikler yüklenirken hata oluştu.');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

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
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500">Sistemin genel durumuna hızlı bakış</p>
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
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
