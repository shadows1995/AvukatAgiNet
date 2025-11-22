import React, { useState } from 'react';
import { Star, X, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAlert } from '../contexts/AlertContext';

interface RatingModalProps {
    isOpen: boolean;
    onClose: () => void;
    jobId: string;
    revieweeId: string;
    revieweeName: string;
    onSuccess: () => void;
}

const RatingModal: React.FC<RatingModalProps> = ({
    isOpen,
    onClose,
    jobId,
    revieweeId,
    revieweeName,
    onSuccess
}) => {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [loading, setLoading] = useState(false);
    const { showAlert } = useAlert();

    const handleSubmit = async () => {
        if (rating === 0) {
            showAlert({
                title: "Hata",
                message: "Lütfen bir puan seçin.",
                type: "error",
                confirmText: "Tamam"
            });
            return;
        }

        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Kullanıcı bulunamadı');

            // Insert rating
            const { error: ratingError } = await supabase.from('ratings').insert({
                job_id: jobId,
                reviewer_id: user.id,
                reviewee_id: revieweeId,
                rating: rating,
                review_text: reviewText || null
            });

            if (ratingError) throw ratingError;

            // Update job to mark as rated
            const { data: job } = await supabase
                .from('jobs')
                .select('created_by, selected_applicant')
                .eq('job_id', jobId)
                .single();

            if (job) {
                const isOwner = job.created_by === user.id;
                await supabase
                    .from('jobs')
                    .update({
                        [isOwner ? 'owner_rated' : 'lawyer_rated']: true
                    })
                    .eq('job_id', jobId);
            }

            showAlert({
                title: "Başarılı",
                message: "Değerlendirmeniz kaydedildi. Teşekkürler!",
                type: "success",
                confirmText: "Tamam",
                onConfirm: () => {
                    onSuccess();
                    onClose();
                }
            });

        } catch (error: any) {
            console.error('Rating error:', error);
            showAlert({
                title: "Hata",
                message: error.message || "Değerlendirme kaydedilemedi.",
                type: "error",
                confirmText: "Tamam"
            });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Değerlendirme</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    <p className="text-slate-600 text-center">
                        <span className="font-semibold text-slate-900">{revieweeName}</span> ile yaptığınız işbirliğini değerlendirin
                    </p>

                    {/* Star Rating */}
                    <div className="flex justify-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                                className="transition-transform hover:scale-110"
                            >
                                <Star
                                    className={`w-10 h-10 ${star <= (hoveredRating || rating)
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-slate-300'
                                        }`}
                                />
                            </button>
                        ))}
                    </div>

                    {rating > 0 && (
                        <p className="text-center text-slate-600 font-medium">
                            {rating === 1 && "Çok Kötü"}
                            {rating === 2 && "Kötü"}
                            {rating === 3 && "Orta"}
                            {rating === 4 && "İyi"}
                            {rating === 5 && "Mükemmel"}
                        </p>
                    )}

                    {/* Review Text */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Yorumunuz (Opsiyonel)
                        </label>
                        <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="İşbirliği deneyiminizi paylaşın..."
                            rows={4}
                            className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition disabled:opacity-50"
                        >
                            İptal
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading || rating === 0}
                            className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 flex items-center justify-center"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                'Gönder'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RatingModal;
