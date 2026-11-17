import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Plus, Minus, HelpCircle, ArrowLeft, ArrowRight, Search } from 'lucide-react';
import SEO from '../components/SEO';
import { FAQ_ITEMS } from '../data/seoData';

const FAQPage: React.FC = () => {
    const [openIds, setOpenIds] = useState<Record<string, boolean>>({});
    const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
    const [searchQuery, setSearchQuery] = useState<string>('');

    const categories = ['Tümü', ...Array.from(new Set(FAQ_ITEMS.map(item => item.category)))];

    const toggleItem = (id: string) => {
        setOpenIds(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const filteredItems = FAQ_ITEMS.filter(item => {
        const matchesCat = selectedCategory === 'Tümü' || item.category === selectedCategory;
        const q = searchQuery.trim().toLocaleLowerCase('tr-TR');
        const matchesSearch =
            !q ||
            item.question.toLocaleLowerCase('tr-TR').includes(q) ||
            item.answer.toLocaleLowerCase('tr-TR').includes(q);
        return matchesCat && matchesSearch;
    });

    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQ_ITEMS.map(item => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer
            }
        }))
    };

    return (
        <main className="min-h-screen bg-slate-50 flex flex-col">
            <SEO
                title="Sıkça Sorulan Sorular (SSS) | AvukatAğı"
                description="AvukatAğı tevkil sistemi, üyelik, ücretlendirme, yetki belgesi, bildirimler ve görev iptal kuralları hakkında sıkça sorulan sorular ve cevapları."
                keywords="avukatağı sıkça sorulan sorular, tevkil sss, avukat tevkil nasıl çalışır, yetki belgesi tevkil"
                canonicalUrl="https://avukatagi.net/sss"
            />
            <Helmet>
                <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
            </Helmet>

            <div className="flex-grow pt-12 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <nav className="mb-8 flex items-center justify-between" aria-label="Breadcrumb">
                        <Link to="/" className="inline-flex items-center text-slate-600 hover:text-primary-600 transition-colors font-medium">
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Ana Sayfaya Dön
                        </Link>
                        <Link to="/adliyeler" className="text-sm font-semibold text-primary-600 hover:text-primary-700 hover:underline">
                            81 İl &amp; Tüm Adliyeler &rarr;
                        </Link>
                    </nav>

                    {/* Hero Header */}
                    <header className="bg-gradient-to-br from-primary-900 via-primary-800 to-indigo-900 rounded-3xl p-8 md:p-12 text-white shadow-xl mb-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none"></div>
                        <div className="relative z-10 text-center max-w-2xl mx-auto">
                            <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-primary-100 text-xs font-bold uppercase tracking-wider mb-4">
                                <HelpCircle className="w-4 h-4 mr-1.5" />
                                Yardım &amp; Bilgi Merkezi
                            </div>
                            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
                                Sıkça Sorulan Sorular
                            </h1>
                            <p className="text-primary-100 text-base md:text-lg leading-relaxed">
                                AvukatAğı üzerinden tevkil görevi oluşturma, başvuru süreci, bildirimler ve üyelik avantajları hakkında tüm soruların yanıtları burada.
                            </p>
                        </div>
                    </header>

                    {/* Search & Category Filter */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-8 shadow-sm space-y-4">
                        <div className="relative">
                            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Soru veya anahtar kelime ara (ör. yetki belgesi, ücretsiz, bildirim)..."
                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-primary-500 text-sm text-slate-800"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                                        selectedCategory === cat
                                            ? 'bg-primary-600 text-white shadow-sm'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Accordion List */}
                    <div className="space-y-4">
                        {filteredItems.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
                                Aramanızla eşleşen soru bulunamadı.
                            </div>
                        ) : (
                            filteredItems.map(item => {
                                const isOpen = Boolean(openIds[item.id]);
                                return (
                                    <div
                                        key={item.id}
                                        className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                                            isOpen
                                                ? 'border-primary-300 shadow-lg shadow-primary-100/40'
                                                : 'border-slate-200 hover:border-primary-200 shadow-sm'
                                        }`}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => toggleItem(item.id)}
                                            aria-expanded={isOpen}
                                            aria-controls={`faq-page-answer-${item.id}`}
                                            className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 focus:outline-none group"
                                        >
                                            <div>
                                                <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-2.5 py-0.5 rounded-full mb-1.5">
                                                    {item.category}
                                                </span>
                                                <h2 className={`text-base md:text-lg font-bold transition-colors ${isOpen ? 'text-primary-700' : 'text-slate-900 group-hover:text-primary-600'}`}>
                                                    {item.question}
                                                </h2>
                                            </div>
                                            <span
                                                className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                                                    isOpen
                                                        ? 'bg-primary-600 text-white shadow-md'
                                                        : 'bg-slate-100 text-slate-600 group-hover:bg-primary-50 group-hover:text-primary-600'
                                                }`}
                                                aria-hidden="true"
                                            >
                                                {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                            </span>
                                        </button>

                                        {isOpen && (
                                            <div
                                                id={`faq-page-answer-${item.id}`}
                                                className="px-6 pb-6 pt-2 text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in duration-200"
                                            >
                                                <p>{item.answer}</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-14 bg-white rounded-3xl border border-slate-200 p-8 md:p-10 text-center shadow-sm">
                        <h2 className="text-2xl font-bold text-slate-900 mb-3">
                            AvukatAğı’na Katılmaya Hazır mısınız?
                        </h2>
                        <p className="text-slate-600 max-w-xl mx-auto mb-6">
                            Ücretsiz kayıt olarak 2 Ay Ücretsiz Beta Premium+ ayrıcalığı ile 81 ildeki adliyelerde tevkil alın ve verin.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link
                                to="/register"
                                className="inline-flex items-center justify-center px-8 py-3.5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition shadow-md"
                            >
                                Ücretsiz Üye Ol
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Link>
                            <Link
                                to="/how-it-works"
                                className="inline-flex items-center justify-center px-8 py-3.5 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition"
                            >
                                Nasıl Çalışır?
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default FAQPage;
