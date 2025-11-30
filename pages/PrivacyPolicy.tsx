import React from 'react';
import { ShieldCheck } from 'lucide-react';
import SEO from '../components/SEO';

const PrivacyPolicy = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <SEO
                title="Gizlilik Politikası ve KVKK Aydınlatma Metni - AvukatAğı"
                description="AvukatAğı Gizlilik Politikası ve Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında aydınlatma metni."
            />
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-green-100 rounded-xl">
                        <ShieldCheck className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">Gizlilik ve Kişisel Verilerin İşlenmesi Politikası</h1>
                </div>

                <div className="prose prose-slate max-w-none">
                    <h2 className="text-center font-bold mb-6">KİŞİSEL VERİLERİN KORUNMASI KANUNU KAPSAMINDA<br />AYDINLATMA METNİ</h2>

                    <p>
                        Just Fair Araştırma Danışmanlık A.Ş. (bundan böyle “Şirket” veya “Avukat Ağı” olarak anılacaktır) olarak, <a href="http://www.avukatagi.net" className="text-primary-600 hover:underline">www.avukatagi.net</a> internet sitemizde, mobil uygulamamızda ve tüm alt alan adlarımızda şahsınıza ait kişisel verilerin işlenmesi ve korunması süreçlerine azami özen göstermekteyiz.
                    </p>

                    <p>
                        İşbu Aydınlatma Metni; 6698 sayılı Kişisel Verilerin Korunması Kanunu’nun (“KVKK” veya “Kanun”) 10. maddesi ile ilgili ikincil mevzuat ve Kişisel Verileri Koruma Kurulu kararları doğrultusunda aydınlatma yükümlülüğümüzü yerine getirmek ve sizleri bilgilendirmek amacıyla hazırlanmıştır.
                    </p>

                    <p>Bu metinde;</p>
                    <ul className="list-disc pl-5 mb-4">
                        <li>Hangi kişisel verilerinizi,</li>
                        <li>Hangi amaçlarla ve hangi hukuki sebeplere dayanarak,</li>
                        <li>Hangi yöntemlerle işlediğimiz,</li>
                        <li>Kimlere ve hangi amaçlarla aktarabileceğimiz</li>
                    </ul>
                    <p>
                        ve KVKK kapsamındaki haklarınız hakkında detaylı bilgi yer almaktadır. Bu nedenle metni dikkatlice okumanızı tavsiye ederiz.
                    </p>

                    <h3>1. Kişisel Verilerinizi İşleme Sürecindeki Temel İlkelerimiz</h3>
                    <p>Kişisel verilerinizi;</p>
                    <ul className="list-disc pl-5 mb-4">
                        <li>Hukuka ve dürüstlük kurallarına uygun,</li>
                        <li>Doğru ve gerektiğinde güncel,</li>
                        <li>Belirli, açık ve meşru amaçlar doğrultusunda,</li>
                        <li>İşlendikleri amaçla bağlantılı, sınırlı ve ölçülü,</li>
                        <li>İlgili mevzuatta öngörülen veya işleme amacı için gerekli süre kadar</li>
                    </ul>
                    <p>
                        işlemekte ve muhafaza etmekteyiz.
                    </p>
                    <p>
                        Kişisel verileriniz, tamamen veya kısmen otomatik yollarla ya da bir veri kayıt sisteminin parçası olmak kaydıyla otomatik olmayan yollarla işlenebilmektedir.
                    </p>
                    <p>
                        Aydınlatma metnimizde yer alan veri işleme amaçlarımızda değişiklik olması halinde, veri işleme faaliyetine başlamadan önce bu metin güncellenerek tarafınıza yeniden sunulacaktır.
                    </p>

                    <h3>2. Tanımlar</h3>
                    <p>Bu Aydınlatma Metni’nde kullanılan temel kavramlardan bazıları aşağıdaki gibidir:</p>
                    <ul className="list-none pl-0 space-y-2">
                        <li><strong>Kişisel Veri:</strong> Kimliği belirli veya belirlenebilir gerçek kişiye ilişkin her türlü bilgi.</li>
                        <li><strong>Özel Nitelikli Kişisel Veri:</strong> Irk, etnik köken, siyasi düşünce, felsefi inanç, din, mezhep veya diğer inançlar, kılık kıyafet, dernek/vakıf/sendika üyeliği, sağlık, cinsel hayat, ceza mahkûmiyeti ve güvenlik tedbirleriyle ilgili veriler ile biyometrik ve genetik veriler.</li>
                        <li><strong>Veri Sorumlusu:</strong> Kişisel verilerin işleme amaçlarını ve vasıtalarını belirleyen, veri kayıt sistemini kuran ve yöneten gerçek veya tüzel kişi.</li>
                        <li><strong>Veri Kayıt Sistemi:</strong> Kişisel verilerin belirli kriterlere göre yapılandırılarak işlendiği kayıt sistemi.</li>
                        <li><strong>Kişisel Verilerin Silinmesi/Yok Edilmesi/Anonim Hale Getirilmesi:</strong> KVKK ve ilgili mevzuatta öngörülen yöntemlerle verilerin erişilemez, geri getirilemez veya kimliği belirli/belirlenebilir kişiyle ilişkilendirilemez hale getirilmesi işlemlerini ifade eder.</li>
                    </ul>

                    <h3>3. Kişisel Verilerinizi İşleme Şartlarımız</h3>
                    <p>
                        KVKK uyarınca kişisel veriler, kural olarak ilgili kişinin açık rızası ile işlenebilmektedir. Açık rıza; belirli bir konuya ilişkin, bilgilendirmeye dayanan ve özgür iradeyle açıklanan rızadır.
                    </p>
                    <p>
                        Bununla birlikte Kanun’un 5. ve 6. maddelerinde sayılan aşağıdaki hallerde açık rıza aranmaksızın kişisel verileriniz işlenebilmektedir:
                    </p>
                    <ul className="list-disc pl-5 mb-4">
                        <li>Kanunlarda açıkça öngörülmesi</li>
                        <li>Bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olmak kaydıyla, sözleşmenin taraflarına ait kişisel verilerin işlenmesinin gerekli olması</li>
                        <li>Veri sorumlusu olarak hukuki yükümlülüklerimizi yerine getirebilmemiz için veri işlemenin zorunlu olması</li>
                        <li>İlgili kişinin kendisi tarafından verinin alenileştirilmiş olması</li>
                        <li>Bir hakkın tesisi, kullanılması veya korunması için veri işlemenin zorunlu olması</li>
                        <li>İlgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla, veri sorumlusunun meşru menfaatleri için veri işlenmesinin zorunlu olması</li>
                    </ul>
                    <p>
                        Avukat Ağı’nda yürütülen faaliyetler kapsamında kişisel verileriniz, yukarıda sayılan hukuki sebeplerden biri veya birkaçı ile birlikte gerektiği ölçüde açık rızanıza dayanılarak işlenmektedir.
                    </p>

                    <h3>4. İşlediğimiz Kişisel Verileriniz ve İşleme Amaçlarımız</h3>
                    <p>
                        Aşağıdaki tablo, genel olarak işlediğimiz kişisel verileri, işleme amaçlarımızı ve hukuki sebeplerimizi göstermektedir.
                    </p>
                    <div className="overflow-x-auto my-4">
                        <table className="min-w-full border border-slate-200 text-sm text-left">
                            <thead className="bg-slate-50 font-semibold text-slate-700">
                                <tr>
                                    <th className="border p-2">Kişisel Verileriniz</th>
                                    <th className="border p-2">İşleme Amaçlarımız</th>
                                    <th className="border p-2">Yasal/Hukuki Sebep</th>
                                    <th className="border p-2">Sisteme Ulaştığı Ortam</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border p-2">T.C. Kimlik Numarası, Baro Sicil Numarası, İsim-Soyisim, E-posta, Telefon, Bağlı Olduğunuz Baro, Profil Fotoğrafı, Katip üyeler için katiplik belgesi vb.</td>
                                    <td className="border p-2">Avukat Ağı’na üyeliğinizin gerçekleştirilmesi, bilgilerinizin doğrulanması, üyelik hesabınızın onaylanması ve üyelik sözleşmesinin kurulması ve ifası; 5651 sayılı Kanun ve ilgili mevzuattan doğan yükümlülüklerin yerine getirilmesi; üyelik süreçlerinin yönetilmesi</td>
                                    <td className="border p-2">Sözleşmenin kurulması ve ifası için gerekli olması, 5651 sayılı Kanun’dan kaynaklanan yer sağlayıcı yükümlülüklerinin yerine getirilmesi için zorunlu olması, gerekli hallerde açık rızanız</td>
                                    <td className="border p-2">www.avukatagi.net ve mobil uygulamalar</td>
                                </tr>
                                <tr>
                                    <td className="border p-2">IP adresi, trafik verileri, çerez bilgileri, kullanılan cihaz, işletim sistemi, tarayıcı bilgisi</td>
                                    <td className="border p-2">5651 ve ilgili mevzuat kapsamındaki log kayıtları yükümlülüklerimizin yerine getirilmesi; sistem güvenliği, hata tespiti ve performans analizi; kullanıcı deneyiminin ve altyapının geliştirilmesi</td>
                                    <td className="border p-2">Yer sağlayıcı olarak hukuki yükümlülüklerimizin yerine getirilmesi, meşru menfaatlerimiz, gerekli olduğu ölçüde açık rızanız</td>
                                    <td className="border p-2">www.avukatagi.net ve mobil uygulamalar</td>
                                </tr>
                                <tr>
                                    <td className="border p-2">Görevlendirme iletim, başvuru ve atama logları; görev geçmişi</td>
                                    <td className="border p-2">Üyelerimizin hangi hizmetleri kullandığının takibi; görev oluşturma, başvuru ve atama süreçlerinin yürütülmesi; uyuşmazlık halinde delil olarak saklanması; adli/ idari makamların talep etmesi halinde bilgi verilmesi</td>
                                    <td className="border p-2">Bir hakkın tesisi, kullanılması veya korunması için veri işlemenin zorunlu olması; meşru menfaatlerimiz; hukuki yükümlülüklerimiz; gerekli olduğu ölçüde açık rızanız</td>
                                    <td className="border p-2">www.avukatagi.net ve mobil uygulamalar</td>
                                </tr>
                                <tr>
                                    <td className="border p-2">Profil resmi, “Hakkımda” metni, uzmanlıklar, fatura/birim bilgileri, görev yorum ve puanlamaları</td>
                                    <td className="border p-2">Üyelerin sistemden en verimli şekilde yararlanabilmesi; mesleki profil oluşturulması; üyelerin birbirlerini değerlendirmesi; şeffaflık ve güvenin sağlanması; faturalama ve muhasebe süreçlerinin yürütülmesi</td>
                                    <td className="border p-2">Veri sahibinin kendisi tarafından alenileştirilmiş olması; bir hakkın tesisi, kullanılması veya korunması için zorunlu olması; sözleşmenin ifası; hukuki yükümlülükler</td>
                                    <td className="border p-2">www.avukatagi.net ve mobil uygulamalar</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p>
                        Üyelik girişi gerçekleştirilmediği durumda IP adresi, trafik verisi, çerezler, kullanılan cihaz, işletim sistemi ve tarayıcı bilgileriniz, kimliğinizle eşleştirilmeden anonim olarak işlenebilmekte; bu veriler, sistem altyapısının güçlendirilmesi ve potansiyel kullanıcılarımızı daha iyi tanımaya yönelik analizler amacıyla kullanılmaktadır. Sitemizi üyelik girişi yapmaksızın kullanmaya devam ederek bu verilerin anonim olarak işlenmesini kabul etmiş sayılırsınız.
                    </p>

                    <h3>5. Kişisel Verilerin Aktarılması</h3>
                    <p>
                        Kişisel verileriniz; KVKK’nın 8. ve 9. maddeleri uyarınca, veri güvenliğinizi teminen gerekli tüm teknik ve idari tedbirler alınarak ve yeterli koruma sağlanmak suretiyle, aşağıdaki taraflarla paylaşılabilmektedir:
                    </p>
                    <h4>5.1. Yurtiçi Aktarım</h4>
                    <ul className="list-disc pl-5 mb-4">
                        <li>Avukat Ağı’nın faaliyetlerini sürdürebilmesi için hizmet aldığı barındırma, yedekleme, e-posta, SMS, bildirim, güvenlik ve altyapı hizmeti sağlayıcılarına,</li>
                        <li>Yazılım, bakım, destek, geliştirme faaliyetlerini yürüten teknik ekip, yazılım ve veri tabanı uzmanlarına,</li>
                        <li>Muhasebe, finans, hukuk, denetim, danışmanlık gibi alanlarda birlikte çalıştığımız iş ortaklarımıza ve danışmanlarımıza,</li>
                        <li>Reklam, kampanya, tanıtım ve pazarlama faaliyetlerimiz kapsamında çalıştığımız iş ortaklarımıza,</li>
                        <li>5651 sayılı Kanun ve diğer mevzuattan kaynaklanan yükümlülüklerimiz çerçevesinde talep edilmesi halinde adli ve idari makamlara,</li>
                    </ul>
                    <p>mevzuata uygun şekilde aktarılabilmektedir.</p>

                    <h4>5.2. Yurtdışına Aktarım</h4>
                    <p>
                        Kişisel verileriniz; sistemimizin barındırılması, yedeklenmesi, geliştirilmesi, uzaktan teknik destek sağlanması, toplu e-posta/SMS gönderimi, analiz ve raporlama gibi amaçlarla, gerekli güvenlik önlemleri alınmak suretiyle yurtdışında bulunan hizmet sağlayıcılarına ve iş ortaklarımıza aktarılabilmektedir. Bu kapsamda yapılacak tüm aktarım faaliyetlerinde KVKK’nın 9. maddesi ve Kurul kararları titizlikle gözetilmektedir.
                    </p>

                    <h4>5.3. Diğer Üyelere Aktarım</h4>
                    <p>Platformun işleyişi gereği bazı kişisel verileriniz diğer üyelere gösterilebilmektedir. Örneğin:</p>
                    <ul className="list-disc pl-5 mb-4">
                        <li>Hakkımda ve uzmanlık alanları bilgileriniz, isim-soyisim bilgileriniz gizlenmiş olacak şekilde, başvuru yaptığınız görevlerde görevi açan üyeye gösterilebilir.</li>
                        <li>Profil resminiz, görev oluşturduğunuzda, görev iletilen üyelere ve yorum/puan bıraktığınız meslektaşınızın profil sayfasında, gerektiği ölçüde isim-soyisim bilgisi maskelenerek gösterilebilir.</li>
                        <li>Görev ataması yaptığınız veya size görev atayan meslektaşınıza; isim, soyisim ve iletişim bilgileriniz, görevin ifası için gerekli sınırlar dahilinde gösterilebilir.</li>
                        <li>Platform içi akış ve sosyal özellikler kapsamında, “Avukat Ağı’nda neler oluyor?” benzeri alanlarda yeni üye olan, görev oluşturan, atama yapan veya atanan üyelerin isimleri, soyisimlerin ilk harfleri gösterilmek suretiyle paylaşılabilir.</li>
                    </ul>
                    <p>
                        Bu paylaşımlar, sadece sistemin doğru işlemesi ve taraflar arasında güven ve şeffaflık sağlanması için gerekli olduğu ölçüde yapılmaktadır.
                    </p>

                    <h3>6. Veri Sorumlusu</h3>
                    <p>Kişisel verileriniz, veri sorumlusu sıfatıyla Just Fair Araştırma Danışmanlık A.Ş. tarafından işlenmektedir.</p>
                    <p>
                        <strong>Unvan:</strong> Just Fair Araştırma Danışmanlık A.Ş.<br />
                        <strong>İnternet Sitesi:</strong> <a href="http://www.avukatagi.net" className="text-primary-600 hover:underline">www.avukatagi.net</a><br />
                        <strong>E-posta:</strong> <a href="mailto:info@avukatagi.net" className="text-primary-600 hover:underline">info@avukatagi.net</a>
                    </p>

                    <h3>7. KVKK Kapsamındaki Haklarınız ve Başvuru Usulü</h3>
                    <p>KVKK’nın 11. maddesi uyarınca veri sahibi olarak aşağıdaki haklara sahipsiniz:</p>
                    <ul className="list-disc pl-5 mb-4">
                        <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
                        <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme,</li>
                        <li>Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
                        <li>Kişisel verilerinizin yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,</li>
                        <li>Kişisel verilerinizin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme,</li>
                        <li>KVKK ve ilgili mevzuat hükümlerine uygun olarak işlenmiş olmasına rağmen, işlenmesini gerektiren sebeplerin ortadan kalkması hâlinde kişisel verilerinizin silinmesini veya yok edilmesini isteme,</li>
                        <li>Düzeltme, silme veya yok edilme taleplerinizin, kişisel verilerinizin aktarıldığı üçüncü kişilere bildirilmesini isteme,</li>
                        <li>İşlenen verilerinizin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme,</li>
                        <li>Kişisel verilerinizin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme.</li>
                    </ul>

                    <h4>Başvuru Yöntemi</h4>
                    <p>
                        Bu haklarınıza ilişkin taleplerinizi, KVKK ve “Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ” uyarınca;
                    </p>
                    <ul className="list-disc pl-5 mb-4">
                        <li>Kayıtlı elektronik posta (KEP) adresiniz üzerinden,</li>
                        <li>Sistemimize kayıtlı e-posta adresinizi kullanarak,</li>
                        <li>Ya da yazılı olarak ıslak imzalı dilekçe ile</li>
                    </ul>
                    <p>Şirketimize iletebilirsiniz.</p>

                    <p>Başvurunuzda;</p>
                    <ul className="list-disc pl-5 mb-4">
                        <li>Adınız, soyadınız,</li>
                        <li>T.C. kimlik numaranız (yabancılar için uyruğu ve pasaport numarası),</li>
                        <li>Tebligata esas yerleşim yeri veya iş yeri adresiniz,</li>
                        <li>Varsa bildirime esas e-posta adresiniz, telefon numaranız,</li>
                        <li>Talep konunuz</li>
                    </ul>
                    <p>ve talep konusuna ilişkin bilgi ve belgelerin yer alması gerekmektedir.</p>
                    <p>
                        Başvurunuz bize ulaştığı tarihi izleyen en geç 30 (otuz) gün içinde, mümkün olduğu ölçüde ücretsiz olarak sonuçlandırılacaktır. İşlemin ayrıca bir maliyet gerektirmesi hâlinde, Kişisel Verileri Koruma Kurulu’nca belirlenen tarifedeki ücret alınabilecektir.
                    </p>

                    <h3>8. Saklama ve İmha</h3>
                    <p>
                        Şirket, kişisel veriler için KVKK ve ilgili mevzuata uygun bir Kişisel Veri Saklama ve İmha Politikası oluşturmuştur.
                    </p>
                    <p>
                        Kişisel verileriniz, ilgili mevzuatta öngörülen veya işleme amacı için gerekli asgari süre boyunca saklanmakta; bu sürenin sona ermesiyle birlikte periyodik imha süreçleri kapsamında silinmekte, yok edilmekte veya anonim hale getirilmektedir.
                    </p>

                    <h3>9. Yürürlük ve Değişiklikler</h3>
                    <p>
                        Bu Aydınlatma Metni, <a href="http://www.avukatagi.net" className="text-primary-600 hover:underline">www.avukatagi.net</a> web sitemiz ve mobil uygulamalarımız için KVKK ve ilgili mevzuata uygun olarak hazırlanmıştır.
                    </p>
                    <p>
                        Metinde yer alan hükümlerin uygulanmasında Türk hukuku esas alınır; herhangi bir uyuşmazlıkta KVKK ve ikincil düzenlemeler öncelikle uygulanır. Gerekli görülmesi hâlinde Aydınlatma Metni güncellenerek yeni versiyonu web sitemiz üzerinden yayımlanacaktır.
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
