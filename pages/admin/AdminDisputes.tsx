import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/adminApi';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

const AdminDisputes = () => {
    const [disputes, setDisputes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchDisputes = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getDisputes();
            setDisputes(data);
        } catch (err) {
            console.error('Error fetching disputes:', err);
            setError('Şikayetler yüklenirken hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDisputes();
    }, []);

    const handleResolve = async (id: string) => {
        if (!window.confirm('Bu şikayeti çözüldü olarak işaretlemek istiyor musunuz?')) return;
        try {
            await adminApi.resolveDispute(id, 'Admin tarafından çözüldü işaretlendi.');
            fetchDisputes(); // Refresh list
        } catch (err) {
            alert('İşlem başarısız oldu.');
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Yükleniyor...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Şikayet Yönetimi</h1>
                    <p className="text-slate-500">Kullanıcılar tarafından bildirilen sorunlar.</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    {error}
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="p-4 font-semibold text-slate-600 text-sm">Tarih</th>
                                <th className="p-4 font-semibold text-slate-600 text-sm">Bildiren</th>
                                <th className="p-4 font-semibold text-slate-600 text-sm">İlgili Görev</th>
                                <th className="p-4 font-semibold text-slate-600 text-sm">Açıklama</th>
                                <th className="p-4 font-semibold text-slate-600 text-sm">Durum</th>
                                <th className="p-4 font-semibold text-slate-600 text-sm">İşlem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {disputes.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-400 font-medium">
                                        Henüz bir şikayet bulunmuyor.
                                    </td>
                                </tr>
                            ) : (
                                disputes.map((dispute) => (
                                    <tr key={dispute.id} className="hover:bg-slate-50/50 transition duration-150">
                                        <td className="p-4 text-sm text-slate-600 whitespace-nowrap">
                                            {new Date(dispute.created_at).toLocaleDateString('tr-TR')}
                                        </td>
                                        <td className="p-4 text-sm">
                                            <div className="font-medium text-slate-900">{dispute.users?.full_name || 'Bilinmeyen'}</div>
                                            <div className="text-xs text-slate-400">{dispute.users?.phone}</div>
                                        </td>
                                        <td className="p-4 text-sm">
                                            {dispute.jobs ? (
                                                <div>
                                                    <div className="font-medium text-slate-900">{dispute.jobs.title}</div>
                                                    <div className="text-xs text-slate-500">{dispute.jobs.courthouse}</div>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 italic">Silinmiş Görev</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-sm text-slate-700 max-w-xs">
                                            {dispute.description}
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${dispute.status === 'resolved'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {dispute.status === 'resolved' ? (
                                                    <><CheckCircle className="w-3 h-3 mr-1" /> Çözüldü</>
                                                ) : (
                                                    <><Clock className="w-3 h-3 mr-1" /> Açık</>
                                                )}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {dispute.status !== 'resolved' && (
                                                <button
                                                    onClick={() => handleResolve(dispute.id)}
                                                    className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline"
                                                >
                                                    Çözüldü İşaretle
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDisputes;
