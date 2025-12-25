import React from "react";
import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  page: number;
  setPage: (page: number) => void;
  pageCount: number;
}

const Pagination: React.FC<PaginationProps> = ({ page, setPage, pageCount }) => {
  if (pageCount <= 1) return null;

  return (
    <ReactPaginate
      forcePage={page - 1}
      onPageChange={(selected) => setPage(selected.selected + 1)}
      pageCount={pageCount}
      previousLabel="<"
      nextLabel=">"
      breakLabel="..."
      containerClassName={css.pagination}
      activeClassName={css.active}
    />
  );
};

export default Pagination;