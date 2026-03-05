import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Shield, Clock, Bell, Users, FileText } from 'lucide-react';
import SEO from '../components/SEO';

const HowItWorksPage = () => {
    return (
        <main className="min-h-screen bg-slate-50 flex flex-col">
            <SEO
                title="Nas─▒l ├çal─▒┼ş─▒r? - AvukatA─ş─▒ ─░l D─▒┼ş─▒ Tevkil Sistemi"
                description="AvukatA─ş─▒ ile il d─▒┼ş─▒ tevkil ve duru┼şma g├Ârevlendirmesi nas─▒l yap─▒l─▒r? Avukatlar i├ğin i┼ş birli─şi platformu kullan─▒m rehberi."
                keywords="tevkil nas─▒l ├ğal─▒┼ş─▒r, avukat a─ş─▒ nedir, duru┼şma g├Ârevlendirme, il d─▒┼ş─▒ tevkil, avukat i┼ş birli─şi"
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
                        <header className="bg-primary-600 px-8 py-12 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-10"></div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 relative z-10">
                                AvukatAgi.net ÔÇô ─░l D─▒┼ş─▒ Tevkil G├Ârevlendirme Sistemi Nas─▒l ├çal─▒┼ş─▒r?
                            </h1>
                            <p className="text-primary-100 text-lg max-w-2xl mx-auto relative z-10">
                                ─░l d─▒┼ş─▒ tevkil i┼şlemlerinizi h─▒zl─▒, g├╝venilir ve profesyonel bir yap─▒ya kavu┼şturun.
                            </p>
                        </header>

                        <div className="p-8 md:p-12 space-y-12">

                            {/* Intro */}
                            <section className="prose prose-slate max-w-none">
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    T├╝rkiye genelindeki avukatlar─▒ tek platformda bulu┼şturan <strong>AvukatAgi.net</strong>, il d─▒┼ş─▒ tevkil i┼şlemlerini h─▒zl─▒, g├╝venilir ve profesyonel bir yap─▒ya kavu┼şturur.
                                    Sistem; i┼ş y├╝k├╝n├╝z├╝ azaltmak, zaman kayb─▒n─▒ ortadan kald─▒rmak ve do─şru avukata en k─▒sa s├╝rede ula┼şman─▒z─▒ sa─şlamak i├ğin tasarlanm─▒┼şt─▒r.
                                </p>
                                <p className="font-medium text-slate-700">
                                    A┼şa─ş─▒da AvukatAgi.netÔÇÖin i┼şleyi┼şini ad─▒m ad─▒m bulabilirsiniz.
                                </p>
                            </section>

                            {/* Steps */}
                            <div className="space-y-12">

                                {/* Step 1 */}
                                <section className="flex flex-col md:flex-row gap-6" aria-labelledby="step-1-title">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xl">1</div>
                                    </div>
                                    <div>
                                        <h2 id="step-1-title" className="text-xl font-bold text-slate-900 mb-3 flex items-center">
                                            ├£yeli─şinizi Olu┼şturun ve Sisteme Giri┼ş Yap─▒n
                                        </h2>
                                        <p className="text-slate-600 mb-4">
                                            AvukatAgi.netÔÇÖe kay─▒t olmak son derece kolayd─▒r.
                                            Kay─▒t formunu doldurup SMS ve e-posta do─şrulamas─▒n─▒ tamamlad─▒─ş─▒n─▒z anda profiliniz otomatik olarak aktif hale gelir ve t├╝m panel ├Âzelliklerine eri┼şim sa─şlan─▒r.
                                        </p>
                                        <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-start">
                                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                                            <p className="text-sm text-green-800 font-medium">
                                                Bu sayede, herhangi bir manuel onay s├╝reci beklemeden platformu hemen kullanmaya ba┼şlayabilirsiniz.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* Step 2 */}
                                <section className="flex flex-col md:flex-row gap-6" aria-labelledby="step-2-title">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xl">2</div>
                                    </div>
                                    <div>
                                        <h2 id="step-2-title" className="text-xl font-bold text-slate-900 mb-3 flex items-center">
                                            ─░l D─▒┼ş─▒ Tevkil ve Duru┼şma ─░┼şlemleri ─░├ğin G├Ârev Vermek (Tamamen ├£cretsiz)
                                        </h2>
                                        <p className="text-slate-600 mb-4">
                                            AvukatAgi.net, il d─▒┼ş─▒ tevkil i┼şlemlerinizi h─▒zl─▒ ┼şekilde ├ğ├Âzmeniz i├ğin g├╝├ğl├╝ bir g├Ârevlendirme altyap─▒s─▒ sunar.
                                        </p>
                                        <ul className="space-y-2 mb-4 text-slate-600 list-disc pl-5">
                                            <li>G├Ârevlendirme Panelinden yeni g├Ârev olu┼şturun,</li>
                                            <li>Adliye, tarih ve g├Ârev detaylar─▒n─▒ ekleyin,</li>
                                            <li>ÔÇ£G├Ârev Olu┼şturÔÇØ butonuna t─▒klay─▒n.</li>
                                        </ul>
                                        <p className="text-slate-600 mb-4">
                                            G├Âreviniz an─▒nda sisteme d├╝┼şer ve ilgili adliyede g├Ârev almak isteyen Premium avukatlara bildirilir.
                                            Avukatlar─▒n ba┼şvuru yapabilmesi i├ğin tan─▒nan s├╝re <strong>15 dakikad─▒r</strong>.
                                            S├╝re doldu─şunda ba┼şvuran avukatlar─▒ g├Ârebilir ve tek t─▒kla g├Ârevlendirme yapabilirsiniz.
                                        </p>
                                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-bold">
                                            G├Ârev vermek her zaman ├╝cretsizdir.
                                        </div>
                                    </div>
                                </section>

                                {/* Step 3 */}
                                <section className="flex flex-col md:flex-row gap-6" aria-labelledby="step-3-title">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xl">3</div>
                                    </div>
                                    <div>
                                        <h2 id="step-3-title" className="text-xl font-bold text-slate-900 mb-3 flex items-center">
                                            G├Ârev Almak ─░├ğin Premium ├£yelik Gereklidir
                                        </h2>
                                        <p className="text-slate-600 mb-4">
                                            AvukatAgi.netÔÇÖte g├Ârev alabilmek i├ğin Premium veya Premium+ ├╝yeliklerden birine sahip olman─▒z yeterlidir.
                                        </p>
                                        <p className="text-slate-700 font-medium mb-2">Premium ├╝yeler:</p>
                                        <ul className="space-y-2 mb-4 text-slate-600 list-disc pl-5">
                                            <li>Se├ğtikleri adliyelerde yeni g├Ârev a├ğ─▒ld─▒─ş─▒nda an─▒nda bilgilendirilir,</li>
                                            <li>15 dakikal─▒k ba┼şvuru s├╝resi i├ğinde g├Âreve ba┼şvuru g├Ânderebilir.</li>
                                        </ul>
                                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                                            <p className="text-sm text-slate-600 italic">
                                                Bu yap─▒, sadece ger├ğekten g├Ârev almak isteyen avukatlar─▒n sisteme dahil edilmesini sa─şlayarak, daha kaliteli ve g├╝venilir bir i┼ş payla┼ş─▒m a─ş─▒ olu┼şturur.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* Step 4 */}
                                <section className="flex flex-col md:flex-row gap-6" aria-labelledby="step-4-title">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xl">4</div>
                                    </div>
                                    <div>
                                        <h2 id="step-4-title" className="text-xl font-bold text-slate-900 mb-3 flex items-center">
                                            G├Ârevlendirme Durumu Y├Ânetimi
                                        </h2>
                                        <p className="text-slate-600 mb-4">
                                            G├Ârev almak i├ğin ayr─▒ca bir i┼şlem yapman─▒za gerek yoktur.
                                            Premium ├╝yeli─şiniz aktif oldu─şu s├╝rece g├Ârevlendirme durumunuz a├ğ─▒k ise:
                                        </p>
                                        <ul className="space-y-2 mb-4 text-slate-600 list-disc pl-5">
                                            <li>Se├ğti─şiniz adliyelerde g├Ârev olu┼şturuldu─şunda bildirim al─▒rs─▒n─▒z,</li>
                                            <li>Uygun oldu─şunuz g├Ârevlere h─▒zl─▒ ┼şekilde ba┼şvuru yapabilirsiniz.</li>
                                        </ul>
                                        <p className="text-slate-600">
                                            Dilerseniz g├Ârevlendirme durumunu panel ├╝zerinden anl─▒k olarak a├ğ─▒p kapatabilirsiniz.
                                        </p>
                                    </div>
                                </section>

                                {/* Step 5 */}
                                <section className="flex flex-col md:flex-row gap-6" aria-labelledby="step-5-title">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xl">5</div>
                                    </div>
                                    <div>
                                        <h2 id="step-5-title" className="text-xl font-bold text-slate-900 mb-3 flex items-center">
                                            Yeni G├Ârev Olu┼şturma S├╝reci
                                        </h2>
                                        <p className="text-slate-600 mb-4">
                                            Platformda g├Ârev olu┼şturmak hem kolay hem de dakikalar i├ğinde sonu├ğ verir:
                                        </p>
                                        <ol className="space-y-2 mb-4 text-slate-600 list-decimal pl-5">
                                            <li>G├Ârevlendirme Paneline giri┼ş yap─▒n.</li>
                                            <li>ÔÇ£Yeni G├Ârev VerÔÇØ b├Âl├╝m├╝n├╝ a├ğ─▒n.</li>
                                            <li>G├Ârev detaylar─▒n─▒ girin.</li>
                                            <li>ÔÇ£G├Ârev Olu┼şturÔÇØ butonuna t─▒klay─▒n.</li>
                                        </ol>
                                        <p className="text-slate-600">
                                            G├Ârev sistem taraf─▒ndan yay─▒nlan─▒r ve avukatlardan gelen ba┼şvurular 15 dakika i├ğinde toplan─▒r.
                                        </p>
                                    </div>
                                </section>

                                {/* Step 6 */}
                                <section className="flex flex-col md:flex-row gap-6" aria-labelledby="step-6-title">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-xl">6</div>
                                    </div>
                                    <div>
                                        <h2 id="step-6-title" className="text-xl font-bold text-slate-900 mb-3 flex items-center">
                                            G├Ârev Bildirimleri
                                        </h2>
                                        <p className="text-slate-600 mb-4">
                                            Se├ğti─şiniz adliyelerde g├Ârev olu┼şturuldu─şunda Premium ├╝yeler:
                                        </p>
                                        <div className="flex gap-4 mb-4">
                                            <div className="flex items-center bg-slate-100 px-3 py-2 rounded-lg text-slate-700">
                                                <Bell className="h-4 w-4 mr-2" /> Mobil bildirim
                                            </div>
                                            <div className="flex items-center bg-slate-100 px-3 py-2 rounded-lg text-slate-700">
                                                <FileText className="h-4 w-4 mr-2" /> E-posta bildirimi
                                            </div>
                                        </div>
                                        <p className="text-slate-600">
                                            ile an─▒nda haberdar edilir.
                                            Bu sayede, tevkil ve duru┼şma g├Ârevlerini ka├ğ─▒rma riskiniz ortadan kalkar ve t├╝m i┼şlerinizi tek bir platform ├╝zerinden y├Ânetebilirsiniz.
                                        </p>
                                    </div>
                                </section>

                            </div>

                            {/* Why Us */}
                            <section className="bg-slate-50 rounded-2xl p-8 mt-12" aria-labelledby="why-us-title">
                                <h2 id="why-us-title" className="text-2xl font-bold text-slate-900 mb-6 text-center">Neden AvukatAgi.net?</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[
                                        "H─▒zl─▒ tevkil ├ğ├Âz├╝m├╝",
                                        "G├╝venilir avukat a─ş─▒",
                                        "T├╝rkiye genelinde anl─▒k g├Ârev bilgilendirmesi",
                                        "├£cretsiz g├Ârev verme imk├ón─▒",
                                        "Premium ├╝yeler i├ğin y├╝ksek i┼ş alma potansiyeli"
                                    ].map((item, index) => (
                                        <div key={index} className="flex items-center bg-white p-4 rounded-xl shadow-sm">
                                            <CheckCircle className="h-5 w-5 text-primary-600 mr-3 flex-shrink-0" />
                                            <span className="text-slate-700 font-medium">{item}</span>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-center text-slate-600 mt-8 font-medium">
                                    AvukatAgi.net, avukatlar─▒n il d─▒┼ş─▒ tevkil s├╝re├ğlerini modern, d├╝zenli ve tamamen dijital hale getiren profesyonel bir sistemdir.
                                </p>
                            </section>

                            {/* CTA */}
                            <div className="text-center pt-8">
                                <Link to="/register" className="inline-flex items-center px-8 py-4 bg-primary-600 text-white rounded-xl font-bold text-lg hover:bg-primary-700 transition-all shadow-lg hover:shadow-primary-500/30">
                                    Hemen ├£cretsiz ├£ye Ol
                                    <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />
                                </Link>
                            </div>

                        </div>
                    </div>
                </article>
            </div>
        </main>
    );
};

export default HowItWorksPage;
