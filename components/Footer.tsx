import React from "react";
import { Link } from "react-router-dom";
import {
    Facebook,
    Instagram,
    Twitter,
    Linkedin,
    Youtube,
    Gavel,
} from "lucide-react";

const Footer = () => {
    const linkStyle =
        "text-sm font-medium text-slate-400 hover:text-white transition-colors cursor-pointer";

    const sectionTitle = "text-lg font-semibold text-white";

    const socialStyle =
        "w-9 h-9 flex items-center justify-center rounded-full border border-slate-700 text-slate-300 hover:text-white hover:bg-primary-600 transition-all duration-300 cursor-pointer";

    return (
        <footer className="bg-primary-900 border-t border-primary-800">
            {/* Top Section */}
            <div className="max-w-6xl w-11/12 mx-auto flex flex-wrap justify-between py-16 gap-10">
                {/* Logo + About */}
                <div className="w-full sm:w-auto flex flex-col items-center sm:items-start">
                    <div className="flex items-center space-x-2 mb-4">
                        <div className="bg-primary-600 text-white p-1.5 rounded-lg">
                            <Gavel className="h-6 w-6" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white">
                            Avukat<span className="text-primary-500">Net</span>
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
                        <li><Link to="/" className={linkStyle}>Hakkımızda</Link></li>
                        <li><Link to="/" className={linkStyle}>Özellikler</Link></li>
                        <li><Link to="/" className={linkStyle}>İletişim</Link></li>
                    </ul>
                </div>

                {/* Legal */}
                <div className="flex flex-col gap-4">
                    <h1 className={sectionTitle}>Yasal</h1>
                    <ul className="flex flex-col gap-3">
                        <li><Link to="/privacy" className={linkStyle}>Gizlilik Politikası</Link></li>
                        <li><Link to="/terms" className={linkStyle}>Kullanım Şartları</Link></li>
                        <li><Link to="/terms" className={linkStyle}>İptal ve İade</Link></li>
                    </ul>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="bg-primary-950 py-8">
                <div className="max-w-6xl w-11/12 mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
                    <p className="text-xs text-slate-500 text-center sm:text-left">
                        © {new Date().getFullYear()}{" "}
                        <span className="text-primary-500 font-medium">AvukatNet</span>. Tüm hakları saklıdır.
                    </p>

                    {/* Social Icons */}
                    <div className="flex gap-4">
                        {[
                            Facebook,
                            Instagram,
                            Twitter,
                            Linkedin,
                            Youtube,
                        ].map((Icon, idx) => (
                            <a key={idx} href="#" className={socialStyle}>
                                <Icon className="w-4 h-4" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
