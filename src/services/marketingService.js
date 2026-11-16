import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();
const SETTINGS_KEY = "marketing_campaign_state";
const DEFAULT_DAILY_LIMIT = 100;
const DEFAULT_MAILTRAP_TOKEN = process.env.MAILTRAP_TOKEN || "6f03fcbc60f27b98ec05e5bc932eb05c";
// 10 distinct angles/sides of AvukatAğı so each full-list cycle highlights a different value proposition
export const MARKETING_ANGLES = [
    {
        angleId: "time_saving_conflicts",
        angleTitle: "Duruşma Çakışmaları ve Zaman Tasarrufu",
        subject: "Meslektaşım, Duruşmalarınız Çakıştığında veya Şehir Dışındayken Ne Yapıyorsunuz?",
        preheader: "Aynı saatteki iki duruşmaya yetişme stresine AvukatAğı ile son verin.",
        headline: "Duruşma Çakışmalarına ve Saatler Süren Yol Mesaisine Son Verin",
        greeting: "Değerli Meslektaşımız,",
        paragraphs: [
            "Avukatlık mesleğinin en büyük zorluklarından biri, aynı gün ve saatte farklı mahkemelerde çakışan duruşmalar veya tek bir işlem için saatlerce trafikte/şehir dışında vakit kaybetmektir.",
            "AvukatAğı (avukatagi.net), Türkiye'nin 81 ilindeki tüm adliyelerde görev yapan meslektaşlarımızı güvenli, hızlı ve kurumsal bir tevkil ağında buluşturmak için geliştirildi. İhtiyacınız olan adliyede saniyeler içinde görev ilanı açabilir, o adliyede halihazırda bulunan meslektaşlarımızın başvuruları arasından seçiminizi yapabilirsiniz."
        ],
        bulletPoints: [
            "81 İl ve Tüm Adliyeler: Çağlayan, İstanbul Anadolu, Bakırköy, Sıhhiye, Bayraklı dahil Türkiye'deki tüm adliyelerde anında meslektaş desteği.",
            "Acil Görev Seçeneği: Duruşmaya dakikalar kala bile 5 dakikalık 'Acil Görev' moduyla hızlıca meslektaş bulun.",
            "Sıfır Komisyon: Ödemelerinizde veya aldığınız görevlerde platform hiçbir komisyon kesintisi yapmaz.",
            "Yeni Üyelere Özel: Hemen ücretsiz kaydolun ve 2 Ay Ücretsiz Beta Premium+ ayrıcalıklarını anında aktif edin!"
        ],
        ctaText: "AvukatAğı'na Ücretsiz Katılın",
        closingNote: "Mesleki dayanışmamızı dijital çağın hızıyla güçlendirmek dileğiyle, iyi çalışmalar dileriz.",
        generatedBy: "ai_library"
    },
    {
        angleId: "extra_income_courthouse",
        angleTitle: "Adliyedeyken Ek Gelir ve İş Ağı Fırsatı",
        subject: "Adliyede Duruşma Beklerken Geçen Zamanı Kazanca Dönüştürün ⚖️",
        preheader: "Bulunduğunuz adliyedeki tevkil görevlerini üstlenerek hem meslektaşlarınıza destek olun hem ek gelir elde edin.",
        headline: "Bulunduğunuz Adliyedeki Fırsatları Kaçırmayın",
        greeting: "Değerli Meslektaşımız,",
        paragraphs: [
            "Haftanın birkaç günü zaten adliyedesiniz. Duruşma sırası beklerken veya aynı adliyede iki işiniz arasında boşluk varken, başka bir şehirdeki meslektaşınızın o adliyedeki duruşmasına, icra işlemine veya dosya incelemesine katılarak ek gelir elde edebilirsiniz.",
            "AvukatAğı üzerinde sadece düzenli gittiğiniz adliyeleri (örneğin İstanbul Çağlayan, Ankara Sıhhiye, İzmir vb.) izleme listenize eklemeniz yeterli. Seçtiğiniz adliyelerde yeni bir görev açıldığında sistem sizi anında bilgilendirir."
        ],
        bulletPoints: [
            "Şeffaf ve Garantili Alt Limitli Ücretler: Duruşma, icra, haciz ve dosya inceleme görevlerinde meslek vakarına uygun ücretlendirme.",
            "Tek Tıkla Başvuru: Size uygun göreve saniyeler içinde başvurun, onaylandığında görev sahibiyle WhatsApp veya telefon üzerinden doğrudan iletişime geçin.",
            "Mesleki Network: Türkiye'nin dört bir yanındaki yüzlerce hukuk bürosu ve avukatla doğrudan çalışma ağı kurun.",
            "2 Ay Ücretsiz Premium+: Şimdi kaydolarak hiçbir ücret ödemeden tüm görevlere başvuru hakkı kazanın."
        ],
        ctaText: "Adliyelerinizi Seçin ve Başlayın",
        closingNote: "Adliyedeki her saatinizi daha verimli ve kazançlı hale getirmeniz dileğiyle.",
        generatedBy: "ai_library"
    },
    {
        angleId: "instant_notifications_sms_telegram",
        angleTitle: "Anında SMS, Telegram ve Mobil Bildirim Ağı",
        subject: "WhatsApp Gruplarında İlan Aramak Yerine Görevler Cebinizde Çalsın 📱",
        preheader: "İzlediğiniz adliyede görev açıldığı anda SMS, Telegram ve mobil bildirimle ilk siz haberdar olun.",
        headline: "Yüzlerce Mesaj Arasında Kaybolmayın: Akıllı Bildirim Sistemi",
        greeting: "Değerli Meslektaşımız,",
        paragraphs: [
            "Kalabalık mesajlaşma gruplarında gün boyu akan yüzlerce alakasız mesaj arasında kendi adliyenize ait tevkil ilanlarını yakalamaya çalışmak hem yorucu hem de verimsizdir. Üstelik ilanı gördüğünüzde çoğu zaman görev çoktan başkasına verilmiş olur.",
            "AvukatAğı'nın akıllı filtreleme ve çok kanallı bildirim altyapısı sayesinde yalnızca sizin seçtiğiniz adliyelerde bir görev yayınlandığında telefonunuza anında bildirim gelir."
        ],
        bulletPoints: [
            "Anında SMS Bildirimi: İzlediğiniz adliyede görev açıldığı saniye görev tarihi ve ücretiyle birlikte cebinize SMS gelir.",
            "Telegram Bot Entegrasyonu (@AvukatAgiBot): Hesabınızı tek kodla eşleştirin, tüm bildirimleri ücretsiz ve anlık olarak Telegram'dan alın.",
            "Adil Başvuru Süresi: İlk görenin değil, 15 dakikalık başvuru penceresinde başvuran meslektaşlar arasından en uygun adayın seçildiği adil sistem.",
            "Kişiselleştirilmiş Panel: Sadece ilgilendiğiniz adliyeleri ve görev tiplerini görün."
        ],
        ctaText: "Bildirimlerinizi Şimdi Aktif Edin",
        closingNote: "Teknolojiyi mesleğimizin hizmetine sunan AvukatAğı'nda sizi de aramızda görmekten mutluluk duyarız.",
        generatedBy: "ai_library"
    },
    {
        angleId: "give_job_earn_premium",
        angleTitle: "Tevkil Verin Kazanın: +15 Gün Premium Ödül Sistemi",
        subject: "AvukatAğı'nda Tevkil Veren Meslektaşlarımız Ücretsiz Premium Kazanıyor! 🎁",
        preheader: "Oluşturduğunuz her görev atamasında hesabınıza otomatik +15 gün Premium üyelik tanımlanır.",
        headline: "Tevkil Verin, İşinizi Kolaylaştırırken Ücretsiz Premium Kazanın!",
        greeting: "Değerli Meslektaşımız,",
        paragraphs: [
            "AvukatAğı'nda meslektaş dayanışmasını teşvik etmek için benzersiz bir ödül mekanizması geliştirdik: Platform üzerinden oluşturduğunuz her görev bir meslektaşınıza atandığında, üyelik sürenize otomatik olarak +15 Gün Premium eklenir!",
            "Böylece hem yetişemediğiniz duruşma, icra ve dosya inceleme işlerinizi güvenilir meslektaşlarınıza devrederek zamandan tasarruf edersiniz, hem de platformu aktif kullandıkça üyeliğinizi tamamen ücretsiz şekilde sürdürebilirsiniz."
        ],
        bulletPoints: [
            "Her Görevde +15 Gün Hediye: Görev oluşturup bir meslektaşınıza atadığınız anda 15 gün Premium hesabınıza tanımlanır.",
            "Başlangıçta 2 Ay Ücretsiz Beta Premium+: Kayıt olur olmaz 60 gün boyunca Premium+ ayrıcalıklarından ücretsiz yararlanın.",
            "Yetki Belgesi Bilgileri Hazır: Görevi üstlenen meslektaşınızın baro, sicil ve adres bilgilerine tek ekrandan anında ulaşın.",
            "Güvenilir Değerlendirme: Görev sonunda meslektaşınızı puanlayarak kaliteli iş ağının büyümesine katkıda bulunun."
        ],
        ctaText: "İlk Görevinizi Oluşturun veya İnceleyin",
        closingNote: "Birlikte daha güçlü, daha hızlı ve daha dayanışmacı bir avukat ağı için.",
        generatedBy: "ai_library"
    },
    {
        angleId: "fair_selection_and_trust",
        angleTitle: "Güvenilir Meslektaş Seçimi ve Adil Algoritma",
        subject: "Dosyanızı Tevkil Verirken Gözünüz Arkada Kalmasın 🛡️",
        preheader: "Baro sicil bilgileri, uzmanlık alanları, meslektaş puanları ve adil görev dağılımı tek ekranda.",
        headline: "Tevkilde Güven, Şeffaflık ve Adil Görev Dağılımı",
        greeting: "Değerli Meslektaşımız,",
        paragraphs: [
            "Müvekkilinizin dosyasını başka bir adliyedeki meslektaşınıza emanet ederken en önemli kriter güvendir. Sosyal medya veya mesaj gruplarında hiç tanımadığınız birine ilk yazan olduğu için görev vermek çoğu zaman risk taşır.",
            "AvukatAğı, görev veren avukata başvuran tüm meslektaşların uzmanlık alanlarını, geçmiş görev puanlarını ve o ay aldığı görev sayısını şeffaf biçimde sunar."
        ],
        bulletPoints: [
            "15 Dakika Başvuru Toplama Penceresi: İlan açıldığında 15 dakika boyunca tüm başvurular toplanır; aceleyle değil, profilleri inceleyerek seçim yaparsınız.",
            "Uzmanlık ve Puan Gösterimi: Başvuran meslektaşınızın Ceza, Aile, İş, İcra gibi uzmanlık alanlarını ve meslektaş değerlendirme puanını görün.",
            "Adil Dağılım Algoritması: Sistem, o ay daha az görev almış meslektaşları önceliklendirerek görevlerin tekelleşmesini önler.",
            "Yetki Belgesi Kolaylığı: Seçtiğiniz avukatın baro sicil ve vergi/adres bilgileri anında ekranınızda açılır."
        ],
        ctaText: "Güvenli Tevkil Ağına Katılın",
        closingNote: "Müvekkillerinize en yüksek standartta hizmet sunarken yanınızdayız.",
        generatedBy: "ai_library"
    },
    {
        angleId: "outside_courthouse_and_81_cities",
        angleTitle: "81 İlde Adliye İçi ve Adliye Dışı Tüm Hukuki İşlemler",
        subject: "Sadece Duruşma Değil: 81 İlde İcra, Haciz, Dosya Fotokopisi ve Adliye Dışı İşlemler",
        preheader: "Başka bir ildeki tek bir dosya fotokopisi veya haciz işlemi için tüm gününüzü harcamayın.",
        headline: "Türkiye'nin Her Noktasında Eliniz Kolunuz Olacak Meslektaş Ağı",
        greeting: "Değerli Meslektaşımız,",
        paragraphs: [
            "Bazen başka bir şehirdeki veya uzak bir ilçedeki dosyadan yalnızca birkaç sayfa belge sureti alınması, bir müzekkere takibi yapılması ya da noter/tapu/karakol nezdinde adliye dışı bir işlem yürütülmesi gerekir.",
            "Bunun için tam gününüzü yola ayırmak veya yüksek ulaşım maliyetlerine katlanmak yerine, AvukatAğı üzerinden 'Adliye İçi' veya 'Adliye Dışı' görev oluşturarak işlemi o bölgedeki meslektaşınıza dakikalar içinde devredebilirsiniz."
        ],
        bulletPoints: [
            "6 Farklı Görev Kategorisi: Duruşma, İcra İşlemi, Dosya İnceleme, Haciz, Dilekçe ve Adliye Dışı (Diğer) işlemler.",
            "Adliye Dışı Esnekliği: Noter, tapu müdürlüğü, emniyet/karakol ifade katılımı veya kurum başvuruları için serbest konum ve ücret belirleme.",
            "81 İlde Yüzlerce Adliye: Büyükşehirlerden ilçe adliyelerine kadar geniş kapsam.",
            "Anında İletişim: Görev atandığı anda tek tuşla WhatsApp veya telefon bağlantısı."
        ],
        ctaText: "81 İldeki Meslektaş Ağına Erişin",
        closingNote: "Coğrafi sınırları ortadan kaldıran meslektaş ağımıza davetlisiniz.",
        generatedBy: "ai_library"
    },
    {
        angleId: "analytics_and_referrals",
        angleTitle: "Kazanç Grafikleri, Görev Arşivi ve Davet Et Kazan",
        subject: "Tevkil Gelirlerinizi ve Görev Geçmişinizi Profesyonelce Yönetin 📊",
        preheader: "Aylık kazanç grafikleri, çalışılan adliye istatistikleri ve arkadaş davetlerine +30 gün Premium hediye!",
        headline: "Dijital Tevkil Asistanınız: İstatistikler, Arşiv ve Referans Ödülleri",
        greeting: "Değerli Meslektaşımız,",
        paragraphs: [
            "AvukatAğı yalnızca bir ilan panosu değil; aldığınız ve verdiğiniz tüm tevkil işlerini, aylık/günlük kazançlarınızı ve çalıştığınız adliye dağılımını kayıt altında tutan kapsamlı bir iş yönetim platformudur.",
            "Ayrıca platformumuza katılarak kendi referans kodunuzu meslektaşlarınızla paylaşabilir; davet ettiğiniz her meslektaşınızla birlikte karşılıklı +30 Gün Ücretsiz Premium kazanabilirsiniz."
        ],
        bulletPoints: [
            "Canlı Kazanç ve Görev Grafikleri: Tamamladığınız görevlerden elde ettiğiniz toplam geliri aylık ve günlük grafiklerle takip edin.",
            "Görevlendirme Arşivi: Geçmişte kime hangi görevi verdiğinizi veya hangi dosyaları üstlendiğinizi tek tıkla görüntüleyin.",
            "Arkadaşını Getir, 30 Gün Kazan: Referans kodunuzla kaydolan her meslektaşınız için hem size hem arkadaşınıza +30 gün Premium!",
            "2 Ay Ücretsiz Başlangıç: Şimdi kaydolun, kredi kartı gerekmeden 2 ay Premium+ üyeliğinizi hemen başlatın."
        ],
        ctaText: "Ücretsiz Profilinizi Şimdi Oluşturun",
        closingNote: "Mesleki çalışmalarınızda başarılar ve bol kazançlar dileriz.",
        generatedBy: "ai_library"
    }
];
export function getTurkeyDateString() {
    const now = new Date();
    const trTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Istanbul" }));
    const year = trTime.getFullYear();
    const month = String(trTime.getMonth() + 1).padStart(2, "0");
    const day = String(trTime.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}
export function buildMarketingEmailHtml(content) {
    const paragraphsHtml = content.paragraphs
        .map(p => `<p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.65; color: #334155;">${p}</p>`)
        .join("\n");
    const bulletsHtml = content.bulletPoints
        .map(b => {
        const parts = b.split(":");
        const formatted = parts.length > 1
            ? `<strong style="color: #1e1b4b;">${parts[0]}:</strong>${parts.slice(1).join(":")}`
            : b;
        return `<li style="margin-bottom: 12px; font-size: 15px; line-height: 1.6; color: #334155;">${formatted}</li>`;
    })
        .join("\n");
    return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${content.subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <div style="display: none; max-height: 0; overflow: hidden; opacity: 0;">
    ${content.preheader}
  </div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f1f5f9; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(15, 23, 42, 0.08);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e1b4b 0%, #323485 50%, #4f46e5 100%); padding: 36px 32px; text-align: center;">
              <div style="display: inline-block; background-color: rgba(255,255,255,0.15); padding: 8px 16px; border-radius: 999px; color: #e0e7ff; font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 14px;">
                AVUKATAĞI • TÜRKİYE'NİN TEVKİL PLATFORMU
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; line-height: 1.35;">
                ${content.headline}
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 36px 32px 24px 32px;">
              <p style="margin: 0 0 18px 0; font-size: 17px; font-weight: 700; color: #0f172a;">
                ${content.greeting}
              </p>

              ${paragraphsHtml}

              <!-- Feature Box -->
              <div style="background-color: #f8fafc; border-left: 4px solid #4f46e5; border-radius: 8px; padding: 20px 24px; margin: 24px 0;">
                <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #4f46e5;">
                  Neden AvukatAğı?
                </p>
                <ul style="margin: 0; padding-left: 20px;">
                  ${bulletsHtml}
                </ul>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="https://avukatagi.net/register" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #4f46e5 0%, #323485 100%); color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 700; padding: 16px 36px; border-radius: 12px; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);">
                  ${content.ctaText} &rarr;
                </a>
                <p style="margin: 10px 0 0 0; font-size: 12px; color: #64748b;">
                  Kayıt ücretsizdir • Yeni üyelere özel <strong>2 Ay Ücretsiz Premium+</strong> tanımlanır.
                </p>
              </div>

              <p style="margin: 24px 0 0 0; font-size: 15px; line-height: 1.6; color: #475569;">
                ${content.closingNote}
              </p>
              <p style="margin: 8px 0 0 0; font-size: 15px; font-weight: 700; color: #1e1b4b;">
                AvukatAğı Ekibi
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px 32px; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 13px; color: #64748b;">
                <a href="https://avukatagi.net" style="color: #4f46e5; text-decoration: none; font-weight: 600;">www.avukatagi.net</a>
                &nbsp;•&nbsp;
                <a href="https://avukatagi.net/how-it-works" style="color: #64748b; text-decoration: none;">Nasıl Çalışır?</a>
                &nbsp;•&nbsp;
                <a href="https://t.me/avukatagitevkil" style="color: #64748b; text-decoration: none;">Telegram Kanalı</a>
              </p>
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                Bu e-posta meslektaşlarımızı AvukatAğı tevkil ağı hakkında bilgilendirmek amacıyla gönderilmiştir.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
export function buildMarketingEmailText(content) {
    return [
        content.headline.toUpperCase(),
        "",
        content.greeting,
        "",
        ...content.paragraphs.map(p => `${p}\n`),
        "ÖNE ÇIKAN AVANTAJLAR:",
        ...content.bulletPoints.map(b => `• ${b}`),
        "",
        `${content.ctaText}: https://avukatagi.net/register`,
        "(Yeni üyelere özel 2 Ay Ücretsiz Premium+ tanımlanmaktadır)",
        "",
        content.closingNote,
        "AvukatAğı Ekibi - https://avukatagi.net"
    ].join("\n");
}
/**
 * Generates the next marketing campaign email using Gemini AI (if GEMINI_API_KEY is active)
 * or falls back seamlessly to the next unused angle in MARKETING_ANGLES.
 */
export async function generateNextCampaignContent(nextCampaignNumber, history) {
    const usedAngleIds = new Set(history.map(h => h.angleId));
    // Pick the next angle in rotation
    const angleIndex = (nextCampaignNumber - 1) % MARKETING_ANGLES.length;
    const baseAngle = MARKETING_ANGLES.find(a => !usedAngleIds.has(a.angleId)) ||
        MARKETING_ANGLES[angleIndex];
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const pastSubjects = history.slice(-6).map(h => `- ${h.angleTitle}: "${h.subject}"`).join("\n");
            const prompt = `
Sen Türkiye'deki avukatlar için geliştirilen "AvukatAğı" (https://avukatagi.net) tevkil ve meslektaş dayanışma platformunun baş pazarlama ve iletişim uzmanısın.
Avukatlara gönderilecek ${nextCampaignNumber}. e-posta kampanyasını hazırlıyorsun.

AVUKATAĞI NEDİR VE NASIL ÇALIŞIR?
- AvukatAğı, Türkiye'nin 81 ilindeki tüm adliyelerde avukatların birbirlerine duruşma, icra işlemi, haciz, dosya inceleme, dilekçe ve adliye dışı (noter, tapu, karakol vb.) görevleri devretmesini (tevkil vermesini) ve görev alarak ek gelir elde etmesini sağlayan dijital platformdur.
- Avukatlar izlemek istedikleri adliyeleri seçer; o adliyede görev açıldığı anda SMS, Telegram (@AvukatAgiBot) ve mobil bildirim alırlar.
- Normal görevlerde 15 dakika, Acil görevlerde 5 dakika başvuru toplama süresi vardır; görev sahibi başvuran avukatların uzmanlıklarını, puanlarını ve o ay aldığı görev sayısını görerek adil seçim yapar.
- Platform komisyon almaz.
- "Tevkil Verin Kazanın" kampanyası ile görev oluşturup bir meslektaşına atayan her avukata +15 Gün Ücretsiz Premium hediye edilir.
- Yeni kayıt olan tüm avukatlara kredi kartı gerekmeden "2 Ay Ücretsiz Beta Premium+" üyelik tanımlanır.
- Arkadaşını davet eden avukatlara karşılıklı +30 Gün Premium verilir.

BU KAMPANYADA ODAKLANACAĞIN YÖN (TEMA):
- Tema Başlığı: ${baseAngle.angleTitle}
- Daha önce gönderilen kampanyalar (BUNLARDAN FARKLI BİR DİL VE KONU BAŞLIĞI KULLAN):
${pastSubjects || "İlk AI kampanyası"}

KURALLAR:
1. Hitap dili tamamen bir avukattan diğer meslektaşına ("Değerli Meslektaşımız") samimi, saygılı, kurumsal ve ikna edici olmalı.
2. Okuyan avukatı https://avukatagi.net/register adresinden ücretsiz kayıt olmaya ikna etmeli.
3. Sadece aşağıdaki JSON formatında yanıt ver:
{
  "subject": "Merak uyandıran, spam kelimeler içermeyen, yüksek açılma oranlı e-posta konusu",
  "preheader": "Gelen kutusunda konu yanında görünecek 1 cümlelik özet",
  "headline": "E-posta içindeki ana başlık",
  "greeting": "Değerli Meslektaşımız,",
  "paragraphs": [
    "1. paragraf: Avukatların yaşadığı somut problemi ve bu temanın önemini anlatan giriş",
    "2. paragraf: AvukatAğı'nın bu problemi nasıl çözdüğü ve sağladığı somut avantajlar"
  ],
  "bulletPoints": [
    "Başlık 1: Açıklama",
    "Başlık 2: Açıklama",
    "Başlık 3: Açıklama",
    "Başlık 4: Açıklama"
  ],
  "ctaText": "Harekete geçirici buton metni (örn: Ücretsiz Hesabınızı Oluşturun)",
  "closingNote": "Kısa ve sıcak kapanış cümlesi"
}`;
            const model = genAI.getGenerativeModel({
                model: "gemini-2.5-flash",
                generationConfig: { responseMimeType: "application/json" }
            });
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            if (text) {
                const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
                const parsed = JSON.parse(jsonStr);
                if (parsed.subject && parsed.headline && Array.isArray(parsed.paragraphs) && Array.isArray(parsed.bulletPoints)) {
                    console.log(`✨ [Marketing AI] Generated Campaign #${nextCampaignNumber} via Gemini (${baseAngle.angleTitle})`);
                    return {
                        angleId: baseAngle.angleId,
                        angleTitle: baseAngle.angleTitle,
                        subject: parsed.subject,
                        preheader: parsed.preheader || baseAngle.preheader,
                        headline: parsed.headline,
                        greeting: parsed.greeting || "Değerli Meslektaşımız,",
                        paragraphs: parsed.paragraphs,
                        bulletPoints: parsed.bulletPoints,
                        ctaText: parsed.ctaText || baseAngle.ctaText,
                        closingNote: parsed.closingNote || baseAngle.closingNote,
                        generatedBy: "gemini"
                    };
                }
            }
        }
        catch (err) {
            console.warn(`⚠️ [Marketing AI] Gemini API unavailable (${err?.status || err?.message}). Using built-in AI campaign library for angle "${baseAngle.angleTitle}".`);
        }
    }
    return {
        ...baseAngle,
        generatedBy: "ai_library"
    };
}
/**
 * Loads or initializes the marketing campaign state from `system_settings`.
 */
export async function getOrInitCampaignState(supabase) {
    const { data, error } = await supabase
        .from("system_settings")
        .select("value")
        .eq("key", SETTINGS_KEY)
        .maybeSingle();
    if (!error && data?.value) {
        try {
            const parsed = typeof data.value === "string" ? JSON.parse(data.value) : data.value;
            if (parsed && parsed.currentCampaign) {
                const todayTr = getTurkeyDateString();
                if (parsed.sentTodayDate !== todayTr) {
                    parsed.sentTodayCount = 0;
                    parsed.sentTodayDate = todayTr;
                }
                return parsed;
            }
        }
        catch (e) {
            console.error("Failed to parse marketing_campaign_state:", e);
        }
    }
    // Check current DB counts to see if Campaign #1 (the legacy Mailtrap template) already finished
    const { count: sentCount } = await supabase
        .from("marketing_emails")
        .select("*", { count: "exact", head: true })
        .eq("sent", true);
    const { count: unsentCount } = await supabase
        .from("marketing_emails")
        .select("*", { count: "exact", head: true })
        .eq("sent", false);
    const history = [];
    let initialCampaignNumber = 1;
    // If all existing emails were already marked sent (from Campaign #1), record Campaign #1 as completed
    // and immediately start Campaign #2 and reset `sent = false` so the new cycle begins!
    if ((sentCount || 0) > 0 && (unsentCount || 0) === 0) {
        history.push({
            campaignNumber: 1,
            angleId: "initial_launch_template",
            angleTitle: "Açılış Kampanyası (Mailtrap Şablonu)",
            subject: "AvukatAğı Açılış Kampanyası",
            startedAt: "2026-04-01T00:00:00.000Z",
            completedAt: new Date().toISOString(),
            totalSent: sentCount || 0
        });
        initialCampaignNumber = 2;
        // Reset all recipients so they receive Campaign #2
        await supabase
            .from("marketing_emails")
            .update({ sent: false })
            .not("email", "is", null);
        console.log(`🔄 [Marketing AI] All ${sentCount} recipients finished Campaign #1. Reset queue for Campaign #2.`);
    }
    const firstContent = await generateNextCampaignContent(initialCampaignNumber, history);
    const todayTr = getTurkeyDateString();
    const initialState = {
        campaignNumber: initialCampaignNumber,
        autoSendEnabled: true,
        dailyLimit: DEFAULT_DAILY_LIMIT,
        lastAutoSendDate: null,
        sentTodayCount: 0,
        sentTodayDate: todayTr,
        currentCampaign: firstContent,
        startedAt: new Date().toISOString(),
        history
    };
    await saveCampaignState(supabase, initialState);
    return initialState;
}
export async function saveCampaignState(supabase, state) {
    const { error } = await supabase
        .from("system_settings")
        .upsert({
        key: SETTINGS_KEY,
        value: JSON.stringify(state),
        updated_at: new Date().toISOString()
    }, { onConflict: "key" });
    if (error) {
        console.error("❌ [Marketing AI] Failed to save campaign state:", error);
    }
}
/**
 * Rotates to the next campaign (increments campaignNumber, generates new AI email for a new angle of the app,
 * and resets `sent = false` for all recipients in `marketing_emails`).
 */
export async function rotateToNextCampaign(supabase, state, resetRecipients = true) {
    const { count: sentCount } = await supabase
        .from("marketing_emails")
        .select("*", { count: "exact", head: true })
        .eq("sent", true);
    const updatedHistory = [
        ...state.history,
        {
            campaignNumber: state.campaignNumber,
            angleId: state.currentCampaign.angleId,
            angleTitle: state.currentCampaign.angleTitle,
            subject: state.currentCampaign.subject,
            startedAt: state.startedAt,
            completedAt: new Date().toISOString(),
            totalSent: sentCount || 0
        }
    ];
    const nextCampaignNumber = state.campaignNumber + 1;
    const nextContent = await generateNextCampaignContent(nextCampaignNumber, updatedHistory);
    if (resetRecipients) {
        await supabase
            .from("marketing_emails")
            .update({ sent: false })
            .not("email", "is", null);
        console.log(`🔄 [Marketing AI] Reset all recipients in marketing_emails to sent=false for Campaign #${nextCampaignNumber}.`);
    }
    const newState = {
        ...state,
        campaignNumber: nextCampaignNumber,
        currentCampaign: nextContent,
        startedAt: new Date().toISOString(),
        history: updatedHistory
    };
    await saveCampaignState(supabase, newState);
    return newState;
}
/**
 * Sends a batch of marketing emails for the current campaign.
 * If all recipients have already received the current campaign (`unsent === 0`),
 * automatically rotates to the next AI campaign and resets the recipient queue first!
 */
export async function sendMarketingBatch(supabase, options = {}) {
    let state = await getOrInitCampaignState(supabase);
    const todayTr = getTurkeyDateString();
    if (state.sentTodayDate !== todayTr) {
        state.sentTodayCount = 0;
        state.sentTodayDate = todayTr;
    }
    if (options.isAutoCron) {
        if (!state.autoSendEnabled) {
            return {
                sentCount: 0,
                skippedInvalidCount: 0,
                rotatedToNewCampaign: false,
                campaignNumber: state.campaignNumber,
                subject: state.currentCampaign.subject,
                message: "Otomatik gönderim kapalı."
            };
        }
        if (state.sentTodayCount >= state.dailyLimit) {
            return {
                sentCount: 0,
                skippedInvalidCount: 0,
                rotatedToNewCampaign: false,
                campaignNumber: state.campaignNumber,
                subject: state.currentCampaign.subject,
                message: `Günlük gönderim limitine (${state.dailyLimit}) ulaşıldı.`
            };
        }
    }
    const limitToSend = options.batchSize || (options.isAutoCron
        ? Math.max(1, state.dailyLimit - state.sentTodayCount)
        : state.dailyLimit);
    // Check how many unsent recipients remain
    let { data: unsentEmails, error: fetchError } = await supabase
        .from("marketing_emails")
        .select("*")
        .eq("sent", false)
        .limit(limitToSend);
    if (fetchError)
        throw fetchError;
    let rotatedToNewCampaign = false;
    // If everyone has received the current campaign, automatically generate the next AI campaign and reset the list!
    if (!unsentEmails || unsentEmails.length === 0) {
        const { count: totalCount } = await supabase
            .from("marketing_emails")
            .select("*", { count: "exact", head: true });
        if (!totalCount || totalCount === 0) {
            return {
                sentCount: 0,
                skippedInvalidCount: 0,
                rotatedToNewCampaign: false,
                campaignNumber: state.campaignNumber,
                subject: state.currentCampaign.subject,
                message: "E-posta listesinde kayıtlı alıcı bulunmuyor."
            };
        }
        console.log(`🎉 [Marketing AI] Campaign #${state.campaignNumber} completed for all ${totalCount} recipients! Generating Campaign #${state.campaignNumber + 1}...`);
        state = await rotateToNextCampaign(supabase, state, true);
        rotatedToNewCampaign = true;
        const refetch = await supabase
            .from("marketing_emails")
            .select("*")
            .eq("sent", false)
            .limit(limitToSend);
        if (refetch.error)
            throw refetch.error;
        unsentEmails = refetch.data || [];
    }
    // Validate email addresses
    const validEmails = unsentEmails.filter((e) => {
        if (!e.email)
            return false;
        const email = e.email.trim();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email) && !email.includes("..") && !email.includes(".@") && !email.startsWith(".");
    });
    const invalidEmails = unsentEmails.filter((e) => !validEmails.includes(e));
    if (invalidEmails.length > 0) {
        console.warn(`⚠️ [Marketing AI] Removing ${invalidEmails.length} invalid email addresses from marketing_emails.`);
        await supabase
            .from("marketing_emails")
            .delete()
            .in("email", invalidEmails.map((e) => e.email));
    }
    if (validEmails.length === 0) {
        return {
            sentCount: 0,
            skippedInvalidCount: invalidEmails.length,
            rotatedToNewCampaign,
            campaignNumber: state.campaignNumber,
            subject: state.currentCampaign.subject,
            message: "Geçerli e-posta adresi bulunamadı. Hatalı adresler temizlendi."
        };
    }
    const htmlBody = buildMarketingEmailHtml(state.currentCampaign);
    const textBody = buildMarketingEmailText(state.currentCampaign);
    const payload = {
        from: { email: "hello@avukatagi.net", name: "AvukatAğı" },
        to: validEmails.map((e) => ({
            email: e.email.trim(),
            name: `${e.first_name || ""} ${e.last_name || ""}`.trim() || "Değerli Meslektaşımız"
        })),
        subject: state.currentCampaign.subject,
        html: htmlBody,
        text: textBody,
        category: `Campaign_${state.campaignNumber}_${state.currentCampaign.angleId}`
    };
    const response = await fetch("https://bulk.api.mailtrap.io/api/send", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${DEFAULT_MAILTRAP_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Mailtrap API error: ${response.status} ${errorText}`);
    }
    const sentEmailAddresses = validEmails.map((e) => e.email);
    const { error: updateError } = await supabase
        .from("marketing_emails")
        .update({ sent: true, sent_at: new Date().toISOString() })
        .in("email", sentEmailAddresses);
    if (updateError)
        throw updateError;
    // Update daily counter in state
    state.sentTodayCount = (state.sentTodayCount || 0) + sentEmailAddresses.length;
    state.sentTodayDate = todayTr;
    if (options.isAutoCron) {
        state.lastAutoSendDate = todayTr;
    }
    // Check if this batch finished the entire list for the current campaign!
    const { count: remainingUnsent } = await supabase
        .from("marketing_emails")
        .select("*", { count: "exact", head: true })
        .eq("sent", false);
    let postBatchRotationMsg = "";
    if ((remainingUnsent || 0) === 0) {
        console.log(`🎉 [Marketing AI] Final batch of Campaign #${state.campaignNumber} sent! Automatically generating Campaign #${state.campaignNumber + 1} and resetting list for tomorrow...`);
        state = await rotateToNextCampaign(supabase, state, true);
        rotatedToNewCampaign = true;
        postBatchRotationMsg = ` (Tüm liste tamamlandı! Yeni AI Kampanyası #${state.campaignNumber} "${state.currentCampaign.angleTitle}" otomatik oluşturuldu ve liste yeni kampanya için sıfırlandı.)`;
    }
    else {
        await saveCampaignState(supabase, state);
    }
    return {
        sentCount: sentEmailAddresses.length,
        skippedInvalidCount: invalidEmails.length,
        rotatedToNewCampaign,
        campaignNumber: state.campaignNumber,
        subject: state.currentCampaign.subject,
        message: `Başarıyla ${sentEmailAddresses.length} kişiye e-posta gönderildi.${invalidEmails.length > 0 ? ` (${invalidEmails.length} hatalı adres temizlendi)` : ""}${postBatchRotationMsg}`
    };
}
