import { useCallback, useEffect, useState } from "react";
import TableFilter2 from "../components/filter/TableFilter2";
import TableHeader from "../components/header/table-header/TableHeader";
import AllProductTable, { ProductTableRow } from "../components/table/AllProductTable";
import { allProductHeaderData } from "../data";
import TableBottomControls from "../components/utils/TableBottomControls";
import { productApi } from "../services/ecommerceApi";
import type { ProductResponseDto } from "../services/apiTypes";

function mapProductToRow(p: ProductResponseDto): ProductTableRow {
  return {
    id: p.id,
    product_name: p.productName ?? "",
    category: p.categoryName ?? "",
    sku: 0,
    image: "/img/product-12.jpg",
    stock: p.stockQuantity,
    price: p.price,
    sales: 0,
    rating: 0,
    published: p.createdDate ? new Date(p.createdDate).toLocaleDateString() : "",
  };
}

const AllProductPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(10);
  const [dataList, setDataList] = useState<ProductTableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productApi.getAll();
      setDataList(data.map(mapProductToRow));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ürünler yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = dataList.slice(indexOfFirstData, indexOfLastData);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(dataList.length / dataPerPage) || 1;
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleDelete = async (id: string | number) => {
    try {
      await productApi.delete(String(id));
      setDataList((prev) => prev.filter((item) => item.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ürün silinemedi.");
    }
  };

  return (
    <div className="row g-4">
      <div className="col-12">
        <div className="panel">
          <TableHeader
            tableHeading="All Products"
            tableHeaderData={allProductHeaderData}
            showAddLink
          />

          <div className="panel-body">
            {error && <div className="alert alert-danger mb-3">{error}</div>}
            {loading ? (
              <div className="text-center py-5">Yükleniyor...</div>
            ) : (
              <>
                <div className="product-table-quantity">
                  <ul>
                    <li className="text-white">All ({dataList.length})</li>
                    <li>Published ({dataList.length})</li>
                    <li>Draft (0)</li>
                    <li>Trush (0)</li>
                  </ul>
                </div>

                <TableFilter2 showCategory showProductType showProductStock />

                <div className="table-responsive">
                  <AllProductTable
                    tableData={currentData}
                    handleDelete={handleDelete}
                  />
                </div>
              </>
            )}

            {!loading && (
              <TableBottomControls
                indexOfFirstData={indexOfFirstData}
                indexOfLastData={indexOfLastData}
                dataList={dataList}
                currentPage={currentPage}
                totalPages={totalPages}
                paginate={paginate}
                pageNumbers={pageNumbers}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AllProductPage;
