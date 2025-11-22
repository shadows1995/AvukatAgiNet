import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Briefcase, User, Calendar, MapPin, Clock,
    AlertCircle, Edit, Trash2, RefreshCw
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import { useAlert } from '../../contexts/AlertContext';

interface JobDetailData {
    job: any;
    owner: any;
    assignedLawyer: any;
    applications: any[];
    history: any[];
}

const AdminJobDetail = () => {
    const { jobId } = useParams<{ jobId: string }>();
    const navigate = useNavigate();
    const [data, setData] = useState<JobDetailData | null>(null);
    const [loading, setLoading] = useState(true);

    // Modal states (simplified for this implementation)
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [statusReason, setStatusReason] = useState('');

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (jobId) fetchJobDetail(jobId);
    }, [jobId]);

    const fetchJobDetail = async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            console.log("Fetching job details for ID:", id);
            const result = await adminApi.getJobDetail(id);
            setData(result);
        } catch (err: any) {
            console.error('Error fetching job:', err);
            setError(err.message || 'Görev detayları alınamadı');
        } finally {
            setLoading(false);
        }
    };

    const { showAlert } = useAlert();

    const handleStatusUpdate = async () => {
        if (!selectedStatus || !statusReason || !jobId) {
            showAlert({ title: "Eksik Bilgi", message: "Lütfen yeni durum ve sebep giriniz.", type: "warning" });
            return;
        }

        try {
            await adminApi.updateJobStatus(jobId, selectedStatus, statusReason);
            showAlert({ title: "Başarılı", message: "Görev durumu güncellendi.", type: "success" });
            setIsStatusModalOpen(false);
            setStatusReason('');
            fetchJobDetail(jobId);
        } catch (error) {
            console.error('Error updating status:', error);
            showAlert({ title: "Hata", message: "Bir hata oluştu.", type: "error" });
        }
    };

    const handleDelete = async () => {
        if (!jobId) return;

        showAlert({
            title: "Görevi Sil",
            message: "Bu görevi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.",
            type: "warning",
            confirmText: "Evet, Sil",
            cancelText: "Vazgeç",
            onConfirm: () => {
                setTimeout(() => {
                    showAlert({
                        title: "Silme Sebebi",
                        message: "Lütfen silme sebebini belirtin:",
                        type: "warning",
                        inputPlaceholder: "Silme sebebi...",
                        confirmText: "Sil",
                        cancelText: "Vazgeç",
                        onConfirm: async (reason) => {
                            if (!reason) return;
                            try {
                                await adminApi.deleteJob(jobId, reason);
                                showAlert({
                                    title: "Başarılı",
                                    message: "Görev silindi.",
                                    type: "success",
                                    onConfirm: () => navigate('/admin/jobs')
                                });
                            } catch (error) {
                                console.error('Error deleting job:', error);
                                showAlert({ title: "Hata", message: "Bir hata oluştu.", type: "error" });
                            }
                        }
                    });
                }, 300);
            }
        });
    };

    if (loading) return <div className="p-8 text-center">Yükleniyor...</div>;
    if (error) return (
        <div className="p-8 text-center">
            <div className="text-red-500 font-bold mb-2">Hata Oluştu</div>
            <p className="text-gray-600">{error}</p>
            <p className="text-xs text-gray-400 mt-2">Job ID: {jobId}</p>
            <button onClick={() => navigate('/admin/jobs')} className="mt-4 text-indigo-600 hover:underline">
                Listeye Dön
            </button>
        </div>
    );
    if (!data) return <div className="p-8 text-center">Görev bulunamadı</div>;

    const { job, owner, assignedLawyer, applications, history } = data;

    return (
        <div className="max-w-7xl mx-auto space-y-6 relative">
            {/* Status Modal */}
            {isStatusModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Görev Durumunu Değiştir</h3>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Yeni Durum</label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border"
                            >
                                <option value="">Seçiniz...</option>
                                <option value="open">Açık (Open)</option>
                                <option value="in_progress">Devam Ediyor (In Progress)</option>
                                <option value="completed">Tamamlandı (Completed)</option>
                                <option value="cancelled">İptal Edildi (Cancelled)</option>
                            </select>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Değişiklik Sebebi</label>
                            <textarea
                                value={statusReason}
                                onChange={(e) => setStatusReason(e.target.value)}
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border"
                                rows={3}
                                placeholder="Bu değişikliği neden yapıyorsunuz?"
                            ></textarea>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsStatusModalOpen(false)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleStatusUpdate}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                            >
                                Güncelle
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-800">
                                {job.status === 'open' ? 'AÇIK' :
                                    job.status === 'in_progress' ? 'DEVAM EDİYOR' :
                                        job.status === 'completed' ? 'TAMAMLANDI' :
                                            job.status === 'cancelled' ? 'İPTAL' : job.status}
                            </span>
                        </div>
                        <p className="text-gray-500">Görev ID: {job.jobId}</p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setSelectedStatus(job.status);
                                setIsStatusModalOpen(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            <Edit className="w-4 h-4" />
                            Durum Değiştir
                        </button>
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                            <Trash2 className="w-4 h-4" />
                            Sil
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Job Info */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Briefcase className="w-5 h-5" />
                            Görev Bilgileri
                        </h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Görev Tipi</p>
                                <p className="font-medium">{job.jobType || 'Belirtilmemiş'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Ücret</p>
                                <p className="font-medium">{job.offeredFee} TL</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Konum</p>
                                <p className="font-medium">{job.city} - {job.courthouse}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Oluşturulma Tarihi</p>
                                <p className="font-medium">
                                    {(() => {
                                        if (!job.createdAt) return '-';
                                        const seconds = job.createdAt.seconds || job.createdAt._seconds;
                                        if (seconds) return new Date(seconds * 1000).toLocaleDateString('tr-TR');
                                        return new Date(job.createdAt).toLocaleDateString('tr-TR');
                                    })()}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <p className="text-sm text-gray-500 mb-2">Açıklama</p>
                            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{job.description}</p>
                        </div>
                    </div>

                    {/* Applications */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <h2 className="text-lg font-semibold mb-4">Başvurular ({applications.length})</h2>
                        {applications.length === 0 ? (
                            <p className="text-gray-500">Henüz başvuru yok.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-500">
                                        <tr>
                                            <th className="px-4 py-2">Avukat</th>
                                            <th className="px-4 py-2">Teklif</th>
                                            <th className="px-4 py-2">Durum</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {applications.map((app, idx) => (
                                            <tr key={idx} className="border-b">
                                                <td className="px-4 py-2">{app.applicantName}</td>
                                                <td className="px-4 py-2">{app.proposedFee} TL</td>
                                                <td className="px-4 py-2">{app.status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* History */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            İşlem Geçmişi
                        </h2>
                        <div className="space-y-4">
                            {history.map((item, index) => (
                                <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
                                    <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-indigo-600"></div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{item.action}</p>
                                        <p className="text-sm text-gray-600">
                                            {item.adminEmail} • {(() => {
                                                const seconds = item.timestamp?.seconds || item.timestamp?._seconds;
                                                return seconds ? new Date(seconds * 1000).toLocaleString('tr-TR') : '-';
                                            })()}
                                        </p>
                                        {item.reason && (
                                            <p className="text-xs text-gray-500 mt-1">Sebep: {item.reason}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Owner */}
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <User className="w-5 h-5" />
                            İlan Sahibi
                        </h2>
                        {owner ? (
                            <div className="space-y-3">
                                <p className="font-medium text-indigo-600 cursor-pointer" onClick={() => navigate(`/admin/users/${owner.uid}`)}>
                                    {owner.fullName}
                                </p>
                                <p className="text-sm text-gray-600">{owner.email}</p>
                                <p className="text-sm text-gray-600">{owner.phone}</p>
                                <p className="text-sm text-gray-600">{owner.baroCity} Barosu</p>
                            </div>
                        ) : (
                            <p className="text-gray-500">Kullanıcı bulunamadı</p>
                        )}
                    </div>

                    {/* Assigned Lawyer */}
                    {assignedLawyer && (
                        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Atanan Avukat
                            </h2>
                            <div className="space-y-3">
                                <p className="font-medium text-indigo-600 cursor-pointer" onClick={() => navigate(`/admin/users/${assignedLawyer.uid}`)}>
                                    {assignedLawyer.fullName}
                                </p>
                                <p className="text-sm text-gray-600">{assignedLawyer.email}</p>
                                <p className="text-sm text-gray-600">{assignedLawyer.phone}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminJobDetail;
