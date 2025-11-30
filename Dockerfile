# 1. AŞAMA: Build aşaması (Node ile Vite build)
FROM node:20-alpine AS build

WORKDIR /app

# Paket dosyalarını kopyala
COPY package*.json ./
COPY vite.config.* ./
COPY tsconfig.* ./

# Bağımlılıkları yükle
RUN npm install --legacy-peer-deps

# Diğer tüm proje dosyalarını kopyala
COPY . .

# Vite build: dist klasörü oluşacak
RUN npm run build

# 2. AŞAMA: Production aşaması (Sadece backend ve dist)
FROM node:20-alpine

WORKDIR /app

# Sadece production bağımlılıklarını yükle (daha küçük imaj için)
COPY package*.json ./
RUN npm install --only=production --legacy-peer-deps

# Build aşamasından dist klasörünü kopyala
COPY --from=build /app/dist ./dist

# Backend dosyalarını kopyala
COPY server.js ./
# Eğer backend için başka dosyalar lazımsa buraya ekle (örn: services, utils klasörleri)
# COPY services ./services 

# Portu ayarla (deploy.sh 80:80 mapliyor, bu yüzden içeride 80 dinlemeli)
ENV PORT=80

EXPOSE 80

# Uygulamayı başlat
CMD ["node", "server.js"]
