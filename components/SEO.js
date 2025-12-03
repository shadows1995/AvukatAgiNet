"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_helmet_async_1 = require("react-helmet-async");
var SEO = function (_a) {
    var title = _a.title, _b = _a.description, description = _b === void 0 ? "AvukatAğı - Avukatlar arası iş birliği ve tevkil platformu." : _b, _c = _a.keywords, keywords = _c === void 0 ? "avukat, tevkil, hukuk, avukat ağı, avukat iş birliği, duruşma, dosya inceleme" : _c, canonicalUrl = _a.canonicalUrl;
    var fullTitle = "".concat(title, " | AvukatA\u011F\u0131");
    var currentUrl = canonicalUrl || window.location.href;
    return (<react_helmet_async_1.Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description}/>
            <meta name="keywords" content={keywords}/>
            <meta property="og:title" content={fullTitle}/>
            <meta property="og:description" content={description}/>
            <meta property="og:url" content={currentUrl}/>
            <meta property="og:type" content="website"/>
            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:title" content={fullTitle}/>
            <meta name="twitter:description" content={description}/>
            {canonicalUrl && <link rel="canonical" href={canonicalUrl}/>}
        </react_helmet_async_1.Helmet>);
};
exports.default = SEO;
