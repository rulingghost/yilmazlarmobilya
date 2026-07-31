# Yılmazlar Mobilya - Linux Cron & Otomatik Güncelleme Kurulum Rehberi

Bu proje, İstikbal internet sitesindeki güncel ürün ve fiyat bilgilerini her gece **TSİ 01.00'de** otomatik olarak senkronize eder.

## 1. Sunucu Saat Dilimi Ayarı (Europe/Istanbul)

Sunucunuzun saat dilimini `Europe/Istanbul` olarak ayarlamak için Linux terminalinde şu komutu çalıştırın:

```bash
sudo timedatectl set-timezone Europe/Istanbul
```

Doğrulamak için:

```bash
date
```

Çıktıda `+03` veya `EEST/TRT` saat dilimi görünmelidir.

---

## 2. Cron Görevinin Eklenmesi

Sunucudaki kullanıcı crontab düzenleyicisini açın:

```bash
crontab -e
```

Aşağıdaki satırı ekleyin ve kaydedin (dosya yolunu sunucunuzdaki proje dizinine göre güncelleyin):

```cron
0 1 * * * cd /var/www/yilmazlar-mobilya && npm run update-products >> logs/product-update.log 2>&1
```

---

## 3. Manuel Güncelleme Komutu

İhtiyaç duyulduğunda güncelleme işlemi aşağıdaki komutla dilediğiniz an manuel olarak da çalıştırılabilir:

```bash
npm run update-products
```

---

## 4. Log Takibi

Yapılan güncellemeler, eklenen/güncellenen/kaldırılan ürün sayıları ve oluşabilecek tüm detaylar `logs/product-update.log` dosyasına yazılır. Logları canlı izlemek için:

```bash
tail -f logs/product-update.log
```
