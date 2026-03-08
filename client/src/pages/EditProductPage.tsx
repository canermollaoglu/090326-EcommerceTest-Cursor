import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BreadcrumbSection from "../components/breadcrumb/BreadcrumbSection";
import { categoryApi, productApi } from "../services/ecommerceApi";
import type { CategoryResponseDto, ProductResponseDto } from "../services/apiTypes";

const EditProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductResponseDto | null>(null);
  const [categories, setCategories] = useState<CategoryResponseDto[]>([]);
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    Promise.all([productApi.getById(id), categoryApi.getAll()])
      .then(([prod, cats]) => {
        setProduct(prod);
        setCategories(cats);
        setProductName(prod.productName ?? "");
        setDescription(prod.description ?? "");
        setPrice(String(prod.price));
        setStockQuantity(String(prod.stockQuantity));
        setCategoryId(prod.categoryId);
      })
      .catch(() => setError("Ürün veya kategoriler yüklenemedi."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !product) return;
    setError(null);
    const priceNum = parseFloat(price);
    const stockNum = parseInt(stockQuantity, 10);
    if (!productName.trim()) {
      setError("Ürün adı gerekli.");
      return;
    }
    if (isNaN(priceNum) || priceNum <= 0) {
      setError("Geçerli bir fiyat girin.");
      return;
    }
    if (isNaN(stockNum) || stockNum < 0) {
      setError("Geçerli bir stok miktarı girin.");
      return;
    }
    if (!categoryId) {
      setError("Kategori seçin.");
      return;
    }
    setSubmitting(true);
    try {
      await productApi.update(id, {
        id,
        productName: productName.trim(),
        description: description.trim() || null,
        price: priceNum,
        stockQuantity: stockNum,
        categoryId,
      });
      navigate("/all-product");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Güncellenemedi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="row g-4">
        <div className="col-12">
          <BreadcrumbSection title="Ürün Düzenle" link="/all-product" />
          <div className="panel">
            <div className="panel-body text-center py-5">Yükleniyor...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!product || !id) {
    return (
      <div className="row g-4">
        <div className="col-12">
          <BreadcrumbSection title="Ürün Düzenle" link="/all-product" />
          <div className="alert alert-danger">Ürün bulunamadı.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="row g-4 add-product-page">
      <div className="col-12">
        <BreadcrumbSection title="Ürün Düzenle" link="/all-product" />
      </div>
      <div className="col-12">
        <div className="panel">
          <div className="panel-header">
            <h5>Ürün Bilgileri</h5>
          </div>
          <div className="panel-body">
            {error && (
              <div className="alert alert-danger mb-3" role="alert">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">Ürün adı *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Ürün adı"
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Açıklama</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Açıklama"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Fiyat *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="form-control"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Stok miktarı *</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Kategori *</label>
                  <select
                    className="form-control"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name ?? c.id}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? "Kaydediliyor..." : "Güncelle"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={() => navigate("/all-product")}
                  >
                    İptal
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;
