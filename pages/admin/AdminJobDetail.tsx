import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Briefcase, User, Calendar, MapPin, Clock,
    AlertCircle, Edit, Trash2, RefreshCw
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';

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

    useEffect(() => {
        if (jobId) fetchJobDetail(jobId);
    }, [jobId]);

    const fetchJobDetail = async (id: string) => {
        try {
            const result = await adminApi.getJobDetail(id);
            setData(result);
        } catch (error) {
            console.error('Error fetching job:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        const reason = prompt('Durum değişikliği için sebep giriniz:');
        if (!reason || !jobId) return;

        try {
            await adminApi.updateJobStatus(jobId, newStatus, reason);
            alert('Görev durumu güncellendi');
            fetchJobDetail(jobId);
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Hata oluştu');
        }
    };

    const handleDelete = async () => {
        if (!confirm('Bu görevi silmek istediğinizden emin misiniz?')) return;
        const reason = prompt('Silme sebebi:');
        if (!reason || !jobId) return;

        try {
            await adminApi.deleteJob(jobId, reason);
            alert('Görev silindi');
            navigate('/admin/jobs');
        } catch (error) {
            console.error('Error deleting job:', error);
            alert('Hata oluştu');
        }
    };

    if (loading) return <div className="p-8 text-center">Yükleniyor...</div>;
    if (!data) return <div className="p-8 text-center">Görev bulunamadı</div>;

    const { job, owner, assignedLawyer, applications, history } = data;

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-800">
                                {job.status.toUpperCase()}
                            </span>
                        </div>
                        <p className="text-gray-500">Görev ID: {job.jobId}</p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => handleStatusChange(job.status === 'open' ? 'cancelled' : 'completed')}
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
                                <p className="text-sm text-gray-500">Tarih</p>
                                <p className="font-medium">{job.date} {job.time}</p>
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
                                            {item.adminEmail} • {new Date(item.timestamp._seconds * 1000).toLocaleString('tr-TR')}
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
