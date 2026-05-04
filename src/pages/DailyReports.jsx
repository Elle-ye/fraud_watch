import { useState, useEffect, useMemo } from "react";
import { Card, Button, InputGroup, Form, Badge, Row, Col } from "react-bootstrap";
import { supabase } from "../config/supabase";
import "./ReportsTable.css";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

const DailyReports = () => {
  // Initial States
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    console.log('DailyReports mounted');
    return () => {
      console.log('DailyReports unmounted');
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const fetchReports = async () => {
      setLoading(true);
    
      try {
        const { data: reports, error } = await supabase
          .from("reports")
          .select("*")
          .order("created_at", { ascending: false });
    
        if (error) {
          console.error(error);
          if (isMounted) setData([]);
          return;
        }
    
        if (isMounted) setData(reports || []);
      } catch (err) {
        console.error(err);
        if (isMounted) setData([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchReports();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const normalize = (value) => String(value ?? "").toLowerCase();

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const idText = normalize(item.id);
      const typeText = normalize(item.crime_type);
      const locationText = normalize(item.crime_location);
      const statusText = normalize(item.report_status);
      const priorityText = normalize(item.report_priority);
      const searchText = searchTerm.toLowerCase();

      const matchesSearch =
        searchTerm === "" ||
        idText.includes(searchText) ||
        typeText.includes(searchText) ||
        locationText.includes(searchText);

      const matchesStatus =
        filterStatus === "all" || statusText === filterStatus.toLowerCase();
      const matchesPriority =
        filterPriority === "all" || priorityText === filterPriority.toLowerCase();

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [data, searchTerm, filterStatus, filterPriority]);

  const getPriorityBadge = (priority) => {
    const value = String(priority ?? "").toLowerCase();
    const variants = {
      low: "success",
      medium: "info",
      high: "warning",
      critical: "danger",
    };
    return (
      <Badge bg={variants[value] || "secondary"} className="px-3 py-2 text-capitalize">
        {value || "unknown"}
      </Badge>
    );
  };

  const getStatusBadge = (status) => {
    const value = String(status ?? "").toLowerCase();
    const variants = {
      new: "primary",
      pending: "secondary",
      under_review: "info",
      underreview: "info",
      resolved: "success",
      investigation: "warning",
      rejected: "danger",
    };
    const label = value.replaceAll("_", " ") || "unknown";
    return (
      <Badge bg={variants[value] || "secondary"} className="px-3 py-2 text-capitalize">
        {label}
      </Badge>
    );
  };

  // Move columns definition inside useMemo to prevent recreation on every render
  const columns = useMemo(() => [
    {
      id: "select",
      header: ({ table }) => (
        <Form.Check
          type="checkbox"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <Form.Check
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
      enableSorting: false,
    },
    {
      accessorKey: "id",
      header: "Report ID",
      cell: ({ row }) => <span className="fw-bold text-primary">{row.original.id}</span>,
    },
    {
      id: "dateTime",
      header: "Date & Time",
      accessorFn: (row) => `${row.crime_date || ""} ${row.created_at || ""}`,
      cell: ({ row }) => (
        <>
          {row.original.crime_date || "N/A"}{" "}
          {row.original.created_at ? new Date(row.original.created_at).toLocaleTimeString() : ""}
        </>
      ),
    },
    {
      accessorKey: "crime_type",
      header: "Crime Type",
      cell: ({ row }) => row.original.crime_type || "N/A",
    },
    {
      accessorKey: "crime_location",
      header: "Location",
      cell: ({ row }) => row.original.crime_location || "N/A",
    },
    {
      accessorKey: "report_status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.original.report_status),
    },
    {
      accessorKey: "report_priority",
      header: "Priority",
      cell: ({ row }) => getPriorityBadge(row.original.report_priority),
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="d-flex gap-2">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => alert(`Viewing ${row.original.id}`)}
            title="View Details"
          >
            <i className="fas fa-eye"></i>
          </Button>
          <Button
            variant="outline-info"
            size="sm"
            onClick={() => alert(`Editing ${row.original.id}`)}
            title="Edit Report"
          >
            <i className="fas fa-edit"></i>
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => alert(`Delete ${row.original.id}?`)}
            title="Delete Report"
          >
            <i className="fas fa-trash"></i>
          </Button>
        </div>
      ),
    },
  ], []); // Empty dependency array since these don't change

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      rowSelection,
    },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
  });

  const selectedRows = table.getSelectedRowModel().rows.map((row) => row.original.id);

  const handleBulkAction = (action) => {
    if (selectedRows.length === 0) {
      alert("Please select at least one report");
      return;
    }
    alert(`${action} ${selectedRows.length} report(s): ${selectedRows.join(", ")}`);
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
      <div className="mb-4">
        <h1 className="h2 mb-2 reports-page-title">
          <i className="fas fa-calendar-day me-3"></i>
          Daily Reports
        </h1>
        <p className="text-secondary">Reports filed today - {new Date().toLocaleDateString()}</p>
      </div>

      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={4}>
              <Form.Label className="text-secondary mb-1">
                <i className="fas fa-search me-2"></i>Search
              </Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <i className="fas fa-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by ID, type, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <Button variant="outline-secondary" onClick={() => setSearchTerm("")}>
                    <i className="fas fa-times"></i>
                  </Button>
                )}
              </InputGroup>
            </Col>

            <Col md={3}>
              <Form.Label className="text-secondary mb-1">
                <i className="fas fa-filter me-2"></i>Status
              </Form.Label>
              <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="investigation">Investigation</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </Form.Select>
            </Col>

            <Col md={3}>
              <Form.Label className="text-secondary mb-1">
                <i className="fas fa-flag me-2"></i>Priority
              </Form.Label>
              <Form.Select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </Form.Select>
            </Col>

            <Col md={2}>
              <Form.Label className="mb-1">&nbsp;</Form.Label>
              <Button
                className="w-100 reports-reset-btn"
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("all");
                  setFilterPriority("all");
                }}
              >
                <i className="fas fa-undo-alt me-2"></i>Reset
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {selectedRows.length > 0 && (
        <div className="mb-3 p-3 bg-primary bg-opacity-10 rounded border border-primary">
          <div className="d-flex justify-content-between align-items-center">
            <span>
              <i className="fas fa-check-circle me-2 text-primary"></i>
              <strong>{selectedRows.length}</strong> report(s) selected
            </span>
            <div className="d-flex gap-2">
              <Button size="sm" variant="success" onClick={() => handleBulkAction("Resolve")}>
                <i className="fas fa-check me-2"></i>Resolve Selected
              </Button>
              <Button size="sm" variant="danger" onClick={() => handleBulkAction("Delete")}>
                <i className="fas fa-trash me-2"></i>Delete Selected
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setRowSelection({})}>
                <i className="fas fa-times me-2"></i>Clear Selection
              </Button>
            </div>
          </div>
        </div>
      )}

      <Card className="border-0 shadow-sm">
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
                          cursor: header.column.getCanSort() ? "pointer" : "default",
                        }}
                      >
                        {header.isPlaceholder ? null : (
                          <>
                            {flexRender(header.column.columnDef.header, header.getContext())}
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
                    className={row.getIsSelected() ? "reports-row-selected" : ""}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredData.length === 0 && (
              <div className="text-center py-5">
                <i className="fas fa-inbox fa-3x text-secondary mb-3"></i>
                <p className="text-secondary">No reports found matching your criteria</p>
              </div>
            )}
          </div>
        </Card.Body>
      </Card>

      <div className="mt-3 d-flex justify-content-between align-items-center">
        <div className="text-secondary">
          <i className="fas fa-chart-bar me-2"></i>
          Showing {filteredData.length} of {data.length} reports
        </div>
        <div className="text-secondary">
          <Button
            variant="link"
            className="text-decoration-none"
            onClick={() => alert("Exporting to CSV...")}
          >
            <i className="fas fa-download me-1"></i> Export
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DailyReports;