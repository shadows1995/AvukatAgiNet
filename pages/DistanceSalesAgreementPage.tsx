import React from 'react';
import { FileText } from 'lucide-react';
import SEO from '../components/SEO';

const DistanceSalesAgreementPage = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <SEO
                title="Mesafeli Satış Sözleşmesi - AvukatAğı"
                description="AvukatAğı Mesafeli Satış Sözleşmesi ve Ön Bilgilendirme Formu."
            />
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-primary-100 rounded-xl">
                        <FileText className="w-8 h-8 text-primary-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">MESAFELİ SATIŞ SÖZLEŞMESİ</h1>
                </div>

                <div className="prose prose-slate max-w-none">
                    <p className="font-medium">
                        İşbu Ön Bilgilendirme Formu ve Mesafeli Satış Sözleşmesi, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği çerçevesinde dijital ortamda kurulmuştur.
                    </p>
                    <p>
                        Kullanıcı, ödeme işlemini tamamlayarak bu sözleşme hükümlerini kabul ettiğini beyan eder.
                    </p>

                    <hr className="my-6 border-slate-200" />

                    <h3>1. SATICI BİLGİLERİ</h3>
                    <p>
                        <strong>Unvan:</strong> Vahdet Talha BIÇAK<br />
                        (Bu sözleşmede “AvukatAgi” olarak anılacaktır.)
                    </p>
                    <p>
                        <strong>Adres:</strong> AŞAĞI ÖVEÇLER MAH. 1322 CAD. NO: 62 İÇ KAPI NO: 4 ÇANKAYA / ANKARA
                    </p>
                    <p>
                        <strong>E-posta:</strong> <a href="mailto:iletisim@avukatagi.net" className="text-primary-600 hover:underline">iletisim@avukatagi.net</a>
                    </p>
                    <p>
                        <strong>Telefon:</strong> 0850 307 7417<br />
                        <strong>Web:</strong> <a href="http://www.avukatagi.net" className="text-primary-600 hover:underline">www.avukatagi.net</a>
                    </p>

                    <hr className="my-6 border-slate-200" />

                    <h3>2. ALICI BİLGİLERİ</h3>
                    <ul className="list-none pl-0 space-y-2">
                        <li><strong>İsim Soyisim:</strong> Kullanıcının sistemde beyan ettiği bilgiler</li>
                        <li><strong>Telefon:</strong> Kullanıcının beyanı</li>
                        <li><strong>E-posta:</strong> Kullanıcının beyanı</li>
                    </ul>

                    <hr className="my-6 border-slate-200" />

                    <h3>3. HİZMET BİLGİLERİ</h3>
                    <ul className="list-none pl-0 space-y-4">
                        <li>
                            <strong>Hizmet Adı:</strong><br />
                            AvukatAgi Premium / Premium+ Yıllık Üyelik Hizmeti
                        </li>
                        <li>
                            <strong>Hizmet Türü:</strong><br />
                            Dijital üyelik hizmeti (Görev başvurusu yapabilme hakkı)
                        </li>
                        <li>
                            <strong>Hizmet Süresi:</strong><br />
                            1 yıl
                        </li>
                        <li>
                            <strong>Hizmet Bedeli:</strong><br />
                            Satın alma ekranında belirtilen fiyat
                        </li>
                        <li>
                            <strong>Ödeme Yöntemi:</strong><br />
                            Online ödeme sistemi (kredi/banka kartı)
                        </li>
                    </ul>
                    <p className="mt-4">
                        Premium üyelik, kullanıcının seçtiği adliyelerde açılan görevlere başvuru yapabilme imkânı sağlar.<br />
                        Görev oluşturmak ise tüm kullanıcılar için daima ücretsizdir.
                    </p>

                    <hr className="my-6 border-slate-200" />

                    <h3>4. SÖZLEŞMENİN KONUSU</h3>
                    <p>
                        Bu sözleşmenin konusu, Kullanıcı’nın AvukatAgi üzerinden satın aldığı Premium/Premium+ üyelik hizmetine ilişkin olarak tarafların hak, yükümlülük ve kullanım koşullarının düzenlenmesidir.
                    </p>
                    <p>Kullanıcı, hizmeti satın alarak:</p>
                    <ul className="list-disc pl-5 mb-2">
                        <li>Sistem işleyişini,</li>
                        <li>Görev atama algoritmasını,</li>
                        <li>Başvuru yapmanın görev atanmasını garanti etmediğini</li>
                    </ul>
                    <p>kabul etmiş sayılır.</p>

                    <hr className="my-6 border-slate-200" />

                    <h3>5. CAYMA HAKKI</h3>
                    <h4 className="font-bold mt-4">5.1 – Dijital Hizmetlerde Cayma İstisnası</h4>
                    <p>
                        6502 sayılı Kanun gereği, anında ifa edilen veya dijital ortamda anında teslim edilen hizmetlerde cayma hakkı bulunmamaktadır.
                    </p>
                    <p>Premium üyelik:</p>
                    <ul className="list-disc pl-5 mb-2">
                        <li>Ödeme sonrası derhal aktifleşir,</li>
                        <li>Kullanıcıya anında görev başvurusu yapma hakkı sağlar,</li>
                        <li>Dijital bir hizmettir.</li>
                    </ul>
                    <p>Bu nedenle:</p>
                    <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400 my-4">
                        <p className="font-bold">➡️ Kullanıcı tek bir göreve bile başvuru yapmışsa cayma hakkı ortadan kalkar.</p>
                        <p className="font-bold">➡️ Kullanıcı hiç başvuru yapmamışsa 14 gün içinde cayma hakkını kullanabilir.</p>
                    </div>

                    <hr className="my-6 border-slate-200" />

                    <h3>6. HİZMETİN KAPSAMI VE İFASI</h3>
                    <ul className="list-disc pl-5 mb-2">
                        <li>Premium üyelik ödeme sonrası otomatik aktif olur.</li>
                        <li>Kullanıcı, seçtiği adliyelerdeki görevlere başvuru yapabilir.</li>
                        <li>Görevi kimin alacağına daima görev oluşturan üye karar verir.</li>
                        <li>Algoritma, adil dağılım için tasarlanmıştır ancak atanmayı garanti etmez.</li>
                        <li>Kullanıcı bir yıl boyunca sınırsız başvuru hakkına sahiptir.</li>
                    </ul>

                    <hr className="my-6 border-slate-200" />

                    <h3>7. ÜCRET İADESİ</h3>
                    <p>İade yalnızca şu şartlarda mümkündür:</p>
                    <ul className="list-disc pl-5 mb-2">
                        <li>Kullanıcı hiçbir göreve başvuru yapmamışsa,</li>
                        <li>Satın alma üzerinden 14 gün geçmemişse.</li>
                    </ul>
                    <p>Aşağıdaki durumlarda iade yapılmaz:</p>
                    <ul className="list-disc pl-5 mb-2">
                        <li>Kullanıcı en az 1 göreve başvuru yaptıysa,</li>
                        <li>Dijital hizmet ifa edilmişse,</li>
                        <li>Kullanıcı algoritmayı beğenmediğini ileri sürerse.</li>
                    </ul>
                    <p className="font-bold mt-4">Ek Güvence:</p>
                    <p>
                        Yıllık üyelik sonunda kullanıcı 3’ten az görev aldıysa, üyeliği ücretsiz 1 yıl daha uzatılır.<br />
                        (Pasif kullanıcılar kapsam dışıdır.)
                    </p>

                    <hr className="my-6 border-slate-200" />

                    <h3>8. KULLANICI YÜKÜMLÜLÜKLERİ</h3>
                    <p>Kullanıcı:</p>
                    <ul className="list-disc pl-5 mb-2">
                        <li>Bilgilerini doğru beyan etmekle,</li>
                        <li>Sistemi hukuka uygun şekilde kullanmakla,</li>
                        <li>Meslek etiğine uymakla,</li>
                        <li>Şifre güvenliğini sağlamakla,</li>
                        <li>Görev bilgilerini gizlilik esasına göre korumakla</li>
                    </ul>
                    <p>yükümlüdür.</p>

                    <hr className="my-6 border-slate-200" />

                    <h3>9. AVUKATAGİ’NİN YETKİLERİ</h3>
                    <p>AvukatAgi:</p>
                    <ul className="list-disc pl-5 mb-2">
                        <li>Kötüye kullanım, yanlış bilgi, suiistimal, etik dışı davranış tespitinde üyeliği askıya alma veya sonlandırma,</li>
                        <li>Sistem yapısını, fiyatlandırmayı ve hizmet koşullarını güncelleme</li>
                    </ul>
                    <p>hakkına sahiptir.</p>

                    <hr className="my-6 border-slate-200" />

                    <h3>10. UYUŞMAZLIKLARIN ÇÖZÜMÜ</h3>
                    <p className="font-bold">(ISTAC Tahkim Maddesi – Güncel)</p>
                    <p>
                        Taraflar, işbu sözleşmeden kaynaklanan tüm uyuşmazlıkların İstanbul Tahkim Merkezi (ISTAC) Tahkim Kuralları uyarınca nihai olarak tahkim yoluyla çözüleceğini kabul eder.
                    </p>
                    <ul className="list-none pl-0 space-y-2">
                        <li><strong>Tahkim Yeri:</strong> Ankara / Türkiye</li>
                        <li><strong>Hakem Sayısı:</strong> 1 (Bir)</li>
                        <li><strong>Tahkim Dili:</strong> Türkçe</li>
                        <li><strong>Uygulanacak Hukuk:</strong> Türk Hukuku</li>
                    </ul>
                    <p>Hakem kararı taraflar açısından nihai ve bağlayıcıdır.</p>
                    <p>
                        Bu madde, tüketicinin zorunlu başvuru yolları (Tüketici Hakem Heyeti / Tüketici Mahkemesi) kapsamındaki uyuşmazlıklarda engel teşkil etmez. Ticari nitelikli uyuşmazlıklarda münhasıran tahkim uygulanır.
                    </p>

                    <hr className="my-6 border-slate-200" />

                    <h3>11. YÜRÜRLÜK</h3>
                    <p>Kullanıcı, online ödeme işlemini tamamlayarak:</p>
                    <ul className="list-disc pl-5 mb-2">
                        <li>Bu sözleşmeyi okuduğunu,</li>
                        <li>Anladığını,</li>
                        <li>Tüm hükümlerini kabul ettiğini</li>
                    </ul>
                    <p>beyan eder.</p>

                    <div className="mt-8 pt-8 border-t border-slate-100 text-sm text-slate-500">
                        Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DistanceSalesAgreementPage;
