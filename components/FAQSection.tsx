import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, HelpCircle, ArrowRight } from 'lucide-react';
import { FaqItem, FAQ_ITEMS } from '../data/seoData';

interface FAQSectionProps {
    items?: FaqItem[];
    title?: string;
    subtitle?: string;
    showViewAllLink?: boolean;
    limit?: number;
    className?: string;
}

const FAQSection: React.FC<FAQSectionProps> = ({
    items = FAQ_ITEMS,
    title = 'Sıkça Sorulan Sorular',
    subtitle = 'AvukatAğı tevkil ve görev paylaşım sistemi hakkında merak ettiğiniz tüm detaylar',
    showViewAllLink = false,
    limit,
    className = ''
}) => {
    const [openIds, setOpenIds] = useState<Record<string, boolean>>({});

    const toggleItem = (id: string) => {
        setOpenIds(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const displayedItems = limit ? items.slice(0, limit) : items;

    return (
        <section className={`py-20 bg-slate-50 border-t border-slate-100 ${className}`} aria-labelledby="faq-section-heading">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-bold uppercase tracking-wider mb-4 border border-primary-100">
                        <HelpCircle className="w-3.5 h-3.5 mr-1.5" />
                        SSS / Bilgi Merkezi
                    </div>
                    <h2 id="faq-section-heading" className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="mt-3 text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
                            {subtitle}
                        </p>
                    )}
                </div>

                <div className="space-y-4">
                    {displayedItems.map((item) => {
                        const isOpen = Boolean(openIds[item.id]);
                        return (
                            <div
                                key={item.id}
                                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                                    isOpen
                                        ? 'border-primary-200 shadow-lg shadow-primary-100/40'
                                        : 'border-slate-200 hover:border-primary-200 shadow-sm'
                                }`}
                            >
                                <button
                                    type="button"
                                    onClick={() => toggleItem(item.id)}
                                    aria-expanded={isOpen}
                                    aria-controls={`faq-answer-${item.id}`}
                                    className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 focus:outline-none group"
                                >
                                    <span className={`text-base md:text-lg font-bold transition-colors ${isOpen ? 'text-primary-700' : 'text-slate-900 group-hover:text-primary-600'}`}>
                                        {item.question}
                                    </span>
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
                                        id={`faq-answer-${item.id}`}
                                        className="px-6 pb-6 pt-1 text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in duration-200"
                                    >
                                        <p>{item.answer}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {showViewAllLink && (
                    <div className="mt-10 text-center">
                        <Link
                            to="/sss"
                            className="inline-flex items-center px-6 py-3 rounded-xl bg-white border border-slate-200 text-primary-700 font-bold hover:border-primary-300 hover:bg-primary-50 transition shadow-sm"
                        >
                            Tüm Sıkça Sorulan Soruları Görüntüle
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default FAQSection;
