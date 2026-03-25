import React, { useState, useEffect } from 'react';
import { Mail, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const AdminMarketing = () => {
    const [stats, setStats] = useState({ sent: 0, unsent: 0, total: 0 });
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const fetchStats = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const apiUrl = import.meta.env.VITE_API_URL || '';
            const res = await fetch(`${apiUrl}/api/admin/marketing-stats`, {
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            });

            if (!res.ok) throw new Error('API Hatası');
            
            const data = await res.json();
            setStats({ sent: data.sent, unsent: data.unsent, total: data.total });
        } catch (error) {
            console.error("Marketing stats fetch error:", error);
            setMessage({ type: 'error', text: 'İstatistikler yüklenirken hata oluştu.' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleSendBatch = async () => {
        if (!confirm('Sıradaki en fazla 100 kişiye "Açılış" Mailtrap şablonunu göndermek istediğinize emin misiniz?')) return;
        
        setSending(true);
        setMessage(null);
        
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("Oturum bulunamadı");

            const apiUrl = import.meta.env.VITE_API_URL || '';
            const res = await fetch(`${apiUrl}/api/admin/send-marketing`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            });

            const data = await res.json();
            
            if (!res.ok) throw new Error(data.error || 'Bilinmeyen hata');

            setMessage({ type: 'success', text: data.message });
            fetchStats(); // update the counter
        } catch (error: any) {
            console.error("Batch send error:", error);
            setMessage({ type: 'error', text: error.message || 'Gönderim başarısız.' });
        } finally {
            setSending(false);
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

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 border-b pb-2 flex items-center">
                    <Mail className="w-6 h-6 mr-2 text-indigo-600" />
                    Mailtrap E-Posta Kampanyası
                </h1>
            </div>

            {message && (
                <div className={`p-4 rounded-lg flex items-center ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {message.type === 'success' ? <CheckCircle className="w-5 h-5 mr-2" /> : <AlertCircle className="w-5 h-5 mr-2" />}
                    <p className="font-medium">{message.text}</p>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Toplam Hedef Kitle</p>
                            <h3 className="text-3xl font-bold text-slate-800 mt-1">{stats.total}</h3>
                        </div>
                        <div className="p-3 bg-indigo-50 rounded-lg">
                            <UsersIcon className="w-6 h-6 text-indigo-600" />
                        </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                        <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Gönderilen (Başarılı)</p>
                            <h3 className="text-3xl font-bold text-green-600 mt-1">{stats.sent}</h3>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                        <div className="bg-green-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 font-medium">% {progressPercentage} tamamlandı</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Kuyrukta (Kalan)</p>
                            <h3 className="text-3xl font-bold text-amber-600 mt-1">{stats.unsent}</h3>
                        </div>
                        <div className="p-3 bg-amber-50 rounded-lg">
                            <AlertCircle className="w-6 h-6 text-amber-600" />
                        </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                        <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${100 - progressPercentage}%` }}></div>
                    </div>
                </div>
            </div>

            {/* Action Control */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex flex-col items-center justify-center space-y-6">
                <div className="text-center max-w-lg">
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Toplu Gönderim Tetikleyici</h2>
                    <p className="text-slate-500">
                        Bu butona tıkladığınızda sistem sırasını bekleyen ilk 100 kişiyi otomatik seçerek Mailtrap üzerinden açılış kampanyanızı iletecektir. 
                        <strong> Aynı kişiye birden fazla posta atılması sistem tarafından engellenmiştir.</strong>
                    </p>
                </div>

                <button
                    onClick={handleSendBatch}
                    disabled={sending || stats.unsent === 0}
                    className="flex items-center px-8 py-4 bg-indigo-600 text-white text-lg font-bold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
                >
                    {sending ? (
                        <>
                            <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                            İşleniyor (Gönderiliyor)...
                        </>
                    ) : (
                        <>
                            <Send className="w-6 h-6 mr-3" />
                            Sıradaki 100 Kişiye Gönder
                        </>
                    )}
                </button>
                {stats.unsent === 0 && (
                    <p className="text-sm text-green-600 font-medium mt-2">
                        Tüm hedef kitlenize başarıyla ulaştınız! Kuyrukta kimse kalmadı.
                    </p>
                )}
            </div>
            
            {/* Info Notice */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm text-blue-800 font-bold">Önemli Bot/Spam Koruması</h3>
                        <div className="mt-2 text-sm text-blue-700">
                            <p>
                                Günde 100 gönderim limiti, e-posta sunucusunun (Mailtrap) spam olarak algılanmasını önlemek için kasten ayarlanmıştır. Hedef kitleyi eritmek için her gün bir kez bu butona basmanız yeterlidir. Daha fazla basmak sadece o günkü Mailtrap API limitlerinizi zorlar.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Extracted simple icon since we used UsersIcon
const UsersIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
);

export default AdminMarketing;
