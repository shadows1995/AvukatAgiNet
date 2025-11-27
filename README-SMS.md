# AvukatAğı SMS Sistemi - Kullanım Kılavuzu

## 🚀 Hızlı Başlangıç

### 1. Sunucuyu Başlatma

SMS sisteminin çalışması için `server.js` dosyasının çalışıyor olması **zorunludur**.

**Windows:**
```bash
# Çift tıklayarak çalıştırın:
start-server.bat

# Veya komut satırından:
node server.js
```

Sunucu başarıyla başladığında şu mesajı göreceksiniz:
```
Server running on port 3001
```

### 2. SMS Testleri

Sunucu çalıştıktan sonra testleri yapabilirsiniz:

**Tam Test (Önerilen):**
```bash
# Çift tıklayarak çalıştırın:
test-sms-system.bat
```

Bu script:
- Sunucunun çalışıp çalışmadığını kontrol eder
- NetGSM API'yi doğrudan test eder
- Server endpoint'i üzerinden test eder

**Manuel Testler:**
```bash
# NetGSM API direkt testi
node test-sms-direct.js

# Server endpoint testi
node test-with-uuid.js
```

## 🔧 Yaygın Sorunlar ve Çözümleri

### Problem: "Failed: Error" veya "ECONNREFUSED"

**Neden:** Sunucu çalışmıyor.

**Çözüm:** 
1. `start-server.bat` dosyasını çalıştırın
2. "Server running on port 3001" mesajını gördüğünüzden emin olun
3. Test scriptlerini tekrar çalıştırın

### Problem: "SMS failed with code: 30"

**Neden:** NetGSM kullanıcı adı veya şifresi hatalı.

**Çözüm:** 
1. `.env` dosyasını kontrol edin
2. `NETGSM_USERNAME` ve `NETGSM_PASSWORD` değerlerinin doğru olduğundan emin olun

### Problem: "SMS failed with code: 40"

**Neden:** SMS başlığı (header) NetGSM tarafından onaylanmamış.

**Çözüm:** 
1. `.env` dosyasındaki `NETGSM_HEADER` değerini kontrol edin
2. NetGSM panelinden onaylı başlıkları kontrol edin

### Problem: "SMS failed with code: 60"

**Neden:** NetGSM hesabında yeterli kredi yok.

**Çözüm:** NetGSM hesabınıza kredi yükleyin.

## 📋 NetGSM Hata Kodları

| Kod | Açıklama |
|-----|----------|
| 00/01 | **Başarılı** - SMS gönderildi |
| 20 | Geçersiz mesaj içeriği |
| 30 | Hatalı kullanıcı adı/şifre |
| 40 | Geçersiz başlık (header) |
| 50 | Geçersiz telefon numarası |
| 60 | Yetersiz kredi |
| 70 | Eksik veya hatalı parametre |

## 🔍 Loglama

Sunucu çalışırken tüm SMS işlemleri detaylı olarak loglanır:

```
📨 SMS Request received: { city: 'İstanbul', courthouse: '...', ... }
📊 Total premium users found: 5
🔍 Filtering users for courthouse: '...'
   ✅ Match found: Ahmet Yılmaz (05551234567)
📱 Sending SMS to Ahmet Yılmaz (05551234567)
✅ SMS sent successfully to 05551234567. Code: 00
```

## 🛠️ Geliştirme

### SMS Gönderme Fonksiyonu

`server.js` içindeki `sendSms()` fonksiyonu:

```javascript
async function sendSms(phone, message) {
    // NetGSM XML API kullanarak SMS gönderir
    // Dönen değer: { success: true/false, code: '00', data: ... }
}
```

### API Endpoint'i

```
POST /api/notify-new-job
Body: {
    "city": "İstanbul",
    "courthouse": "İstanbul Adliyesi (Çağlayan)",
    "jobType": "Duruşma",
    "createdBy": "uuid"
}
```

## 📞 Destek

Sorun devam ederse:
1. `error.log` dosyasını kontrol edin
2. Sunucu konsolundaki hata mesajlarını okuyun
3. NetGSM panelinden SMS gönderim loglarını kontrol edin

---

**Not:** Production ortamında sunucunun sürekli çalışır durumda olması için bir process manager (PM2, systemd, vb.) kullanılmalıdır.
