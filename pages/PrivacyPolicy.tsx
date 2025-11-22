import React from 'react';
import { ShieldCheck } from 'lucide-react';

const PrivacyPolicy = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-green-100 rounded-xl">
                        <ShieldCheck className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">Gizlilik Politikası ve KVKK Aydınlatma Metni</h1>
                </div>

                <div className="prose prose-slate max-w-none">
                    <h3>1. Veri Sorumlusu</h3>
                    <p>
                        6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verileriniz; veri sorumlusu olarak AvukatNet tarafından aşağıda açıklanan kapsamda işlenebilecektir.
                    </p>

                    <h3>2. Kişisel Verilerin İşlenme Amacı</h3>
                    <p>
                        Toplanan kişisel verileriniz (Ad, Soyad, E-posta, Telefon, Baro Bilgileri vb.); Platform hizmetlerinden faydalanmanız, üyelik işlemlerinin gerçekleştirilmesi, güvenliğin sağlanması ve yasal yükümlülüklerin yerine getirilmesi amaçlarıyla işlenmektedir.
                    </p>

                    <h3>3. Kişisel Verilerin Aktarılması</h3>
                    <p>
                        Kişisel verileriniz, yasal zorunluluklar haricinde üçüncü kişilerle paylaşılmamaktadır. Ancak, görev ataması durumunda ilgili taraflar (görev veren ve alan avukat) arasında iletişim bilgileri paylaşılabilir.
                    </p>

                    <h3>4. Veri Toplama Yöntemi ve Hukuki Sebebi</h3>
                    <p>
                        Kişisel verileriniz, Platform üzerinden elektronik ortamda, üyelik formu ve kullanım esnasındaki işlemleriniz aracılığıyla toplanmaktadır. Bu veriler, KVKK'nın 5. ve 6. maddelerinde belirtilen hukuki sebeplere dayanarak işlenmektedir.
                    </p>

                    <h3>5. İlgili Kişinin Hakları</h3>
                    <p>
                        KVKK'nın 11. maddesi uyarınca veri sahipleri; verilerinin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, verilerin düzeltilmesini veya silinmesini isteme haklarına sahiptir.
                    </p>

                    <h3>6. Çerezler (Cookies)</h3>
                    <p>
                        Platform, kullanıcı deneyimini iyileştirmek amacıyla çerezler kullanmaktadır. Tarayıcı ayarlarınızdan çerezleri yönetebilirsiniz.
                    </p>

                    <div className="mt-8 pt-8 border-t border-slate-100 text-sm text-slate-500">
                        Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
