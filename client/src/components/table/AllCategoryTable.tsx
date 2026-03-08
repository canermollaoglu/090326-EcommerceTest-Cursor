import { useState } from "react";
import { categoryHeaderData } from "../../data";
import TableHeader from "../header/table-header/TableHeader";
import { Link } from "react-router-dom";
import TableBottomControls from "../utils/TableBottomControls";
import BulkActions from "../utils/dropdowns/BulkActions";
import EmployeeLength from "../utils/dropdowns/EmployeeLength";
import type { CategoryResponseDto } from "../../services/apiTypes";

export type CategoryTableRow = {
  id: string;
  category_name: string;
  description: string;
  slug: string;
  count: string;
  image: string;
};

type Props = {
  dataList: CategoryTableRow[];
  loading?: boolean;
  onEditClick?: (row: CategoryTableRow) => void;
};

const AllCategoryTable = ({ dataList, loading = false, onEditClick }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(10);

  // Pagination logic
  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = dataList.slice(indexOfFirstData, indexOfLastData);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Calculate total number of pages
  const totalPages = Math.ceil(dataList.length / dataPerPage) || 1;
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  if (loading) {
    return (
      <div className="panel category-page">
        <div className="panel-body text-center py-5">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="panel category-page">
      <TableHeader
        tableHeading="All Categories"
        tableHeaderData={categoryHeaderData}
      />

      <div className="panel-body">
        <div className="table-filter-option">
          <div className="row g-3">
            <div className="col-12 col-sm-8">
              <form className="row g-2">
                <div className="col-9 col-sm-6 col-lg-5 col-xl-6 col-xxl-4">
                  <BulkActions />
                </div>
                <div className="col-3 col-sm-4 col-lg-3 col-xl-3">
                  <button className="btn btn-primary w-100">Apply</button>
                </div>
              </form>
            </div>
            <div className="col-12 col-sm-4 d-flex justify-content-end">
              <div id="employeeTableLength">
                <label className="d-flex align-items-center gap-2">
                  <EmployeeLength />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table
            className="table table-dashed table-hover digi-dataTable all-product-table"
            id="allProductTable"
          >
            <thead>
              <tr>
                <th className="no-sort">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="markAllProduct"
                    />
                  </div>
                </th>
                <th>Name</th>
                <th>Description</th>
                <th>Slug</th>
                <th>Count</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" />
                    </div>
                  </td>
                  <td>
                    <div className="table-category-card">
                      <div className="part-icon">
                        <span>
                          <img src={item.image} alt="image" />
                        </span>
                      </div>
                      <div className="part-txt">
                        <span className="category-name">
                          {item.category_name}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="table-dscr">{item.description}</span>
                  </td>
                  <td>{item.slug}</td>
                  <td>
                    <Link to="/all-product">{item.count}</Link>
                  </td>
                  <td>
                    <div className="btn-box">
                      <button type="button" title="Görüntüle">
                        <i className="fa-light fa-eye"></i>
                      </button>
                      <button
                        type="button"
                        title="Düzenle"
                        onClick={() => onEditClick?.(item)}
                      >
                        <i className="fa-light fa-pen-to-square"></i>
                      </button>
                      <button type="button" title="Sil">
                        <i className="fa-light fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <TableBottomControls
          indexOfFirstData={indexOfFirstData}
          indexOfLastData={indexOfLastData}
          dataList={dataList}
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
          pageNumbers={pageNumbers}
        />
      </div>
    </div>
  );
};
export default AllCategoryTable;
