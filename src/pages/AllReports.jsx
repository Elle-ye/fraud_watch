import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import ReportDetailsModal from "../components/ReportDetailsModal";
import ReportsPageHeader from "../components/reports/ReportsPageHeader";
import ReportsFilters from "../components/reports/ReportsFilters";
import ReportsBulkBar from "../components/reports/ReportsBulkBar";
import ReportsTable from "../components/reports/ReportsTable";
import ReportsPagination from "../components/reports/ReportsPagination";
import { useAllReports } from "../hooks/useAllReports";
import { useReportsColumns } from "../hooks/useReportsColumns";
import { filterReports } from "../utils/reportFormatters";
import "./ReportsTable.css";

const DailyReports = () => {
  const { data, loading } = useAllReports();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [detailReport, setDetailReport] = useState(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Caching filters
  const filteredData = useMemo(
    () =>
      filterReports(data, { searchTerm, filterStatus, filterPriority }),
    [data, searchTerm, filterStatus, filterPriority],
  );

  const columns = useReportsColumns(setDetailReport);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, rowSelection, pagination },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
  });

  const selectedRows = table
    .getSelectedRowModel()
    .rows.map((row) => row.original.id);

  const handleBulkAction = (action) => {
    if (selectedRows.length === 0) {
      alert("Please select at least one report");
      return;
    }
    alert(
      `${action} ${selectedRows.length} report(s): ${selectedRows.join(", ")}`,
    );
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
    setFilterPriority("all");
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-0 reports-page">
      <ReportsPageHeader
        title="All Reports"
        icon="fas fa-database"
        subtitle={`Complete history of all fraud and crime reports`}
      />

      <ReportsFilters
        searchTerm={searchTerm}
        filterStatus={filterStatus}
        filterPriority={filterPriority}
        onSearchChange={setSearchTerm}
        onStatusChange={setFilterStatus}
        onPriorityChange={setFilterPriority}
        onReset={handleResetFilters}
      />

      <ReportsBulkBar
        selectedCount={selectedRows.length}
        onBulkAction={handleBulkAction}
        onClearSelection={() => setRowSelection({})}
      />

      <ReportsTable table={table} filteredCount={filteredData.length} />

      <ReportsPagination
        table={table}
        filteredCount={filteredData.length}
        onExport={() => alert("Exporting to CSV...")}
      />

      <ReportDetailsModal
        show={detailReport != null}
        onHide={() => setDetailReport(null)}
        report={detailReport}
      />
    </div>
  );
};

export default DailyReports;
