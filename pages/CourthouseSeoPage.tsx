import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
    MapPin, Gavel, Briefcase, Clock, ShieldCheck, Bell,
    ArrowRight, CheckCircle, Building2, Plus, Minus
} from 'lucide-react';
import SEO from '../components/SEO';
import { supabase } from '../supabaseClient';
import { getSeoEntryBySlug, getCourthouseSlug } from '../data/seoData';

interface PublicJobPreview {
    job_id: string;
    title: string;
    courthouse: string;
    job_type: string;
    offered_fee: number;
    date: string;
    status: string;
}

const CourthouseSeoPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const entry = slug ? getSeoEntryBySlug(slug) : undefined;
    const [recentJobs, setRecentJobs] = useState<PublicJobPreview[]>([]);
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    useEffect(() => {
        if (!entry) return;
        const fetchRecent = async () => {
            try {
                let query = supabase
                    .from('jobs')
                    .select('job_id, title, courthouse, job_type, offered_fee, date, status')
                    .neq('status', 'cancelled')
                    .order('created_at', { ascending: false })
                    .limit(4);

                if (entry.type === 'courthouse' && entry.courthouse) {
                    query = query.eq('courthouse', entry.courthouse);
                } else {
                    query = query.eq('city', entry.city);
                }

                const { data } = await query;
                if (data) setRecentJobs(data as PublicJobPreview[]);
            } catch (e) {
                // Ignore public fetch errors silently
            }
        };
        fetchRecent();
    }, [entry?.slug]);

    if (!entry) {
        return <Navigate to="/adliyeler" replace />;
    }

    const isCity = entry.type === 'city';
    const displayName = isCity ? `${entry.city} Adliyeleri` : entry.courthouse!;
    const pageTitle = isCity
        ? `${entry.city} Tevkil Platformu — ${entry.city} Avukat Görev Paylaşımı | AvukatAğı`
        : `${entry.courthouse} Tevkil — ${entry.city} Avukat Görevlendirme | AvukatAğı`;
    const pageDescription = isCity
        ? `${entry.city} ili ve ilçelerindeki tüm adliyelerde duruşma, icra, haciz ve dosya inceleme için AvukatAğı üzerinden güvenle tevkil verin veya görev alın.`
        : `${entry.courthouse} (${entry.city}) için duruşma, icra işlemi, haciz ve dosya inceleme tevkil görevleri. Baro kayıtlı meslektaşlarla anında görev paylaşımı yapın.`;
    const canonicalUrl = `https://avukatagi.net/tevkil/${entry.slug}`;

    const localFaqs = [
        {
            question: `${displayName} için tevkil görevi nasıl oluşturulur?`,
            answer: `AvukatAğı'na ücretsiz üye olduktan sonra "Yeni Görev Oluştur" ekranından şehir olarak ${entry.city}${isCity ? '' : ` ve adliye olarak ${entry.courthouse}`} seçip tarih, saat, görev türü ve ücreti girerek saniyeler içinde ilan açabilirsiniz. Görev vermek tamamen ücretsizdir.`
        },
        {
            question: `${displayName} görevlerinden anlık bildirim nasıl alırım?`,
            answer: `Ayarlar > Görev Adliyeleriniz menüsünden ${isCity ? `${entry.city} ilindeki adliyeleri` : entry.courthouse} izleme listenize ekleyin. Bu adliyede yeni bir görev yayınlandığı saniye SMS, Telegram (@AvukatAgiBot) ve mobil bildirim ile ilk haberdar olan meslektaşlar arasında yer alırsınız.`
        },
        {
            question: `${displayName} için önerilen tevkil ücret alt sınırları nelerdir?`,
            answer: `AvukatAğı'nda meslek vakarına uygun şeffaf alt sınırlar uygulanır: Duruşma görevleri en az 900 TL, Haciz ve Dosya İnceleme 700 TL, İcra İşlemleri 600 TL ve Dilekçe sunumu 500 TL'den başlar. Platform hiçbir komisyon kesmez.`
        },
        {
            question: `${displayName} bölgesinde yetki belgesi süreci nasıl işler?`,
            answer: `15 dakikalık (Acil görevlerde 5 dk) başvuru süresi sonunda seçtiğiniz meslektaşın baro ili, baro sicil numarası, adresi ve iletişim bilgileri ekranınızda açılır. Avukatlık Kanunu m. 56 uyarınca yetki belgenizi düzenleyip WhatsApp/telefon üzerinden doğrudan iletebilirsiniz.`
        }
    ];

    const structuredData = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: 'https://avukatagi.net/' },
                    { '@type': 'ListItem', position: 2, name: 'Adliyeler', item: 'https://avukatagi.net/adliyeler' },
                    ...(isCity
                        ? [{ '@type': 'ListItem', position: 3, name: `${entry.city} Adliyeleri`, item: canonicalUrl }]
                        : [
                              { '@type': 'ListItem', position: 3, name: `${entry.city} Adliyeleri`, item: `https://avukatagi.net/tevkil/${entry.citySlug}` },
                              { '@type': 'ListItem', position: 4, name: entry.courthouse, item: canonicalUrl }
                          ])
                ]
            },
            {
                '@type': 'LegalService',
                name: `AvukatAğı — ${displayName} Tevkil Ağı`,
                description: pageDescription,
                url: canonicalUrl,
                areaServed: {
                    '@type': 'City',
                    name: entry.city
                },
                provider: {
                    '@type': 'Organization',
                    name: 'AvukatAğı',
                    url: 'https://avukatagi.net/'
                }
            },
            {
                '@type': 'FAQPage',
                mainEntity: localFaqs.map(f => ({
                    '@type': 'Question',
                    name: f.question,
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: f.answer
                    }
                }))
            }
        ]
    };

    const siblingCourthouses = entry.courthousesInCity.filter(ch => ch !== entry.courthouse);

    return (
        <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
            <SEO
                title={pageTitle}
                description={pageDescription}
                keywords={`${displayName} tevkil, ${entry.city} tevkil avukat, ${displayName} duruşma tevkil, ${entry.city} dosya inceleme, avukatağı`}
                canonicalUrl={canonicalUrl}
            />
            <Helmet>
                <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
            </Helmet>

            <div className="max-w-6xl mx-auto space-y-10">
                {/* Breadcrumb */}
                <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500" aria-label="Breadcrumb">
                    <Link to="/" className="hover:text-primary-600 transition">Ana Sayfa</Link>
                    <span>/</span>
                    <Link to="/adliyeler" className="hover:text-primary-600 transition">Adliyeler</Link>
                    <span>/</span>
                    {isCity ? (
                        <span className="font-semibold text-slate-800">{entry.city} Adliyeleri</span>
                    ) : (
                        <>
                            <Link to={`/tevkil/${entry.citySlug}`} className="hover:text-primary-600 transition">
                                {entry.city} Adliyeleri
                            </Link>
                            <span>/</span>
                            <span className="font-semibold text-slate-800">{entry.courthouse}</span>
                        </>
                    )}
                </nav>

                {/* Hero */}
                <header className="bg-gradient-to-br from-primary-900 via-primary-800 to-indigo-900 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>
                    <div className="relative z-10 max-w-3xl">
                        <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-primary-100 text-xs font-bold uppercase tracking-wider mb-4">
                            <MapPin className="w-4 h-4 mr-1.5" />
                            {entry.city} • Baro Kayıtlı Meslektaş Ağı
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
                            {displayName} Tevkil &amp; Avukat Görevlendirme Ağı
                        </h1>
                        <p className="text-primary-100 text-base md:text-lg leading-relaxed mb-8">
                            {isCity
                                ? `${entry.city} ilindeki tüm adliyelerde duruşma katılımı, icra işlemi, haciz ve dosya inceleme işlerinizi güvenilir meslektaşlarınıza dakikalar içinde devredin veya bölgenizdeki açık görevlere başvurarak ek gelir elde edin.`
                                : `${entry.courthouse} bünyesindeki duruşma, icra müdürlüğü, haciz, dosya inceleme ve kalem işlemleriniz için ${entry.city} bölgesindeki meslektaşlarınızla AvukatAğı güvencesiyle anında iş birliği yapın.`}
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                to="/register"
                                className="inline-flex items-center px-7 py-3.5 bg-white text-primary-900 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg"
                            >
                                Ücretsiz Kaydol (2 Ay Premium+)
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Link>
                            <Link
                                to="/create-job"
                                className="inline-flex items-center px-7 py-3.5 bg-primary-700/70 border border-primary-400/30 text-white rounded-xl font-bold hover:bg-primary-700 transition"
                            >
                                <Briefcase className="w-5 h-5 mr-2" />
                                Ücretsiz Görev Oluştur
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Service Categories */}
                <section aria-labelledby="services-heading">
                    <h2 id="services-heading" className="text-2xl font-bold text-slate-900 mb-6">
                        {displayName} Üzerinden Yapabileceğiniz İşlemler
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                                <Gavel className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Duruşma &amp; Mahkeme Temsili</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {displayName} Hukuk ve Ceza mahkemelerindeki çakışan veya şehir dışı duruşmalarınız için yetki belgesiyle meslektaş görevlendirin.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                                <Briefcase className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">İcra, Haciz &amp; Dosya İnceleme</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                İcra dairesi talepleri, fiili haciz işlemleri, müzekkere takibi ve fiziki dosya fotokopisi için yerinde avukat desteği alın.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                                <Bell className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Anında SMS &amp; Telegram Bildirimi</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {displayName} bölgesinde görev açıldığı anda bölgedeki meslektaşlara SMS, Telegram (@AvukatAgiBot) ve mobil bildirim gönderilir.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Live Anonymized Recent Jobs in this City / Courthouse */}
                {recentJobs.length > 0 && (
                    <section className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm" aria-labelledby="recent-jobs-heading">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                            <div>
                                <h2 id="recent-jobs-heading" className="text-xl font-bold text-slate-900">
                                    {displayName} Son Görev Örnekleri
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Meslektaşlarımızın paylaştığı gerçek tevkil görevlerinden özetler
                                </p>
                            </div>
                            <Link to="/register" className="text-sm font-bold text-primary-600 hover:underline">
                                Başvurmak İçin Üye Olun &rarr;
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {recentJobs.map(job => (
                                <div key={job.job_id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-start gap-3">
                                    <div>
                                        <span className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary-100 text-primary-700 mb-1.5">
                                            {job.job_type}
                                        </span>
                                        <h3 className="font-bold text-slate-900 text-sm">{job.title}</h3>
                                        <p className="text-xs text-slate-500 mt-1">{job.courthouse} • {job.date}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <span className="text-sm font-extrabold text-primary-700">{job.offered_fee} TL</span>
                                        <div className="text-[11px] font-semibold text-slate-500 mt-1">
                                            {job.status === 'open' ? 'Başvuruya Açık' : job.status === 'in_progress' ? 'Meslektaşa Atandı' : 'Tamamlandı'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Why AvukatAgi for this Courthouse */}
                <section className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm" aria-labelledby="benefits-heading">
                    <h2 id="benefits-heading" className="text-xl font-bold text-slate-900 mb-6">
                        {displayName} İçin Neden AvukatAğı?
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { icon: ShieldCheck, text: 'Yalnızca baro levhasına kayıtlı meslektaşlarla güvenli ağ' },
                            { icon: Clock, text: 'Normal görevlerde 15 dk, Acil görevlerde 5 dk adil başvuru süresi' },
                            { icon: CheckCircle, text: 'Her görev atamasında görev sahibine +15 Gün Premium hediye' },
                            { icon: Building2, text: 'Adliye içi ve Adliye dışı (Noter, Tapu, Karakol) tüm işlemler' }
                        ].map((item, i) => (
                            <div key={i} className="flex items-start p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <item.icon className="w-5 h-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                                <span className="text-sm font-medium text-slate-700">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Other Courthouses in Same City (Internal SEO Linking) */}
                {siblingCourthouses.length > 0 && (
                    <section className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm" aria-labelledby="other-courthouses-heading">
                        <div className="flex items-center justify-between mb-4">
                            <h2 id="other-courthouses-heading" className="text-xl font-bold text-slate-900">
                                {entry.city} İlindeki {isCity ? 'Tüm' : 'Diğer'} Adliyeler
                            </h2>
                            <Link to="/adliyeler" className="text-xs font-bold text-primary-600 hover:underline">
                                81 İl Listesi &rarr;
                            </Link>
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                            {siblingCourthouses.map(ch => (
                                <Link
                                    key={ch}
                                    to={`/tevkil/${getCourthouseSlug(entry.city, ch)}`}
                                    className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700 hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50 transition"
                                >
                                    {ch} Tevkil
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Local Courthouse FAQ with + button */}
                <section className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm" aria-labelledby="local-faq-heading">
                    <h2 id="local-faq-heading" className="text-xl font-bold text-slate-900 mb-6">
                        {displayName} Tevkil Hakkında Sıkça Sorulan Sorular
                    </h2>
                    <div className="space-y-3">
                        {localFaqs.map((faq, idx) => {
                            const isOpen = openFaqIndex === idx;
                            return (
                                <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden">
                                    <button
                                        type="button"
                                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                                        aria-expanded={isOpen}
                                        className="w-full px-5 py-4 flex items-center justify-between text-left gap-4 hover:bg-slate-50 transition"
                                    >
                                        <span className="font-bold text-slate-900 text-sm md:text-base">{faq.question}</span>
                                        <span className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isOpen ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                            {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                        </span>
                                    </button>
                                    {isOpen && (
                                        <div className="px-5 pb-4 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>
        </main>
    );
};

export default CourthouseSeoPage;
