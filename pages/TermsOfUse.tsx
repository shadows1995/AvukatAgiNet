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
                    <h1 className="text-3xl font-bold text-slate-900">KİŞİSEL VERİLERİN KORUNMASI KANUNU KAPSAMINDA AYDINLATMA METNİ</h1>
                </div>

                <div className="prose prose-slate max-w-none">
                    <div className="text-center mb-8">
                        <p className="font-bold text-lg">Just Fair Araştırma Danışmanlık A.Ş.<br />(“Şirket” veya “Avukat Ağı”)</p>
                    </div>

                    <p>
                        Şirket olarak <a href="http://www.avukatagi.net" className="text-primary-600 hover:underline">www.avukatagi.net</a> alan adlı internet sitemiz, mobil uygulamalarımız ve bunlara bağlı tüm alt alan adlarında, kullanıcılarımıza ait kişisel verilerin korunmasına ve gizliliğine önem veriyoruz. Bu Aydınlatma Metni; 6698 sayılı Kişisel Verilerin Korunması Kanunu’nun (“<strong>KVKK</strong>”) 10. maddesi ile ikincil düzenlemeler ve Kurul kararları uyarınca, kişisel verilerinizin işlenmesine ilişkin sizleri bilgilendirmek amacıyla hazırlanmıştır.
                    </p>

                    <p>Bu metinde;</p>
                    <ul className="list-disc pl-5 mb-4">
                        <li>Hangi kişisel verileri topladığımız,</li>
                        <li>Bu verileri hangi amaçlarla ve hangi hukuki sebeplere dayanarak işlediğimiz,</li>
                        <li>Verilerin kimlerle ve hangi amaçlarla paylaşılabileceği</li>
                    </ul>
                    <p>ve KVKK kapsamındaki haklarınız açıklanmaktadır.</p>

                    <p className="font-medium">Lütfen Aydınlatma Metni’ni dikkatlice okuyunuz.</p>

                    <hr className="my-6 border-slate-200" />

                    <h3>1. Kişisel Verilerin İşlenmesine İlişkin Temel İlkelerimiz</h3>
                    <p>Kişisel verileriniz;</p>
                    <ul className="list-disc pl-5 mb-4">
                        <li>KVKK ve 5651 sayılı “İnternet Ortamında Yapılan Yayınların Düzenlenmesi…” Kanunu başta olmak üzere ilgili mevzuata,</li>
                        <li>Hukuka ve dürüstlük kurallarına uygun,</li>
                        <li>Doğru ve mümkün olduğunca güncel,</li>
                        <li>Belirli, açık ve meşru amaçlar doğrultusunda,</li>
                        <li>İşlendikleri amaçla bağlantılı, sınırlı ve ölçülü,</li>
                        <li>İlgili mevzuatta öngörülen veya işleme amacı için gerekli süre kadar</li>
                    </ul>
                    <p>işlenmekte ve muhafaza edilmektedir.</p>
                    <p>
                        Kişisel verileriniz; Şirketimiz tarafından tamamen veya kısmen <strong>otomatik yollarla</strong> ya da bir veri kayıt sisteminin parçası olmak kaydıyla <strong>otomatik olmayan yollarla</strong> işlenebilmektedir.
                    </p>
                    <p>
                        Veri işleme amaçlarımızda değişiklik olması halinde, bu Aydınlatma Metni güncellenecek ve yeni metin <a href="http://www.avukatagi.net" className="text-primary-600 hover:underline">www.avukatagi.net</a> üzerinden erişiminize sunulacaktır.
                    </p>

                    <hr className="my-6 border-slate-200" />

                    <h3>2. Tanımlar</h3>
                    <p>Bu metinde geçen başlıca kavramlar kısaca şöyledir:</p>
                    <ul className="list-disc pl-5 mb-4">
                        <li><strong>Kişisel Veri:</strong> Kimliği belirli veya belirlenebilir gerçek kişiye ilişkin her türlü bilgi.</li>
                        <li><strong>Özel Nitelikli Kişisel Veri:</strong> Irk, etnik köken, siyasi düşünce, inanç, sağlık bilgisi, cinsel hayat, ceza mahkûmiyeti, biyometrik ve genetik veriler vb. KVKK’da sınırlı sayıda sayılan veriler.</li>
                        <li><strong>Veri Sorumlusu:</strong> Kişisel verilerin işlenme amaç ve vasıtalarını belirleyen, veri kayıt sistemini kuran ve yöneten gerçek/tüzel kişi.</li>
                        <li><strong>Veri Kayıt Sistemi:</strong> Kişisel verilerin belirli kriterlere göre yapılandırılarak işlendiği kayıt sistemi.</li>
                        <li><strong>Silme/Yok Etme/Anonimleştirme:</strong> Kişisel verilerin, ilgili düzenlemelere uygun şekilde erişilemez, geri getirilemez veya kimliği belirli/belirlenebilir kişiyle ilişkilendirilemez hâle getirilmesini sağlayan işlemler.</li>
                    </ul>

                    <hr className="my-6 border-slate-200" />

                    <h3>3. Kişisel Verilerinizi Hangi Hukuki Sebeplerle İşliyoruz?</h3>
                    <p>
                        KVKK uyarınca kişisel veriler kural olarak ilgili kişinin <strong>açık rızası</strong> ile işlenir. Ancak Kanun’un 5 ve 6. maddelerinde sayılan aşağıdaki hâllerde açık rıza aranmaksızın da veri işlenebilmektedir:
                    </p>
                    <ul className="list-disc pl-5 mb-4">
                        <li>Kanunlarda açıkça öngörülmesi,</li>
                        <li>Bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili ve gerekli olması,</li>
                        <li>Veri sorumlusunun hukuki yükümlülüklerini yerine getirebilmesi için zorunlu olması,</li>
                        <li>İlgili kişi tarafından alenileştirilmiş olması,</li>
                        <li>Bir hakkın tesisi, kullanılması veya korunması için zorunlu olması,</li>
                        <li>Veri sorumlusunun meşru menfaatleri için zorunlu olması ve ilgili kişinin temel hak ve özgürlüklerine zarar vermemesi.</li>
                    </ul>
                    <p>
                        Avukat Ağı’nda yürütülen faaliyetler kapsamında kişisel verileriniz; yukarıdaki hukuki sebeplerden biri veya birkaçına dayanılarak ve gerekli olduğu ölçüde açık rızanız alınarak işlenmektedir.
                    </p>

                    <hr className="my-6 border-slate-200" />

                    <h3>4. İşlediğimiz Kişisel Veriler ve Amaçlarımız</h3>
                    <p>Aşağıda sık kullanılan veri kategorileri örnek olarak belirtilmiştir:</p>

                    <h4 className="font-bold mt-4">a) Üyelik ve Kimlik Bilgileri</h4>
                    <ul className="list-disc pl-5 mb-2">
                        <li>T.C. Kimlik Numarası, baro sicil numarası, ad-soyad, e-posta adresi, telefon numarası, bağlı olduğunuz baro, profil fotoğrafı, katip üyeler için katiplik belgesi vb.</li>
                    </ul>
                    <p><strong>İşleme Amaçlarımız:</strong></p>
                    <ul className="list-disc pl-5 mb-2">
                        <li>Avukat Ağı platformuna üyelik kaydınızın oluşturulması ve hesabınızın doğrulanması,</li>
                        <li>Üyelik sözleşmesinin kurulması ve ifası,</li>
                        <li>Gerekli hallerde sizlerle iletişim kurulması,</li>
                        <li>5651 ve ilgili mevzuat kapsamındaki yükümlülüklerimizin yerine getirilmesi,</li>
                        <li>Uyuşmazlık halinde delil niteliği taşıyabilecek kayıtların tutulması.</li>
                    </ul>
                    <p><strong>Hukuki Sebep:</strong></p>
                    <ul className="list-disc pl-5 mb-4">
                        <li>Sözleşmenin kurulması ve ifası için zorunlu olması,</li>
                        <li>Yer sağlayıcı sıfatıyla hukuki yükümlülüklerimizin yerine getirilmesi,</li>
                        <li>Bir hakkın tesisi, kullanılması veya korunması için zorunlu olması,</li>
                        <li>Gerekli olduğu hallerde açık rızanız.</li>
                    </ul>

                    <h4 className="font-bold mt-4">b) İşlem Güvenliği ve Kullanım Verileri</h4>
                    <ul className="list-disc pl-5 mb-2">
                        <li>IP adresi, bağlantı zamanı, trafik verileri, çerez (cookie) kayıtları, cihaz bilgileri, işletim sistemi, tarayıcı bilgisi vb.</li>
                    </ul>
                    <p><strong>İşleme Amaçlarımız:</strong></p>
                    <ul className="list-disc pl-5 mb-2">
                        <li>5651 sayılı Kanun kapsamında trafik bilgisi kayıtlarının tutulması,</li>
                        <li>Sistem güvenliğinin sağlanması, kötüye kullanımın tespiti ve önlenmesi,</li>
                        <li>Site ve uygulama performansının ölçülmesi, geliştirilmesi, kullanıcı deneyiminin iyileştirilmesi.</li>
                    </ul>
                    <p><strong>Hukuki Sebep:</strong></p>
                    <ul className="list-disc pl-5 mb-4">
                        <li>Yer sağlayıcı olarak hukuki yükümlülüklerimizin yerine getirilmesi,</li>
                        <li>Meşru menfaatlerimizin korunması,</li>
                        <li>Çerezler bakımından gerektiği ölçüde açık rızanız.</li>
                    </ul>

                    <h4 className="font-bold mt-4">c) Görev ve İşlem Kayıtları</h4>
                    <ul className="list-disc pl-5 mb-2">
                        <li>Görevlendirme iletim, başvuru ve atama logları, işlem tarih/saat bilgileri, görev geçmişi.</li>
                    </ul>
                    <p><strong>İşleme Amaçlarımız:</strong></p>
                    <ul className="list-disc pl-5 mb-2">
                        <li>Platformun temel işleyişi olan görev oluşturma, başvuru ve atama süreçlerinin yürütülmesi,</li>
                        <li>Hangi hizmetlerin kullanıldığının tespiti,</li>
                        <li>Uyuşmazlık veya itiraz halinde delil oluşturulması,</li>
                        <li>Adli veya idari makamların taleplerinin karşılanması.</li>
                    </ul>
                    <p><strong>Hukuki Sebep:</strong></p>
                    <ul className="list-disc pl-5 mb-4">
                        <li>Bir hakkın tesisi, kullanılması veya korunması için zorunlu olması,</li>
                        <li>Hukuki yükümlülüklerimizin yerine getirilmesi,</li>
                        <li>Meşru menfaatlerimizin korunması.</li>
                    </ul>

                    <h4 className="font-bold mt-4">d) Profil ve Değerlendirme Bilgileri</h4>
                    <ul className="list-disc pl-5 mb-2">
                        <li>Profil fotoğrafı, “hakkımda” metni, uzmanlık alanları, fatura/birim bilgileriniz, görev yorumları ve puanlamalar.</li>
                    </ul>
                    <p><strong>İşleme Amaçlarımız:</strong></p>
                    <ul className="list-disc pl-5 mb-2">
                        <li>Diğer üyelerin sizinle ilgili mesleki profilinizi görebilmesi,</li>
                        <li>Platformda güven ve şeffaflığın sağlanması,</li>
                        <li>Hizmet kalitesinin ölçülmesi ve iyileştirilmesi.</li>
                    </ul>
                    <p><strong>Hukuki Sebep:</strong></p>
                    <ul className="list-disc pl-5 mb-4">
                        <li>Sözleşmenin ifası,</li>
                        <li>Veri sahibinin kendisi tarafından alenileştirilmiş olması,</li>
                        <li>Bir hakkın tesisi, kullanılması veya korunması için zorunlu olması,</li>
                        <li>Meşru menfaatlerimizin korunması.</li>
                    </ul>

                    <p>
                        Üyelik girişi yapılmaksızın web sitemizin kullanılması halinde; IP adresi, trafik verileri, çerezler ve cihaz bilgileriniz kimliğinizle ilişkilendirilmeksizin <strong>anonim</strong> şekilde işlenebilmekte ve istatistiksel analizler için kullanılabilmektedir. Siteyi kullanmaya devam ederek bu anonim işlemeyi kabul etmiş sayılırsınız.
                    </p>

                    <hr className="my-6 border-slate-200" />

                    <h3>5. Kişisel Verilerinizin Aktarılması</h3>
                    <p>
                        Kişisel verileriniz; KVKK’nın 8. ve 9. maddeleri uyarınca, veri güvenliğinize ilişkin gerekli teknik ve idari tedbirler alınarak aşağıdaki taraflara aktarılabilmektedir.
                    </p>

                    <h4 className="font-bold mt-4">5.1. Yurtiçi Aktarım</h4>
                    <ul className="list-disc pl-5 mb-4">
                        <li>Barındırma, yedekleme, e-posta, SMS ve bildirim hizmetleri aldığımız hizmet sağlayıcılar,</li>
                        <li>Yazılım geliştirme, bakım ve destek sağlayan teknik ekipler ve altyapı sağlayıcıları,</li>
                        <li>Muhasebe, hukuk, denetim ve benzeri danışmanlık aldığımız iş ortakları,</li>
                        <li>Reklam ve kampanya faaliyetlerimiz için çalıştığımız iş ortakları,</li>
                        <li>Yasal yükümlülüklerimiz kapsamında talepte bulunan adli ve idari makamlar.</li>
                    </ul>
                    <p>Verileriniz, yalnızca belirtilen amaçlarla sınırlı ve KVKK’ya uygun şekilde paylaşılmaktadır.</p>

                    <h4 className="font-bold mt-4">5.2. Yurtdışına Aktarım</h4>
                    <p>
                        Sistemlerimizin işletilmesi, geliştirilmesi, yedeklenmesi, hata ve performans analizlerinin yapılması, e-posta/SMS/bildirim gönderimi gibi amaçlarla, gerekli güvenlik tedbirleri alınmış olmak kaydıyla yurtdışında bulunan hizmet sağlayıcılarına ve iş ortaklarımıza veri aktarımı yapılabilir.
                    </p>

                    <h4 className="font-bold mt-4">5.3. Diğer Üyelere Aktarım</h4>
                    <p>Platformun işleyişi gereği, bazı kişisel verileriniz diğer üyelere yansıyabilmektedir. Örneğin:</p>
                    <ul className="list-disc pl-5 mb-4">
                        <li>Hakkınızda ve uzmanlık alanları bilgileriniz, başvuru yaptığınız görevlerde, isim-soyisim bilgileriniz kısmen maskeleme uygulanarak görevi açan üyeye gösterilebilir.</li>
                        <li>Profil resminiz, görev oluşturduğunuzda görevi gören üyelere ve yorum/puan bıraktığınız meslektaşınızın profilinde görünebilir.</li>
                        <li>Görev atadığınız veya size görev atayan meslektaşınız; görevin ifası için gerekli olduğu ölçüde isim, soyisim ve iletişim bilgilerinize erişebilir.</li>
                        <li>Platformdaki akış/sosyal alanlarda yeni kayıt olan, görev oluşturan ya da atama yapılan üyelerin isimleri, soyisimleri kısmen gizlenerek gösterilebilir.</li>
                    </ul>
                    <p>Bu paylaşımlar, sadece platformun amacına uygun faaliyetler yürütülebilsin diye ve ölçülü şekilde yapılmaktadır.</p>

                    <hr className="my-6 border-slate-200" />

                    <h3>6. Veri Sorumlusu</h3>
                    <p>Kişisel verileriniz, KVKK kapsamında veri sorumlusu olan:</p>
                    <p className="font-bold">Just Fair Araştırma Danışmanlık A.Ş.</p>
                    <p>
                        <strong>İnternet Adresi:</strong> <a href="http://www.avukatagi.net" className="text-primary-600 hover:underline">www.avukatagi.net</a><br />
                        <strong>E-posta:</strong> <a href="mailto:kvkk@avukatagi.net" className="text-primary-600 hover:underline">kvkk@avukatagi.net</a>
                    </p>

                    <hr className="my-6 border-slate-200" />

                    <h3>7. KVKK Kapsamındaki Haklarınız ve Başvuru Usulü</h3>
                    <p>KVKK’nın 11. maddesi uyarınca veri sahibi olarak aşağıdaki haklara sahipsiniz:</p>
                    <ul className="list-disc pl-5 mb-4">
                        <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
                        <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
                        <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
                        <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,</li>
                        <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme,</li>
                        <li>İşlenmesini gerektiren sebeplerin ortadan kalkması hâlinde silinmesini veya yok edilmesini isteme,</li>
                        <li>Düzeltme, silme veya yok etme işlemlerinin, verilerinizin aktarıldığı üçüncü kişilere bildirilmesini isteme,</li>
                        <li>İşlenen verilerinizin otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme,</li>
                        <li>Kanuna aykırı işleme sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme.</li>
                    </ul>

                    <p>
                        Taleplerinizi; KVKK ve “Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ” uyarınca, sistemimize kayıtlı e-posta adresinizi kullanarak veya yazılı başvuru yoluyla Şirketimize iletebilirsiniz.
                    </p>

                    <p>Başvurularınızda en azından;</p>
                    <ul className="list-disc pl-5 mb-4">
                        <li>Ad-soyad,</li>
                        <li>T.C. kimlik numarası (yabancılar için pasaport/kimlik numarası),</li>
                        <li>Tebligata esas adres,</li>
                        <li>Varsa bildirim yapılacak e-posta adresi ve telefon numarası,</li>
                        <li>Talep konusu</li>
                    </ul>
                    <p>
                        bilgilerinin yer alması gerekmektedir. Talebinize ilişkin bilgi ve belgeleri başvurunuza eklemeniz sürecin hızlı ilerlemesine yardımcı olacaktır.
                    </p>
                    <p>
                        Başvurularınız, Şirketimize ulaştığı tarihten itibaren <strong>en geç 30 (otuz) gün</strong> içinde, mümkün olduğunca ücretsiz olarak sonuçlandırılacak; işlemin ayrıca bir maliyet gerektirmesi hâlinde Kurul’un belirlediği tarifedeki ücret alınabilecektir.
                    </p>

                    <hr className="my-6 border-slate-200" />

                    <h3>8. Saklama ve İmha</h3>
                    <p>
                        Şirket, kişisel veriler için KVKK’ya uygun bir <strong>Kişisel Veri Saklama ve İmha Politikası</strong> uygulamaktadır.
                    </p>
                    <p>
                        İlgili mevzuatta kişisel verilerin saklanması için belirlenmiş süreler varsa, verileriniz en az bu süre boyunca saklanır; sürelerin sona ermesi veya işleme amacının ortadan kalkması hâlinde kişisel verileriniz, periyodik imha süreçleri kapsamında silinir, yok edilir veya anonim hale getirilir.
                    </p>

                    <hr className="my-6 border-slate-200" />

                    <h3>9. Yürürlük ve Değişiklikler</h3>
                    <p>
                        Bu Aydınlatma Metni, <a href="http://www.avukatagi.net" className="text-primary-600 hover:underline">www.avukatagi.net</a> sitesi ve mobil uygulamaları için hazırlanmış olup yayımlandığı tarihte yürürlüğe girer. Gerekli görüldüğü takdirde metinde değişiklik yapılabilir; güncel versiyon her zaman internet sitemiz üzerinden erişilebilir olacaktır. Uygulamada ortaya çıkabilecek tereddütlerde KVKK ve ilgili ikincil düzenlemeler esas alınır.
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
