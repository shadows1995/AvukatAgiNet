import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { User } from '../types';
import { Sparkles, Rocket, Info, Check } from 'lucide-react';

interface BetaWelcomeModalProps {
    user: User;
    onSuccess: () => void;
}

const BetaWelcomeModal: React.FC<BetaWelcomeModalProps> = ({ user, onSuccess }) => {
    const [loading, setLoading] = useState(false);

    const handleStartTrial = async () => {
        setLoading(true);
        try {
            // Get current session token for authentication
            const { data: { session } } = await supabase.auth.getSession();

            if (!session?.access_token) {
                throw new Error("Oturum süreniz dolmuş olabilir. Lütfen tekrar giriş yapın.");
            }

            // Call the backend API (avoids RLS restricted update issues)
            const apiUrl = import.meta.env.VITE_API_URL || '';
            const response = await fetch(`${apiUrl}/api/activate-beta`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token: session.access_token })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Beta aktivasyonu başarısız oldu.");
            }

            onSuccess();
        } catch (err: any) {
            console.error("Error activating beta trial:", err);
            alert(`Hata: ${err.message || 'Bir sorun oluştu'}`);
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative border border-white/20">

                {/* Header Background */}
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="bg-white/20 p-4 rounded-full mb-4 backdrop-blur-sm border border-white/30 animate-pulse">
                            <Rocket className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                            AvukatAğı BETA
                        </h2>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                    <div className="text-center space-y-3">
                        <p className="text-lg font-semibold text-slate-800">
                            Aramıza Hoşgeldiniz!
                        </p>
                        <p className="text-slate-600 leading-relaxed">
                            Şu anda <span className="font-bold text-indigo-600">BETA (Test)</span> aşamasındayız.
                            Siz değerli meslektaşlarımızla birlikte sistemimizi geliştiriyor ve başvuruları topluyoruz.
                        </p>
                    </div>

                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start">
                        <Info className="w-5 h-5 text-indigo-600 mr-3 flex-shrink-0 mt-0.5" />
                        <div className="text-left">
                            <p className="text-sm text-indigo-800 mb-2">
                                Bu sürece katkılarınız için teşekkür ederiz. Beta sürecine özel, tüm özellikleri limitsiz kullanabilmeniz için size bir hediyemiz var.
                            </p>
                            <ul className="text-sm text-indigo-900 space-y-1.5 mt-2">
                                <li className="flex items-center"><Check className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" /> Sınırsız Görev Oluşturabilirsiniz</li>
                                <li className="flex items-center"><Check className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" /> Görevlere sınırsız başvuru yapabilirsiniz</li>
                                <li className="flex items-center"><Check className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" /> Birden fazla ilde pek çok adliye seçebilirsiniz</li>
                                <li className="flex items-center"><Check className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" /> Başvurularınız üstte görünür</li>
                                <li className="flex items-center"><Check className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" /> Acil Görev oluşturabilirsiniz</li>
                                <li className="flex items-center"><Check className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" /> Uzmanlık Alanı seçebilirsiniz</li>
                            </ul>
                        </div>
                    </div>

                    <button
                        onClick={handleStartTrial}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                İşleniyor...
                            </span>
                        ) : (
                            <span className="flex items-center">
                                <Sparkles className="w-5 h-5 mr-2" />
                                2 Ay Ücretsiz Premium Başlat
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BetaWelcomeModal;
