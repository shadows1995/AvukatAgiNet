import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Briefcase, CheckCircle, Users, TrendingUp,
    Activity, AlertCircle, Bot, Power, Bell, Send, Loader2
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
    const navigate = useNavigate();
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

            {/* Push Notification Panel */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Bot className="w-5 h-5 mr-2 text-indigo-500" />
                    Push Bildirimi Gönder
                </h2>

                <PushNotificationSender />
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
                    <div className="p-4 bg-red-50 rounded-lg text-center cursor-pointer hover:bg-red-100 transition" onClick={() => navigate('/admin/disputes')}>
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

const PushNotificationSender = () => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    // Segment logic
    const [segmentMode, setSegmentMode] = useState<'ids' | 'filters'>('filters');

    // ID Mode
    const [targetUserIdsStr, setTargetUserIdsStr] = useState('');

    // Filter Mode
    const [filterIsPremium, setFilterIsPremium] = useState<'all' | 'premium' | 'standard'>('all');
    const [filterCity, setFilterCity] = useState('');

    const [sending, setSending] = useState(false);
    const [result, setResult] = useState('');

    const handleSend = async () => {
        if (!title || !body) {
            alert("Lütfen başlık ve mesaj giriniz.");
            return;
        }

        setSending(true);
        setResult('');

        try {
            let payload: any = {
                title,
                body
            };

            if (segmentMode === 'ids') {
                if (!targetUserIdsStr) {
                    alert("Lütfen kullanıcı ID'lerini giriniz.");
                    setSending(false);
                    return;
                }
                const ids = targetUserIdsStr.split(',').map(id => id.trim()).filter(id => id);
                payload.userIds = ids;
            } else {
                // Filters
                payload.filters = {};

                if (filterIsPremium === 'premium') payload.filters.isPremium = true;
                if (filterIsPremium === 'standard') payload.filters.isPremium = false;
                // 'all' means don't send isPremium filter

                if (filterCity) {
                    payload.filters.city = filterCity;
                }
            }

            const response = await adminApi.sendPushNotification(payload);
            setResult(`Başarılı! ${response.sent} kişiye gönderildi.`);
        } catch (err: any) {
            console.error(err);
            setResult(`Hata: ${err.message}`);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                <Bell className="w-5 h-5 mr-2 text-primary-600" /> Push Bildirimi Gönder
            </h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Başlık</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Örn: Yeni Özellik Yayında!"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Mesaj İçeriği</label>
                    <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 h-24"
                        placeholder="Bildirim detaylarını buraya yazınız..."
                    />
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Hedef Kitle Seçimi</label>

                    <div className="flex space-x-4 mb-4">
                        <button
                            className={`px-3 py-1 rounded-full text-sm font-medium transition ${segmentMode === 'filters' ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-500' : 'bg-white border text-slate-600'}`}
                            onClick={() => setSegmentMode('filters')}
                        >
                            Filtrele (Segment)
                        </button>
                        <button
                            className={`px-3 py-1 rounded-full text-sm font-medium transition ${segmentMode === 'ids' ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-500' : 'bg-white border text-slate-600'}`}
                            onClick={() => setSegmentMode('ids')}
                        >
                            Özel Kullanıcı ID
                        </button>
                    </div>

                    {segmentMode === 'ids' ? (
                        <div>
                            <input
                                type="text"
                                value={targetUserIdsStr}
                                onChange={(e) => setTargetUserIdsStr(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                placeholder="Kullanıcı ID (virgülle ayırarak birden fazla girebilirsiniz)"
                            />
                            <p className="text-xs text-slate-500 mt-1">Örn: uid1, uid2, uid3</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Premium Status Filter */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Üyelik Tipi</label>
                                <div className="space-y-2">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="premiumFilter"
                                            checked={filterIsPremium === 'all'}
                                            onChange={() => setFilterIsPremium('all')}
                                            className="text-primary-600 focus:ring-primary-500"
                                        />
                                        <span className="text-sm text-slate-700">Tümü</span>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="premiumFilter"
                                            checked={filterIsPremium === 'premium'}
                                            onChange={() => setFilterIsPremium('premium')}
                                            className="text-primary-600 focus:ring-primary-500"
                                        />
                                        <span className="text-sm text-slate-700">Sadece Premium Üyeler</span>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="premiumFilter"
                                            checked={filterIsPremium === 'standard'}
                                            onChange={() => setFilterIsPremium('standard')}
                                            className="text-primary-600 focus:ring-primary-500"
                                        />
                                        <span className="text-sm text-slate-700">Sadece Standart Üyeler</span>
                                    </label>
                                </div>
                            </div>

                            {/* City Filter */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Şehir</label>
                                <select
                                    value={filterCity}
                                    onChange={(e) => setFilterCity(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 text-sm"
                                >
                                    <option value="">Tüm Şehirler</option>
                                    <option value="İstanbul">İstanbul</option>
                                    <option value="Ankara">Ankara</option>
                                    <option value="İzmir">İzmir</option>
                                    <option value="Antalya">Antalya</option>
                                    <option value="Bursa">Bursa</option>
                                    <option value="Adana">Adana</option>
                                    <option value="Konya">Konya</option>
                                    <option value="Gaziantep">Gaziantep</option>
                                    <option value="Şanlıurfa">Şanlıurfa</option>
                                    <option value="Mersin">Mersin</option>
                                    <option value="Trabzon">Trabzon</option>
                                    <option value="Samsun">Samsun</option>
                                    <option value="Diyarbakır">Diyarbakır</option>
                                    <option disabled>──────────</option>
                                </select>
                                <p className="text-xs text-slate-400 mt-1">*Sadece ana şehirler listelenmiştir.</p>
                            </div>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleSend}
                    disabled={sending}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition flex justify-center items-center disabled:opacity-50"
                >
                    {sending ? (
                        <>
                            <Loader2 className="animate-spin w-5 h-5 mr-2" /> Gönderiliyor...
                        </>
                    ) : (
                        <>
                            <Send className="w-5 h-5 mr-2" /> Bildirimi Gönder
                        </>
                    )}
                </button>

                {result && (
                    <div className={`p-4 rounded-lg mt-4 ${result.startsWith('Hata') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                        {result}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
