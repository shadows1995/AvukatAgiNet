import React from 'react';
import { FileText } from 'lucide-react';
import SEO from '../components/SEO';

const TermsOfUse = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <SEO
                title="Kullanıcı Sözleşmesi - AvukatAğı"
                description="AvukatAğı Üyelik ve Kullanıcı Sözleşmesi. Platform kullanım koşulları, haklar ve yükümlülükler."
            />
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-primary-100 rounded-xl">
                        <FileText className="w-8 h-8 text-primary-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">ÜYELİK VE KULLANICI SÖZLEŞMESİ</h1>
                </div>

                <div className="prose prose-slate max-w-none">
                    <div className="text-center mb-8">
                        <p className="font-bold text-lg">BÇK TARIM GIDA İTHALAT İHRACAT SANAYİ VE TİCARET LİMİTED ŞİRKETİ<br />(Bu sözleşmede “AvukatAgi” olarak anılacaktır)</p>
                    </div>

                    <p>
                        AvukatAgi web sitesi ve mobil uygulaması (<a href="http://www.avukatagi.net" className="text-primary-600 hover:underline">www.avukatagi.net</a>) üzerinden sunulan hizmetlerden yararlanan tüm kullanıcılar, işbu Üyelik ve Kullanıcı Sözleşmesi’nde belirtilen tüm koşulları peşinen kabul etmiş sayılır. Bu şartların okunmaması, yanlış anlaşılması veya gereği gibi uygulanmaması sebebiyle oluşabilecek her türlü maddi/manevi zarardan AvukatAgi ve bağlı çalışanları/iş ortakları sorumlu tutulamaz.
                    </p>
                    <p>
                        AvukatAgi, hizmet kapsamını, sistem işleyişini, sözleşme hükümlerini ve fiyatlandırmayı önceden bildirmeksizin tek taraflı olarak güncelleme hakkına sahiptir.
                    </p>
                    <p>
                        <a href="http://www.avukatagi.net" className="text-primary-600 hover:underline">www.avukatagi.net</a> adresi veya mobil uygulamasına erişim sağlayan her kullanıcı, bu sözleşmenin tamamının kendisi için bağlayıcı olduğunu kabul ve taahhüt eder.
                    </p>

                    <hr className="my-6 border-slate-200" />

                    <h3>1. TARAFLAR</h3>
                    <p>
                        İşbu sözleşme,<br />
                        <strong>BÇK TARIM GIDA İTHALAT İHRACAT SANAYİ VE TİCARET LİMİTED ŞİRKETİ (AvukatAgi)</strong> ile,<br />
                        AvukatAgi web sitesi/mobil uygulamasına üye olan avukatlar, stajyer avukatlar ve resmi kimlik ibraz eden katipler arasında akdedilmiştir.
                    </p>
                    <p>Üyelik işlemini tamamlayan kullanıcı bu sözleşme hükümlerini elektronik ortamda onaylamış olur.</p>

                    <hr className="my-6 border-slate-200" />

                    <h3>2. AMAÇ VE KAPSAM</h3>
                    <p>
                        Bu sözleşme; avukatların il dışı tevkil, duruşma ve adliye işlemlerinde birbirine destek verebilmesini sağlamak amacıyla AvukatAgi tarafından sunulan hizmetlerin kapsamını, kullanım koşullarını, tarafların hak ve yükümlülüklerini düzenler.
                    </p>
                    <p>
                        AvukatAgi’nin kullanımına ilişkin platform kuralları, yardım metinleri, bildirimler ve tüm ek açıklamalar da sözleşmenin ayrılmaz parçasıdır.
                    </p>

                    <hr className="my-6 border-slate-200" />

                    <h3>3. TANIMLAR</h3>
                    <ul className="list-none pl-0 space-y-4">
                        <li>
                            <strong>AvukatAgi:</strong><br />
                            Avukatların birbirleriyle yardımlaşmasını sağlamak amacıyla geliştirilen web/mobil platform.
                        </li>
                        <li>
                            <strong>www.avukatagi.net:</strong><br />
                            Platformun resmi internet sitesidir.
                        </li>
                        <li>
                            <strong>Kullanıcı/Üye:</strong><br />
                            Bu sözleşmeyi kabul ederek sisteme kayıt olan avukat, stajyer avukat veya kimlik ibraz eden katip.
                        </li>
                        <li>
                            <strong>Premium / Premium+ Üyelik:</strong><br />
                            Görev alabilmek için satın alınması gereken ücretli hizmet modeli.
                        </li>
                        <li>
                            <strong>Görev Oluşturan:</strong><br />
                            Kendi işi kapsamında şehir dışı işlem için görev açan üye.
                        </li>
                        <li>
                            <strong>Göreve Başvuran:</strong><br />
                            Premium veya Premium+ üyeliği ile göreve başvuru yapan üye.
                        </li>
                        <li>
                            <strong>Göreve Atanan:</strong><br />
                            Görev oluşturan tarafından seçilen veya sistem tarafından otomatik atanan üye.
                        </li>
                        <li>
                            <strong>Görev Atama Algoritması:</strong><br />
                            Adil iş dağılımı amacıyla kullanılan sistemsel algoritma.
                        </li>
                        <li>
                            <strong>Bekleyen Görevler:</strong><br />
                            Görev alma durumu açık olan kullanıcılara iletilmiş ve 15 dakika içinde başvuru yapılabilecek görevler.
                        </li>
                        <li>
                            <strong>Profilim, Ayarlar, Destek Sistemi:</strong><br />
                            Üyelerin kendi bilgilerini ve bildirim tercihlerini yönettiği bölümler.
                        </li>
                    </ul>

                    <hr className="my-6 border-slate-200" />

                    <h3>4. AVUKATAGİ TARAFINDAN SUNULAN HİZMET</h3>
                    <p>
                        AvukatAgi; görev oluşturan ve görev alan üyeler arasında yalnızca iletişim köprüsü kurar.
                        Görevin fiilen yapılması tamamen taraflar arasındaki hukuki ilişkiye tabidir.
                    </p>
                    <p><strong>AvukatAgi:</strong></p>
                    <ul className="list-disc pl-5 mb-4">
                        <li>Görevin niteliği, içeriği veya doğruluğundan,</li>
                        <li>Taraflar arasındaki ücret anlaşmazlıklarından,</li>
                        <li>Görevin ifasından doğabilecek zararlardan,</li>
                    </ul>
                    <p>sorumlu değildir.</p>
                    <p>Hukuka aykırı kullanım tespitinde üyelik askıya alınabilir veya tamamen iptal edilebilir.</p>

                    <hr className="my-6 border-slate-200" />

                    <h3>5. SUNULAN HİZMETLERİN KULLANIMI</h3>

                    <h4 className="font-bold mt-4">5.1 – Görev Oluşturan Açısından</h4>
                    <p>Görev oluşturmak ücretsizdir.</p>
                    <p>Görev oluşturan üye;</p>
                    <ul className="list-disc pl-5 mb-2">
                        <li>Adliye,</li>
                        <li>İş türü,</li>
                        <li>Tarih/saat,</li>
                        <li>Bütçe,</li>
                        <li>Açıklama</li>
                    </ul>
                    <p>bilgilerini doğru ve eksiksiz girmekle yükümlüdür.</p>
                    <p>Görev açıldığında:</p>
                    <ul className="list-disc pl-5 mb-2">
                        <li>Seçili adliyede bulunan Premium/Premium+ üyelerine bildirilir.</li>
                        <li>Başvuru süresi 15 dakikadır.</li>
                        <li>Görev oluşturulduktan sonra iptal edilemez. (İptal edilmesi gerekiyorsa taraflar doğrudan iletişime geçer.)</li>
                    </ul>
                    <p>Süre sonunda:</p>
                    <ul className="list-disc pl-5 mb-2">
                        <li>Görev oluşturan üye dilediği başvuranı seçebilir.</li>
                        <li>Seçim yapılmazsa sistem görev atama algoritmasına göre otomatik atama yapabilir.</li>
                        <li>Görev tamamlandıktan sonra görev oluşturan üye, belirttiği ücreti ödemekle yükümlüdür.</li>
                    </ul>

                    <h4 className="font-bold mt-4">5.2 – Göreve Başvuran Açısından</h4>
                    <p>Göreve başvuru yapabilmek için:</p>
                    <p className="font-bold">➡️ Premium veya Premium+ üyelik zorunludur.</p>
                    <p>
                        Başvuru yapmak, görevin mutlaka size atanacağı anlamına gelmez.
                        Seçilmediğiniz görevler için iade talep edilemez.
                    </p>
                    <p>Premium hizmet bedeli yıllık olup, satın alındığı andan itibaren aktifleşir.</p>

                    <h4 className="font-bold mt-4">5.3 – Göreve Atanan Açısından</h4>
                    <p>Görev atanması durumunda;</p>
                    <ul className="list-disc pl-5 mb-2">
                        <li>Üye, görevi Avukatlık Kanunu ve meslek etiği çerçevesinde özenle yürütmelidir.</li>
                        <li>Görev oluşturanla karşılıklı iletişim bilgilerini görüntüler.</li>
                        <li>Görev tamamlandığında belirtilen ücrete hak kazanır.</li>
                    </ul>
                    <p>Ödeme ihtilaflarından AvukatAgi sorumlu değildir; şikâyet halinde ilgili üye sistemden çıkarılabilir.</p>

                    <hr className="my-6 border-slate-200" />

                    <h3>6. KULLANIM ŞARTLARI</h3>
                    <p>Kullanıcı;</p>
                    <ul className="list-disc pl-5 mb-2">
                        <li>Doğru ve güncel bilgi vermeyi,</li>
                        <li>Sistemi yalnızca hukuka uygun amaçlarla kullanmayı,</li>
                        <li>Şifre güvenliğini sağlamayı,</li>
                        <li>Başkalarının haklarını ihlal etmemeyi,</li>
                    </ul>
                    <p>kabul eder.</p>
                    <p>Yanlış bilgi verilmesi, sahte görev açılması, haksız rekabet yaratılması gibi fiiller üyeliğin iptaline sebep olur.</p>

                    <hr className="my-6 border-slate-200" />

                    <h3>7. KULLANICILARIN HAK VE YÜKÜMLÜLÜKLERİ</h3>
                    <p>Üyeler:</p>
                    <ul className="list-disc pl-5 mb-2">
                        <li>Tüm kurallara uymakla,</li>
                        <li>Kendi hesap güvenliklerini sağlamakla,</li>
                        <li>Göreve ait bilgi ve belgeleri gizlilikle kullanmakla,</li>
                        <li>İşini meslek etiğine uygun yürütmekle,</li>
                    </ul>
                    <p>yükümlüdür.</p>
                    <p>AvukatAgi tarafsızdır; görevlendirme süreçlerinde yalnızca teknik altyapı sağlar ve hiçbir hukuki/cezai sorumluluk üstlenmez.</p>

                    <hr className="my-6 border-slate-200" />

                    <h3>8. ÜYELİK İŞLEMLERİ</h3>
                    <p>Üyelik:</p>
                    <ul className="list-disc pl-5 mb-2">
                        <li>Avukat ve katiplere açıktır.</li>
                        <li>TC kimlik ve Baro Sicil doğrulaması otomatik yapılır.</li>
                        <li>SMS/e-posta doğrulaması yapılmadan üyelik tamamlanmaz.</li>
                        <li>Profil fotoğrafı ve bilgiler sonradan güncellenebilir.</li>
                    </ul>

                    <hr className="my-6 border-slate-200" />

                    <h3>9. BİLDİRİM SİSTEMİ</h3>
                    <p>Seçili adliyelerde görev açıldığında bildirimler:</p>
                    <ul className="list-disc pl-5 mb-2">
                        <li>Mobil bildirim,</li>
                        <li>E-posta,</li>
                    </ul>
                    <p>yollarıyla iletilir.</p>
                    <p>Otomatik arama bulunmamaktadır.</p>
                    <p>Görev alma durumu “Kapalı” olan kullanıcıya görev iletilmez.</p>

                    <hr className="my-6 border-slate-200" />

                    <h3>10. GÖREVLENDİRME GELME SIKLIĞI</h3>
                    <p>
                        Görev sıklığı; şehir, adliye yoğunluğu, avukat sayısı ve görevin niteliğine göre değişir.
                        AvukatAgi hiçbir şekilde “belirli sayıda görev garantisi” vermez.
                    </p>
                    <p>Premium üyelik bir hizmettir; başvuru hakkı kazandırır ancak iş garantisi sağlamaz.</p>

                    <hr className="my-6 border-slate-200" />

                    <h3>11. GÖREVLENDİRME SONRASI SORUMLULUK</h3>
                    <p>
                        Taraflar arasında doğabilecek ücret, iş kalitesi veya etik sorunlardan AvukatAgi sorumlu değildir.
                        Etik ihlal durumunda ilgili üye sistemden kaldırılabilir.
                    </p>

                    <hr className="my-6 border-slate-200" />

                    <h3>12. PREMIUM ÜYELİK VE İADE</h3>
                    <p>Premium üyelik isteğe bağlıdır.</p>
                    <p>Ödeme sonrası üyelik hemen başlar.</p>
                    <p>İade koşulları Mesafeli Satış Sözleşmesi çerçevesinde değerlendirilir.</p>

                    <hr className="my-6 border-slate-200" />

                    <h3>13. ÜYELİK İPTALİ</h3>
                    <p>Kullanıcı kendi hesabını Ayarlar → “Hesabımı Sil” bölümünden silebilir.</p>
                    <p>AvukatAgi, sistem kötüye kullanıldığında üyeliği tek taraflı sonlandırma hakkına sahiptir.</p>

                    <hr className="my-6 border-slate-200" />

                    <h3>14. İLETİŞİM</h3>
                    <p className="font-bold">BÇK TARIM GIDA İTHALAT İHRACAT SANAYİ VE TİCARET LTD. ŞTİ.</p>
                    <p>
                        <strong>E-posta:</strong> <a href="mailto:iletisim@avukatagi.net" className="text-primary-600 hover:underline">iletisim@avukatagi.net</a>
                    </p>
                    <p>
                        <strong>Web:</strong> <a href="http://www.avukatagi.net" className="text-primary-600 hover:underline">www.avukatagi.net</a>
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
