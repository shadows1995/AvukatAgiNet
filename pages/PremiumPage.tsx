import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Rocket, Zap, Crown, Shield, Loader2 } from 'lucide-react';
import { User } from '../types';
import { supabase } from '../supabaseClient';
import { useAlert } from '../contexts/AlertContext';

const styles = {
    section: "relative py-20 bg-slate-50 min-h-screen",
    container: "px-4 mx-auto max-w-7xl sm:px-6 lg:px-8",
    header: "max-w-2xl mx-auto text-center mb-16",
    heading: "text-4xl font-bold text-slate-900 sm:text-5xl lg:text-6xl tracking-tight",
    subheading: "mt-6 text-lg text-slate-600",
    grid: "grid gap-10 mt-16 md:grid-cols-3 max-w-6xl mx-auto items-start",
    card: "relative flex flex-col p-8 bg-white rounded-2xl shadow-lg border transition-all duration-300 hover:shadow-2xl",

    badge: "absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-semibold text-white rounded-full shadow-md",
    cardHeader: "text-center",
    iconWrapper: "flex justify-center mb-4",
    cardTitle: "mt-6 text-2xl font-semibold text-slate-900",
    cardDescription: "mt-2 text-base text-slate-600",
    cardPrice: "flex items-end justify-center mt-6",
    priceSign: "text-xl font-semibold text-slate-400 mb-2",
    priceValue: "text-5xl font-bold text-slate-900",
    pricePeriod: "text-lg font-normal text-slate-500 ml-1 mb-2",
    featureList: "mt-8 space-y-4 flex-grow",
    featureItem: "flex items-start text-slate-700",
    featureIcon: "w-5 h-5 mr-3 text-green-500 flex-shrink-0 mt-0.5",
    buttonBase: "inline-flex items-center justify-center w-full px-6 py-3 mt-10 text-base font-semibold rounded-xl shadow-md transition-all duration-300",
    buttonPrimary: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:scale-105",
    buttonSecondary: "border border-slate-300 text-slate-800 hover:border-indigo-500 hover:text-indigo-600 bg-white",
    buttonDisabled: "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none",
    noCredit: "mt-4 text-sm text-slate-500",
    footer: "mt-20 max-w-xl mx-auto text-base text-center text-slate-500 border-t border-slate-200 pt-8",
};

const PremiumPage = ({ user }: { user: User }) => {
    const [loading, setLoading] = useState<string | null>(null);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
    const { showAlert } = useAlert();

    const navigate = useNavigate();

    const handleUpgrade = (plan: 'premium' | 'premium_plus') => {
        const price = plan === 'premium'
            ? (billingCycle === 'monthly' ? 250 : 1500)
            : (billingCycle === 'monthly' ? 300 : 2000);

        navigate('/payment', {
            state: {
                plan,
                price,
                period: billingCycle
            }
        });
    };

    const getPlanStatus = (planType: string) => {
        const currentType = user.membershipType || 'free';

        // 1. Is this the current plan?
        if (planType === currentType) {
            return {
                text: "Mevcut Plan",
                disabled: true,
                style: styles.buttonDisabled,
                isCurrent: true
            };
        }

        // 2. Logic based on current user level
        if (currentType === 'premium_plus') {
            // User is top tier, everything else is included/lower
            return {
                text: "Pakete Dahil",
                disabled: true,
                style: styles.buttonDisabled,
                isCurrent: false
            };
        }

        if (currentType === 'premium') {
            if (planType === 'free') {
                return {
                    text: "Pakete Dahil",
                    disabled: true,
                    style: styles.buttonDisabled,
                    isCurrent: false
                };
            }
            if (planType === 'premium_plus') {
                return {
                    text: "Hemen Yükselt",
                    disabled: false,
                    style: styles.buttonSecondary, // Premium+ uses secondary style in original, but maybe primary is better? Original used secondary.
                    isCurrent: false
                };
            }
        }

        // User is free
        if (currentType === 'free') {
            return {
                text: "Hemen Yükselt",
                disabled: false,
                style: planType === 'premium' ? styles.buttonPrimary : styles.buttonSecondary,
                isCurrent: false
            };
        }

        return { text: "Seç", disabled: false, style: styles.buttonSecondary, isCurrent: false };
    };

    const pricingPlans = [
        {
            type: 'free',
            title: "Başlangıç",
            description: "Sadece Görev vermek isteyen avukatlar için ideal",
            price: 0,
            features: [
                "Günlük 10 İlan Açabilme",
                "Profil Oluşturma",
                "Başvuruları Görüntüleme",
                "Görevleri başka avukatlara verebilme"
            ],
            icon: <Rocket className="w-12 h-12 text-cyan-500" />,
            ...getPlanStatus('free')
        },
        {
            type: 'premium',
            title: "Premium",
            description: "İşlerini büyütmek isteyenler için",
            price: billingCycle === 'monthly' ? 250 : 125,
            originalPriceYearly: 1500,
            features: [
                "Her Şey Dahil (Başlangıç)",
                "15 dk Görevlere Başvuru Hakkı",
                "Başvurudan Gelir Kazanma",
                "Acil İlan Açabilme",
            ],
            icon: <Zap className="w-12 h-12 text-indigo-500" />,
            badge: "En Popüler",
            badgeColor: "bg-gradient-to-r from-indigo-500 to-purple-600",
            ...getPlanStatus('premium')
        },
        {
            type: 'premium_plus',
            title: "Premium +",
            description: "Profesyoneller için tam paket",
            price: billingCycle === 'monthly' ? 300 : 167,
            originalPriceYearly: 2000,
            features: [
                "Tüm Premium Özellikleri",
                "Görevlere başvurularda üstte yer alma",
                "Birden fazla ildeki adliyelerde görev alabilme",
                "Yıllık planda geçerli Görev garantisi-Yıllık 3 görev"
            ],
            icon: <Crown className="w-12 h-12 text-pink-500" />,
            ...getPlanStatus('premium_plus')
        }
    ];

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.heading}>
                        İhtiyacınıza uygun planı seçin
                    </h2>
                    <p className={styles.subheading}>
                        Kendinize en uygun planı seçin ve Avukat Ağı'nın premium özelliklerinin keyfini çıkarın.
                    </p>

                    {/* Billing Toggle */}
                    <div className="flex justify-center items-center space-x-4 mt-8">
                        <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-500'}`}>Aylık</span>
                        <button
                            onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                            className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${billingCycle === 'yearly' ? 'bg-indigo-600' : 'bg-slate-300'}`}
                        >
                            <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${billingCycle === 'yearly' ? 'translate-x-6' : ''}`}></div>
                        </button>
                        <span className={`text-sm font-bold ${billingCycle === 'yearly' ? 'text-slate-900' : 'text-slate-500'}`}>
                            Yıllık <span className="text-green-600 text-xs ml-1 bg-green-100 px-2 py-0.5 rounded-full">%50 İndirim</span>
                        </span>
                    </div>
                </div>

                <div className={styles.grid}>
                    {pricingPlans.map((plan, index) => (
                        <div
                            key={index}
                            className={`${styles.card} ${plan.title === "Premium"
                                ? "border-indigo-500 border-t-4 scale-105 z-10 shadow-xl"
                                : "border-slate-200 border-t-4 hover:border-indigo-300"
                                }`}
                        >
                            {'badge' in plan && plan.badge && (
                                <div className={`${styles.badge} ${'badgeColor' in plan ? plan.badgeColor : ''}`}>
                                    {plan.badge}
                                </div>
                            )}
                            <div className={styles.cardHeader}>
                                <div className={styles.iconWrapper}>
                                    {plan.icon}
                                </div>
                                <h3 className={styles.cardTitle}>{plan.title}</h3>
                                <p className={styles.cardDescription}>{plan.description}</p>
                                <div className={styles.cardPrice}>
                                    <span className={styles.priceSign}>₺</span>
                                    <span className={styles.priceValue}>{Math.round(plan.price)}</span>
                                    <span className={styles.pricePeriod}>/ay</span>
                                </div>
                                {billingCycle === 'yearly' && plan.price > 0 && 'originalPriceYearly' in plan && (
                                    <p className="text-xs text-slate-400 mt-1">
                                        Yıllık {plan.originalPriceYearly} TL olarak faturalandırılır
                                    </p>
                                )}
                            </div>

                            <ul className={styles.featureList}>
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className={styles.featureItem}>
                                        <CheckCircle className={styles.featureIcon} />
                                        <span className="text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-auto flex flex-col items-center w-full">
                                <button
                                    disabled={plan.disabled || (loading !== null)}
                                    onClick={() => !plan.disabled && handleUpgrade(plan.type as 'premium' | 'premium_plus')}
                                    className={`${styles.buttonBase} ${plan.style}`}
                                >
                                    {loading === `${plan.type}-${billingCycle}` ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        plan.text
                                    )}
                                </button>
                                <p className={`${styles.noCredit} text-center`}>
                                    {plan.price > 0 ? '' : 'Süresiz ücretsiz'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <p className={styles.footer}>
                    <Shield className="w-4 h-4 inline mr-1" />
                    Şeffaf fiyatlandırma, gizli ücret yok. Tüm ödemeler 256-bit SSL ile korunmaktadır.
                </p>
            </div>
        </section>
    );
};

export default PremiumPage;
