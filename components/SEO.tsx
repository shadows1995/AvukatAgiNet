import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description?: string;
    keywords?: string;
    canonicalUrl?: string;
}

const SEO: React.FC<SEOProps> = ({
    title,
    description = "AvukatAğı - Türkiye'nin avukatlar arası tevkil, duruşma ve görev paylaşım platformu.",
    keywords = "avukatağı, avukat ağı, tevkil, tevkil platformu, avukat tevkil, duruşma tevkil, dosya inceleme, haciz tevkil",
    canonicalUrl
}) => {
    const fullTitle = title.includes('AvukatAğı') ? title : `${title} | AvukatAğı`;
    const cleanUrl = canonicalUrl || `${window.location.origin}${window.location.pathname}`;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta property="og:site_name" content="AvukatAğı" />
            <meta property="og:locale" content="tr_TR" />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={cleanUrl} />
            <meta property="og:type" content="website" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <link rel="canonical" href={cleanUrl} />
        </Helmet>
    );
};

export default SEO;
