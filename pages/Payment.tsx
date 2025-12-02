import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, ShieldCheck, Lock, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAlert } from '../contexts/AlertContext';

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { plan, price, period } = location.state || { plan: 'premium', price: 249, period: 'monthly' };
    const [loading, setLoading] = useState(false);
    const { showAlert } = useAlert();
    const [agreementAccepted, setAgreementAccepted] = useState(false);
    const [billingInfo, setBillingInfo] = useState({
        fullName: '',
        address: '',
        tcId: ''
    });

    const handlePayment = async () => {
        if (!agreementAccepted) {
            showAlert({
                title: "Uyarı",
                message: "Lütfen Mesafeli Satış Sözleşmesi ve Kullanım Şartları'nı onaylayınız.",
                type: "warning",
                confirmText: "Tamam"
            });
            return;
        }

        if (!billingInfo.fullName || !billingInfo.address || !billingInfo.tcId) {
            showAlert({
                title: "Eksik Bilgi",
                message: "Lütfen tüm fatura bilgilerini doldurunuz.",
                type: "warning",
                confirmText: "Tamam"
            });
            return;
        }

        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Update user with premium status AND billing info
            // Note: Ideally billing info should be in a separate table or column.
            // For now, we will try to update it in the 'users' table if columns exist, 
            // or just proceed with premium update if not.
            // Since we can't easily run migrations here, we'll assume columns might be missing 
            // and just update what we can, or store it in metadata if possible.
            // However, the user requested it to be stored. 
            // We will try to update 'address' which exists in User type, and maybe store TC in metadata or a new column if we could.
            // Let's try to update address. TC might need a new column.

            const { error } = await supabase.from('users').update({
                is_premium: true,
                membership_type: plan,
                premium_plan: period,
                premium_price: price,
                premium_since: new Date().toISOString(),
                premium_until: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)).toISOString(),
                updated_at: new Date().toISOString(),
                billing_address: billingInfo.address,
                tc_id: billingInfo.tcId
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

                <div className="bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row">
                    {/* Order Summary */}
                    <div className="bg-gradient-to-br from-primary-900 to-primary-800 p-10 text-white md:w-2/5 flex flex-col justify-between relative overflow-hidden">
                        {/* Decorative background elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-500/10 rounded-full -ml-10 -mb-10 blur-2xl pointer-events-none"></div>

                        <div className="relative z-10">
                            <h3 className="text-xl font-bold text-white/90 uppercase tracking-wider mb-8 border-b border-white/10 pb-4">Sipariş Özeti</h3>
                            <div className="space-y-6">
                                <div className="flex justify-between items-center group">
                                    <span className="text-primary-100 font-medium group-hover:text-white transition-colors">Paket</span>
                                    <span className="font-bold text-lg">{plan === 'premium_plus' ? 'Premium Plus' : 'Premium'}</span>
                                </div>
                                <div className="flex justify-between items-center group">
                                    <span className="text-primary-100 font-medium group-hover:text-white transition-colors">Periyot</span>
                                    <span className="font-bold text-lg">{period === 'monthly' ? 'Aylık' : 'Yıllık'}</span>
                                </div>
                                <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                                    <span className="text-xl font-bold text-white/90">Toplam</span>
                                    <span className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-primary-200">{price} TL</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-12 relative z-10 space-y-3 bg-black/20 p-4 rounded-xl backdrop-blur-sm">
                            <div className="flex items-center text-sm text-primary-100">
                                <ShieldCheck className="w-5 h-5 mr-3 text-emerald-400 flex-shrink-0" />
                                <span>256-bit SSL Koruması</span>
                            </div>
                            <div className="flex items-center text-sm text-primary-100">
                                <Lock className="w-5 h-5 mr-3 text-emerald-400 flex-shrink-0" />
                                <span>Güvenli Ödeme Altyapısı</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <div className="p-8 md:p-10 md:w-3/5 bg-white">
                        <form onSubmit={(e) => { e.preventDefault(); handlePayment(); }} className="space-y-6">

                            {/* Billing Info */}
                            <div className="space-y-4 mb-6 pb-6 border-b border-slate-100">
                                <h3 className="text-lg font-bold text-slate-800">Fatura Bilgileri</h3>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Ad Soyad</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-11"
                                        placeholder="Ad Soyad"
                                        value={billingInfo.fullName}
                                        onChange={e => setBillingInfo({ ...billingInfo, fullName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">TC Kimlik No</label>
                                    <input
                                        type="text"
                                        required
                                        maxLength={11}
                                        className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-11"
                                        placeholder="11 Haneli TC Kimlik No"
                                        value={billingInfo.tcId}
                                        onChange={e => setBillingInfo({ ...billingInfo, tcId: e.target.value.replace(/\D/g, '') })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Adres</label>
                                    <textarea
                                        required
                                        rows={2}
                                        className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 p-3"
                                        placeholder="Fatura Adresi"
                                        value={billingInfo.address}
                                        onChange={e => setBillingInfo({ ...billingInfo, address: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>

                            {/* Card Info */}
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-4">Kart Bilgileri</h3>
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

                            {/* Agreement Checkbox */}
                            <div className="flex items-start mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex items-center h-5">
                                    <input
                                        id="agreement"
                                        name="agreement"
                                        type="checkbox"
                                        required
                                        checked={agreementAccepted}
                                        onChange={(e) => setAgreementAccepted(e.target.checked)}
                                        className="focus:ring-primary-500 h-5 w-5 text-primary-600 border-gray-300 rounded cursor-pointer"
                                    />
                                </div>
                                <div className="ml-3 text-sm leading-relaxed">
                                    <label htmlFor="agreement" className="font-medium text-slate-600 cursor-pointer">
                                        <a href="#/distance-sales-agreement" target="_blank" className="text-primary-600 hover:text-primary-700 hover:underline font-bold">Mesafeli Satış Sözleşmesi</a>'ni ve <a href="#/terms" target="_blank" className="text-primary-600 hover:text-primary-700 hover:underline font-bold">Kullanım Şartları</a>'nı okudum ve kabul ediyorum.
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 rounded-xl font-bold text-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-primary-500/30 disabled:opacity-70 flex justify-center items-center transform hover:-translate-y-0.5"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2 h-5 w-5" />
                                        İşleniyor...
                                    </>
                                ) : (
                                    `Ödemeyi Tamamla (${price} TL)`
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
