import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BreadcrumbSection from "../components/breadcrumb/BreadcrumbSection";
import { categoryApi, productApi } from "../services/ecommerceApi";
import type { CategoryResponseDto } from "../services/apiTypes";

const AddNewProductPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryResponseDto[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    categoryApi
      .getAll()
      .then((data) => {
        if (!cancelled) {
          setCategories(data);
          if (data.length > 0 && !categoryId) setCategoryId(data[0].id);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Kategoriler yüklenemedi.");
      })
      .finally(() => {
        if (!cancelled) setLoadingCategories(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      await productApi.create({
        productName: productName.trim(),
        description: description.trim() || null,
        price: priceNum,
        stockQuantity: stockNum,
        categoryId,
      });
      navigate("/all-product");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ürün eklenemedi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="row g-4 add-product-page">
      <div className="col-12">
        <BreadcrumbSection title="Add New Product" link="/all-product" />
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
                    disabled={loadingCategories}
                  >
                    <option value="">
                      {loadingCategories ? "Yükleniyor..." : "Kategori seçin"}
                    </option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name ?? c.id}
                      </option>
                    ))}
                  </select>
                  {!loadingCategories && categories.length === 0 && (
                    <p className="text-muted small mt-1">
                      Önce <a href="/category">Kategori</a> sayfasından en az bir kategori ekleyin.
                    </p>
                  )}
                </div>
                <div className="col-12">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting || loadingCategories || categories.length === 0}
                  >
                    {submitting ? "Kaydediliyor..." : "Ürün Ekle"}
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

export default AddNewProductPage;
