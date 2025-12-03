"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var lucide_react_1 = require("lucide-react");
var SEO_1 = require("../components/SEO");
var HowItWorksPage = function () {
    return (<main className="min-h-screen bg-slate-50 flex flex-col">
            <SEO_1.default title="Nasıl Çalışır? - AvukatAğı İl Dışı Tevkil Sistemi" description="AvukatAğı ile il dışı tevkil ve duruşma görevlendirmesi nasıl yapılır? Avukatlar için iş birliği platformu kullanım rehberi." keywords="tevkil nasıl çalışır, avukat ağı nedir, duruşma görevlendirme, il dışı tevkil, avukat iş birliği"/>

            <div className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <article className="max-w-4xl mx-auto">

                    <nav className="mb-8" aria-label="Breadcrumb">
                        <react_router_dom_1.Link to="/" className="inline-flex items-center text-slate-600 hover:text-primary-600 transition-colors">
                            <lucide_react_1.ArrowLeft className="h-5 w-5 mr-2"/>
                            Ana Sayfaya Dön
                        </react_router_dom_1.Link>
                    </nav>

                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                        <header className="bg-primary-600 px-8 py-12 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-10"></div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 relative z-10">
                                AvukatAgi.net – İl Dışı Tevkil Görevlendirme Sistemi Nasıl Çalışır?
                            </h1>
                            <p className="text-primary-100 text-lg max-w-2xl mx-auto relative z-10">
                                İl dışı tevkil işlemlerinizi hızlı, güvenilir ve profesyonel bir yapıya kavuşturun.
                            </p>
                        </header>

                        <div className="p-8 md:p-12 space-y-12">

                            {/* Intro */}
                            <section className="prose prose-slate max-w-none">
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    Türkiye genelindeki avukatları tek platformda buluşturan <strong>AvukatAgi.net</strong>, il dışı tevkil işlemlerini hızlı, güvenilir ve profesyonel bir yapıya kavuşturur.
                                    Sistem; iş yükünüzü azaltmak, zaman kaybını ortadan kaldırmak ve doğru avukata en kısa sürede ulaşmanızı sağlamak için tasarlanmıştır.
                                </p>
                                <p className="font-medium text-slate-700">
                                    Aşağıda AvukatAgi.net’in işleyişini adım adım bulabilirsiniz.
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
                                            Üyeliğinizi Oluşturun ve Sisteme Giriş Yapın
                                        </h2>
                                        <p className="text-slate-600 mb-4">
                                            AvukatAgi.net’e kayıt olmak son derece kolaydır.
                                            Kayıt formunu doldurup SMS ve e-posta doğrulamasını tamamladığınız anda profiliniz otomatik olarak aktif hale gelir ve tüm panel özelliklerine erişim sağlanır.
                                        </p>
                                        <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-start">
                                            <lucide_react_1.CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0"/>
                                            <p className="text-sm text-green-800 font-medium">
                                                Bu sayede, herhangi bir manuel onay süreci beklemeden platformu hemen kullanmaya başlayabilirsiniz.
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
                                            İl Dışı Tevkil ve Duruşma İşlemleri İçin Görev Vermek (Tamamen Ücretsiz)
                                        </h2>
                                        <p className="text-slate-600 mb-4">
                                            AvukatAgi.net, il dışı tevkil işlemlerinizi hızlı şekilde çözmeniz için güçlü bir görevlendirme altyapısı sunar.
                                        </p>
                                        <ul className="space-y-2 mb-4 text-slate-600 list-disc pl-5">
                                            <li>Görevlendirme Panelinden yeni görev oluşturun,</li>
                                            <li>Adliye, tarih ve görev detaylarını ekleyin,</li>
                                            <li>“Görev Oluştur” butonuna tıklayın.</li>
                                        </ul>
                                        <p className="text-slate-600 mb-4">
                                            Göreviniz anında sisteme düşer ve ilgili adliyede görev almak isteyen Premium avukatlara bildirilir.
                                            Avukatların başvuru yapabilmesi için tanınan süre <strong>15 dakikadır</strong>.
                                            Süre dolduğunda başvuran avukatları görebilir ve tek tıkla görevlendirme yapabilirsiniz.
                                        </p>
                                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-bold">
                                            Görev vermek her zaman ücretsizdir.
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
                                            Görev Almak İçin Premium Üyelik Gereklidir
                                        </h2>
                                        <p className="text-slate-600 mb-4">
                                            AvukatAgi.net’te görev alabilmek için Premium veya Premium+ üyeliklerden birine sahip olmanız yeterlidir.
                                        </p>
                                        <p className="text-slate-700 font-medium mb-2">Premium üyeler:</p>
                                        <ul className="space-y-2 mb-4 text-slate-600 list-disc pl-5">
                                            <li>Seçtikleri adliyelerde yeni görev açıldığında anında bilgilendirilir,</li>
                                            <li>15 dakikalık başvuru süresi içinde göreve başvuru gönderebilir.</li>
                                        </ul>
                                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                                            <p className="text-sm text-slate-600 italic">
                                                Bu yapı, sadece gerçekten görev almak isteyen avukatların sisteme dahil edilmesini sağlayarak, daha kaliteli ve güvenilir bir iş paylaşım ağı oluşturur.
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
                                            Görevlendirme Durumu Yönetimi
                                        </h2>
                                        <p className="text-slate-600 mb-4">
                                            Görev almak için ayrıca bir işlem yapmanıza gerek yoktur.
                                            Premium üyeliğiniz aktif olduğu sürece görevlendirme durumunuz açık ise:
                                        </p>
                                        <ul className="space-y-2 mb-4 text-slate-600 list-disc pl-5">
                                            <li>Seçtiğiniz adliyelerde görev oluşturulduğunda bildirim alırsınız,</li>
                                            <li>Uygun olduğunuz görevlere hızlı şekilde başvuru yapabilirsiniz.</li>
                                        </ul>
                                        <p className="text-slate-600">
                                            Dilerseniz görevlendirme durumunu panel üzerinden anlık olarak açıp kapatabilirsiniz.
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
                                            Yeni Görev Oluşturma Süreci
                                        </h2>
                                        <p className="text-slate-600 mb-4">
                                            Platformda görev oluşturmak hem kolay hem de dakikalar içinde sonuç verir:
                                        </p>
                                        <ol className="space-y-2 mb-4 text-slate-600 list-decimal pl-5">
                                            <li>Görevlendirme Paneline giriş yapın.</li>
                                            <li>“Yeni Görev Ver” bölümünü açın.</li>
                                            <li>Görev detaylarını girin.</li>
                                            <li>“Görev Oluştur” butonuna tıklayın.</li>
                                        </ol>
                                        <p className="text-slate-600">
                                            Görev sistem tarafından yayınlanır ve avukatlardan gelen başvurular 15 dakika içinde toplanır.
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
                                            Görev Bildirimleri
                                        </h2>
                                        <p className="text-slate-600 mb-4">
                                            Seçtiğiniz adliyelerde görev oluşturulduğunda Premium üyeler:
                                        </p>
                                        <div className="flex gap-4 mb-4">
                                            <div className="flex items-center bg-slate-100 px-3 py-2 rounded-lg text-slate-700">
                                                <lucide_react_1.Bell className="h-4 w-4 mr-2"/> Mobil bildirim
                                            </div>
                                            <div className="flex items-center bg-slate-100 px-3 py-2 rounded-lg text-slate-700">
                                                <lucide_react_1.FileText className="h-4 w-4 mr-2"/> E-posta bildirimi
                                            </div>
                                        </div>
                                        <p className="text-slate-600">
                                            ile anında haberdar edilir.
                                            Bu sayede, tevkil ve duruşma görevlerini kaçırma riskiniz ortadan kalkar ve tüm işlerinizi tek bir platform üzerinden yönetebilirsiniz.
                                        </p>
                                    </div>
                                </section>

                            </div>

                            {/* Why Us */}
                            <section className="bg-slate-50 rounded-2xl p-8 mt-12" aria-labelledby="why-us-title">
                                <h2 id="why-us-title" className="text-2xl font-bold text-slate-900 mb-6 text-center">Neden AvukatAgi.net?</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[
            "Hızlı tevkil çözümü",
            "Güvenilir avukat ağı",
            "Türkiye genelinde anlık görev bilgilendirmesi",
            "Ücretsiz görev verme imkânı",
            "Premium üyeler için yüksek iş alma potansiyeli"
        ].map(function (item, index) { return (<div key={index} className="flex items-center bg-white p-4 rounded-xl shadow-sm">
                                            <lucide_react_1.CheckCircle className="h-5 w-5 text-primary-600 mr-3 flex-shrink-0"/>
                                            <span className="text-slate-700 font-medium">{item}</span>
                                        </div>); })}
                                </div>
                                <p className="text-center text-slate-600 mt-8 font-medium">
                                    AvukatAgi.net, avukatların il dışı tevkil süreçlerini modern, düzenli ve tamamen dijital hale getiren profesyonel bir sistemdir.
                                </p>
                            </section>

                            {/* CTA */}
                            <div className="text-center pt-8">
                                <react_router_dom_1.Link to="/register" className="inline-flex items-center px-8 py-4 bg-primary-600 text-white rounded-xl font-bold text-lg hover:bg-primary-700 transition-all shadow-lg hover:shadow-primary-500/30">
                                    Hemen Ücretsiz Üye Ol
                                    <lucide_react_1.ArrowLeft className="ml-2 h-5 w-5 rotate-180"/>
                                </react_router_dom_1.Link>
                            </div>

                        </div>
                    </div>
                </article>
            </div>
        </main>);
};
exports.default = HowItWorksPage;
