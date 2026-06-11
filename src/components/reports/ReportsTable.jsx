import { Card } from "react-bootstrap";
import { flexRender } from "@tanstack/react-table";

const ReportsTable = ({ table, filteredCount }) => {
  const pageSize = table.getState().pagination.pageSize;
  const isAll = pageSize === filteredCount;

  const handlePageSizeChange = (e) => {
    const value = e.target.value;
    table.setPageSize(value === "all" ? filteredCount : Number(value));
    table.setPageIndex(0);
  };

  return (
    <Card className="border-0 shadow-sm">
      <Card.Header className="d-flex align-items-center justify-content-between flex-wrap gap-2 py-3">
        <span className="text-secondary small mb-0">
          <i className="fas fa-list-ul me-2"></i>
          Rows per page
        </span>
        <select
          className="pages"
          aria-label="Rows per page"
          value={isAll ? "all" : pageSize}
          onChange={handlePageSizeChange}
        >
          {[5, 10, 20, 50].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
          <option value="all">Show All</option>
        </select>
      </Card.Header>
      <Card.Body className="p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="reports-table-head">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={
                        header.id === "select"
                          ? "reports-checkbox-col"
                          : "reports-table-header"
                      }
                      onClick={
                        header.column.getCanSort()
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                      style={{
                        cursor: header.column.getCanSort()
                          ? "pointer"
                          : "default",
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {header.column.getCanSort() &&
                            (header.column.getIsSorted() === "asc"
                              ? " ▲"
                              : header.column.getIsSorted() === "desc"
                                ? " ▼"
                                : "")}
                        </>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={
                    row.getIsSelected() ? "reports-row-selected" : ""
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCount === 0 && (
            <div className="text-center py-5">
              <i className="fas fa-inbox fa-3x text-secondary mb-3"></i>
              <p className="text-secondary">
                No reports found matching your criteria
              </p>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ReportsTable;
