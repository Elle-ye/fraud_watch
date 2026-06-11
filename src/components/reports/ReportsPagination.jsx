import { Button } from "react-bootstrap";

const ReportsPagination = ({ table, filteredCount, onExport }) => (
  <div className="mt-3 d-flex justify-content-between align-items-center paginations">
    <div className="text-secondary small">
      <i className="fas fa-chart-bar me-2"></i>
      Showing {table.getRowModel().rows.length} of {filteredCount} reports
    </div>

    <div className="d-flex flex-wrap align-items-center gap-2 ms-auto">
      {table.getPageCount() > 1 && (
        <span className="pagination-page-label">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
      )}

      <div className="pagination-actions">
        <button
          type="button"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          First
        </button>
        <button
          type="button"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Prev
        </button>
        <button
          type="button"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </button>
        <button
          type="button"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          Last
        </button>
      </div>

      <Button
        variant="link"
        className="text-decoration-none text-secondary small py-0"
        onClick={onExport}
      >
        <i className="fas fa-download me-1"></i> Export
      </Button>
    </div>
  </div>
);

export default ReportsPagination;
