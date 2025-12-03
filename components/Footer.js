"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var lucide_react_1 = require("lucide-react");
var Footer = function () {
    var linkStyle = "text-sm font-medium text-slate-400 hover:text-white transition-colors cursor-pointer";
    var sectionTitle = "text-lg font-semibold text-white";
    var socialStyle = "w-9 h-9 flex items-center justify-center rounded-full border border-slate-700 text-slate-300 hover:text-white hover:bg-primary-600 transition-all duration-300 cursor-pointer";
    return (<footer className="bg-primary-900 border-t border-primary-800">
            {/* Top Section */}
            <div className="max-w-6xl w-11/12 mx-auto flex flex-wrap justify-between py-16 gap-10">
                {/* Logo + About */}
                <div className="w-full sm:w-auto flex flex-col items-center sm:items-start">
                    <div className="flex items-center space-x-2 mb-4">
                        <div className="bg-primary-600 text-white p-1.5 rounded-lg">
                            <lucide_react_1.Gavel className="h-6 w-6"/>
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white">
                            Avukat<span className="text-primary-500">Ağı</span>
                        </span>
                    </div>
                    <p className="text-sm text-slate-400 max-w-xs text-center sm:text-left leading-relaxed">
                        Türkiye'nin en büyük <span className="text-primary-400">hukuk ağı</span> ile
                        meslektaşlarınızla güçlerinizi birleştirin, işlerinizi büyütün.
                    </p>
                </div>

                {/* Company */}
                <div className="flex flex-col gap-4">
                    <h1 className={sectionTitle}>Kurumsal</h1>
                    <ul className="flex flex-col gap-3">
                        <li><react_router_dom_1.Link to="/about" className={linkStyle}>Hakkımızda</react_router_dom_1.Link></li>
                        <li><react_router_dom_1.Link to="/how-it-works" className={linkStyle}>Özellikler</react_router_dom_1.Link></li>
                        <li><react_router_dom_1.Link to="/" className={linkStyle}>İletişim</react_router_dom_1.Link></li>
                    </ul>
                </div>

                {/* Legal */}
                <div className="flex flex-col gap-4">
                    <h1 className={sectionTitle}>Yasal</h1>
                    <ul className="flex flex-col gap-3">
                        <li><react_router_dom_1.Link to="/privacy" className={linkStyle}>Gizlilik ve Kişisel Verilerin İşlenmesi Politikası</react_router_dom_1.Link></li>
                        <li><react_router_dom_1.Link to="/terms" className={linkStyle}>Kullanım Şartları</react_router_dom_1.Link></li>
                        <li><react_router_dom_1.Link to="/distance-sales-agreement" className={linkStyle}>Mesafeli Satış Sözleşmesi</react_router_dom_1.Link></li>
                    </ul>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="bg-primary-950 py-8">
                <div className="max-w-6xl w-11/12 mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
                    <p className="text-xs text-slate-500 text-center sm:text-left">
                        © {new Date().getFullYear()}{" "}
                        <span className="text-primary-500 font-medium">AvukatAğı</span>. Tüm hakları saklıdır.
                    </p>

                    {/* Social Icons */}
                    <div className="flex gap-4">
                        {[
            lucide_react_1.Facebook,
            lucide_react_1.Instagram,
            lucide_react_1.Twitter,
            lucide_react_1.Linkedin,
            lucide_react_1.Youtube,
        ].map(function (Icon, idx) { return (<a key={idx} href="#" className={socialStyle}>
                                <Icon className="w-4 h-4"/>
                            </a>); })}
                    </div>
                </div>
            </div>
        </footer>);
};
exports.default = Footer;
