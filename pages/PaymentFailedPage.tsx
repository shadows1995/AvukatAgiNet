import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { XCircle, ArrowRight, AlertTriangle } from 'lucide-react';

const PaymentFailedPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Extract error message from URL query params
    const query = new URLSearchParams(location.search);
    const msg = query.get('msg');
    const code = query.get('code');
    const md = query.get('md');

    let displayMsg = msg ? decodeURIComponent(msg).replace(/_/g, ' ') : "İşlem sırasında bir hata oluştu.";

    if (code || md) {
        displayMsg += ` (Kod: ${code || '-'}, MD: ${md || '-'})`;
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-red-500 to-rose-600 p-12 text-center relative overflow-hidden">
                </div>
            </div>
        </div>
        </div >
    );
};

export default PaymentFailedPage;
