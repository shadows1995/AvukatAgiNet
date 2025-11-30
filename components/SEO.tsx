import React from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';

interface SEOProps {
    title: string;
    description?: string;
    keywords?: string;
    canonicalUrl?: string;
}

const SEO: React.FC<SEOProps> = ({
    title,
    description = "AvukatAğı - Avukatlar arası iş birliği ve tevkil platformu.",
    keywords = "avukat, tevkil, hukuk, avukat ağı, avukat iş birliği, duruşma, dosya inceleme",
    canonicalUrl
}) => {
    const fullTitle = `${title} | AvukatAğı`;
    const currentUrl = canonicalUrl || window.location.href;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:type" content="website" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        </Helmet>
    );
};

export default SEO;
