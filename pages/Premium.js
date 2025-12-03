"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PremiumPage = void 0;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var lucide_react_1 = require("lucide-react");
var PremiumPage = function (_a) {
    var user = _a.user;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _b = react_1.default.useState('monthly'), billingCycle = _b[0], setBillingCycle = _b[1];
    var prices = {
        premium: {
            monthly: 249,
            yearly: 2390 // ~199/mo
        },
        premium_plus: {
            monthly: 499,
            yearly: 4790 // ~399/mo
        }
    };
    var handleSelectPlan = function (plan, price, period) {
        navigate('/payment', { state: { plan: plan, price: price, period: period } });
    };
    return (<div className="max-w-7xl mx-auto px-4 py-20">
            <div className="text-center mb-10">
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">İhtiyacınıza uygun planı seçin</h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
                    Kendinize en uygun planı seçin ve Avukat Ağı'nın premium özelliklerinin keyfini çıkarın.
                </p>

                {/* Billing Toggle */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    <span className={"text-sm font-semibold ".concat(billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-500')}>Aylık</span>
                    <button onClick={function () { return setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly'); }} className={"relative w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none ".concat(billingCycle === 'yearly' ? 'bg-indigo-600' : 'bg-slate-300')}>
                        <span className={"absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ".concat(billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0')}/>
                    </button>
                    <div className="flex items-center gap-2">
                        <span className={"text-sm font-semibold ".concat(billingCycle === 'yearly' ? 'text-slate-900' : 'text-slate-500')}>Yıllık</span>
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                            5 Ay Bedava!
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto items-start">
                {/* Free Plan */}
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition duration-300 relative z-0 text-center">
                    <div className="flex justify-center mb-4">
                        <lucide_react_1.Sparkles className="w-8 h-8 text-cyan-500"/>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Başlangıç</h3>
                    <p className="text-slate-500 mt-2 text-sm">Yeni başlayan avukatlar için ideal</p>

                    <div className="flex items-baseline justify-center mt-4">
                        <p className="text-4xl font-bold text-slate-900">₺0</p>
                        <p className="text-slate-500 ml-1">/ay</p>
                    </div>

                    <hr className="my-8 border-slate-100"/>
                    <ul className="space-y-4 text-left">
                        <li className="flex items-center text-slate-700"><lucide_react_1.CheckCircle className="h-5 w-5 text-green-500 mr-3"/> Sınırsız İlan Açabilme</li>
                        <li className="flex items-center text-slate-700"><lucide_react_1.CheckCircle className="h-5 w-5 text-green-500 mr-3"/> Profil Oluşturma</li>
                        <li className="flex items-center text-slate-700"><lucide_react_1.CheckCircle className="h-5 w-5 text-green-500 mr-3"/> Başvuruları Görüntüleme</li>
                    </ul>
                    <button disabled className="w-full mt-8 py-3.5 rounded-xl bg-white border-2 border-slate-200 text-slate-700 font-bold text-sm tracking-wide cursor-default">
                        Mevcut Plan
                    </button>
                    <p className="text-xs text-slate-400 mt-3">Süresiz ücretsiz</p>
                </div>

                {/* Premium Plan */}
                <div className="bg-white p-8 rounded-2xl border-2 border-indigo-500 shadow-xl relative z-10 transform md:-translate-y-4 text-center">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full">En Popüler</span>
                    </div>

                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-indigo-50 rounded-full">
                            <lucide_react_1.Crown className="w-8 h-8 text-indigo-600"/>
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900">Premium</h3>
                    <p className="text-slate-500 mt-2 text-sm">İşlerini büyütmek isteyenler için</p>

                    <div className="flex items-baseline justify-center mt-4">
                        <p className="text-5xl font-bold text-slate-900">
                            ₺{billingCycle === 'monthly' ? '300' : Math.round(3000 / 12)}
                        </p>
                        <p className="text-slate-500 ml-1">/ay</p>
                    </div>

                    <hr className="my-8 border-slate-100"/>

                    <ul className="space-y-5 text-left">
                        <li className="flex items-center text-slate-800 font-medium"><lucide_react_1.CheckCircle className="h-5 w-5 text-green-500 mr-3"/> Her Şey Dahil (Başlangıç)</li>
                        <li className="flex items-center text-slate-800 font-medium"><lucide_react_1.CheckCircle className="h-5 w-5 text-green-500 mr-3"/> 15 dk Erken Başvuru Hakkı</li>
                        <li className="flex items-center text-slate-800 font-medium"><lucide_react_1.CheckCircle className="h-5 w-5 text-green-500 mr-3"/> Başvurudan Gelir Kazanma</li>
                        <li className="flex items-center text-slate-800 font-medium"><lucide_react_1.CheckCircle className="h-5 w-5 text-green-500 mr-3"/> Acil İlan Açabilme</li>
                        <li className="flex items-center text-slate-800 font-medium"><lucide_react_1.CheckCircle className="h-5 w-5 text-green-500 mr-3"/> Bölgesel E-posta Bildirimleri</li>
                    </ul>

                    {user.membershipType === 'premium' ? (<button disabled className="w-full mt-10 py-4 rounded-xl bg-indigo-100 text-indigo-700 font-bold shadow-sm cursor-default">
                            Mevcut Planınız
                        </button>) : (<button onClick={function () { return handleSelectPlan('premium', billingCycle === 'monthly' ? 300 : 3000, billingCycle); }} className="w-full mt-10 py-4 rounded-xl bg-indigo-600 text-white font-bold shadow-lg hover:bg-indigo-700 transition transform hover:-translate-y-1">
                            Hemen Yükselt
                        </button>)}
                    <p className="text-xs text-slate-400 mt-3">Kredi kartı gerekmez</p>
                </div>

                {/* Premium Plus Plan */}
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition duration-300 relative z-0 text-center">
                    <div className="flex justify-center mb-4">
                        <lucide_react_1.Crown className="w-8 h-8 text-pink-500"/>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900">Premium +</h3>
                    <p className="text-slate-500 mt-2 text-sm">Profesyoneller için tam paket</p>

                    <div className="flex items-baseline justify-center mt-4">
                        <p className="text-5xl font-bold text-slate-900">
                            ₺{billingCycle === 'monthly' ? '500' : Math.round(5000 / 12)}
                        </p>
                        <p className="text-slate-500 ml-1">/ay</p>
                    </div>

                    <hr className="my-8 border-slate-100"/>

                    <ul className="space-y-5 text-left">
                        <li className="flex items-center text-slate-700 font-medium"><lucide_react_1.CheckCircle className="h-5 w-5 text-green-500 mr-3"/> Tüm Premium Özellikleri</li>
                        <li className="flex items-center text-slate-700 font-medium"><lucide_react_1.CheckCircle className="h-5 w-5 text-green-500 mr-3"/> 10 sn Öncelikli Bildirim</li>
                        <li className="flex items-center text-slate-700 font-medium"><lucide_react_1.CheckCircle className="h-5 w-5 text-green-500 mr-3"/> Başvurularda Üstte Çıkma</li>
                        <li className="flex items-center text-slate-700 font-medium"><lucide_react_1.CheckCircle className="h-5 w-5 text-green-500 mr-3"/> Adliye Filtreli E-posta</li>
                        <li className="flex items-center text-slate-700 font-medium"><lucide_react_1.CheckCircle className="h-5 w-5 text-green-500 mr-3"/> Para İadesi Garantisi</li>
                    </ul>

                    {user.membershipType === 'premium_plus' ? (<button disabled className="w-full mt-10 py-4 rounded-xl bg-slate-100 text-slate-500 font-bold border border-slate-200 cursor-default">
                            Mevcut Planınız
                        </button>) : (<button onClick={function () { return handleSelectPlan('premium_plus', billingCycle === 'monthly' ? 500 : 5000, billingCycle); }} className="w-full mt-10 py-4 rounded-xl bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-400 font-bold transition transform hover:-translate-y-1">
                            Hemen Yükselt
                        </button>)}
                    <p className="text-xs text-slate-400 mt-3">Kredi kartı gerekmez</p>
                </div>
            </div>
        </div>);
};
exports.PremiumPage = PremiumPage;
exports.default = exports.PremiumPage;
