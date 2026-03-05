import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Target, Eye, ShieldCheck, Users, Zap, Lock, CheckCircle, Scale, Globe } from 'lucide-react';
import SEO from '../components/SEO';

const AboutPage = () => {
    return (
        <main className="min-h-screen bg-slate-50 flex flex-col">
            <SEO
                title="Hakk─▒m─▒zda - AvukatA─ş─▒"
                description="AvukatA─ş─▒.net, avukatlar─▒n il d─▒┼ş─▒ tevkil ve duru┼şma s├╝re├ğlerini y├Ânetti─şi profesyonel bir dijital platformdur. Misyonumuz, vizyonumuz ve de─şerlerimiz."
                keywords="avukat a─ş─▒ hakk─▒m─▒zda, tevkil platformu, avukat i┼ş birli─şi, hukuk teknolojileri, avukat g├Ârevlendirme"
            />

            <div className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <article className="max-w-4xl mx-auto">

                    <nav className="mb-8" aria-label="Breadcrumb">
                        <Link to="/" className="inline-flex items-center text-slate-600 hover:text-primary-600 transition-colors">
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Ana Sayfaya D├Ân
                        </Link>
                    </nav>

                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                        {/* Header */}
                        <header className="bg-slate-900 px-8 py-16 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-5"></div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

                            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10">
                                Hakk─▒m─▒zda
                            </h1>
                            <p className="text-slate-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed relative z-10">
                                AvukatAgi.net, T├╝rkiyeÔÇÖdeki avukatlar─▒n il d─▒┼ş─▒ tevkil ve duru┼şma takip s├╝re├ğlerini daha h─▒zl─▒, g├╝venilir ve sistemli bir ┼şekilde y├Ânetebilmesi i├ğin tasarlanm─▒┼ş profesyonel bir dijital platformdur.
                            </p>
                        </header>

                        <div className="p-8 md:p-12 space-y-16">

                            {/* Intro */}
                            <section className="prose prose-slate max-w-none">
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    Amac─▒m─▒z, meslekta┼şlar aras─▒nda uzun y─▒llard─▒r bireysel ileti┼şimle y├╝r├╝t├╝len g├Ârevlendirme s├╝recini modern teknolojilerle birle┼ştirerek ┼şeffaf, adil ve kolay eri┼şilebilir bir yap─▒ya d├Ân├╝┼şt├╝rmektir.
                                </p>
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    Platformumuz, yaln─▒zca avukat ve katiplerin kay─▒t olabildi─şi kapal─▒ bir ekosistem olup, her a┼şamada Avukatl─▒k Kanunu'na uygun ┼şekilde geli┼ştirilmi┼ştir.
                                </p>
                            </section>

                            {/* Mission & Vision */}
                            <div className="grid md:grid-cols-2 gap-8">
                                <section className="bg-primary-50 rounded-2xl p-8 border border-primary-100">
                                    <div className="flex items-center mb-4">
                                        <div className="bg-primary-100 p-3 rounded-lg mr-4">
                                            <Target className="h-6 w-6 text-primary-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-900">Misyonumuz</h2>
                                    </div>
                                    <ul className="space-y-3 text-slate-700">
                                        <li className="flex items-start">
                                            <CheckCircle className="h-5 w-5 text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                                            Avukatlar─▒n ┼şehir d─▒┼ş─▒ adliye i┼şlemlerinde h─▒zl─▒ ve g├╝venilir ┼şekilde destek bulmas─▒n─▒ sa─şlamak
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle className="h-5 w-5 text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                                            Duru┼şma ve tevkil s├╝re├ğlerini dijitalle┼ştirerek hatalar─▒ en aza indirmek
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle className="h-5 w-5 text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                                            Zaman kayb─▒n─▒ ortadan kald─▒rmak ve mesleki dayan─▒┼şmay─▒ g├╝├ğlendirmek
                                        </li>
                                    </ul>
                                </section>

                                <section className="bg-secondary-50 rounded-2xl p-8 border border-secondary-100">
                                    <div className="flex items-center mb-4">
                                        <div className="bg-secondary-100 p-3 rounded-lg mr-4">
                                            <Eye className="h-6 w-6 text-secondary-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-900">Vizyonumuz</h2>
                                    </div>
                                    <ul className="space-y-3 text-slate-700">
                                        <li className="flex items-start">
                                            <CheckCircle className="h-5 w-5 text-secondary-500 mr-2 mt-0.5 flex-shrink-0" />
                                            T├╝rkiye'deki t├╝m adliyelerde avukatlar─▒n birbirine en k─▒sa s├╝rede ula┼şabildi─şi bir a─ş olu┼şturmak
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle className="h-5 w-5 text-secondary-500 mr-2 mt-0.5 flex-shrink-0" />
                                            Dijitalle┼şmi┼ş, ┼şeffaf ve adalet odakl─▒ bir g├Ârevlendirme a─ş─▒ kurmak
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle className="h-5 w-5 text-secondary-500 mr-2 mt-0.5 flex-shrink-0" />
                                            Meslekta┼ş dayan─▒┼şmas─▒n─▒ g├╝├ğlendiren en kapsaml─▒ tevkil platformu olmak
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
                                            <Zap className="h-6 w-6 text-yellow-500 mr-3" />
                                            <h3 className="text-lg font-bold text-slate-900">H─▒zl─▒ ve Modern G├Ârevlendirme Altyap─▒s─▒</h3>
                                        </div>
                                        <p className="text-slate-600 text-sm leading-relaxed">
                                            ┼Şehir d─▒┼ş─▒ tevkil ihtiya├ğlar─▒n─▒z─▒ birka├ğ dakika i├ğinde ├ğ├Âzen otomasyon yap─▒s─▒ ile duru┼şma ve takip i┼şlerinizi zahmetsizce organize edebilirsiniz.
                                        </p>
                                    </div>

                                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-center mb-3">
                                            <Lock className="h-6 w-6 text-slate-700 mr-3" />
                                            <h3 className="text-lg font-bold text-slate-900">Tamamen Avukatlara ├ûzel Kapal─▒ Sistem</h3>
                                        </div>
                                        <p className="text-slate-600 text-sm leading-relaxed">
                                            Platform yaln─▒zca avukat ve katiplerin eri┼şimine a├ğ─▒kt─▒r. B├Âylece hem g├╝venlik hem de mesleki hassasiyet korunur.
                                        </p>
                                    </div>

                                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-center mb-3">
                                            <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                                            <h3 className="text-lg font-bold text-slate-900">├£cretsiz G├Ârev Vermek ÔÇô Kolay Y├Ânetim</h3>
                                        </div>
                                        <p className="text-slate-600 text-sm leading-relaxed">
                                            AvukatAgi.netÔÇÖte g├Ârevlendirme a├ğmak tamamen ├╝cretsizdir. G├Ârev olu┼şturdu─şunuz anda ilgili adliyelerde bulunan Premium avukatlara bildirim gider ve 15 dakika i├ğinde ba┼şvurular toplan─▒r.
                                        </p>
                                    </div>

                                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-center mb-3">
                                            <ShieldCheck className="h-6 w-6 text-primary-600 mr-3" />
                                            <h3 className="text-lg font-bold text-slate-900">Premium ├£yelik ile G├Ârev Alma ─░mkan─▒</h3>
                                        </div>
                                        <p className="text-slate-600 text-sm leading-relaxed">
                                            G├Ârev almak isteyen avukatlar i├ğin Premium ve Premium+ ├╝yelik modelleriyle y├╝ksek i┼ş f─▒rsat─▒ sunulur. Se├ğti─şiniz adliyelerde yeni g├Ârev olu┼şturuldu─şunda an─▒nda bildirim al─▒r ve h─▒zl─▒ca ba┼şvurabilirsiniz.
                                        </p>
                                    </div>

                                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow md:col-span-2">
                                        <div className="flex items-center mb-3">
                                            <Scale className="h-6 w-6 text-indigo-500 mr-3" />
                                            <h3 className="text-lg font-bold text-slate-900">┼Şeffaf, Adil ve G├╝venilir ─░┼şleyi┼ş</h3>
                                        </div>
                                        <p className="text-slate-600 text-sm leading-relaxed">
                                            T├╝m i┼şlemler sistem taraf─▒ndan otomatik ve kay─▒tl─▒ ┼şekilde y├╝r├╝t├╝l├╝r. G├Ârev s├╝re├ğleri net, d├╝zenli ve izlenebilir yap─▒dad─▒r.
                                        </p>
                                    </div>

                                </div>
                            </section>

                            {/* Legal Compliance Summary */}
                            <section className="bg-slate-900 text-white rounded-2xl p-8 md:p-12 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                                <div className="relative z-10">
                                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                                        <Scale className="h-6 w-6 mr-3 text-primary-400" />
                                        Hukuka Uygunluk ─░lkeleri
                                    </h2>
                                    <p className="text-slate-300 mb-6">
                                        AvukatAgi.net, Avukatl─▒k Kanunu'na tamamen uygun bir yap─▒da geli┼ştirilmi┼ştir. Platformumuz:
                                    </p>
                                    <div className="grid sm:grid-cols-2 gap-4 mb-8">
                                        <div className="flex items-center bg-white/10 p-3 rounded-lg">
                                            <ShieldCheck className="h-5 w-5 text-green-400 mr-3" /> Avukatlara i┼ş sa─şlamaz
                                        </div>
                                        <div className="flex items-center bg-white/10 p-3 rounded-lg">
                                            <ShieldCheck className="h-5 w-5 text-green-400 mr-3" /> M├╝vekkil y├Ânlendirmesi yapmaz
                                        </div>
                                        <div className="flex items-center bg-white/10 p-3 rounded-lg">
                                            <ShieldCheck className="h-5 w-5 text-green-400 mr-3" /> ├£cret kar┼ş─▒l─▒─ş─▒ dava devri yapmaz
                                        </div>
                                        <div className="flex items-center bg-white/10 p-3 rounded-lg">
                                            <ShieldCheck className="h-5 w-5 text-green-400 mr-3" /> Komisyon olu┼şturmaz
                                        </div>
                                    </div>
                                    <p className="text-slate-300 text-sm">
                                        Sundu─şumuz hizmet, yaln─▒zca avukatlar─▒n sahip olduklar─▒ i┼şlerde ┼şehir d─▒┼ş─▒ destek almas─▒n─▒ sa─şlayan teknik bir ├ğ├Âz├╝md├╝r.
                                    </p>
                                    <div className="mt-6">
                                        <Link to="/yasal-mevzuat" className="text-primary-300 hover:text-white font-medium underline underline-offset-4">
                                            Yasal Mevzuat Sayfas─▒n─▒ ─░ncele &rarr;
                                        </Link>
                                    </div>
                                </div>
                            </section>

                            {/* Who We Are & Goal */}
                            <div className="grid md:grid-cols-2 gap-12">
                                <section>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                                        <Users className="h-6 w-6 mr-2 text-primary-600" />
                                        Biz Kimiz?
                                    </h2>
                                    <p className="text-slate-600 leading-relaxed mb-4">
                                        AvukatAgi.net; yaz─▒l─▒m geli┼ştiriciler, hukuk dan─▒┼şmanlar─▒ ve deneyimli avukatlardan olu┼şan bir ekip taraf─▒ndan kurulmu┼ş; teknolojiyi meslekta┼ş dayan─▒┼şmas─▒yla birle┼ştirmeyi hedefleyen yenilik├ği bir projedir.
                                    </p>
                                    <p className="text-slate-600 leading-relaxed">
                                        S├╝rekli g├╝ncellenen altyap─▒m─▒z ile her ge├ğen g├╝n daha h─▒zl─▒, daha g├╝venilir ve daha kapsaml─▒ bir tevkil a─ş─▒ olu┼şturmak i├ğin ├ğal─▒┼ş─▒yoruz.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                                        <Globe className="h-6 w-6 mr-2 text-primary-600" />
                                        Hedefimiz
                                    </h2>
                                    <p className="text-slate-600 leading-relaxed mb-4">
                                        T├╝rkiyeÔÇÖnin her adliyesinde g├Ârev veren ve g├Ârev alan avukatlar─▒ tek ├ğat─▒ alt─▒nda bulu┼şturarak, ┼şehir d─▒┼ş─▒ i┼şlemlerde kolayla┼şt─▒r─▒c─▒, g├╝venilir ve modern bir dijital ├ğ├Âz├╝m sunmak.
                                    </p>
                                    <p className="text-slate-600 leading-relaxed">
                                        Uzun vadede ise avukatlar─▒n i┼ş ak─▒┼şlar─▒n─▒ h─▒zland─▒ran ve verimlili─şi art─▒ran t├╝m dijital hukuk ├ğ├Âz├╝mlerinin merkezi haline gelmek.
                                    </p>
                                </section>
                            </div>

                        </div>
                    </div>
                </article>
            </div>
        </main>
    );
};

export default AboutPage;
