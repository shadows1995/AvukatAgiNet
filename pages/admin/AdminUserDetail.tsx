import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    User, Mail, Phone, MapPin, Calendar, Shield,
    Ban, CheckCircle, Edit, TrendingUp, Briefcase,
    Clock, Globe
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import { useAlert } from '../../contexts/AlertContext';

interface UserDetailData {
    user: any;
    stats: any;
    recentLogins: any[];
    activeBans: any[];
}

const AdminUserDetail = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const [data, setData] = useState<UserDetailData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId) fetchUserDetail(userId);
    }, [userId]);

    const fetchUserDetail = async (id: string) => {
        try {
            const result = await adminApi.getUserDetail(id);
            setData(result);
        } catch (error) {
            console.error('Error fetching user:', error);
        } finally {
            setLoading(false);
        }
    };

    const { showAlert } = useAlert();

    const handleBan = async () => {
        if (!userId) return;

        showAlert({
            title: "Kullanıcıyı Banla",
            message: "Bu kullanıcıyı banlamak istediğinize emin misiniz? Lütfen sebep belirtin.",
            type: "warning",
            inputPlaceholder: "Ban sebebi...",
            confirmText: "Banla",
            cancelText: "Vazgeç",
            onConfirm: async (reason) => {
                if (!reason) return;
                try {
                    await adminApi.banUser(userId, { reason, banType: 'permanent' });
                    showAlert({ title: "Başarılı", message: "Kullanıcı banlandı.", type: "success" });
                    fetchUserDetail(userId);
                } catch (error) {
                    console.error(error);
                    showAlert({ title: "Hata", message: "Bir hata oluştu.", type: "error" });
                }
            }
        });
    };

    const handleUnban = async () => {
        if (!userId) return;

        showAlert({
            title: "Banı Kaldır",
            message: "Kullanıcının banını kaldırmak üzeresiniz. Lütfen sebep belirtin.",
            type: "info",
            inputPlaceholder: "Unban sebebi...",
            confirmText: "Banı Kaldır",
            cancelText: "Vazgeç",
            onConfirm: async (reason) => {
                if (!reason) return;
                try {
                    await adminApi.unbanUser(userId, reason);
                    showAlert({ title: "Başarılı", message: "Ban kaldırıldı.", type: "success" });
                    fetchUserDetail(userId);
                } catch (error) {
                    console.error(error);
                    showAlert({ title: "Hata", message: "Bir hata oluştu.", type: "error" });
                }
            }
        });
    };

    const handleRoleChange = async () => {
        if (!userId) return;

        showAlert({
            title: "Rol Değiştir",
            message: "Yeni rolü giriniz (free, premium, premium_plus, admin):",
            type: "info",
            inputPlaceholder: "Yeni rol...",
            confirmText: "İlerle",
            cancelText: "Vazgeç",
            onConfirm: (newRole) => {
                if (!newRole) return;

                setTimeout(() => {
                    showAlert({
                        title: "Rol Değiştirme Sebebi",
                        message: "Lütfen bu değişiklik için bir sebep belirtin:",
                        type: "info",
                        inputPlaceholder: "Değişiklik sebebi...",
                        confirmText: "Güncelle",
                        cancelText: "Vazgeç",
                        onConfirm: async (reason) => {
                            if (!reason) return;
                            try {
                                await adminApi.changeUserRole(userId, newRole, reason);
                                showAlert({ title: "Başarılı", message: "Rol güncellendi.", type: "success" });
                                fetchUserDetail(userId);
                            } catch (error) {
                                console.error(error);
                                showAlert({ title: "Hata", message: "Bir hata oluştu.", type: "error" });
                            }
                        }
                    });
                }, 300); // Wait for previous alert to close
            }
        });
    };

    if (loading) return <div className="p-8 text-center">Yükleniyor...</div>;
    if (!data) return <div className="p-8 text-center">Kullanıcı bulunamadı</div>;

    const { user, stats, recentLogins, activeBans } = data;

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex justify-between items-start">
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
                            <User className="w-8 h-8 text-indigo-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{user.fullName}</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="px-2 py-0.5 rounded bg-gray-100 text-xs font-semibold uppercase text-gray-600">
                                    {user.role}
                                </span>
                                <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${user.accountStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                    {user.accountStatus}
                                </span>
                            </div>
                            <p className="text-gray-500 text-sm mt-1">ID: {user.uid}</p>
                            <p className="text-gray-500 text-sm mt-1">
                                Kayıt Tarihi: {(() => {
                                    if (!user.createdAt) return '-';
                                    const seconds = user.createdAt.seconds || user.createdAt._seconds;
                                    if (seconds) return new Date(seconds * 1000).toLocaleDateString('tr-TR');
                                    return new Date(user.createdAt).toLocaleDateString('tr-TR');
                                })()}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {user.accountStatus === 'banned' ? (
                            <button onClick={handleUnban} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                                <CheckCircle className="w-4 h-4" /> Banı Kaldır
                            </button>
                        ) : (
                            <button onClick={handleBan} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                                <Ban className="w-4 h-4" /> Banla
                            </button>
                        )}
                        <button onClick={handleRoleChange} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                            <Edit className="w-4 h-4" /> Rol Değiştir
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-sm text-gray-500">Açılan Görev</p>
                    <p className="text-2xl font-bold">{stats.jobsCreated}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-sm text-gray-500">Tamamlanan</p>
                    <p className="text-2xl font-bold">{stats.jobsCompleted}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-sm text-gray-500">Devam Eden</p>
                    <p className="text-2xl font-bold">{stats.jobsInProgress}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-sm text-gray-500">Toplam Kazanç</p>
                    <p className="text-2xl font-bold">{stats.totalEarnings} TL</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Login History */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <h2 className="text-lg font-semibold mb-4">Son Girişler</h2>
                        {recentLogins.length === 0 ? (
                            <p className="text-gray-500">Kayıt yok.</p>
                        ) : (
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500">
                                    <tr>
                                        <th className="px-4 py-2">Tarih</th>
                                        <th className="px-4 py-2">IP</th>
                                        <th className="px-4 py-2">User Agent</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentLogins.map((log, idx) => (
                                        <tr key={idx} className="border-b">
                                            <td className="px-4 py-2">
                                                {(() => {
                                                    const seconds = log.timestamp?.seconds || log.timestamp?._seconds;
                                                    return seconds ? new Date(seconds * 1000).toLocaleString('tr-TR') : '-';
                                                })()}
                                            </td>
                                            <td className="px-4 py-2 font-mono">{log.ipAddress}</td>
                                            <td className="px-4 py-2 truncate max-w-xs">{log.userAgent}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Right: Info */}
                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <h2 className="text-lg font-semibold mb-4">İletişim</h2>
                        <div className="space-y-3">
                            <div className="flex gap-3">
                                <Mail className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Phone className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">Telefon</p>
                                    <p className="font-medium">{user.phone}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <MapPin className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">Baro</p>
                                    <p className="font-medium">{user.baroCity} - {user.baroNumber}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUserDetail;
