import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { XCircle, ArrowRight, AlertTriangle } from 'lucide-react';

const PaymentFailedPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Extract error message from URL query params
    const query = new URLSearchParams(location.search);
    const msg = query.get('msg') || "İşlem sırasında bir hata oluştu.";

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-red-500 to-rose-600 p-12 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-white/10 opacity-30 pattern-grid-lg"></div>
                    <div className="relative z-10">
                        <div className="mx-auto bg-white rounded-full w-24 h-24 flex items-center justify-center mb-6 shadow-lg">
                            <XCircle className="w-12 h-12 text-red-600" />
                        </div>
                        <h1 className="text-4xl font-extrabold text-white mb-2">Ödeme Başarısız</h1>
                        <p className="text-red-100 text-lg">İşleminiz tamamlanamadı.</p>
                    </div>
                </div>

                <div className="p-10 text-center">
                    <div className="bg-red-50 rounded-2xl p-6 mb-10 border border-red-100 inline-block w-full">
                        <div className="flex items-center justify-center text-red-800 font-medium text-lg mb-2">
                            <AlertTriangle className="w-6 h-6 mr-2" />
                            Hata Detayı
                        </div>
                        <p className="text-slate-600">
                            {decodeURIComponent(msg)}
                        </p>
                    </div>

                    <p className="text-slate-500 mb-8">
                        Lütfen kart bilgilerinizi kontrol edip tekrar deneyiniz veya bankanızla iletişime geçiniz.
                    </p>

                    <div className="flex space-x-4">
                        <button
                            onClick={() => navigate('/payment')}
                            className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
                        >
                            Tekrar Dene
                        </button>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex-1 bg-white text-slate-700 border-2 border-slate-200 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all duration-300 flex items-center justify-center"
                        >
                            Panele Dön
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailedPage;
