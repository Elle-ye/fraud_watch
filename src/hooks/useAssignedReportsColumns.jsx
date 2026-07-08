import { useMemo } from "react";
import { Button, Form } from "react-bootstrap";
import { formatShortReportId } from "../utils/reportFormatters";
import { PriorityBadge, StatusBadge } from "../components/reports/ReportBadges";
// import AssigneePills from "../components/reports/AssigneePills";

export const useAssignedReportsColumns = (onViewDetails) =>
  useMemo(
    () => [
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
        accessorKey: "report_id",
        header: "Report ID",
        cell: ({ row }) => (
          <span className="fw-bold text-primary">
            {formatShortReportId(row.original.id)}
          </span>
        ),
      },
      {
        accessorKey: "created_at",
        header: "Report Date",
        cell: ({ row }) =>
          row.original.created_at
            ? new Date(row.original.created_at).toLocaleDateString()
            : "",
      },
      {
        accessorKey: "incident_type",
        header: "Incident Type",
        cell: ({ row }) => row.original.incident_type || "N/A",
      },
      {
        accessorKey: "incident_location",
        header: "Incident Location",
        cell: ({ row }) => row.original.incident_location || "N/A",
      },
    //   {
    //     accessorKey: "incident_description",
    //     header: "Incident Description",
    //     cell: ({ row }) => row.original.incident_description || "N/A",
    //   },
    //   {
    //     accessorKey: "incident_date",
    //     header: "Incident Date",
    //     cell: ({ row }) =>
    //       row.original.incident_date
    //         ? new Date(row.original.reports?.incident_date).toLocaleDateString()
    //         : "",
    //   },
      {
        accessorKey: "report_status",
        header: "Report Status",
        cell: ({ row }) => (
          <StatusBadge status={row.original.report_status} />
        ),
      },
      {
        accessorKey: "report_priority",
        header: "Report Priority",
        cell: ({ row }) => (
          <PriorityBadge priority={row.original.report_priority} />
        ),
      },
    //   {
    //     id: "assigned_to",
    //     header: "Assigned To",
    //     cell: ({ row }) => (
    //       <AssigneePills assignments={row.original.report_assignments} />
    //     ),
    //   },
      {
        id: "assigned_by",
        header: "Assigned By",
        cell: ({ row }) =>
          row.original.assigned_by || "N/A"
      },
      {
        id: "assigned_on",
        header: "Assigned On",
        cell: ({ row }) =>
            row.original.assigned_at
              ? new Date(row.original.assigned_at).toLocaleDateString()
              : "N/A",
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
              onClick={() => onViewDetails(row.original)}
              title="View Details"
            >
              <i className="fas fa-eye"></i>
            </Button>
          </div>
        ),
      }, 
    ],
    [onViewDetails],
  );
  