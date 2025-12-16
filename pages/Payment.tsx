import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, ShieldCheck, Lock, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAlert } from '../contexts/AlertContext';
import axios from 'axios';
import { useMobileApp } from '../hooks/useMobileApp';

interface PaymentPageProps {
    onPaymentSuccess?: () => void;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ onPaymentSuccess }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { plan, price, period } = location.state || { plan: 'premium', price: 249, period: 'monthly' };
    const [loading, setLoading] = useState(false);
    const { showAlert } = useAlert();
    const isMobileApp = useMobileApp();

    if (isMobileApp) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
                <div className="bg-white text-slate-500 p-8 rounded-xl border border-slate-200 shadow-sm text-center font-bold max-w-md w-full">
                    <p>Your account does not have access to this feature.</p>
                </div>
            </div>
        );
    }
    const [agreementAccepted, setAgreementAccepted] = useState(false);
    const [billingInfo, setBillingInfo] = useState({
        fullName: '',
        address: '',
        tcId: ''
    });
    const [cardInfo, setCardInfo] = useState({
        holderName: '',
        number: '',
        expDate: '',
        cvc: ''
    });

    const handlePayment = async () => {
        if (!agreementAccepted) {
            showAlert({ title: "Uyarı", message: "Lütfen Mesafeli Satış Sözleşmesi ve Kullanım Şartları'nı onaylayınız.", type: "warning", confirmText: "Tamam" });
            return;
        }

        if (!billingInfo.fullName || !billingInfo.address || !billingInfo.tcId) {
            showAlert({ title: "Eksik Bilgi", message: "Lütfen tüm fatura bilgilerini doldurunuz.", type: "warning", confirmText: "Tamam" });
            return;
        }

        if (!cardInfo.holderName || !cardInfo.number || !cardInfo.expDate || !cardInfo.cvc) {
            showAlert({ title: "Eksik Bilgi", message: "Lütfen tüm kart bilgilerini doldurunuz.", type: "warning", confirmText: "Tamam" });
            return;
        }

        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            showAlert({ title: "Hata", message: "Oturum açmanız gerekiyor.", type: "error", confirmText: "Tamam" });
            setLoading(false);
            return;
        }

        try {
            const [expMonth, expYear] = cardInfo.expDate.split('/');
            if (!expMonth || !expYear || expMonth.length !== 2 || expYear.length !== 2) {
                throw new Error("Son kullanma tarihi AA/YY formatında olmalıdır.");
            }

            const apiUrl = import.meta.env.VITE_API_URL || '';

            // 1. Initiate Payment on Backend (Get Form Data)
            const response = await axios.post(`${apiUrl}/api/payment/initiate`, {
                price: price.toString(),
                cardData: {
                    number: cardInfo.number.replace(/\s/g, ''),
                    expiry: cardInfo.expDate,
                    cvc: cardInfo.cvc,
                    name: cardInfo.holderName
                },
                billingInfo,
                userId: user.id,
                plan,
                period
            });

            const formData = response.data;
            if (!formData || !formData.secure3dhash) {
                throw new Error("Ödeme başlatılamadı (Hash hatası).");
            }

            // 2. Auto-Submit Form to Garanti
            // Determine Gateway URL
            const isProd = formData.mode === "PROD";
            const gatewayUrl = isProd
                ? "https://sanalposprov.garantibbva.com.tr/servlet/gt3dengine"
                : "https://sanalposprovtest.garantibbva.com.tr/servlet/gt3dengine";

            console.log("Redirecting to Garanti 3D Secure...", gatewayUrl);

            // Create Form
            const form = document.createElement("form");
            form.setAttribute("method", "POST");
            form.setAttribute("action", gatewayUrl);
            form.setAttribute("role", "form"); // Optional but good practice

            // Add Inputs
            Object.keys(formData).forEach(key => {
                const hiddenField = document.createElement("input");
                hiddenField.setAttribute("type", "hidden");
                hiddenField.setAttribute("name", key);
                hiddenField.setAttribute("value", formData[key]);
                form.appendChild(hiddenField);
            });

            document.body.appendChild(form);
            form.submit();

        } catch (error: any) {
            console.error("Payment Init Error:", error);
            showAlert({
                title: "Ödeme Başlatılamadı",
                message: error.response?.data?.error || error.message || "Bir hata oluştu.",
                type: "error",
                confirmText: "Tamam"
            });
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <button
                    onClick={() => navigate('/premium')}
                    className="flex items-center text-slate-500 hover:text-slate-800 transition-colors mb-6 font-medium"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Paketlere Geri Dön
                </button>

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
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-11"
                                    placeholder="Ad Soyad"
                                    value={cardInfo.holderName}
                                    onChange={e => setCardInfo({ ...cardInfo, holderName: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Kart Numarası</label>
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                                    <input
                                        type="text"
                                        required
                                        className="w-full pl-10 rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-11"
                                        placeholder="0000 0000 0000 0000"
                                        maxLength={19}
                                        value={cardInfo.number}
                                        onChange={e => setCardInfo({ ...cardInfo, number: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Son Kullanma Tarihi</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-11"
                                        placeholder="AA/YY"
                                        maxLength={5}
                                        value={cardInfo.expDate}
                                        onChange={e => {
                                            let val = e.target.value.replace(/\D/g, '');
                                            if (val.length > 2) {
                                                val = val.substring(0, 2) + '/' + val.substring(2, 4);
                                            }
                                            setCardInfo({ ...cardInfo, expDate: val });
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">CVC</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 h-11"
                                        placeholder="123"
                                        maxLength={4}
                                        value={cardInfo.cvc}
                                        onChange={e => setCardInfo({ ...cardInfo, cvc: e.target.value })}
                                    />
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
            </div >
        </div >
    );
};

export default PaymentPage;
