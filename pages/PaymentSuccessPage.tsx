import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Shield, Star, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

const PaymentSuccessPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { plan, period } = location.state || { plan: 'premium', period: 'monthly' };

    useEffect(() => {
        // Trigger confetti animation on mount
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);

        return () => clearInterval(interval);
    }, []);

    const planName = plan === 'premium_plus' ? 'Premium Plus' : 'Premium';
    const periodText = period === 'monthly' ? 'Aylık' : 'Yıllık';

    // Calculate validity date (approximate)
    const validUntil = new Date();
    if (period === 'monthly') {
        validUntil.setMonth(validUntil.getMonth() + 1);
    } else {
        validUntil.setFullYear(validUntil.getFullYear() + 1);
    }
    const formattedDate = validUntil.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all hover:scale-[1.01]">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-12 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-white/10 opacity-30 pattern-grid-lg"></div>
                    <div className="relative z-10">
                        <div className="mx-auto bg-white rounded-full w-24 h-24 flex items-center justify-center mb-6 shadow-lg animate-bounce-slow">
                            <CheckCircle className="w-12 h-12 text-emerald-600" />
                        </div>
                        <h1 className="text-4xl font-extrabold text-white mb-2">Ödeme Başarılı!</h1>
                        <p className="text-emerald-100 text-lg">İşleminiz güvenle tamamlandı.</p>
                    </div>
                </div>

                <div className="p-10">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">
                            Hoş Geldiniz, <span className="text-primary-600">{planName}</span> Üyesi!
                        </h2>
                        <p className="text-slate-600 leading-relaxed">
                            Üyeliğiniz <span className="font-semibold text-slate-900">{formattedDate}</span> tarihine kadar hesabınıza tanımlanmıştır.
                            Artık {planName} ayrıcalıklarının keyfini çıkarabilirsiniz.
                        </p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-6 mb-10 border border-slate-100">
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Paket Avantajlarınız</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-3 text-slate-700">
                                <div className="bg-primary-100 p-2 rounded-lg">
                                    <Zap className="w-5 h-5 text-primary-600" />
                                </div>
                                <span className="font-medium">Sınırsız İş Başvurusu</span>
                            </div>
                            <div className="flex items-center space-x-3 text-slate-700">
                                <div className="bg-primary-100 p-2 rounded-lg">
                                    <Star className="w-5 h-5 text-primary-600" />
                                </div>
                                <span className="font-medium">Öncelikli Listeleme</span>
                            </div>
                            <div className="flex items-center space-x-3 text-slate-700">
                                <div className="bg-primary-100 p-2 rounded-lg">
                                    <Shield className="w-5 h-5 text-primary-600" />
                                </div>
                                <span className="font-medium">Rozetli Profil</span>
                            </div>
                            <div className="flex items-center space-x-3 text-slate-700">
                                <div className="bg-primary-100 p-2 rounded-lg">
                                    <CheckCircle className="w-5 h-5 text-primary-600" />
                                </div>
                                <span className="font-medium">Gelişmiş İstatistikler</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group"
                    >
                        Panele Git
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;
