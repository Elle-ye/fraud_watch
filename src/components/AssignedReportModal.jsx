import { Modal, Button, Row, Col, Badge, Form } from "react-bootstrap";
import { useState,  } from "react";
import { supabase } from "../config/supabase";
import { useAuth } from "../context/useAuth";

import toast from "react-hot-toast";
import "./ReportDetailsModal.css";

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
    // under_review: "info",
    in_progress: "info",
    resolved: "success",
    // investigation: "warning",
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

  if (key === "created_at" || key === "updated_at") return formatDateValue(value);

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

// Modal "container"
const AssignedReportModal = ({ show, onHide, report }) => {
  // Assignment of report to team member
  const [assignment, setAssignment] = useState([]);
  // const [teamMembers, setTeamMembers] = useState("");
  const [status, setStatus] = useState("");
  // const [currentUser, setCurrentUser] = useState();
  // const [error, setError] = useState(null);

  const { profile, loading, user } = useAuth();

  // Report Assignment
  // useEffect(() => {
  //   // Fetch team members
  //   const fetchTeamMembers = async () => {
  //     const { data, error } = await supabase
  //       .from("profiles")
  //       .select("id, full_name")
  //       .eq("role", "team_member");

  //     if (error) {
  //       console.log("Error fetching Team Members", error);
  //       setTeamMembers([]);
  //     } else {
  //       setTeamMembers(data);
  //     }
  //   };

  //   fetchTeamMembers();
  // }, []);

  const handleClose = () => {
    setAssignment([]);
    onHide();
  };

  if (loading) return null;

  // No report
  if (!report) return null;

  // Assign to team member
  // const handleSelect = (e) => {
  //   const id = e.target.value;
  //   if (!id || assignment.includes(id)) return;
  //   setAssignment((prev) => [...prev, id]);
  // };

  // // Remove team member
  // const handleRemove = (id) => {
  //   setAssignment((prev) => prev.filter((a) => a !== id));
  // };

  // Update Status
  const handleStatusChange = (e) => {
    const status = e.target.value;

    if (!status) {
      return;
    } else {
      setStatus(status);
    }
  };

  // if (status === "pending" || status === "in_progress") {
  //   // toast.success("Report resolved");
  //   console.log("Report pending or in progress", status);
  // } else if (status === "resolved" || status === "rejected") {
  //   console.log("Report resolved or rejected", status);
  // }

  // Update Status Submit
  const handleStatusSubmit = async () => {
    if (!status) {
      toast.error("Please select a status");
      return;
    }

    if (status === "pending" || status === "in_progress") {
      // toast.success("Report resolved");

      try {
        // const { error } = await supabase
        //   .from("reports")
        //   .update({ report_status: status })
        //   .eq("id", report.id);

        await toast.promise(
          (async () => {
            const { error } = await supabase
              .from("reports")
              .update({ report_status: status })
              .eq("id", report.id);
            if (error) throw error;
          })(),
          {
            loading: "Updating Status...",
            success: () => {
              setStatus(status);
              setTimeout(onHide, 1000);
              alert("Status updated");
              console.log("Status updated:", status);
              return "Status updated";
            },
            error: (err) => err.message ?? "Failed to update status",
          },
        );
      } catch (error) {
        console.error("Error updating status", error);
      } finally {
        setStatus("");
      }
    } else if (status === "resolved" || status === "rejected") {
      console.log("Report resolved or rejected,", status);
    }

    // try {
    //   // const { error } = await supabase
    //   //   .from("reports")
    //   //   .update({ report_status: status })
    //   //   .eq("id", report.id);

    //   await toast.promise(
    //     (async () => {
    //       const { error } = await supabase
    //         .from("reports")
    //         .update({ report_status: status })
    //         .eq("id", report.id);
    //       if (error) throw error;
    //     })(),
    //     {
    //       loading: "Updating Status...",
    //       success: () => {
    //         setStatus(status);
    //         setTimeout(onHide, 1000);
    //         alert("Status updated");
    //         console.log("Status updated");
    //         return "Status updated";
    //       },
    //       error: (err) => err.message ?? "Failed to update status",
    //     },
    //   );
    // } catch (error) {
    //   console.error("Error updating status", error);
    // } finally {
    //   setStatus("");
    // }
  };

  // Submit assignment
  const handleSubmit = async () => {
    if (!assignment.length) {
      toast.error("Please choose at least one member");
      return;
    }

    // if(!assignment) {
    //   return;
    // }

    const rows = assignment.map((assignedTo) => ({
      report_id: report.id,
      assigned_to: assignedTo,
      assigned_by: user.id,
    }));

    await toast.promise(
      // Wrap in a real promise that rejects on error
      (async () => {
        const { error } = await supabase
          .from("report_assignments")
          .insert(rows);
        if (error) throw error;
      })(),
      {
        loading: "Updating assignment...",
        success: () => {
          setAssignment([]);
          setTimeout(onHide, 1000);
          return "Assignment updated";
        },
        error: (err) => err.message ?? "Failed to update assignment",
      },
    );
  };

  const usedKeys = new Set();

  // Render Modal
  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      centered
      scrollable
      backdrop="static"
      keyboard={false}
    >
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

          {/* Report Assignment */}

          {/* {profile?.role === "supervisor" && (
            <Col md={6} className="mt-5 mb-4">
              <Form.Group>
                <Form.Label className="text-secondary mb-1">
                  <i className="fas fa-list-check me-2"></i>Assign To:
                </Form.Label> */}

          {/* Pills */}
          {/* {assignment.length > 0 && (
                  <div className="assign-pills mb-2">
                    {assignment.map((id) => {
                      const member = teamMembers.find((m) => m.id === id);
                      return (
                        <span key={id} className="assign-pill">
                          {member?.full_name}
                          <button
                            type="button"
                            className="assign-pill__remove"
                            onClick={() => handleRemove(id)}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )} */}

          {/* Dropdown */}
          {/* <Form.Select id="assign_to" onChange={handleSelect}>
                  <option value="">Select Team Member</option>
                  {teamMembers
                    .filter((m) => !assignment.includes(m.id))
                    .map((member) => {
                      return (
                        <option value={member.id} key={member.id}>
                          {member.full_name}
                        </option>
                      );
                    })}
                </Form.Select>
              </Form.Group>
            </Col>
          )} */}

          {profile?.role === "team_member" && (
            <Col md={6} className="mt-5 mb-4">
              <Form.Group>
                <Form.Label className="text-secondary mb-1">
                  <i className="fas fa-list-check me-2"></i>Update Status:
                </Form.Label>
                <Form.Select id="update_status" onChange={handleStatusChange}>
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="rejected">Rejected</option>
                </Form.Select>
              </Form.Group>
            </Col>
          )}
        </Row>
      </Modal.Body>
      <Modal.Footer>
        {profile?.role === "supervisor" && (
          <Button variant="primary" className="me-2" onClick={handleSubmit}>
            Update Report
          </Button>
        )}
        {profile?.role === "team_member" && (
          <Button
            variant="primary"
            className="me-2"
            onClick={handleStatusSubmit}
          >
            Update Report
          </Button>
        )}
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AssignedReportModal;
