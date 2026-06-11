import { Modal, Button, Row, Col, Badge, Form } from "react-bootstrap";
import { useState } from "react";

// ID formatting
const formatShortReportId = (id) => {
  if (!id) return "N/A";
  const short = String(id).split("-")[0]?.toUpperCase()?.slice(0, 6);
  return `FR-${short}`;
};

// Date formatting
const formatDateValue = (value) => {
  if (value == null || value === "") return "N/A";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleString();
};

const formatDateOnly = (value) => {
  if (value == null || value === "") return "N/A";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString();
};

// Status Badge variants
const statusBadge = (status) => {
  const value = String(status ?? "").toLowerCase();
  const variants = {
    new: "primary",
    pending: "secondary",
    under_review: "info",
    // underreview: "info",
    resolved: "success",
    investigation: "warning",
    rejected: "danger",
  };
  const label = value.replaceAll("_", " ") || "unknown";
  return (
    <Badge
      bg={variants[value] || "secondary"}
      className="px-3 py-2 text-capitalize"
    >
      {label}
    </Badge>
  );
};

// Priority Variants
const priorityBadge = (priority) => {
  const value = String(priority ?? "").toLowerCase();
  const variants = {
    low: "success",
    medium: "info",
    high: "warning",
    critical: "danger",
  };
  return (
    <Badge
      bg={variants[value] || "secondary"}
      className="px-3 py-2 text-capitalize"
    >
      {value || "unknown"}
    </Badge>
  );
};

// Renders Report Status and Report Priority badges
const renderValue = (key, value) => {
  if (value === null || value === undefined || value === "") return "N/A";

  if (key === "report_status") return statusBadge(value);
  if (key === "report_priority") return priorityBadge(value);

  if (key === "incident_description" && typeof value === "string") {
    return (
      <span className="text-break" style={{ whiteSpace: "pre-wrap" }}>
        {value}
      </span>
    );
  }

  if (key === "attachments" && Array.isArray(value)) {
    if (value.length === 0) {
      return <span className="text-secondary">No attachments</span>;
    }

    return (
      <div className="d-flex flex-wrap gap-3">
        {value.map((item, idx) => {
          const isImage = item.type?.startsWith("image/");

          const isPdf = item.type === "application/pdf";

          return (
            <div
              key={item.id || item.path || idx}
              className="border rounded p-2 bg-light"
              style={{ width: "140px" }}
            >
              {/* IMAGE PREVIEW */}
              {isImage && item.signedUrl && (
                <>
                  <a
                    href={item.signedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={item.signedUrl}
                      alt={item.name || "Attachment"}
                      className="img-fluid rounded"
                      style={{
                        width: "100%",
                        height: "100px",
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                    />
                  </a>

                  <div className="small mt-2 text-truncate" title={item.name}>
                    {item.name}
                  </div>
                </>
              )}

              {/* PDF PREVIEW */}
              {isPdf && item.signedUrl && (
                <div className="d-flex flex-column gap-2">
                  <div className="text-danger text-center fs-1">
                    <i className="fas fa-file-pdf"></i>
                  </div>

                  <div className="small text-truncate" title={item.name}>
                    {item.name}
                  </div>

                  <a
                    href={item.signedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-danger"
                  >
                    Open PDF
                  </a>
                </div>
              )}

              {/* OTHER FILE TYPES */}
              {!isImage && !isPdf && item.signedUrl && (
                <div className="d-flex flex-column gap-2">
                  <div className="text-secondary text-center fs-1">
                    <i className="fas fa-file"></i>
                  </div>

                  <div className="small text-truncate" title={item.name}>
                    {item.name}
                  </div>

                  <a
                    href={item.signedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-secondary"
                  >
                    Open File
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  if (typeof value === "object") {
    try {
      return (
        <pre className="small mb-0 bg-light p-2 rounded border overflow-auto">
          {JSON.stringify(value, null, 2)}
        </pre>
      );
    } catch {
      return String(value);
    }
  }

  if (key === "created_at" || key === "updated_at")
    return formatDateValue(value);
  if (key === "incident_date") return formatDateOnly(value);

  return String(value);
};

const ORDERED_FIELDS = [
  // ["id", "Report ID (reference)"],
  ["incident_type", "Incident type"],
  ["incident_date", "Incident date"],
  ["incident_location", "Incident location"],
  ["incident_description", "Description"],
  ["report_status", "Status"],
  ["report_priority", "Priority"],
  ["attachments", "Attachments"],
  ["created_at", "Submitted at"],
  // ["updated_at", "Last updated"],
];

const HIDDEN_FIELDS = new Set(["id"]);

const ReportDetailsModal = ({ show, onHide, report }) => {

  // Assignment of report to team member
  const [assignment, setAssignment] = useState([]);

  // Change Handler
  const handleChange = (e) => {
    const { id, value } = e.target;

    setAssignment((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // No report
  if (!report) return null;

  const usedKeys = new Set();

  return (
    <Modal show={show} onHide={onHide} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title className="reports-page-title">
          <i className="fas fa-file-alt me-2"></i>
          Report details — {formatShortReportId(report.id)}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* <p className="text-secondary small mb-3">
          <strong className="text-body">Full ID:</strong>{" "}
          <code className="user-select-all">{report.id ?? "N/A"}</code>
        </p> */}
        <Row className="g-3">
          {ORDERED_FIELDS.map(([key, label]) => {
            if (!(key in report) || HIDDEN_FIELDS.has(key)) return null;
            usedKeys.add(key);
            return (
              // <Col md={key === "incident_description" || key === "attachments" ? 12 : 6} key={key}>
              <Col md={6} key={key} className="mt-4">
                <div className="text-secondary small mb-1">
                  {/* <i className="fas fa-caret-right me-1"></i> */}
                  {label}
                </div>
                <div
                  className={key === "incident_description" ? "text-break" : ""}
                >
                  {renderValue(key, report[key])}
                </div>
              </Col>
            );
          })}
          {Object.entries(report)
            .filter(
              ([k, v]) =>
                !usedKeys.has(k) &&
                !HIDDEN_FIELDS.has(k) &&
                v !== undefined &&
                v !== null &&
                v !== "",
            )
            .map(([key, value]) => (
              <Col md={6} key={key} className="mt-4">
                <div className="text-secondary small mb-1 text-capitalize">
                  <i className="fas fa-caret-right me-1"></i>
                  {key.replaceAll("_", " ")}
                </div>
                <div>{renderValue(key, value)}</div>
              </Col>
            ))}

            {/* Assignment */}
          <Col md={6} className="mt-5 mb-4">
            <Form.Group>
              <Form.Label className="text-secondary mb-1">
                <i className="fas fa-list-check me-2"></i>Assign To:
              </Form.Label>
              <Form.Select
                id="assign_to"
                // value={}
                onChange={handleChange}
              >
                <option value="">
                  Select Team Member
                </option>
                <option value="Name">Team Member A</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReportDetailsModal;
