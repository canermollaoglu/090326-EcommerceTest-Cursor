# React Frontend (adminDash) Entegrasyonu

Bu rehber, **client** klasöründeki React + Vite + TypeScript frontend'inin **ECommerceTest** API ile nasıl çalıştığını açıklar. Frontend, `D:\adminDash\main-file` şablonundan **ECommerceTest/client** içine kopyalanmıştır.

---

## 1. Yapılan Değişiklikler Özeti

### Backend (ECommerce.API)
- **CORS** eklendi: `http://localhost:5173` ve `http://127.0.0.1:5173` origin'lerine izin verilir (Vite varsayılan port).

### Frontend (ECommerceTest/client)
- **Vite proxy:** `vite.config.ts` içinde `/api` istekleri `http://localhost:5185` adresine yönlendirilir. Böylece CORS sorunu olmadan aynı origin’den istek atılır.
- **API servisi:** `src/services/ecommerceApi.ts` — Product ve Category için GET/POST/PUT/DELETE.
- **API tipleri:** `src/services/apiTypes.ts` — Backend DTO’larına uyumlu tipler.
- **Sayfalar API’ye bağlandı:**
  - **Category** (`/category`): Kategori listesi GET /api/CategoryApi, yeni kategori POST /api/CategoryApi.
  - **All Product** (`/all-product`): Ürün listesi GET /api/ProductApi, silme DELETE /api/ProductApi/{id}.
- **Add New Category formu:** “Save Category” ile API’ye kategori eklenir ve tablo yenilenir.
- **AllCategoryTable / AllProductTable:** Artık parent’tan gelen `dataList` / `tableData` ile çalışır (API’den gelen veri).

---

## 2. Çalıştırma Adımları

### Backend
```bash
cd c:\Users\ED\Desktop\ECommerceTest
dotnet run --project ECommerce.API
```
API varsayılan olarak **http://localhost:5185** (veya launchSettings’teki port) üzerinde çalışır.

### Frontend
```bash
cd c:\Users\ED\Desktop\ECommerceTest\client
npm install
npm run dev
```
Uygulama **http://localhost:5173** adresinde açılır. Vite proxy sayesinde `/api/*` istekleri otomatik olarak `http://localhost:5185`’e gider.

### Sıra
1. Önce **API’yi** başlatın.
2. Sonra **frontend’i** başlatın.
3. Tarayıcıda:
   - **Kategoriler:** http://localhost:5173/category — Kategori ekleyebilir, listeyi görebilirsiniz.
   - **Ürünler:** http://localhost:5173/all-product — API’deki ürünler listelenir, silme çalışır.
   - Ürün eklemek için önce **Category** sayfasından en az bir kategori oluşturun; **Add Product** sayfasını API’ye bağlamak için ek geliştirme gerekir (aşağıda not).

---

## 3. Opsiyonel: API URL’i Ortam Değişkeni ile

Proxy kullanmıyorsanız (örneğin build alıp farklı bir sunucuda çalıştırıyorsanız):

1. `ECommerceTest/client` içinde `.env` oluşturun:
   ```
   VITE_API_URL=http://localhost:5185
   ```
2. `ecommerceApi.ts` zaten `VITE_API_URL` varsa tam URL ile istek atar; yoksa relative `/api` (proxy) kullanır.

---

## 4. Add Product Sayfası (İleride)

`/add-product` sayfası henüz API’ye bağlı değil. Bağlamak için:

1. **Kategorileri çekin:** Sayfa açılırken `categoryApi.getAll()` ile kategorileri alıp ProductCategorySection / dropdown’da listeyin.
2. **Form submit:** ProductDataForm / ProductTitleForm alanlarından (productName, description, price, stockQuantity, categoryId) bir DTO oluşturup `productApi.create(body)` çağırın.
3. Başarıda listeye yönlendirin: `navigate('/all-product')`.

---

## 5. Frontend Konumu

Frontend **ECommerceTest/client** klasöründedir. Çözüm (.sln) dosyasına frontend projesi eklemeniz gerekmez; .NET build’i sadece backend’i derler. Frontend ayrı bir komutla (`npm run dev` / `npm run build`) çalışır.
