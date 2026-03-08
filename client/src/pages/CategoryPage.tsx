import { useCallback, useEffect, useState } from "react";
import AddNewCategoryForm from "../components/forms/AddNewCategoryForm";
import AllCategoryTable, { CategoryTableRow } from "../components/table/AllCategoryTable";
import CategoryEditModal from "../components/modal/CategoryEditModal";
import { categoryApi } from "../services/ecommerceApi";
import type { CategoryResponseDto } from "../services/apiTypes";

function mapCategoryToRow(c: CategoryResponseDto): CategoryTableRow {
  return {
    id: c.id,
    category_name: c.name ?? "",
    description: c.description ?? "",
    slug: c.name ?? "-",
    count: "-",
    image: "/img/bg-img/image.png",
  };
}

type EditModalState = { id: string; name: string; description: string } | null;

const CategoryPage = () => {
  const [categories, setCategories] = useState<CategoryTableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editModal, setEditModal] = useState<EditModalState>(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryApi.getAll();
      setCategories(data.map(mapCategoryToRow));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kategoriler yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleCategorySave = async (id: string, name: string, description: string) => {
    await categoryApi.update(id, { id, name, description });
    await loadCategories();
  };

  return (
    <div className="row g-4">
      <div className="col-12">
        <div className="dashboard-breadcrumb">
          <h6 className="mb-0">Categories</h6>
        </div>
      </div>
      {error && (
        <div className="col-12">
          <div className="alert alert-danger">{error}</div>
        </div>
      )}
      <div className="col-xxl-4 col-xl-5">
        <AddNewCategoryForm onSuccess={loadCategories} />
      </div>

      <div className="col-xxl-8 col-xl-7">
        <AllCategoryTable
          dataList={categories}
          loading={loading}
          onEditClick={(row) => setEditModal({ id: row.id, name: row.category_name, description: row.description })}
        />
      </div>

      {editModal && (
        <CategoryEditModal
          category={editModal}
          onClose={() => setEditModal(null)}
          onSave={handleCategorySave}
        />
      )}
    </div>
  );
};
export default CategoryPage;
