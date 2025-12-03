#!/bin/bash

cd /root/AvukatAgiNet || exit

# .env kontrolü
if [ ! -f .env ]; then
    echo "❌ HATA: .env dosyası bulunamadı! Container çalışamaz."
    echo "Lütfen /root/AvukatAgiNet klasöründe .env dosyasının olduğundan emin olun."
    exit 1
fi

echo "📌 GitHub'dan son kod çekiliyor..."
git pull || { echo "❌ Git pull failed! Aborting."; exit 1; }

echo "📌 Yeni Docker imajı build ediliyor (Cache temizleniyor)..."
docker build --no-cache -t avukat-agi:latest . || { echo "❌ Docker build failed! Aborting."; exit 1; }

echo "📌 Eski container durduruluyor..."
docker stop avukat-agi-container || true

echo "📌 Eski container siliniyor..."
docker rm avukat-agi-container || true

echo "📌 Yeni container ayağa kaldırılıyor..."
# .env dosyasını container içine mount ediyoruz
docker run -d --name avukat-agi-container -p 80:80 -v "$(pwd)/.env:/app/.env" avukat-agi:latest

echo "✅ Deploy tamamlandı!"
echo "ℹ️ Logları kontrol etmek için: docker logs avukat-agi-container"
