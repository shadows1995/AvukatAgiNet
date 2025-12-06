import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/adminApi';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

const AdminDisputes = () => {
    const [disputes, setDisputes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Modal state
    const [selectedDispute, setSelectedDispute] = useState<any>(null);
    const [resolutionNote, setResolutionNote] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const openResolveModal = (dispute: any) => {
        setSelectedDispute(dispute);
        setResolutionNote(''); // Reset note
        setIsModalOpen(true);
    };

    const handleResolve = async () => {
        if (!selectedDispute) return;
        try {
            await adminApi.resolveDispute(selectedDispute.id, resolutionNote);
            setIsModalOpen(false);
            fetchDisputes(); // Refresh list
        } catch (err) {
            alert('İşlem başarısız oldu.');
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Yükleniyor...</div>;

    return (
        <div className="space-y-6 relative">
            {/* Resolution Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Şikayeti Çözümle</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Çözüm Notu (Opsiyonel)</label>
                            <textarea
                                className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                rows={4}
                                placeholder="Kullanıcıya gösterilecek çözüm açıklaması..."
                                value={resolutionNote}
                                onChange={(e) => setResolutionNote(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleResolve}
                                className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition shadow-sm"
                            >
                                Çözüldü Olarak İşaretle
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                                            <div>{dispute.description}</div>
                                            {dispute.resolution_notes && (
                                                <div className="mt-1 text-xs text-green-700 bg-green-50 p-1 rounded border border-green-100">
                                                    <strong>Çözüm:</strong> {dispute.resolution_notes}
                                                </div>
                                            )}
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
                                                    onClick={() => openResolveModal(dispute)}
                                                    className="text-sm text-white bg-primary-600 hover:bg-primary-700 px-3 py-1.5 rounded-md font-medium transition shadow-sm"
                                                >
                                                    Çöz
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
