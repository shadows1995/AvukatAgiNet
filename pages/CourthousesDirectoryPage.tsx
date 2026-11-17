import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Search, ArrowLeft, Building2, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import { COURTHOUSES, TURKISH_CITIES } from '../data/courthouses';
import { slugifyTr, getCourthouseSlug } from '../data/seoData';

const CourthousesDirectoryPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const normalizedQuery = searchQuery.trim().toLocaleLowerCase('tr-TR');

    const filteredCities = TURKISH_CITIES.filter(city => {
        if (!normalizedQuery) return true;
        if (city.toLocaleLowerCase('tr-TR').includes(normalizedQuery)) return true;
        const chList = COURTHOUSES[city] || [];
        return chList.some(ch => ch.toLocaleLowerCase('tr-TR').includes(normalizedQuery));
    });

    const totalCourthouses = Object.values(COURTHOUSES).reduce((acc, list) => acc + list.length, 0);

    return (
        <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <SEO
                title="81 İl ve Tüm Adliyeler Tevkil Rehberi | AvukatAğı"
                description="Türkiye'nin 81 ilindeki tüm adliyeler için AvukatAğı tevkil ağı. Duruşma, icra, haciz ve dosya inceleme görevleri için adliyenizi seçin."
                keywords="türkiye adliyeleri tevkil, 81 il tevkil, istanbul adliyesi tevkil, ankara adliyesi tevkil, izmir adliyesi tevkil, adliye rehberi"
                canonicalUrl="https://avukatagi.net/adliyeler"
            />

            <div className="max-w-7xl mx-auto">
                <nav className="mb-8 flex items-center justify-between" aria-label="Breadcrumb">
                    <Link to="/" className="inline-flex items-center text-slate-600 hover:text-primary-600 transition-colors font-medium">
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Ana Sayfaya Dön
                    </Link>
                    <Link to="/sss" className="text-sm font-semibold text-primary-600 hover:underline">
                        Sıkça Sorulan Sorular &rarr;
                    </Link>
                </nav>

                {/* Header */}
                <header className="bg-gradient-to-br from-primary-900 via-primary-800 to-indigo-900 rounded-3xl p-8 md:p-12 text-white shadow-xl mb-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>
                    <div className="relative z-10 max-w-3xl">
                        <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-primary-100 text-xs font-bold uppercase tracking-wider mb-4">
                            <Building2 className="w-4 h-4 mr-1.5" />
                            81 İl • {totalCourthouses} Adliye
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
                            Türkiye Adliyeleri Tevkil Rehberi
                        </h1>
                        <p className="text-primary-100 text-base md:text-lg leading-relaxed mb-6">
                            İl içi ve il dışı duruşma, icra işlemi, haciz, dosya inceleme ve dilekçe görevleriniz için Türkiye genelindeki tüm il ve ilçe adliyelerinde AvukatAğı meslektaş desteğine anında ulaşın.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Link
                                to="/register"
                                className="inline-flex items-center px-6 py-3 bg-white text-primary-900 rounded-xl font-bold hover:bg-blue-50 transition shadow-md"
                            >
                                Ücretsiz Kaydol (2 Ay Premium+)
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Search */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-8 shadow-sm">
                    <div className="relative">
                        <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="İl veya adliye adı ara (ör. İstanbul, Çağlayan, Ankara, Bakırköy, İzmir)..."
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-primary-500 text-sm text-slate-800"
                        />
                    </div>
                </div>

                {/* Cities & Courthouses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCities.map(city => {
                        const citySlug = slugifyTr(city);
                        const courthouses = (COURTHOUSES[city] || []).filter(ch =>
                            !normalizedQuery ||
                            city.toLocaleLowerCase('tr-TR').includes(normalizedQuery) ||
                            ch.toLocaleLowerCase('tr-TR').includes(normalizedQuery)
                        );

                        return (
                            <section
                                key={city}
                                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition"
                                aria-labelledby={`city-${citySlug}`}
                            >
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                                    <h2 id={`city-${citySlug}`} className="text-lg font-extrabold text-slate-900 flex items-center">
                                        <MapPin className="w-5 h-5 text-primary-600 mr-2 flex-shrink-0" />
                                        <Link to={`/tevkil/${citySlug}`} className="hover:text-primary-600 transition">
                                            {city} Adliyeleri
                                        </Link>
                                    </h2>
                                    <Link
                                        to={`/tevkil/${citySlug}`}
                                        className="text-xs font-bold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full hover:bg-primary-100 transition"
                                    >
                                        {COURTHOUSES[city]?.length || 0} Adliye
                                    </Link>
                                </div>

                                <ul className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                                    {courthouses.map(ch => {
                                        const chSlug = getCourthouseSlug(city, ch);
                                        return (
                                            <li key={ch}>
                                                <Link
                                                    to={`/tevkil/${chSlug}`}
                                                    className="block text-sm text-slate-600 hover:text-primary-600 hover:bg-slate-50 px-2.5 py-1.5 rounded-lg transition"
                                                >
                                                    {ch} Tevkil
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </section>
                        );
                    })}
                </div>
            </div>
        </main>
    );
};

export default CourthousesDirectoryPage;
