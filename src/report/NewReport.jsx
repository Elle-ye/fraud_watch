import { Card, Button, Form, Row, Col } from "react-bootstrap";
import { supabase } from "../config/supabase";
import { useState } from "react";
import toast from "react-hot-toast";

/** Supabase Storage bucket for report attachments. */
const REPORT_ATTACHMENTS_BUCKET = "report-attachments";

/** Max files per report */
const MAX_ATTACHMENTS = 3;

/** Max file size per file */
const MAX_FILE_BYTES = 5 * 1024 * 1024;

/** Accepted file types */
const ACCEPTED_FILE_TYPES = "image/jpeg,image/png,image/webp,application/pdf";

const NewReport = () => {
  //   Error logging
  const [formError, setFormError] = useState(null);

  const [attachments, setAttachments] = useState([]);

  //   Default/initial form data
  const initialFormData = {
    incidentType: "",
    incidentDate: "",
    incidentDescription: "",
    incidentLocation: "",
    reportStatus: "new",
    reportPriority: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  //   Submit Button Click/Disable loading
  const [isSubmitting, setIsSubmitting] = useState(false);

  //   Form fields
  const {
    incidentType,
    incidentDate,
    incidentDescription,
    incidentLocation,
    reportStatus,
    reportPriority,
  } = formData;

  //   Form change handler
  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const sanitizeFileName = (name) =>
    name.replace(/[^\w.\-()+ ]/g, "_").slice(0, 120);

  const handleFileChange = (e) => {
    const picked = Array.from(e.target.files || []);
    e.target.value = "";

    if (picked.length === 0) return;

    setFormError(null);

    // Validate file size
    const oversized = picked.find((f) => f.size > MAX_FILE_BYTES);
    if (oversized) {
      setFormError(
        `"${oversized.name}" is too large. Maximum file size is ${Math.round(MAX_FILE_BYTES / (1024 * 1024))} MB.`,
      );
      return;
    }

    // Validate file types
    const invalidType = picked.find(
      (file) => !ACCEPTED_FILE_TYPES.includes(file.type),
    );

    if (invalidType) {
      setFormError(`"${invalidType.name}" is not a supported file type.`);
      return;
    }

    // Validate slots (At most 3 files)
    const remainingSlots = MAX_ATTACHMENTS - attachments.length;
    if (remainingSlots <= 0) {
      setFormError(`You can upload at most ${MAX_ATTACHMENTS} files.`);
      return;
    }

    const toAdd = picked.slice(0, remainingSlots);
    if (picked.length > remainingSlots) {
      setFormError(
        `Only ${remainingSlots} more file(s) allowed (${MAX_ATTACHMENTS} max). Extra files were not added.`,
      );
    }

    // Prevent duplicates - Checks file name AND size
    const merged = [...attachments];
    for (const file of toAdd) {
      const dup = merged.some(
        (f) => f.name === file.name && f.size === file.size,
      );
      if (!dup) merged.push(file);
    }
    setAttachments(merged);
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
    setFormError(null);
  };

  //   Form Submission Handler - To Supabase
  // const submitReport = async (e) => {
  //   e.preventDefault();

  //   const {
  //     data: { session },
  //   } = await supabase.auth.getSession();

  //   console.log(session);

  //   if (
  //     !incidentType ||
  //     !incidentDate ||
  //     !incidentDescription ||
  //     !incidentLocation ||
  //     !reportStatus ||
  //     !reportPriority
  //   ) {
  //     // setFormError("Please fill the form properly");
  //     toast.error("Please fill the form properly");
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   setFormError(null);

  //   // Generate report ID upfront
  //   const reportId = crypto.randomUUID();

  //   try {
  //     const uploadedAttachments = [];

  //     // Upload files first
  //     for (const file of attachments) {
  //       const objectPath = `${reportId}/${crypto.randomUUID()}-${sanitizeFileName(
  //         file.name,
  //       )}`;

  //       const { error: uploadError } = await supabase.storage
  //         .from(REPORT_ATTACHMENTS_BUCKET)
  //         .upload(objectPath, file, {
  //           cacheControl: "3600",
  //           upsert: false,
  //           contentType: file.type || undefined,
  //         });

  //       if (uploadError) {
  //         // Cleanup already uploaded files
  //         const uploadedPaths = uploadedAttachments.map((item) => item.path);

  //         if (uploadedPaths.length > 0) {
  //           await supabase.storage
  //             .from(REPORT_ATTACHMENTS_BUCKET)
  //             .remove(uploadedPaths);
  //         }

  //         throw new Error(`File upload failed: ${uploadError.message}`);
  //       }

  //       uploadedAttachments.push({
  //         id: reportId,
  //         path: objectPath,
  //         name: file.name,
  //         size: file.size,
  //         type: file.type,
  //         uploaded_at: new Date().toISOString(),
  //       });
  //     }

  //     // Single INSERT
  //     const { error: insertError } = await supabase.from("reports").insert({
  //       id: reportId,
  //       incident_type: incidentType,
  //       incident_date: incidentDate,
  //       incident_description: incidentDescription,
  //       incident_location: incidentLocation,
  //       report_status: reportStatus,
  //       report_priority: reportPriority,

  //       // JSONB column in Supabase
  //       attachments: uploadedAttachments,
  //     });

  //     if (insertError) {
  //       // Rollback uploaded files if report insert fails
  //       const uploadedPaths = uploadedAttachments.map((item) => item.path);

  //       if (uploadedPaths.length > 0) {
  //         await supabase.storage
  //           .from(REPORT_ATTACHMENTS_BUCKET)
  //           .remove(uploadedPaths);
  //       }

  //       throw insertError;
  //     }

  //     console.log("Submission Successful:", reportId);

  //     alert("Report Submitted Successfully");

  //     setFormData(initialFormData);
  //     setAttachments([]);
  //   } catch (err) {
  //     console.error(err);

  //     setFormError(err?.message || "Report submission failed.");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const submitReport = async (e) => {
    e.preventDefault();

    // const {
    //   data: { session },
    // } = await supabase.auth.getSession();

    // console.log(session);

    if (
      !incidentType ||
      !incidentDate ||
      !incidentDescription ||
      !incidentLocation ||
      !reportStatus ||
      !reportPriority
    ) {
      // setFormError("Please fill the form properly");
      toast.error("Please fill the form properly");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    // Generate report ID upfront
    const reportId = crypto.randomUUID();

    const submitPromise = async () => {
      const uploadedAttachments = [];

      try {
        // Upload files first
        for (const file of attachments) {
          const objectPath = `${reportId}/${crypto.randomUUID()}-${sanitizeFileName(
            file.name,
          )}`;

          const { error: uploadError } = await supabase.storage
            .from(REPORT_ATTACHMENTS_BUCKET)
            .upload(objectPath, file, {
              cacheControl: "3600",
              upsert: false,
              contentType: file.type || undefined,
            });

          if (uploadError) {
            // Cleanup already uploaded files
            const uploadedPaths = uploadedAttachments.map((item) => item.path);

            if (uploadedPaths.length > 0) {
              await supabase.storage
                .from(REPORT_ATTACHMENTS_BUCKET)
                .remove(uploadedPaths);
            }

            throw new Error(`File upload failed: ${uploadError.message}`);
          }

          uploadedAttachments.push({
            id: reportId,
            path: objectPath,
            name: file.name,
            size: file.size,
            type: file.type,
            uploaded_at: new Date().toISOString(),
          });
        }

        // Single INSERT
        const { error: insertError } = await supabase.from("reports").insert({
          id: reportId,
          incident_type: incidentType,
          incident_date: incidentDate,
          incident_description: incidentDescription,
          incident_location: incidentLocation,
          report_status: reportStatus,
          report_priority: reportPriority,

          // JSONB column in Supabase
          attachments: uploadedAttachments,
        });

        if (insertError) {
          // Rollback uploaded files if report insert fails
          const uploadedPaths = uploadedAttachments.map((item) => item.path);

          if (uploadedPaths.length > 0) {
            await supabase.storage
              .from(REPORT_ATTACHMENTS_BUCKET)
              .remove(uploadedPaths);
          }

          throw insertError;
        }

        console.log("Submission Successful:", reportId);

        // alert("Report Submitted Successfully");

        setFormData(initialFormData);
        setAttachments([]);
      } catch (err) {
        console.error(err);

        setFormError(err?.message || "Report submission failed.");
        throw err;
      }
    };

    try {
      await toast.promise(submitPromise(), {
        loading: "Submitting report...",
        success: "Report submitted successfully",
        error: (err) => err?.message || "Report submission failed.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-0 reports-page">
      <div className="mb-4">
        <h1 className="h2 mb-2 reports-page-title">
          <i className="fas fa-database me-3"></i>
          New Report
        </h1>
        <p className="text-secondary">
          Fill out the form below to create a new report.
        </p>
      </div>
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className=" shadow mb-4">
            <Card.Body>
              <Form onSubmit={submitReport}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="text-secondary mb-1">
                        <i className="fas fa-list-check me-2"></i>Incident Type
                      </Form.Label>
                      <Form.Select
                        id="incidentType"
                        value={formData.incidentType}
                        onChange={handleChange}
                      >
                        <option value="" disabled>
                          Select Type of Incident
                        </option>
                        <option value="Fraud">Fraud</option>
                        <option value="Cyber Crime">Cybercrime</option>
                        <option value="Identity Theft">Identity Theft</option>
                        <option value="Other">Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="text-secondary mb-1">
                        <i className="fas fa-calendar-day me-2"></i>Incident
                        Date
                      </Form.Label>
                      <Form.Control
                        type="date"
                        id="incidentDate"
                        value={formData.incidentDate}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="text-secondary mb-1">
                        <i className="fas fa-location-dot me-2"></i>Incident
                        Location
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="incidentLocation"
                        value={formData.incidentLocation}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="text-secondary mb-1">
                        <i className="fas fa-align-left me-2"></i>Description
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        id="incidentDescription"
                        value={formData.incidentDescription}
                        rows={3}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="text-secondary mb-1">
                        <i className="fas fa-flag me-2"></i>Priority
                      </Form.Label>
                      <Form.Select
                        id="reportPriority"
                        value={formData.reportPriority}
                        onChange={handleChange}
                      >
                        <option value="" disabled>
                          Select Priority of Report
                        </option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="text-secondary mb-1">
                        <i className="fas fa-paperclip me-2"></i>Attachments
                        (optional)
                      </Form.Label>
                      <Form.Control
                        type="file"
                        accept={ACCEPTED_FILE_TYPES}
                        multiple
                        onChange={handleFileChange}
                        disabled={
                          attachments.length >= MAX_ATTACHMENTS || isSubmitting
                        }
                      />
                      <Form.Text className="text-secondary">
                        Up to {MAX_ATTACHMENTS} files; images or PDF. Max{" "}
                        {Math.round(MAX_FILE_BYTES / (1024 * 1024))} MB each
                        (Accepted file types: jpeg, png, webp, pdf).
                      </Form.Text>
                      {attachments.length > 0 && (
                        <ul className="list-unstyled small mt-2 mb-0">
                          {attachments.map((file, index) => (
                            <li
                              key={`${file.name}-${file.size}-${index}`}
                              className="d-flex align-items-center justify-content-between gap-2 py-1 border-bottom"
                            >
                              <span className="text-truncate" title={file.name}>
                                {file.name} ({(file.size / 1024).toFixed(1)} KB)
                              </span>
                              <Button
                                type="button"
                                variant="link"
                                className="text-danger text-decoration-none p-0 flex-shrink-0"
                                onClick={() => removeAttachment(index)}
                                disabled={isSubmitting}
                              >
                                Remove
                              </Button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="text-secondary mb-1">
                        <i className="fas fa-circle-info me-2"></i>Status
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.reportStatus}
                        readOnly
                      ></Form.Control>
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    {formError && (
                      <div className="text-danger mt-3">{formError}</div>
                    )}
                  </Col>

                  <Col md={12}>
                    <Button type="submit" disabled={isSubmitting}>
                      <i className="fas fa-paper-plane me-2"></i>
                      {isSubmitting ? "Submitting" : "Submit"}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default NewReport;
