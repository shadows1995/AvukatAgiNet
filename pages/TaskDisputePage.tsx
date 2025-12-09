import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { User } from '../types';
import { AlertCircle, CheckCircle, Clock, Plus, Search, X, Gavel, FileText, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const TaskDisputePage = () => {
    const [user, setUser] = useState<User | null>(null);
    const [disputes, setDisputes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [jobs, setJobs] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [activeType, setActiveType] = useState<'dispute' | 'suggestion' | 'complaint'>('dispute');
    const [newDisputeData, setNewDisputeData] = useState({
        jobId: '',
        description: '',
        type: 'dispute' as 'dispute' | 'suggestion' | 'complaint'
    });
    const [submitLoading, setSubmitLoading] = useState(false);

    // Filter State
    const [filterType, setFilterType] = useState<'all' | 'dispute' | 'suggestion' | 'complaint'>('all');

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                // Fetch full profile if needed, but for now just ID is enough for queries
                // Assuming we might have user context from parent, but fetching safe
                setUser({ uid: user.id } as User);
                fetchDisputes(user.id);
                fetchEligibleJobs(user.id);
            }
        });
    }, []);

    const fetchDisputes = async (userId: string) => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('disputes')
                .select(`
          *,
          jobs:job_id (title, city, courthouse, job_id)
        `)
                .eq('reporter_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setDisputes(data || []);
        } catch (error) {
            console.error('Error fetching disputes:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchEligibleJobs = async (userId: string) => {
        try {
            // Fetch jobs where user is creator OR assigned lawyer
            const { data, error } = await supabase
                .from('jobs')
                .select('job_id, title, city, courthouse, status, created_by, assigned_to')
                .or(`created_by.eq.${userId},assigned_to.eq.${userId}`)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setJobs(data || []);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newDisputeData.description) return;

        // Validate if it's a dispute, job must be selected
        if (newDisputeData.type === 'dispute' && !newDisputeData.jobId) {
            alert('Lütfen ilgili görevi seçiniz.');
            return;
        }

        setSubmitLoading(true);
        try {
            const { error } = await supabase
                .from('disputes')
                .insert({
                    reporter_id: user.uid,
                    job_id: newDisputeData.jobId || null, // Nullable for suggestions/complaints
                    description: newDisputeData.description,
                    status: 'open',
                    dispute_type: newDisputeData.type
                });

            if (error) throw error;

            setIsModalOpen(false);
            setNewDisputeData({ jobId: '', description: '', type: 'dispute' });
            fetchDisputes(user.uid);
        } catch (error) {
            console.error('Error creating feedback:', error);
            alert('Bildirim oluşturulurken bir hata oluştu.');
        } finally {
            setSubmitLoading(false);
        }
    };

    // Filter disputes based on selection
    const filteredDisputes = disputes.filter(d =>
        filterType === 'all' ? true : (d.dispute_type || 'dispute') === filterType
    );

    const getBadges = (type: string) => {
        switch (type) {
            case 'suggestion': return { label: 'Öneri', color: 'bg-blue-100 text-blue-700 border-blue-200' };
            case 'complaint': return { label: 'Şikayet', color: 'bg-red-100 text-red-700 border-red-200' };
            default: return { label: 'Uyuşmazlık', color: 'bg-orange-100 text-orange-700 border-orange-200' };
        }
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Geri Bildirim & Destek</h1>
                    <p className="text-slate-500">Görev uyuşmazlıkları, şikayet ve önerileriniz.</p>
                </div>
                <button
                    onClick={() => {
                        setNewDisputeData({ jobId: '', description: '', type: 'dispute' });
                        setIsModalOpen(true);
                    }}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm flex items-center transition"
                >
                    <Plus className="w-5 h-5 mr-1" />
                    Yeni Bildirim
                </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl mb-6 w-fit">
                <button
                    onClick={() => setFilterType('all')}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${filterType === 'all' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Tümü
                </button>
                <button
                    onClick={() => setFilterType('dispute')}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${filterType === 'dispute' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Uyuşmazlıklar
                </button>
                <button
                    onClick={() => setFilterType('complaint')}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${filterType === 'complaint' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Şikayetler
                </button>
                <button
                    onClick={() => setFilterType('suggestion')}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${filterType === 'suggestion' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Öneriler
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10 text-slate-500">Yükleniyor...</div>
            ) : filteredDisputes.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center shadow-sm">
                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Kayıt Bulunamadı</h3>
                    <p className="text-slate-500">Bu kategoride henüz bir bildiriminiz yok.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredDisputes.map((dispute) => {
                        const typeInfo = getBadges(dispute.dispute_type || 'dispute');
                        return (
                            <div key={dispute.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition">
                                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${typeInfo.color}`}>
                                                {typeInfo.label}
                                            </span>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${dispute.status === 'resolved'
                                                ? 'bg-green-50 text-green-700 border-green-100'
                                                : dispute.status === 'dismissed'
                                                    ? 'bg-red-50 text-red-700 border-red-100'
                                                    : 'bg-slate-100 text-slate-600 border-slate-200'
                                                }`}>
                                                {dispute.status === 'resolved' ? (
                                                    <><CheckCircle className="w-3 h-3 mr-1" /> Çözüldü</>
                                                ) : dispute.status === 'dismissed' ? (
                                                    <><X className="w-3 h-3 mr-1" /> Reddedildi</>
                                                ) : (
                                                    <><Clock className="w-3 h-3 mr-1" /> Beklemede</>
                                                )}
                                            </span>
                                            <span className="text-xs text-slate-400 ml-auto md:ml-0">
                                                {new Date(dispute.created_at).toLocaleDateString('tr-TR')}
                                            </span>
                                        </div>

                                        {/* Job Link ONLY for Disputes or if job exists */}
                                        {dispute.jobs ? (
                                            <Link to={`/job/${dispute.job_id}`} className="group block mb-3 pl-3 border-l-2 border-slate-100 hover:border-primary-300">
                                                <div className="text-xs text-slate-400 mb-0.5">İlgili Görev</div>
                                                <h3 className="text-sm font-bold text-slate-800 group-hover:text-primary-600 transition flex items-center">
                                                    {dispute.jobs.title}
                                                    <ChevronRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </h3>
                                            </Link>
                                        ) : dispute.dispute_type === 'dispute' ? (
                                            <div className="text-xs text-slate-400 italic mb-3">İlgili görev silinmiş veya bulunamadı.</div>
                                        ) : null}

                                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            <p className="text-sm text-slate-700 whitespace-pre-wrap">{dispute.description}</p>
                                        </div>

                                        {dispute.resolution_notes && (
                                            <div className={`mt-3 p-3 rounded-lg border text-sm ${dispute.status === 'dismissed'
                                                ? 'bg-red-50 border-red-100 text-red-800'
                                                : 'bg-green-50 border-green-100 text-green-800'
                                                }`}>
                                                <strong className="block mb-1">{dispute.status === 'dismissed' ? 'Red Nedeni:' : 'Çözüm:'}</strong>
                                                {dispute.resolution_notes}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* New Dispute Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 w-full h-full">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsModalOpen(false)}
                    ></div>

                    {/* Modal Content */}
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-auto overflow-hidden animate-in zoom-in-95 duration-200 z-10 flex flex-col max-h-[90vh]">
                        <div className="p-5 border-b border-slate-100 flex justify-between items-center shrink-0">
                            <h3 className="text-lg font-bold text-slate-900">Yeni Bildirim</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-5 space-y-5 overflow-y-auto">

                            {/* Type Selection */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Bildirim Türü</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setNewDisputeData({ ...newDisputeData, type: 'dispute' })}
                                        className={`py-2 px-1 text-xs sm:text-sm font-medium rounded-lg border text-center transition ${newDisputeData.type === 'dispute' ? 'bg-orange-50 border-orange-200 text-orange-700 ring-1 ring-orange-200' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        Uyuşmazlık
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setNewDisputeData({ ...newDisputeData, type: 'complaint' })}
                                        className={`py-2 px-1 text-xs sm:text-sm font-medium rounded-lg border text-center transition ${newDisputeData.type === 'complaint' ? 'bg-red-50 border-red-200 text-red-700 ring-1 ring-red-200' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        Şikayet
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setNewDisputeData({ ...newDisputeData, type: 'suggestion' })}
                                        className={`py-2 px-1 text-xs sm:text-sm font-medium rounded-lg border text-center transition ${newDisputeData.type === 'suggestion' ? 'bg-blue-50 border-blue-200 text-blue-700 ring-1 ring-blue-200' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        Öneri
                                    </button>
                                </div>
                            </div>

                            {/* Job Selection - Only for Disputes */}
                            {newDisputeData.type === 'dispute' && (
                                <div className="animate-in fade-in slide-in-from-top-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        İlgili Görev <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        required
                                        value={newDisputeData.jobId}
                                        onChange={(e) => setNewDisputeData({ ...newDisputeData, jobId: e.target.value })}
                                        className="w-full rounded-lg border-slate-300 shadow-sm focus:ring-primary-500 focus:border-primary-500"
                                    >
                                        <option value="">Görev Seçiniz</option>
                                        {jobs.map(job => (
                                            <option key={job.job_id} value={job.job_id}>
                                                {job.title} ({job.city})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Açıklama <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={newDisputeData.description}
                                    onChange={(e) => setNewDisputeData({ ...newDisputeData, description: e.target.value })}
                                    className="w-full rounded-lg border-slate-300 shadow-sm focus:ring-primary-500 focus:border-primary-500"
                                    placeholder={newDisputeData.type === 'dispute' ? "Uyuşmazlık detaylarını açıklayınız..." : newDisputeData.type === 'suggestion' ? "Geliştirmemiz için önerinizi bizimle paylaşın..." : "Şikayetçi olduğunuz konuyu detaylandırın..."}
                                />
                            </div>

                            <div className="pt-2 flex justify-end gap-3 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition"
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitLoading}
                                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 shadow-sm transition flex items-center"
                                >
                                    {submitLoading ? 'Gönderiliyor...' : 'Gönder'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskDisputePage;
