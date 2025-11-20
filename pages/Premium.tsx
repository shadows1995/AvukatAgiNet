import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, X, Star, Crown, Sparkles, ShieldCheck } from 'lucide-react';
import { User } from '../types';

export const PremiumPage = ({ user }: { user: User }) => {
    const navigate = useNavigate();
    const [billingCycle, setBillingCycle] = React.useState<'monthly' | 'yearly'>('monthly');

    const prices = {
        premium: {
            monthly: 249,
            yearly: 2390 // ~199/mo
        },
        premium_plus: {
            monthly: 499,
            yearly: 4790 // ~399/mo
        }
    };

    const handleSelectPlan = (plan: 'premium' | 'premium_plus', price: number, period: 'monthly' | 'yearly') => {
        navigate('/payment', { state: { plan, price, period } });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-20">
            <div className="text-center mb-10">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-100 text-secondary-700 text-sm font-semibold mb-4">
                    <Star className="w-4 h-4 mr-2 fill-current" /> Premium Üyelik Seçenekleri
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Mesleğinizi Zirveye Taşıyın</h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
                    İhtiyacınıza uygun paketi seçin, iş ağınızı genişletin ve kazancınızı artırın.
                </p>

                {/* Billing Toggle */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    <span className={`text-sm font-semibold ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-500'}`}>Aylık</span>
                    <button
                        onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                        className={`relative w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none ${billingCycle === 'yearly' ? 'bg-indigo-600' : 'bg-slate-300'}`}
                    >
                        <span
                            className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'}`}
                        />
                    </button>
                    <div className="flex items-center gap-2">
                        <span className={`text-sm font-semibold ${billingCycle === 'yearly' ? 'text-slate-900' : 'text-slate-500'}`}>Yıllık</span>
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                            %20 İndirim
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto items-start">
                {/* Free Plan */}
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition duration-300 relative z-0">
                    <h3 className="text-xl font-bold text-slate-800">Standart Üyelik</h3>
                    <p className="text-4xl font-bold text-slate-900 mt-4">Ücretsiz</p>
                    <p className="text-slate-500 mt-2">Sistemi tanımak için</p>
                    <hr className="my-8 border-slate-100" />
                    <ul className="space-y-4">
                        <li className="flex items-center text-slate-700"><CheckCircle className="h-5 w-5 text-green-500 mr-3" /> Sınırsız Görev Açma</li>
                        <li className="flex items-center text-slate-700"><CheckCircle className="h-5 w-5 text-green-500 mr-3" /> Başvuruları Görüntüleme</li>
                        <li className="flex items-center text-slate-700"><CheckCircle className="h-5 w-5 text-green-500 mr-3" /> Sınırlı Sayıda Acil İlan Oluşturma</li>
                        <li className="flex items-center text-slate-400"><X className="h-5 w-5 mr-3 text-slate-300" /> Görevlere Başvuru Yapma</li>
                        <li className="flex items-center text-slate-400"><X className="h-5 w-5 mr-3 text-slate-300" /> Onaylı Profil Rozeti</li>

                    </ul>
                    <button disabled className="w-full mt-8 py-3.5 rounded-xl bg-slate-100 text-slate-500 font-bold text-sm tracking-wide cursor-default">
                        {!user.membershipType || user.membershipType === 'free' ? 'MEVCUT PLAN' : 'STANDART PAKET'}
                    </button>
                </div>

                {/* Premium Plan */}
                <div className="bg-white p-8 rounded-2xl border border-amber-200 shadow-xl relative z-10 transform md:-translate-y-4">
                    <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-t-2xl"></div>
                    <div className="absolute top-4 right-4">
                        <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full">POPÜLER</span>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                        <Crown className="w-6 h-6 text-amber-500" />
                        <h3 className="text-2xl font-bold text-slate-900">Premium</h3>
                    </div>

                    <div className="flex items-baseline mt-4">
                        <p className="text-5xl font-bold text-amber-600">
                            ₺{billingCycle === 'monthly' ? prices.premium.monthly : Math.round(prices.premium.yearly / 12)}
                        </p>
                        <p className="text-slate-500 ml-2">/ay</p>
                    </div>
                    <p className="text-slate-500 mt-2">
                        {billingCycle === 'monthly' ? 'Aylık faturalandırılır' : `Yıllık ₺${prices.premium.yearly} faturalandırılır`}
                    </p>

                    <hr className="my-8 border-slate-100" />

                    <ul className="space-y-5">
                        <li className="flex items-center text-slate-800 font-medium"><CheckCircle className="h-5 w-5 text-amber-500 mr-3" /> Tüm Standart Özellikler</li>
                        <li className="flex items-center text-slate-800 font-medium"><CheckCircle className="h-5 w-5 text-amber-500 mr-3" /> Sınırsız Göreve Başvuru</li>
                        <li className="flex items-center text-slate-800 font-medium"><CheckCircle className="h-5 w-5 text-amber-500 mr-3" /> "Premium" Profil Rozeti</li>
                        <li className="flex items-center text-slate-800 font-medium"><CheckCircle className="h-5 w-5 text-amber-500 mr-3" /> Öncelikli Destek</li>
                        <li className="flex items-center text-slate-400"><X className="h-5 w-5 mr-3 text-slate-300" /> Çoklu Şehir Seçimi</li>
                    </ul>

                    {user.membershipType === 'premium' ? (
                        <button disabled className="w-full mt-10 py-4 rounded-xl bg-amber-100 text-amber-700 font-bold shadow-sm cursor-default">
                            MEVCUT PLANINIZ
                        </button>
                    ) : (
                        <button
                            onClick={() => handleSelectPlan('premium', billingCycle === 'monthly' ? prices.premium.monthly : prices.premium.yearly, billingCycle)}
                            className="w-full mt-10 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold shadow-lg hover:shadow-amber-500/30 transition transform hover:-translate-y-1"
                        >
                            PREMIUM'A GEÇ
                        </button>
                    )}
                </div>

                {/* Premium Plus Plan */}
                <div className="bg-slate-900 p-8 rounded-2xl border border-indigo-500/30 shadow-2xl relative z-10 text-white">
                    <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-2xl"></div>

                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-6 h-6 text-indigo-400" />
                        <h3 className="text-2xl font-bold text-white">Premium +</h3>
                    </div>

                    <div className="flex items-baseline mt-4">
                        <p className="text-5xl font-bold text-indigo-400">
                            ₺{billingCycle === 'monthly' ? prices.premium_plus.monthly : Math.round(prices.premium_plus.yearly / 12)}
                        </p>
                        <p className="text-slate-400 ml-2">/ay</p>
                    </div>
                    <p className="text-slate-400 mt-2">
                        {billingCycle === 'monthly' ? 'Aylık faturalandırılır' : `Yıllık ₺${prices.premium_plus.yearly} faturalandırılır`}
                    </p>

                    <hr className="my-8 border-slate-700" />

                    <ul className="space-y-5">
                        <li className="flex items-center text-slate-200 font-medium"><CheckCircle className="h-5 w-5 text-indigo-400 mr-3" /> Tüm Premium Özellikler</li>
                        <li className="flex items-center text-slate-200 font-medium"><CheckCircle className="h-5 w-5 text-indigo-400 mr-3" /> Öne Çıkan Profil (Listelerde Üstte)</li>
                        <li className="flex items-center text-slate-200 font-medium"><CheckCircle className="h-5 w-5 text-indigo-400 mr-3" /> Sınırsız Acil İlan Oluşturma</li>
                        <li className="flex items-center text-slate-200 font-medium"><CheckCircle className="h-5 w-5 text-indigo-400 mr-3" /> Birden fazla şehirde Görev alma ve Adliye Seçimi</li>
                        <li className="flex items-center text-slate-200 font-medium"><CheckCircle className="h-5 w-5 text-indigo-400 mr-3" /> Çok Hızlı Müşteri Hizmetleri</li>
                    </ul>

                    {user.membershipType === 'premium_plus' ? (
                        <button disabled className="w-full mt-10 py-4 rounded-xl bg-indigo-900/50 text-indigo-300 font-bold border border-indigo-500/30 cursor-default">
                            MEVCUT PLANINIZ
                        </button>
                    ) : (
                        <button
                            onClick={() => handleSelectPlan('premium_plus', billingCycle === 'monthly' ? prices.premium_plus.monthly : prices.premium_plus.yearly, billingCycle)}
                            className="w-full mt-10 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg hover:shadow-indigo-500/30 transition transform hover:-translate-y-1"
                        >
                            PREMIUM PLUS OL
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PremiumPage;
