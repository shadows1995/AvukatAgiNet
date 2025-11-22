import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, ShieldCheck, Lock, CheckCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAlert } from '../contexts/AlertContext';

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { plan, price, period } = location.state || { plan: 'premium', price: 249, period: 'monthly' };
    const [loading, setLoading] = useState(false);
    const { showAlert } = useAlert();

    const handlePayment = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            const { error } = await supabase.from('users').update({
                is_premium: true,
                membership_type: plan,
                premium_plan: period,
                premium_price: price,
                premium_since: new Date().toISOString(),
                premium_until: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)).toISOString(),
                updated_at: new Date().toISOString()
            }).eq('uid', user.id);

            if (error) throw error;

            showAlert({
                title: "Ödeme Başarılı!",
                message: "Üyeliğiniz başarıyla güncellendi.",
                type: "success",
                confirmText: "Tamam",
                onConfirm: () => navigate('/dashboard')
            });
        } catch (error) {
            console.error("Payment error:", error);
            showAlert({
                title: "Hata",
                message: "Ödeme sırasında bir hata oluştu.",
                type: "error",
                confirmText: "Tamam"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-slate-900">Ödeme Bilgileri</h2>
                    <p className="mt-2 text-lg text-slate-600">Güvenli ödeme altyapısı ile işleminizi tamamlayın.</p>
                </div>

                <div className="bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col md:flex-row">
                    {/* Order Summary */}
                    <div className="bg-slate-900 p-8 text-white md:w-1/3 flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-300 uppercase tracking-wider mb-6">Sipariş Özeti</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Paket</span>
                                    <span className="font-medium">{plan === 'premium_plus' ? 'Premium Plus' : 'Premium'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Periyot</span>
                                    <span className="font-medium">{period === 'monthly' ? 'Aylık' : 'Yıllık'}</span>
                                </div>
                                <div className="pt-4 border-t border-slate-700 flex justify-between items-center text-xl font-bold">
                                    <span>Toplam</span>
                                    <span>{price} TL</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8">
                            <div className="flex items-center text-xs text-slate-400 mb-2">
                                <ShieldCheck className="w-4 h-4 mr-1 text-green-400" /> 256-bit SSL Koruması
                            </div>
                            <div className="flex items-center text-xs text-slate-400">
                                <Lock className="w-4 h-4 mr-1 text-green-400" /> Güvenli Ödeme
                            </div>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <div className="p-8 md:w-2/3">
                        <form onSubmit={(e) => { e.preventDefault(); handlePayment(); }} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Kart Üzerindeki İsim</label>
                                <input type="text" required className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-11" placeholder="Ad Soyad" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Kart Numarası</label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                                    <input type="text" required className="w-full pl-10 rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-11" placeholder="0000 0000 0000 0000" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Son Kullanma Tarihi</label>
                                    <input type="text" required className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-11" placeholder="AA/YY" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">CVC</label>
                                    <input type="text" required className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-11" placeholder="123" />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-700 transition shadow-lg hover:shadow-primary-500/30 disabled:opacity-70 flex justify-center items-center"
                            >
                                {loading ? 'İşleniyor...' : `Ödemeyi Tamamla (${price} TL)`}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
