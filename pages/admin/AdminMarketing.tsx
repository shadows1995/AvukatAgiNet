import React, { useState, useEffect } from 'react';
import {
    Mail, Send, CheckCircle, AlertCircle, Loader2, Sparkles,
    RefreshCw, Plus, Eye, EyeOff, Clock, History, Settings, Users
} from 'lucide-react';
import { supabase } from '../../supabaseClient';

interface CampaignEmailContent {
    angleId: string;
    angleTitle: string;
    subject: string;
    preheader: string;
    headline: string;
    greeting: string;
    paragraphs: string[];
    bulletPoints: string[];
    ctaText: string;
    closingNote: string;
    generatedBy: 'gemini' | 'ai_library';
}

interface CampaignHistoryItem {
    campaignNumber: number;
    angleId: string;
    angleTitle: string;
    subject: string;
    startedAt: string;
    completedAt?: string;
    totalSent: number;
}

interface MarketingCampaignState {
    campaignNumber: number;
    autoSendEnabled: boolean;
    dailyLimit: number;
    lastAutoSendDate: string | null;
    sentTodayCount: number;
    sentTodayDate: string | null;
    currentCampaign: CampaignEmailContent;
    startedAt: string;
    history: CampaignHistoryItem[];
}

const AdminMarketing = () => {
    const [stats, setStats] = useState({ sent: 0, unsent: 0, total: 0 });
    const [campaignState, setCampaignState] = useState<MarketingCampaignState | null>(null);
    const [previewHtml, setPreviewHtml] = useState<string>('');
    const [showPreview, setShowPreview] = useState<boolean>(true);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [rotating, setRotating] = useState(false);
    const [savingSettings, setSavingSettings] = useState(false);
    const [addingEmails, setAddingEmails] = useState(false);
    const [sendingTest, setSendingTest] = useState(false);
    const [testEmailInput, setTestEmailInput] = useState<string>('vahdetbicak@gmail.com');
    const [dailyLimitInput, setDailyLimitInput] = useState<number>(100);
    const [newEmailsText, setNewEmailsText] = useState<string>('');
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const fetchStats = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const apiUrl = window.location.origin;
            const res = await fetch(`${apiUrl}/api/admin/marketing-stats`, {
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            });

            if (!res.ok) throw new Error('API Hatası');

            const data = await res.json();
            setStats({ sent: data.sent, unsent: data.unsent, total: data.total });
            if (data.campaignState) {
                setCampaignState(data.campaignState);
                setDailyLimitInput(data.campaignState.dailyLimit || 100);
            }
            if (data.previewHtml) {
                setPreviewHtml(data.previewHtml);
            }
        } catch (error: any) {
            console.error("Marketing stats fetch error:", error);
            setMessage({ type: 'error', text: 'İstatistikler yüklenirken hata oluştu: ' + String(error.message || error) });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleSendTest = async () => {
        if (!testEmailInput.trim()) return;
        setSendingTest(true);
        setMessage(null);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("Oturum bulunamadı");

            const apiUrl = window.location.origin;
            const res = await fetch(`${apiUrl}/api/admin/marketing-send-test`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: testEmailInput.trim() })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.details || data.error || 'Test gönderilemedi');

            setMessage({ type: 'success', text: data.message });
        } catch (error: any) {
            setMessage({ type: 'error', text: "Test gönderimi başarısız: " + String(error.message || error) });
        } finally {
            setSendingTest(false);
        }
    };

    const handleSendBatch = async () => {
        const limit = campaignState?.dailyLimit || 100;
        if (!confirm(`Sıradaki en fazla ${limit} kişiye aktif AI kampanyasını ("${campaignState?.currentCampaign?.subject || ''}") göndermek istediğinize emin misiniz?`)) return;

        setSending(true);
        setMessage(null);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("Oturum bulunamadı");

            const apiUrl = window.location.origin;
            const res = await fetch(`${apiUrl}/api/admin/send-marketing`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.details || data.error || 'Bilinmeyen hata');

            setMessage({ type: 'success', text: data.message });
            await fetchStats();
        } catch (error: any) {
            console.error("Marketing send batch error:", error);
            setMessage({ type: 'error', text: "Gönderim başarısız: " + String(error.message || error) });
        } finally {
            setSending(false);
        }
    };

    const handleUpdateSettings = async (newAutoEnabled?: boolean, newLimit?: number) => {
        setSavingSettings(true);
        setMessage(null);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("Oturum bulunamadı");

            const apiUrl = window.location.origin;
            const res = await fetch(`${apiUrl}/api/admin/marketing-settings`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    autoSendEnabled: typeof newAutoEnabled === 'boolean' ? newAutoEnabled : campaignState?.autoSendEnabled,
                    dailyLimit: typeof newLimit === 'number' ? newLimit : dailyLimitInput
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.details || data.error || 'Ayarlar kaydedilemedi');

            setCampaignState(data.campaignState);
            setMessage({ type: 'success', text: data.message });
        } catch (error: any) {
            setMessage({ type: 'error', text: String(error.message || error) });
        } finally {
            setSavingSettings(false);
        }
    };

    const handleRotateCampaign = async (resetQueue: boolean) => {
        const confirmMsg = resetQueue
            ? 'Mevcut kampanyayı tamamlandı sayıp AI ile YENİ BİR KAMPANYA oluşturmak ve tüm e-posta listesini (baştan gönderilmek üzere) sıfırlamak istediğinize emin misiniz?'
            : 'Mevcut gönderim sırasını bozmadan, aktif kampanya metnini AI ile yeni bir uygulama özelliğini anlatacak şekilde değiştirmek istediğinize emin misiniz?';

        if (!confirm(confirmMsg)) return;

        setRotating(true);
        setMessage(null);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("Oturum bulunamadı");

            const apiUrl = window.location.origin;
            const res = await fetch(`${apiUrl}/api/admin/marketing-rotate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ resetQueue })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.details || data.error || 'Kampanya üretilemedi');

            setMessage({ type: 'success', text: data.message });
            await fetchStats();
        } catch (error: any) {
            setMessage({ type: 'error', text: String(error.message || error) });
        } finally {
            setRotating(false);
        }
    };

    const handleAddEmails = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEmailsText.trim()) return;

        setAddingEmails(true);
        setMessage(null);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("Oturum bulunamadı");

            const apiUrl = window.location.origin;
            const res = await fetch(`${apiUrl}/api/admin/marketing-add-emails`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rawText: newEmailsText })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.details || data.error || 'E-postalar eklenemedi');

            setNewEmailsText('');
            setMessage({ type: 'success', text: data.message });
            await fetchStats();
        } catch (error: any) {
            setMessage({ type: 'error', text: String(error.message || error) });
        } finally {
            setAddingEmails(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    const progressPercentage = stats.total > 0 ? Math.round((stats.sent / stats.total) * 100) : 0;
    const currentCampaign = campaignState?.currentCampaign;

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                        <Mail className="w-6 h-6 mr-2 text-indigo-600" />
                        Otomatik AI E-Posta Pazarlama Sistemi
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Tüm listeye günlük limitle aynı kampanya gönderilir; liste tamamlandığında AI otomatik olarak uygulamanın farklı bir yönünü anlatan yeni kampanya başlatır.
                    </p>
                </div>

                {campaignState && (
                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center ${campaignState.autoSendEnabled ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                            <span className={`w-2 h-2 rounded-full mr-2 ${campaignState.autoSendEnabled ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></span>
                            Otomatik Gönderim: {campaignState.autoSendEnabled ? 'AÇIK' : 'KAPALI'}
                        </span>
                    </div>
                )}
            </div>

            {message && (
                <div className={`p-4 rounded-xl flex items-center ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {message.type === 'success' ? <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />}
                    <p className="font-medium text-sm">{message.text}</p>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Toplam Liste</p>
                            <h3 className="text-3xl font-bold text-slate-800 mt-1">{stats.total}</h3>
                        </div>
                        <div className="p-2.5 bg-indigo-50 rounded-lg">
                            <Users className="w-5 h-5 text-indigo-600" />
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-3">Yeni e-postalar istediğiniz an eklenebilir</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Bu Kampanyada Gönderilen</p>
                            <h3 className="text-3xl font-bold text-green-600 mt-1">{stats.sent}</h3>
                        </div>
                        <div className="p-2.5 bg-green-50 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
                        <div className="bg-green-500 h-1.5 rounded-full transition-all duration-700" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1.5 font-medium">%{progressPercentage} tamamlandı</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kuyrukta Bekleyen</p>
                            <h3 className="text-3xl font-bold text-amber-600 mt-1">{stats.unsent}</h3>
                        </div>
                        <div className="p-2.5 bg-amber-50 rounded-lg">
                            <Clock className="w-5 h-5 text-amber-600" />
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-3">
                        0 olduğunda yeni AI kampanyası otomatik başlar
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Bugün Gönderilen</p>
                            <h3 className="text-3xl font-bold text-indigo-600 mt-1">
                                {campaignState?.sentTodayCount || 0} <span className="text-lg font-normal text-slate-400">/ {campaignState?.dailyLimit || 100}</span>
                            </h3>
                        </div>
                        <div className="p-2.5 bg-indigo-50 rounded-lg">
                            <Send className="w-5 h-5 text-indigo-600" />
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-3">
                        Son Otomatik Gönderim: {campaignState?.lastAutoSendDate || 'Henüz çalışmadı'}
                    </p>
                </div>
            </div>

            {/* Automation Settings Card */}
            {campaignState && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start space-x-3">
                            <div className="p-2.5 bg-slate-100 rounded-lg mt-0.5">
                                <Settings className="w-5 h-5 text-slate-700" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-slate-800">Günlük Otomasyon ve Limit Ayarları</h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Sunucu her gün (10:00–18:00 TR saati arasında) günlük limit kadar kişiye aktif kampanyayı otomatik gönderir.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center space-x-2">
                                <label className="text-xs font-semibold text-slate-600">Günlük Limit:</label>
                                <input
                                    type="number"
                                    min={1}
                                    max={1000}
                                    value={dailyLimitInput}
                                    onChange={(e) => setDailyLimitInput(Number(e.target.value))}
                                    className="w-24 rounded-lg border-slate-300 text-sm py-1.5 px-3 font-semibold"
                                />
                                <button
                                    onClick={() => handleUpdateSettings(undefined, dailyLimitInput)}
                                    disabled={savingSettings || dailyLimitInput === campaignState.dailyLimit}
                                    className="px-3 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-900 disabled:opacity-40"
                                >
                                    Kaydet
                                </button>
                            </div>

                            <button
                                onClick={() => handleUpdateSettings(!campaignState.autoSendEnabled, undefined)}
                                disabled={savingSettings}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition ${campaignState.autoSendEnabled
                                    ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                                    : 'bg-green-600 text-white hover:bg-green-700'
                                    }`}
                            >
                                {campaignState.autoSendEnabled ? 'Otomatik Gönderimi Durdur' : 'Otomatik Gönderimi Başlat'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Active AI Campaign & Action Controls */}
            {currentCampaign && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-900 p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/30 border border-indigo-400/40 text-indigo-100 flex items-center">
                                    <Sparkles className="w-3.5 h-3.5 mr-1" />
                                    Aktif Kampanya #{campaignState?.campaignNumber}
                                </span>
                                <span className="text-xs text-indigo-200 font-medium">
                                    Tema: <strong>{currentCampaign.angleTitle}</strong>
                                </span>
                            </div>
                            <h2 className="text-lg md:text-xl font-bold text-white">
                                Konu: {currentCampaign.subject}
                            </h2>
                            <p className="text-xs text-indigo-200 mt-1">
                                Ön İzleme Özeti: {currentCampaign.preheader}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                onClick={() => setShowPreview(!showPreview)}
                                className="flex items-center px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition"
                            >
                                {showPreview ? <EyeOff className="w-4 h-4 mr-1.5" /> : <Eye className="w-4 h-4 mr-1.5" />}
                                {showPreview ? 'Önizlemeyi Gizle' : 'E-Postayı Önizle'}
                            </button>
                            <button
                                onClick={() => handleRotateCampaign(false)}
                                disabled={rotating}
                                className="flex items-center px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition disabled:opacity-50"
                                title="Sırayı sıfırlamadan farklı bir uygulama yönünü anlatan yeni metin üretir"
                            >
                                {rotating ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Sparkles className="w-4 h-4 mr-1.5" />}
                                Metni AI İle Değiştir
                            </button>
                            <button
                                onClick={() => handleRotateCampaign(true)}
                                disabled={rotating}
                                className="flex items-center px-3 py-2 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-lg transition disabled:opacity-50"
                                title="Yeni kampanyaya geçer ve tüm listeyi baştan gönderilmek üzere sıfırlar"
                            >
                                <RefreshCw className="w-4 h-4 mr-1.5" />
                                Yeni Kampanya Başlat (Listeyi Sıfırla)
                            </button>
                        </div>
                    </div>

                    {showPreview && previewHtml && (
                        <div className="p-6 bg-slate-50 border-b border-slate-200">
                            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
                                <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 text-xs text-slate-600 flex justify-between">
                                    <span><strong>Gönderen:</strong> AvukatAğı &lt;hello@avukatagi.net&gt;</span>
                                    <span><strong>Konu:</strong> {currentCampaign.subject}</span>
                                </div>
                                <iframe
                                    title="Marketing Email Preview"
                                    srcDoc={previewHtml}
                                    className="w-full h-[560px] border-0"
                                />
                            </div>
                        </div>
                    )}

                    <div className="p-6 flex flex-col lg:flex-row items-center justify-between gap-4 bg-white">
                        <div className="flex flex-col sm:flex-row items-center gap-2 w-full lg:w-auto">
                            <input
                                type="email"
                                value={testEmailInput}
                                onChange={(e) => setTestEmailInput(e.target.value)}
                                placeholder="Test e-posta adresi..."
                                className="w-full sm:w-64 rounded-xl border-slate-300 text-sm py-2.5 px-3"
                            />
                            <button
                                onClick={handleSendTest}
                                disabled={sendingTest || !testEmailInput.trim()}
                                className="w-full sm:w-auto flex items-center justify-center px-4 py-2.5 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-900 transition disabled:opacity-50 whitespace-nowrap"
                            >
                                {sendingTest ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Mail className="w-4 h-4 mr-1.5" />}
                                Kendime Test Gönder
                            </button>
                        </div>

                        <button
                            onClick={handleSendBatch}
                            disabled={sending}
                            className="w-full lg:w-auto flex items-center justify-center px-6 py-3.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 shadow-md"
                        >
                            {sending ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Gönderiliyor...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5 mr-2" />
                                    Sıradaki {campaignState?.dailyLimit || 100} Kişiye Şimdi Gönder
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Add More Emails Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center mb-3">
                    <div className="p-2 bg-emerald-50 rounded-lg mr-3">
                        <Plus className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-slate-800">E-Posta Listesine Yeni Alıcılar Ekle</h2>
                        <p className="text-xs text-slate-500">
                            Her satıra bir e-posta (veya <code>eposta@ornek.com, Ad, Soyad</code> formatında CSV satırları) yapıştırabilirsiniz. Mevcut kayıtlar korunur, yeni adresler doğrudan gönderim kuyruğuna eklenir.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleAddEmails} className="space-y-3">
                    <textarea
                        rows={4}
                        value={newEmailsText}
                        onChange={(e) => setNewEmailsText(e.target.value)}
                        placeholder={"av.ahmetyilmaz@gmail.com, Ahmet, Yılmaz\nav.aysekaya@hotmail.com\n..."}
                        className="w-full rounded-xl border-slate-300 text-sm p-3 font-mono focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={addingEmails || !newEmailsText.trim()}
                            className="flex items-center px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition disabled:opacity-50"
                        >
                            {addingEmails ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                            Listeye Ekle
                        </button>
                    </div>
                </form>
            </div>

            {/* Completed Campaign History */}
            {campaignState?.history && campaignState.history.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center">
                        <History className="w-5 h-5 mr-2 text-slate-500" />
                        Tamamlanan Kampanya Geçmişi
                    </h2>
                    <div className="space-y-3">
                        {campaignState.history.slice().reverse().map((item, idx) => (
                            <div key={idx} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                    <span className="text-xs font-bold text-indigo-600 uppercase">
                                        Kampanya #{item.campaignNumber} • {item.angleTitle}
                                    </span>
                                    <p className="text-sm font-semibold text-slate-800">{item.subject}</p>
                                </div>
                                <div className="text-right text-xs text-slate-500">
                                    <div className="font-bold text-green-700">{item.totalSent} Alıcıya Gönderildi</div>
                                    {item.completedAt && (
                                        <div>Bitiş: {new Date(item.completedAt).toLocaleDateString('tr-TR')}</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMarketing;
