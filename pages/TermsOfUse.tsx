import React from 'react';
import { FileText } from 'lucide-react';

const TermsOfUse = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-primary-100 rounded-xl">
                        <FileText className="w-8 h-8 text-primary-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">Kullanım Sözleşmesi</h1>
                </div>

                <div className="prose prose-slate max-w-none">
                    <h3>1. Taraflar</h3>
                    <p>
                        İşbu Kullanım Sözleşmesi ("Sözleşme"), AvukatNet platformu ("Platform") ile Platform'a üye olan kullanıcı ("Kullanıcı") arasında akdedilmiştir.
                    </p>

                    <h3>2. Konu</h3>
                    <p>
                        İşbu Sözleşme'nin konusu, Kullanıcı'nın Platform'dan faydalanma şartlarının belirlenmesidir. Platform, avukatlar arası iş paylaşımı ve yardımlaşma amacıyla kurulmuştur.
                    </p>

                    <h3>3. Kullanım Şartları</h3>
                    <ul>
                        <li>Kullanıcı, Platform'a üye olurken verdiği bilgilerin doğru ve güncel olduğunu beyan eder.</li>
                        <li>Kullanıcı, Platform'u hukuka ve ahlaka aykırı amaçlarla kullanamaz.</li>
                        <li>Platform üzerinden paylaşılan görev ve iş ilanlarından doğan sorumluluk tamamen ilanı veren Kullanıcı'ya aittir.</li>
                    </ul>

                    <h3>4. Gizlilik ve Güvenlik</h3>
                    <p>
                        Platform, Kullanıcı verilerini Gizlilik Politikası kapsamında korumayı taahhüt eder. Ancak, internet ortamının doğası gereği %100 güvenlik garanti edilemez.
                    </p>

                    <h3>5. Fikri Mülkiyet</h3>
                    <p>
                        Platform'un tasarımı, yazılımı ve içeriği AvukatNet'in mülkiyetindedir. İzinsiz kopyalanamaz ve kullanılamaz.
                    </p>

                    <h3>6. Değişiklikler</h3>
                    <p>
                        AvukatNet, işbu Sözleşme'yi dilediği zaman güncelleme hakkını saklı tutar. Güncel sözleşme Platform'da yayınlandığı tarihte yürürlüğe girer.
                    </p>

                    <div className="mt-8 pt-8 border-t border-slate-100 text-sm text-slate-500">
                        Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsOfUse;
