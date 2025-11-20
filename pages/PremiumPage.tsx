import React, { useState } from 'react';
import { Check, X, Crown, Star, Shield, Zap, Bell, MapPin, ArrowRight, Loader2, User as UserIcon } from 'lucide-react';
import { User } from '../types';
import { db } from '../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

const PremiumPage = ({ user }: { user: User }) => {
    const [loading, setLoading] = useState<string | null>(null);

    const handleUpgrade = async (plan: 'premium' | 'premium_plus', duration: 'monthly' | 'yearly') => {
        setLoading(`${plan}-${duration}`);

        // Payment Links (Replace with actual links provided by user)
        const PAYMENT_LINKS = {
            premium: {
                monthly: "https://iyzico.com/...", // Placeholder
                yearly: "https://iyzico.com/..."   // Placeholder
            },
            premium_plus: {
                monthly: "https://iyzico.com/...", // Placeholder
                yearly: "https://iyzico.com/..."   // Placeholder
            }
        };

        // If we had real links, we would redirect here:
        // window.location.href = PAYMENT_LINKS[plan][duration];
        // return;

        // Simulate payment processing for now
        setTimeout(async () => {
            try {
                const now = Date.now();
                const durationMs = duration === 'monthly' ? 30 * 24 * 60 * 60 * 1000 : 365 * 24 * 60 * 60 * 1000;

                await updateDoc(doc(db, "users", user.uid), {
                    isPremium: true,
                    membershipType: plan,
                    premiumPlan: duration,
                    premiumSince: now,
                    premiumUntil: now + durationMs,
                    premiumPrice: plan === 'premium'
                        ? (duration === 'monthly' ? 300 : 1500)
                        : (duration === 'monthly' ? 500 : 2500)
                });

                alert(`Tebrikler! ${plan === 'premium' ? 'Premium' : 'Premium +'} üyeliğiniz başarıyla aktif edildi.`);
                window.location.reload(); // Simple reload to refresh state
            } catch (error) {
                console.error("Upgrade error:", error);
                alert("Bir hata oluştu. Lütfen tekrar deneyin.");
            } finally {
                setLoading(null);
            }
        }, 1500);
    };

    const PlanCard = ({
        type,
        title,
        priceMonthly,
        priceYearly,
        features,
        recommended = false,
        color
    }: {
        type: 'free' | 'premium' | 'premium_plus',
        title: string,
        priceMonthly: number,
        priceYearly: number,
        features: { text: string, included: boolean }[],
        recommended?: boolean,
        color: string
    }) => {
        const isCurrent = user.membershipType === type || (type === 'free' && !user.isPremium);
        const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

        return (
            <div className={`relative bg-white rounded-2xl shadow-xl border-2 flex flex-col ${recommended ? 'border-amber-500 scale-105 z-10' : 'border-slate-100'} p-6 transition hover:shadow-2xl`}>
                {recommended && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md flex items-center">
                        <Star className="w-4 h-4 mr-1 fill-current" /> EN POPÜLER
                    </div>
                )}

                <div className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center mb-4 mx-auto`}>
                    {type === 'free' && <UserIcon className="w-8 h-8 text-white" />}
                    {type === 'premium' && <Crown className="w-8 h-8 text-white" />}
                    {type === 'premium_plus' && <Zap className="w-8 h-8 text-white" />}
                </div>

                <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
                    {type !== 'free' && (
                        <div className="flex justify-center space-x-2 mt-4 bg-slate-100 p-1 rounded-lg inline-flex mx-auto">
                            <button
                                onClick={() => setBillingCycle('monthly')}
                                className={`px-3 py-1 text-xs font-bold rounded-md transition ${billingCycle === 'monthly' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
                            >
                                Aylık
                            </button>
                            <button
                                onClick={() => setBillingCycle('yearly')}
                                className={`px-3 py-1 text-xs font-bold rounded-md transition ${billingCycle === 'yearly' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
                            >
                                Yıllık %60 İndirim
                            </button>
                        </div>
                    )}
                    <div className="mt-4 h-16 flex items-center justify-center flex-col">
                        {type === 'free' ? (
                            <span className="text-4xl font-bold text-slate-900">Ücretsiz</span>
                        ) : (
                            <>
                                <div className="flex items-baseline justify-center">
                                    <span className="text-4xl font-bold text-slate-900">
                                        {billingCycle === 'monthly' ? priceMonthly : Math.round(priceYearly / 12)}
                                    </span>
                                    <span className="text-xl text-slate-500 font-medium ml-1">TL</span>
                                    <span className="text-slate-400 text-sm ml-1">/ay</span>
                                </div>
                                {billingCycle === 'yearly' && (
                                    <span className="text-xs text-green-600 font-bold mt-1">
                                        Yıllık {priceYearly} TL (5 Ay Bedava!)
                                    </span>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className="space-y-4 mb-8 flex-grow">
                    {features.map((feature, idx) => (
                        <div key={idx} className="flex items-start">
                            {feature.included ? (
                                <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                            ) : (
                                <X className="w-5 h-5 text-slate-300 mr-3 flex-shrink-0" />
                            )}
                            <span className={`text-sm ${feature.included ? 'text-slate-700' : 'text-slate-400'}`}>
                                {feature.text}
                            </span>
                        </div>
                    ))}
                </div>

                <button
                    disabled={isCurrent || (loading !== null)}
                    onClick={() => type !== 'free' && handleUpgrade(type, billingCycle)}
                    className={`w-full py-3 rounded-xl font-bold transition flex items-center justify-center ${isCurrent
                        ? 'bg-slate-100 text-slate-400 cursor-default'
                        : recommended
                            ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:shadow-lg hover:-translate-y-1'
                            : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg hover:-translate-y-1'
                        }`}
                >
                    {loading === `${type}-${billingCycle}` ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : isCurrent ? (
                        'Mevcut Plan'
                    ) : type === 'free' ? (
                        'Varsayılan'
                    ) : (
                        'Hemen Yükselt'
                    )}
                </button>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                        Mesleğinizi <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Zirveye Taşıyın</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Size en uygun paketi seçin, Türkiye'nin en büyük avukat ağında yerinizi alın ve kazanmaya başlayın.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start mb-20">
                    {/* FREE PLAN */}
                    <PlanCard
                        type="free"
                        title="Ücretsiz Üyelik"
                        priceMonthly={0}
                        priceYearly={0}
                        color="bg-slate-400"
                        features={[
                            { text: "İlan Açabilme (Sınırsız)", included: true },
                            { text: "Profil Oluşturma", included: true },
                            { text: "Başvuruları Görüntüleme", included: true },
                            { text: "Mesajlaşma", included: true },
                            { text: "İlanlara Başvuru Yapma", included: false },
                            { text: "Acil İlan Açabilme", included: false },
                            { text: "Bölgesel E-posta Bildirimleri", included: false },
                            { text: "Çoklu İl Seçimi", included: false },
                        ]}
                    />

                    {/* PREMIUM PLAN */}
                    <PlanCard
                        type="premium"
                        title="Premium"
                        priceMonthly={300}
                        priceYearly={1500}
                        color="bg-gradient-to-br from-amber-400 to-orange-500"
                        recommended={true}
                        features={[
                            { text: "15 dk Başvuru Penceresi", included: true },
                            { text: "Başvurudan Gelir Kazanma", included: true },
                            { text: "Acil İlan Açabilme", included: true },
                            { text: "Bölgesel E-posta Bildirimleri", included: true },
                            { text: "Para İadesi Garantisi", included: false },
                            { text: "Öncelikli Bildirim (10 sn erken)", included: false },
                            { text: "Başvurularda Üstte Çıkma", included: false },
                            { text: "Adliye Filtreli E-posta", included: false },
                            { text: "Çoklu İl Seçimi", included: false },
                        ]}
                    />

                    {/* PREMIUM + PLAN */}
                    <PlanCard
                        type="premium_plus"
                        title="Premium +"
                        priceMonthly={500}
                        priceYearly={2500}
                        color="bg-gradient-to-br from-indigo-500 to-purple-600"
                        features={[
                            { text: "Tüm Premium Özellikleri", included: true },
                            { text: "Öncelikli Bildirim (10 sn erken)", included: true },
                            { text: "Başvurularda Üstte Çıkma", included: true },
                            { text: "Acil İlan Açabilme", included: true },
                            { text: "Adliye Filtreli E-posta", included: true },
                            { text: "Çoklu İl Seçimi (Tüm Türkiye)", included: true },
                            { text: "Yılda 5 Görev Alamazsa İade", included: true },
                        ]}
                    />
                </div>

                {/* Feature Details Section */}
                <div className="max-w-5xl mx-auto mb-20">
                    <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Neden Premium?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start">
                            <div className="bg-amber-100 p-3 rounded-lg mr-4">
                                <Crown className="w-6 h-6 text-amber-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">15 Dakika Avantajı</h3>
                                <p className="text-slate-600">
                                    Yeni açılan görevlere ilk 15 dakika sadece Premium üyeler başvurabilir. Bu sayede rekabet avantajı elde edersiniz.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start">
                            <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                                <Zap className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Öncelikli Bildirim (Premium+)</h3>
                                <p className="text-slate-600">
                                    Premium+ üyeler, yeni görev bildirimlerini diğer kullanıcılardan 10 saniye daha erken alır.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start">
                            <div className="bg-green-100 p-3 rounded-lg mr-4">
                                <MapPin className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Bölgesel ve Filtreli Bildirimler</h3>
                                <p className="text-slate-600">
                                    Sadece ilgilendiğiniz şehir veya adliyelerdeki görevler için bildirim alın. Gereksiz e-postalarla uğraşmayın.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start">
                            <div className="bg-purple-100 p-3 rounded-lg mr-4">
                                <Shield className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Para İadesi Garantisi (Premium+)</h3>
                                <p className="text-slate-600">
                                    Premium+ üyeliğiniz boyunca yılda en az 5 görev alamazsanız, üyelik ücretiniz iade edilir.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <div className="inline-flex items-center bg-white px-6 py-3 rounded-full shadow-sm border border-slate-200 text-slate-600">
                        <Shield className="w-5 h-5 mr-2 text-green-500" />
                        <span className="font-medium">Tüm ödemeler 256-bit SSL ile korunmaktadır ve güvenlidir.</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PremiumPage;
