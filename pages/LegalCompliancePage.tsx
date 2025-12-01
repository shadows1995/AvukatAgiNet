import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Scale, ShieldCheck, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import SEO from '../components/SEO';

const LegalCompliancePage = () => {
    return (
        <main className="min-h-screen bg-slate-50 flex flex-col">
            <SEO
                title="Yasal Mevzuat ve Hukuki Uygunluk - AvukatAğı"
                description="AvukatAğı'nın Avukatlık Kanunu'na uygunluğu, tevkil yetkisi ve komisyonculuk yasağına uyumu hakkında detaylı bilgilendirme."
                keywords="avukatlık kanunu, tevkil yetkisi, komisyonculuk yasağı, avukat ağı yasal mı, hukuki uygunluk"
            />

            <div className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <article className="max-w-4xl mx-auto">

                    <nav className="mb-8" aria-label="Breadcrumb">
                        <Link to="/" className="inline-flex items-center text-slate-600 hover:text-primary-600 transition-colors">
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Ana Sayfaya Dön
                        </Link>
                    </nav>

                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                        <header className="bg-slate-900 px-8 py-12 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-5"></div>
                            <div className="flex justify-center mb-6">
                                <div className="bg-white/10 p-4 rounded-full backdrop-blur-sm">
                                    <Scale className="h-12 w-12 text-primary-400" />
                                </div>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 relative z-10">
                                Yasal Mevzuat ve Hukuki Uygunluk
                            </h1>
                            <p className="text-slate-300 text-lg max-w-2xl mx-auto relative z-10">
                                AvukatAgi.net, yalnızca avukatların kendi müvekkillerine ait mevcut işleri, başka bir avukata usulüne uygun şekilde tevkil edebilmesine teknik bir kolaylık sağlar.
                            </p>
                        </header>

                        <div className="p-8 md:p-12 space-y-12">

                            {/* Section 1 */}
                            <section aria-labelledby="section-1-title">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">1</div>
                                    </div>
                                    <div>
                                        <h2 id="section-1-title" className="text-xl font-bold text-slate-900 mb-4">
                                            Avukatlık Kanunu Madde 48 Kapsamında Komisyonculuk Yasağına Uyum
                                        </h2>
                                        <p className="text-slate-600 mb-4 leading-relaxed">
                                            Avukatlık Kanununun 48. maddesi, avukata ücret karşılığı “iş getirme”yi ve bu yönde aracılık yapılmasını açıkça yasaklamaktadır.
                                        </p>
                                        <div className="bg-slate-50 border-l-4 border-primary-500 p-4 rounded-r-lg mb-4">
                                            <p className="font-medium text-slate-800 mb-2">AvukatAgi.net’in işleyişi bu yasağın tamamen dışındadır:</p>
                                            <ul className="space-y-2 text-slate-600 list-disc pl-5">
                                                <li>Sistem, avukatlara yeni müvekkil veya yeni iş yaratmaz.</li>
                                                <li>AvukatAgi.net’teki tüm görevler, avukatların zaten üstlenmiş olduğu dava veya takip işlerinin başka bir yerde yürütülmesi için oluşturulan görevlendirmelerdir.</li>
                                                <li>Platform ücret karşılığı müvekkil temin etmez, komisyon almaz ve avukatlar arasında ticari bir iş devri sağlamaz.</li>
                                            </ul>
                                        </div>
                                        <p className="text-slate-600">
                                            Bu yönüyle AvukatAgi.net, Avukatlık Kanunu m. 48’in kapsamına girmemekte olup komisyonculuk yasağı ile çelişen herhangi bir faaliyette bulunmaz.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <hr className="border-slate-100" />

                            {/* Section 2 */}
                            <section aria-labelledby="section-2-title">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">2</div>
                                    </div>
                                    <div>
                                        <h2 id="section-2-title" className="text-xl font-bold text-slate-900 mb-4">
                                            Avukatlık Kanunu Madde 56 Kapsamında Tevkil Yetkisi
                                        </h2>
                                        <p className="text-slate-600 mb-4">
                                            Avukatlık Kanunu’nun 56. maddesi açıkça belirtmektedir:
                                        </p>
                                        <blockquote className="border-l-4 border-slate-300 pl-4 italic text-slate-700 mb-4 py-2 bg-slate-50 rounded-r-lg">
                                            “Avukatlar, vekâletnameye dayanarak üzerlerine aldıkları işi başka bir avukata tevkil edebilirler.”
                                        </blockquote>
                                        <p className="text-slate-600 mb-2">Bu hükme göre:</p>
                                        <ul className="space-y-2 text-slate-600 list-disc pl-5 mb-4">
                                            <li>Bir avukat, başka bir şehirde yapılması gereken işlem için bir meslektaşını görevlendirebilir.</li>
                                            <li>Tevkil edilen avukat, işi tevkil eden avukat adına yürütür.</li>
                                        </ul>
                                        <p className="text-slate-600">
                                            Bu süreç, avukatlar arasında tamamen hukuki yetkiye dayalı doğal bir iş bölümüdür.
                                            AvukatAgi.net’in sunduğu sistem tam olarak bu hukuki yetkinin dijital ortamda organize edilmiş şeklidir.
                                            Platform yalnızca avukatların bu yetkiyi daha hızlı, güvenli ve kayıt altında kullanmasına teknik bir kolaylık sağlar.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <hr className="border-slate-100" />

                            {/* Section 3 */}
                            <section aria-labelledby="section-3-title">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">3</div>
                                    </div>
                                    <div>
                                        <h2 id="section-3-title" className="text-xl font-bold text-slate-900 mb-4">
                                            Avukatlık Kanunu Madde 171 – İşi Sonuna Kadar Takip ve Başkasına Devretme
                                        </h2>
                                        <p className="text-slate-600 mb-4">
                                            Kanunun 171. maddesi, avukatın işi sonuna kadar takip etme yükümlülüğünü düzenler; ancak vekâletnamede yetki varsa işin başka bir avukata tevkil edilebileceğini de açıkça belirtir.
                                        </p>
                                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                                <h4 className="font-bold text-blue-800 mb-2 flex items-center"><ShieldCheck className="h-4 w-4 mr-2" /> Tevkil Eden</h4>
                                                <p className="text-sm text-blue-700">Müvekkiline karşı sorumluluğunu sürdürür.</p>
                                            </div>
                                            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                                <h4 className="font-bold text-green-800 mb-2 flex items-center"><CheckCircle className="h-4 w-4 mr-2" /> Tevkil Edilen</h4>
                                                <p className="text-sm text-green-700">Mesleki sorumluluk bilinciyle hareket eder.</p>
                                            </div>
                                        </div>
                                        <p className="text-slate-600">
                                            AvukatAgi.net, bu süreci kolaylaştıran bir araç olup tarafların hukuki sorumluluklarına hiçbir şekilde müdahale etmez.
                                            Platformumuz sadece iletişim, görev takibi ve başvuru toplama işlevi görür; hukuki ilişki yine iki avukat arasında kurulur.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <hr className="border-slate-100" />

                            {/* Section 4 */}
                            <section aria-labelledby="section-4-title">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">4</div>
                                    </div>
                                    <div>
                                        <h2 id="section-4-title" className="text-xl font-bold text-slate-900 mb-4">
                                            AvukatAgi.net’in Hukuki Niteliği
                                        </h2>
                                        <div className="bg-slate-50 p-6 rounded-xl mb-6">
                                            <h3 className="font-bold text-slate-800 mb-4">AvukatAgi.net;</h3>
                                            <div className="grid md:grid-cols-2 gap-3">
                                                <div className="flex items-center text-slate-600"><AlertCircle className="h-4 w-4 text-red-500 mr-2" /> Avukatlara iş sağlamaz</div>
                                                <div className="flex items-center text-slate-600"><AlertCircle className="h-4 w-4 text-red-500 mr-2" /> Müvekkil yönlendirme yapmaz</div>
                                                <div className="flex items-center text-slate-600"><AlertCircle className="h-4 w-4 text-red-500 mr-2" /> Ücret karşılığı dava devri sağlamaz</div>
                                                <div className="flex items-center text-slate-600"><AlertCircle className="h-4 w-4 text-red-500 mr-2" /> Aracı veya komisyoncu konumunda değildir</div>
                                            </div>
                                        </div>
                                        <p className="text-slate-600 mb-4">
                                            Sistem, tamamen avukatların kendi işlerini başka bir avukata yetkilendirebilmesini kolaylaştıran teknik bir platformdur.
                                        </p>
                                        <p className="text-slate-600">
                                            Görevlendirmelerin nasıl ve kime yapılacağına <strong>tek karar mercii tevkil eden avukattır</strong>.
                                            AvukatAgi.net yalnızca başvuruları toplar ve avukata seçim imkânı sunar.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <hr className="border-slate-100" />

                            {/* Section 5 */}
                            <section aria-labelledby="section-5-title">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">5</div>
                                    </div>
                                    <div>
                                        <h2 id="section-5-title" className="text-xl font-bold text-slate-900 mb-4">
                                            Haksız Rekabetin Önlenmesi
                                        </h2>
                                        <p className="text-slate-600 mb-4">
                                            Meslek kuralları doğrultusunda haksız rekabetin önlenmesi için AvukatAgi.net;
                                        </p>
                                        <ul className="grid md:grid-cols-2 gap-3 mb-4">
                                            {[
                                                "Yalnızca avukatların erişimine açık bir kapalı kullanıcı yapısı",
                                                "Adliyelere göre düzenlenmiş görev dağılım mantığı",
                                                "Sıralama ve puanlama algoritmalarında tarafsızlık",
                                                "Şeffaf ve kayıtlı bir operasyon akışı"
                                            ].map((item, i) => (
                                                <li key={i} className="flex items-center bg-white border border-slate-200 p-3 rounded-lg text-sm text-slate-700 shadow-sm">
                                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" /> {item}
                                                </li>
                                            ))}
                                        </ul>
                                        <p className="text-slate-600">
                                            Tüm amaç, şehir dışı adliye işlerinde meslektaş dayanışmasını güçlendirmek ve süreci objektif bir yapıda yürütmektir.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <hr className="border-slate-100" />

                            {/* Section 6 */}
                            <section aria-labelledby="section-6-title">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">6</div>
                                    </div>
                                    <div>
                                        <h2 id="section-6-title" className="text-xl font-bold text-slate-900 mb-4">
                                            AvukatAgi.net Neden Tamamen Yasaldır?
                                        </h2>
                                        <p className="text-slate-600 mb-6">
                                            Platformumuzun hukuken uygun olmasının temel nedenleri şunlardır:
                                        </p>
                                        <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                                            <ul className="space-y-3">
                                                {[
                                                    "İş yaratmaz; sadece var olan işin yürütülmesini kolaylaştırır.",
                                                    "Avukatlık Kanununun tevkile izin veren maddelerine dayanır.",
                                                    "Komisyonculuk yasağının kapsamında değildir.",
                                                    "Avukatlar arasında doğrudan hukuki işlem kurulmasına müdahale etmez.",
                                                    "Hiçbir şekilde müvekkil-avukat ilişkisinin tarafı değildir.",
                                                    "Teknik bir iletişim ve organizasyon aracıdır."
                                                ].map((item, i) => (
                                                    <li key={i} className="flex items-start text-slate-700">
                                                        <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <p className="text-slate-800 font-medium mt-6 text-center">
                                            Bu yapısı itibariyle AvukatAgi.net, avukatlık mesleğinin kanuni çerçevesi ile tamamen uyumludur.
                                        </p>
                                    </div>
                                </div>
                            </section>

                        </div>
                    </div>
                </article>
            </div>
        </main>
    );
};

export default LegalCompliancePage;
