# Uyku Merdiveni: kurulum

Bu klasör hazır bir web uygulamasıdır. Android'de de iPhone'da da ana ekrana eklenir.
Eşinizle ortak kayıt için Firebase gerekir (ücretsiz plan yeter).

## 1. Firebase projesi (yaklaşık 5 dakika)
Öğrenci takip sitenizdeki projeyi kullanmayın, bebek kayıtları için yeni bir proje açın.

1. https://console.firebase.google.com adresinde **Proje ekle** deyin, adı "uyku" olsun. Analytics'i kapatabilirsiniz.
2. **Build > Firestore Database > Veritabanı oluştur**. Üretim modunu seçin, konum olarak `eur3` ya da `europe-west` seçin.
3. **Build > Authentication > Başlayın > Anonim** yöntemini etkinleştirin.
4. **Proje ayarları (dişli) > Uygulamalarınız > Web (</>)** ile uygulama ekleyin. Çıkan `firebaseConfig` içindeki `apiKey`, `authDomain`, `projectId`, `appId` değerlerini `config.js` dosyasına yapıştırın.
5. **Firestore > Kurallar** sekmesine `firestore.rules` dosyasındaki metni yapıştırıp **Yayınla** deyin.

## 2. İnternete koyma
Bu klasörü Vercel'e yükleyin (GitHub'a atıp bağlamak ya da Vercel'de "Add New > Project" ile klasörü sürüklemek yeter). Çıkan adres uygulamanın adresi olur.

## 3. Telefonlara ekleme
- **Android (Chrome):** Adresi açın, menüden **Uygulamayı yükle** (ya da Ana ekrana ekle).
- **iPhone (Safari):** Adresi Safari'de açın, **Paylaş** düğmesi, **Ana Ekrana Ekle**. Chrome'dan eklenmez, Safari gerekir.

## 4. Ortak kayıt
İlk telefonda sayfanın altındaki **Ortak kayıt** kutusundan **Yeni kod oluştur**'a basın, çıkan kodu eşinize gönderin.
Eşiniz kendi telefonunda aynı kutuya kodu yazıp **Bağlan** der. Artık iki telefon aynı kaydı görür.

Not: Kod gizli tutulmalı, kodu bilen kayıtları görür. Bağlanmadan önce bir telefonda tuttuğunuz kayıtlar ilk bağlanan telefonda ortak kayda taşınır. Sonradan bağlanan ikinci telefonun eski yerel kayıtları taşınmaz.

## Güncelleme
Dosyaları değiştirip tekrar yüklemeniz yeterli. Uygulama bir sonraki açılışta yeni sürümü alır.

## Uyku sesi

Ana sayfadaki "Uyku sesi" bölümünde hazır sesler (beyaz gürültü, fan, yağmur, kalp atışı, müzik kutusu) var.
"Dosya ekle" ile telefondan kendi mp3/m4a/wav dosyalarınızı seçebilirsiniz. Dosyalar o telefonda saklanır, her telefona ayrı eklenir.
Ekran kilitlenince Android'de ses devam eder. iPhone'da kesilirse "Ekran kendiliğinden kapanmasın" kutusunu işaretleyin.
