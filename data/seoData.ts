import { COURTHOUSES, TURKISH_CITIES } from './courthouses.js';

export interface CourthouseSeoEntry {
    type: 'city' | 'courthouse';
    slug: string;
    city: string;
    citySlug: string;
    courthouse?: string;
    courthousesInCity: string[];
}

export interface FaqItem {
    id: string;
    category: string;
    question: string;
    answer: string;
}

export function slugifyTr(text: string): string {
    if (!text) return '';
    const map: Record<string, string> = {
        'ç': 'c', 'Ç': 'c',
        'ğ': 'g', 'Ğ': 'g',
        'ı': 'i', 'İ': 'i', 'I': 'i',
        'ö': 'o', 'Ö': 'o',
        'ş': 's', 'Ş': 's',
        'ü': 'u', 'Ü': 'u',
        'â': 'a', 'Â': 'a',
        'î': 'i', 'Î': 'i',
        'û': 'u', 'Û': 'u'
    };

    return text
        .split('')
        .map(ch => map[ch] ?? ch)
        .join('')
        .toLowerCase()
        .replace(/[()]/g, ' ')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-{2,}/g, '-');
}

// Build complete, collision-free index of all 81 cities and all courthouses
const _entries: CourthouseSeoEntry[] = [];
const _bySlug = new Map<string, CourthouseSeoEntry>();
const _courthouseToSlug = new Map<string, string>(); // key: `${city}::${courthouse}`

// First count courthouse base slugs to detect cross-city duplicates (e.g., Ereğli, Saray, Gölbaşı)
const baseSlugCounts = new Map<string, number>();
for (const city of TURKISH_CITIES) {
    const chList = COURTHOUSES[city] || [];
    for (const ch of chList) {
        const base = slugifyTr(ch);
        baseSlugCounts.set(base, (baseSlugCounts.get(base) || 0) + 1);
    }
}

for (const city of TURKISH_CITIES) {
    const citySlug = slugifyTr(city);
    const chList = COURTHOUSES[city] || [];

    const cityEntry: CourthouseSeoEntry = {
        type: 'city',
        slug: citySlug,
        city,
        citySlug,
        courthousesInCity: chList
    };
    _entries.push(cityEntry);
    _bySlug.set(citySlug, cityEntry);

    for (const ch of chList) {
        const base = slugifyTr(ch);
        const isDuplicate = (baseSlugCounts.get(base) || 0) > 1;
        // If duplicate across cities or identical to city slug, prefix with citySlug
        let chSlug = isDuplicate || base === citySlug ? `${citySlug}-${base}` : base;
        if (_bySlug.has(chSlug)) {
            chSlug = `${citySlug}-${base}-adliyesi`;
        }

        const chEntry: CourthouseSeoEntry = {
            type: 'courthouse',
            slug: chSlug,
            city,
            citySlug,
            courthouse: ch,
            courthousesInCity: chList
        };
        _entries.push(chEntry);
        _bySlug.set(chSlug, chEntry);
        _courthouseToSlug.set(`${city}::${ch}`, chSlug);
    }
}

export const ALL_SEO_ENTRIES: CourthouseSeoEntry[] = _entries;

export function getSeoEntryBySlug(slug: string): CourthouseSeoEntry | undefined {
    return _bySlug.get(slug.toLowerCase().trim());
}

export function getCourthouseSlug(city: string, courthouse: string): string {
    return _courthouseToSlug.get(`${city}::${courthouse}`) || `${slugifyTr(city)}-${slugifyTr(courthouse)}`;
}

export const FAQ_ITEMS: FaqItem[] = [
    {
        id: 'what-is-avukatagi',
        category: 'Genel',
        question: 'AvukatAğı (avukatagi.net) nedir ve kimler üye olabilir?',
        answer: 'AvukatAğı, Türkiye’nin 81 ilindeki tüm adliyelerde avukatlar arasında hızlı, güvenli ve kurumsal tevkil (görev paylaşımı) yapılmasını sağlayan dijital hukuk ağıdır. Platforma yalnızca Türkiye Barolar Birliği ve ilgili il barosu levhasına kayıtlı avukatlar baro sicil bilgileri ile üye olabilir.'
    },
    {
        id: 'is-it-free',
        category: 'Üyelik & Ücret',
        question: 'AvukatAğı’na üye olmak ve tevkil görevi vermek ücretli midir?',
        answer: 'AvukatAğı’na kayıt olmak ve il içi ya da il dışı tevkil görevi oluşturmak tamamen ücretsizdir. Ayrıca yeni kayıt olan tüm meslektaşlarımıza hiçbir kart bilgisi istenmeden 2 Ay Ücretsiz Beta Premium+ üyelik hediye edilir. Görev ödemelerinde ise platform hiçbir komisyon kesintisi yapmaz.'
    },
    {
        id: 'reward-system',
        category: 'Üyelik & Ücret',
        question: '"Tevkil Verin, Kazanın" (+15 Gün Premium) ödülü nasıl çalışır?',
        answer: 'Platform üzerinden oluşturduğunuz herhangi bir görevi başvuran meslektaşlarınız arasından birine atadığınız anda hesabınıza otomatik olarak +15 Gün Premium üyelik süresi eklenir. Böylece platformu aktif kullandıkça üyeliğinizi ücretsiz olarak uzatabilirsiniz.'
    },
    {
        id: 'how-notifications-work',
        category: 'Bildirim & Görevler',
        question: 'İzlediğim adliyelerde görev açıldığında nasıl haberdar olurum?',
        answer: 'Ayarlar > Görev Adliyeleriniz bölümünden çalışmak istediğiniz adliyeleri seçebilirsiniz. Seçtiğiniz adliyelerde yeni bir tevkil görevi oluşturulduğu saniye anında SMS, Telegram botu (@AvukatAgiBot) ve mobil bildirim ile bilgilendirilirsiniz.'
    },
    {
        id: 'application-window',
        category: 'Bildirim & Görevler',
        question: 'Başvuru süresi (15 dakika ve Acil Görev 5 dakika) ne anlama gelir?',
        answer: 'Kalabalık mesaj gruplarındaki "ilk yazan alır" karmaşasını önlemek için normal görevlerde 15 dakika, Acil Görevlerde ise 5 dakika boyunca tüm meslektaşların başvuruları toplanır. Süre dolduğunda görev sahibi başvuranların uzmanlık alanlarını, puanlarını ve o ay aldıkları görev sayılarını görerek en uygun adayı seçer.'
    },
    {
        id: 'fair-distribution',
        category: 'Bildirim & Görevler',
        question: 'Adil görev dağılımı sistemi nasıl işler?',
        answer: 'AvukatAğı, görevlerin tekelleşmesini önlemek için şeffaf bir dağıtım algoritması uygular. Başvuru listesinde her avukatın o ay aldığı görev sayısı görünür, daha az görev almış meslektaşlar üst sıralarda listelenir ve aynı ay içinde ortalamanın çok üzerinde görev almış adaylar geçici olarak kısıtlanır.'
    },
    {
        id: 'authorization-certificate',
        category: 'Hukuki Süreç',
        question: 'Yetki belgesi ve görevlendirme bilgileri nasıl paylaşılır?',
        answer: 'Görev sahibi başvuranlar arasından seçim yaptığında, seçilen avukatın adı soyadı, baro ili, baro sicil numarası, ofis adresi ve telefon/WhatsApp iletişim bilgileri görev sahibine anında açılır. Avukatlık Kanunu m. 56 uyarınca yetki belgesi düzenlenerek süreç doğrudan meslektaşlar arasında tamamlanır.'
    },
    {
        id: 'outside-courthouse',
        category: 'Görev Türleri',
        question: 'Sadece duruşma için mi, yoksa icra ve adliye dışı işlemler için de tevkil verilebilir mi?',
        answer: 'Hayır, sadece duruşma değil; Duruşma, İcra İşlemi, Dosya İnceleme / Fotokopi, Haciz ve Dilekçe sunumu gibi tüm adliye içi işlemlerin yanı sıra "Adliye Dışı" seçeneği ile noter, tapu müdürlüğü, emniyet/karakol ifade katılımı ve kurum başvuruları için de görev oluşturabilirsiniz.'
    },
    {
        id: 'min-fees',
        category: 'Üyelik & Ücret',
        question: 'Görev ücretleri nasıl belirlenir, alt limit var mıdır?',
        answer: 'Meslek onuruna ve emeğe saygı gereği adliye içi görevlerde türe göre alt ücret sınırları uygulanır (örneğin duruşma görevlerinde en az 900 TL, haciz ve dosya incelemede 700 TL, icra işlemlerinde 600 TL, dilekçe işlerinde 500 TL). Görev sahibi dilerse daha yüksek ücret belirleyebilir.'
    },
    {
        id: 'cancel-job-rule',
        category: 'Hukuki Süreç',
        question: 'Görev ataması yapıldıktan sonra görev iptal edilebilir mi?',
        answer: 'Görev sahibi henüz meslektaş seçimi yapmadan önce görevini iptal edebilir. Ancak başvurular arasından bir meslektaş seçilip görev atandığında, iki tarafın da mağduriyetini önlemek amacıyla görev sahibi görevi tek taraflı iptal edemez.'
    },
    {
        id: 'referral-bonus',
        category: 'Üyelik & Ücret',
        question: 'Arkadaş davet (referans) sistemi ile nasıl ücretsiz Premium kazanılır?',
        answer: 'Ayarlar > Arkadaşını Davet Et bölümünden size özel 6 haneli davet kodunuzu oluşturabilirsiniz. Kodunuzla kayıt olan her meslektaşınızla birlikte hem sizin hem de meslektaşınızın hesabına +30 Gün Ücretsiz Premium tanımlanır.'
    },
    {
        id: 'privacy-security',
        category: 'Güvenlik',
        question: 'İlanlarda kişisel bilgilerim ve telefon numaram herkese açık mı görünür?',
        answer: 'Hayır. Görev açıkken görev sahibinin adı ve başvuran adayların adları yalnızca baş harfleriyle (ör. A. Y.) maskelenir ve telefon numaraları gizli tutulur. İletişim bilgileri ve tam kimlik yalnızca görev ataması onaylanan iki meslektaş arasında karşılıklı olarak paylaşılır.'
    }
];
