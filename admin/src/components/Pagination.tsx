import React from "react";

const Pagination = ({ totalPages, currentPage, changePage }: { totalPages: number, currentPage: number, changePage: (pageNumber: number) => void }) => {
  return (
    <div className="flex justify-center">
      {Array.from({ length: totalPages }, (_, index) => index + 1).map(pageNumber => (
        <button
          key={pageNumber}
          className={`mx-1 px-3 py-1 rounded-md ${
            pageNumber === currentPage ? "bg-primary text-white" : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => changePage(pageNumber)}
        >
          {pageNumber}
        </button>
      ))}
    </div>
  );
};

export default Pagination;