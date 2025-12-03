"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var lucide_react_1 = require("lucide-react");
var SEO_1 = require("../components/SEO");
var AboutPage = function () {
    return (<main className="min-h-screen bg-slate-50 flex flex-col">
            <SEO_1.default title="Hakkımızda - AvukatAğı" description="AvukatAğı.net, avukatların il dışı tevkil ve duruşma süreçlerini yönettiği profesyonel bir dijital platformdur. Misyonumuz, vizyonumuz ve değerlerimiz." keywords="avukat ağı hakkımızda, tevkil platformu, avukat iş birliği, hukuk teknolojileri, avukat görevlendirme"/>

            <div className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <article className="max-w-4xl mx-auto">

                    <nav className="mb-8" aria-label="Breadcrumb">
                        <react_router_dom_1.Link to="/" className="inline-flex items-center text-slate-600 hover:text-primary-600 transition-colors">
                            <lucide_react_1.ArrowLeft className="h-5 w-5 mr-2"/>
                            Ana Sayfaya Dön
                        </react_router_dom_1.Link>
                    </nav>

                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                        {/* Header */}
                        <header className="bg-slate-900 px-8 py-16 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-5"></div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

                            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10">
                                Hakkımızda
                            </h1>
                            <p className="text-slate-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed relative z-10">
                                AvukatAgi.net, Türkiye’deki avukatların il dışı tevkil ve duruşma takip süreçlerini daha hızlı, güvenilir ve sistemli bir şekilde yönetebilmesi için tasarlanmış profesyonel bir dijital platformdur.
                            </p>
                        </header>

                        <div className="p-8 md:p-12 space-y-16">

                            {/* Intro */}
                            <section className="prose prose-slate max-w-none">
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    Amacımız, meslektaşlar arasında uzun yıllardır bireysel iletişimle yürütülen görevlendirme sürecini modern teknolojilerle birleştirerek şeffaf, adil ve kolay erişilebilir bir yapıya dönüştürmektir.
                                </p>
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    Platformumuz, yalnızca avukat ve katiplerin kayıt olabildiği kapalı bir ekosistem olup, her aşamada Avukatlık Kanunu'na uygun şekilde geliştirilmiştir.
                                </p>
                            </section>

                            {/* Mission & Vision */}
                            <div className="grid md:grid-cols-2 gap-8">
                                <section className="bg-primary-50 rounded-2xl p-8 border border-primary-100">
                                    <div className="flex items-center mb-4">
                                        <div className="bg-primary-100 p-3 rounded-lg mr-4">
                                            <lucide_react_1.Target className="h-6 w-6 text-primary-600"/>
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-900">Misyonumuz</h2>
                                    </div>
                                    <ul className="space-y-3 text-slate-700">
                                        <li className="flex items-start">
                                            <lucide_react_1.CheckCircle className="h-5 w-5 text-primary-500 mr-2 mt-0.5 flex-shrink-0"/>
                                            Avukatların şehir dışı adliye işlemlerinde hızlı ve güvenilir şekilde destek bulmasını sağlamak
                                        </li>
                                        <li className="flex items-start">
                                            <lucide_react_1.CheckCircle className="h-5 w-5 text-primary-500 mr-2 mt-0.5 flex-shrink-0"/>
                                            Duruşma ve tevkil süreçlerini dijitalleştirerek hataları en aza indirmek
                                        </li>
                                        <li className="flex items-start">
                                            <lucide_react_1.CheckCircle className="h-5 w-5 text-primary-500 mr-2 mt-0.5 flex-shrink-0"/>
                                            Zaman kaybını ortadan kaldırmak ve mesleki dayanışmayı güçlendirmek
                                        </li>
                                    </ul>
                                </section>

                                <section className="bg-secondary-50 rounded-2xl p-8 border border-secondary-100">
                                    <div className="flex items-center mb-4">
                                        <div className="bg-secondary-100 p-3 rounded-lg mr-4">
                                            <lucide_react_1.Eye className="h-6 w-6 text-secondary-600"/>
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-900">Vizyonumuz</h2>
                                    </div>
                                    <ul className="space-y-3 text-slate-700">
                                        <li className="flex items-start">
                                            <lucide_react_1.CheckCircle className="h-5 w-5 text-secondary-500 mr-2 mt-0.5 flex-shrink-0"/>
                                            Türkiye'deki tüm adliyelerde avukatların birbirine en kısa sürede ulaşabildiği bir ağ oluşturmak
                                        </li>
                                        <li className="flex items-start">
                                            <lucide_react_1.CheckCircle className="h-5 w-5 text-secondary-500 mr-2 mt-0.5 flex-shrink-0"/>
                                            Dijitalleşmiş, şeffaf ve adalet odaklı bir görevlendirme ağı kurmak
                                        </li>
                                        <li className="flex items-start">
                                            <lucide_react_1.CheckCircle className="h-5 w-5 text-secondary-500 mr-2 mt-0.5 flex-shrink-0"/>
                                            Meslektaş dayanışmasını güçlendiren en kapsamlı tevkil platformu olmak
                                        </li>
                                    </ul>
                                </section>
                            </div>

                            {/* Why Us */}
                            <section aria-labelledby="why-us-title">
                                <h2 id="why-us-title" className="text-3xl font-bold text-slate-900 mb-8 text-center">Neden AvukatAgi.net?</h2>
                                <div className="grid md:grid-cols-2 gap-6">

                                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-center mb-3">
                                            <lucide_react_1.Zap className="h-6 w-6 text-yellow-500 mr-3"/>
                                            <h3 className="text-lg font-bold text-slate-900">Hızlı ve Modern Görevlendirme Altyapısı</h3>
                                        </div>
                                        <p className="text-slate-600 text-sm leading-relaxed">
                                            Şehir dışı tevkil ihtiyaçlarınızı birkaç dakika içinde çözen otomasyon yapısı ile duruşma ve takip işlerinizi zahmetsizce organize edebilirsiniz.
                                        </p>
                                    </div>

                                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-center mb-3">
                                            <lucide_react_1.Lock className="h-6 w-6 text-slate-700 mr-3"/>
                                            <h3 className="text-lg font-bold text-slate-900">Tamamen Avukatlara Özel Kapalı Sistem</h3>
                                        </div>
                                        <p className="text-slate-600 text-sm leading-relaxed">
                                            Platform yalnızca avukat ve katiplerin erişimine açıktır. Böylece hem güvenlik hem de mesleki hassasiyet korunur.
                                        </p>
                                    </div>

                                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-center mb-3">
                                            <lucide_react_1.CheckCircle className="h-6 w-6 text-green-500 mr-3"/>
                                            <h3 className="text-lg font-bold text-slate-900">Ücretsiz Görev Vermek – Kolay Yönetim</h3>
                                        </div>
                                        <p className="text-slate-600 text-sm leading-relaxed">
                                            AvukatAgi.net’te görevlendirme açmak tamamen ücretsizdir. Görev oluşturduğunuz anda ilgili adliyelerde bulunan Premium avukatlara bildirim gider ve 15 dakika içinde başvurular toplanır.
                                        </p>
                                    </div>

                                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-center mb-3">
                                            <lucide_react_1.ShieldCheck className="h-6 w-6 text-primary-600 mr-3"/>
                                            <h3 className="text-lg font-bold text-slate-900">Premium Üyelik ile Görev Alma İmkanı</h3>
                                        </div>
                                        <p className="text-slate-600 text-sm leading-relaxed">
                                            Görev almak isteyen avukatlar için Premium ve Premium+ üyelik modelleriyle yüksek iş fırsatı sunulur. Seçtiğiniz adliyelerde yeni görev oluşturulduğunda anında bildirim alır ve hızlıca başvurabilirsiniz.
                                        </p>
                                    </div>

                                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow md:col-span-2">
                                        <div className="flex items-center mb-3">
                                            <lucide_react_1.Scale className="h-6 w-6 text-indigo-500 mr-3"/>
                                            <h3 className="text-lg font-bold text-slate-900">Şeffaf, Adil ve Güvenilir İşleyiş</h3>
                                        </div>
                                        <p className="text-slate-600 text-sm leading-relaxed">
                                            Tüm işlemler sistem tarafından otomatik ve kayıtlı şekilde yürütülür. Görev süreçleri net, düzenli ve izlenebilir yapıdadır.
                                        </p>
                                    </div>

                                </div>
                            </section>

                            {/* Legal Compliance Summary */}
                            <section className="bg-slate-900 text-white rounded-2xl p-8 md:p-12 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                                <div className="relative z-10">
                                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                                        <lucide_react_1.Scale className="h-6 w-6 mr-3 text-primary-400"/>
                                        Hukuka Uygunluk İlkeleri
                                    </h2>
                                    <p className="text-slate-300 mb-6">
                                        AvukatAgi.net, Avukatlık Kanunu'na tamamen uygun bir yapıda geliştirilmiştir. Platformumuz:
                                    </p>
                                    <div className="grid sm:grid-cols-2 gap-4 mb-8">
                                        <div className="flex items-center bg-white/10 p-3 rounded-lg">
                                            <lucide_react_1.ShieldCheck className="h-5 w-5 text-green-400 mr-3"/> Avukatlara iş sağlamaz
                                        </div>
                                        <div className="flex items-center bg-white/10 p-3 rounded-lg">
                                            <lucide_react_1.ShieldCheck className="h-5 w-5 text-green-400 mr-3"/> Müvekkil yönlendirmesi yapmaz
                                        </div>
                                        <div className="flex items-center bg-white/10 p-3 rounded-lg">
                                            <lucide_react_1.ShieldCheck className="h-5 w-5 text-green-400 mr-3"/> Ücret karşılığı dava devri yapmaz
                                        </div>
                                        <div className="flex items-center bg-white/10 p-3 rounded-lg">
                                            <lucide_react_1.ShieldCheck className="h-5 w-5 text-green-400 mr-3"/> Komisyon oluşturmaz
                                        </div>
                                    </div>
                                    <p className="text-slate-300 text-sm">
                                        Sunduğumuz hizmet, yalnızca avukatların sahip oldukları işlerde şehir dışı destek almasını sağlayan teknik bir çözümdür.
                                    </p>
                                    <div className="mt-6">
                                        <react_router_dom_1.Link to="/yasal-mevzuat" className="text-primary-300 hover:text-white font-medium underline underline-offset-4">
                                            Yasal Mevzuat Sayfasını İncele &rarr;
                                        </react_router_dom_1.Link>
                                    </div>
                                </div>
                            </section>

                            {/* Who We Are & Goal */}
                            <div className="grid md:grid-cols-2 gap-12">
                                <section>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                                        <lucide_react_1.Users className="h-6 w-6 mr-2 text-primary-600"/>
                                        Biz Kimiz?
                                    </h2>
                                    <p className="text-slate-600 leading-relaxed mb-4">
                                        AvukatAgi.net; yazılım geliştiriciler, hukuk danışmanları ve deneyimli avukatlardan oluşan bir ekip tarafından kurulmuş; teknolojiyi meslektaş dayanışmasıyla birleştirmeyi hedefleyen yenilikçi bir projedir.
                                    </p>
                                    <p className="text-slate-600 leading-relaxed">
                                        Sürekli güncellenen altyapımız ile her geçen gün daha hızlı, daha güvenilir ve daha kapsamlı bir tevkil ağı oluşturmak için çalışıyoruz.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                                        <lucide_react_1.Globe className="h-6 w-6 mr-2 text-primary-600"/>
                                        Hedefimiz
                                    </h2>
                                    <p className="text-slate-600 leading-relaxed mb-4">
                                        Türkiye’nin her adliyesinde görev veren ve görev alan avukatları tek çatı altında buluşturarak, şehir dışı işlemlerde kolaylaştırıcı, güvenilir ve modern bir dijital çözüm sunmak.
                                    </p>
                                    <p className="text-slate-600 leading-relaxed">
                                        Uzun vadede ise avukatların iş akışlarını hızlandıran ve verimliliği artıran tüm dijital hukuk çözümlerinin merkezi haline gelmek.
                                    </p>
                                </section>
                            </div>

                        </div>
                    </div>
                </article>
            </div>
        </main>);
};
exports.default = AboutPage;
