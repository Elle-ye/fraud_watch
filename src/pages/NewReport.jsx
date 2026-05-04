import { Card, Button, Form, Row, Col } from "react-bootstrap";
import { supabase } from "../config/supabase";
import { useState } from "react";

/** Supabase Storage bucket for report attachments (create in dashboard + set RLS policies). */
const REPORT_ATTACHMENTS_BUCKET = "report-attachments";

/** Max files per report */
const MAX_ATTACHMENTS = 3;

/**
 * Max size per file (bytes).
 * 5 MB is a good default for photos + PDFs: mobile-friendly, fast uploads,
 * and usually within Storage / API limits. Raise to 10 MB if you expect large scans.
 */
const MAX_FILE_BYTES = 5 * 1024 * 1024;

const ACCEPTED_FILE_TYPES =
  "image/jpeg,image/png,image/webp,application/pdf";

const NewReport = () => {
  //   Error logging
  const [formError, setFormError] = useState(null);

  const [attachments, setAttachments] = useState([]);

  //   Default/initial form data
  const initialFormData = {
    crimeType: "",
    crimeDate: "",
    crimeDescription: "",
    crimeLocation: "",
    reportStatus: "new",
    reportPriority: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  //   Submit Button Click/Disable loading
  const [isSubmitting, setIsSubmitting] = useState(false);

  //   Form fields
  const {
    crimeType,
    crimeDate,
    crimeDescription,
    crimeLocation,
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

    const oversized = picked.find((f) => f.size > MAX_FILE_BYTES);
    if (oversized) {
      setFormError(
        `"${oversized.name}" is too large. Each file must be at most ${Math.round(MAX_FILE_BYTES / (1024 * 1024))} MB.`,
      );
      return;
    }

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

    const merged = [...attachments];
    for (const file of toAdd) {
      const dup = merged.some((f) => f.name === file.name && f.size === file.size);
      if (!dup) merged.push(file);
    }
    setAttachments(merged);
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
    setFormError(null);
  };

//   Form Submission Handler - To Supabase
  const submitReport = async (e) => {
    e.preventDefault();

    if (
      !crimeType ||
      !crimeDate ||
      !crimeDescription ||
      !crimeLocation ||
      !reportStatus ||
      !reportPriority
    ) {
      setFormError("Please fill the form properly");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const { data: newRow, error } = await supabase
        .from("reports")
        .insert([
          {
            crime_type: crimeType,
            crime_date: crimeDate,
            crime_description: crimeDescription,
            crime_location: crimeLocation,
            report_status: reportStatus,
            report_priority: reportPriority,
            // evidence_files: evidenceFiles
          },
        ])
        .select("id")
        .single();

      if (error) {
        console.error(error);
        const detail = [error.message, error.hint, error.details]
          .filter(Boolean)
          .join(" — ");
        setFormError(
          detail ||
            "Could not save the report. Check the browser console and Supabase logs.",
        );
        return;
      }

      const reportId = newRow?.id;

      if (attachments.length > 0 && reportId != null) {
        const publicUrls = [];

        for (const file of attachments) {
          const objectPath = `${reportId}/${crypto.randomUUID()}-${sanitizeFileName(file.name)}`;
          const { error: uploadError } = await supabase.storage
            .from(REPORT_ATTACHMENTS_BUCKET)
            .upload(objectPath, file, {
              cacheControl: "3600",
              upsert: false,
              contentType: file.type || undefined,
            });

          if (uploadError) {
            console.error(uploadError);
            setFormError(
              uploadError.message ||
                "File upload failed. Check that the Storage bucket exists and upload is allowed for your role.",
            );
            return;
          }

          const { data: urlData } = supabase.storage
            .from(REPORT_ATTACHMENTS_BUCKET)
            .getPublicUrl(objectPath);

          if (urlData?.publicUrl) publicUrls.push(urlData.publicUrl);
        }

        if (publicUrls.length > 0) {
          const { error: updateError } = await supabase
            .from("reports")
            .update({ attachment_urls: publicUrls })
            .eq("id", reportId);

          if (updateError) {
            console.error(updateError);
            setFormError(
              [
                "Report was saved but attaching files failed:",
                updateError.message,
                "Add a text[] or jsonb column `attachment_urls` on `reports`, or adjust the update to match your schema.",
              ]
                .filter(Boolean)
                .join(" "),
            );
            return;
          }
        }
      }

      console.log("Submission Successful:", newRow);
      alert("Report Submitted Successfully");
      setFormData(initialFormData);
      setAttachments([]);

    } catch (err) {
      console.error(err);
      setFormError(
        err?.message ??
          "Network or client error. Check the console and that Vite env vars are loaded (restart npm run dev after editing .env).",
      );
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
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Form onSubmit={submitReport}>
            <Row className="g-3">
              
              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    <strong>Crime Type</strong>
                  </Form.Label>
                  <Form.Control
                    as="select"
                    id="crimeType"
                    value={formData.crimeType}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Select Type of Crime
                    </option>
                    <option value="fraud">Fraud</option>
                    <option value="cybercrime">Cybercrime</option>
                    <option value="identitytheft">Identity Theft</option>
                    <option value="other">Other</option>
                  </Form.Control>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    <strong>Crime Date</strong>
                  </Form.Label>
                  <Form.Control
                    type="date"
                    id="crimeDate"
                    value={formData.crimeDate}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    <strong>Crime Location</strong>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    id="crimeLocation"
                    value={formData.crimeLocation}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    <strong>Description</strong>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    id="crimeDescription"
                    value={formData.crimeDescription}
                    rows={3}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    <strong>Priority</strong>
                  </Form.Label>
                  <Form.Control
                    as="select"
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
                  </Form.Control>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    <strong>Attachments (optional)</strong>
                  </Form.Label>
                  <Form.Control
                    type="file"
                    accept={ACCEPTED_FILE_TYPES}
                    multiple
                    onChange={handleFileChange}
                    disabled={attachments.length >= MAX_ATTACHMENTS || isSubmitting}
                  />
                  <Form.Text className="text-secondary">
                    Up to {MAX_ATTACHMENTS} files; images or PDF. Max{" "}
                    {Math.round(MAX_FILE_BYTES / (1024 * 1024))} MB each (Accepted file types: jpeg, png, webp, pdf).
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
                  <Form.Label>
                    <strong>Status</strong>
                  </Form.Label>
                  {/* <Form.Control
                    as="select"
                    id="reportStatus"
                    value={formData.reportStatus}
                    readOnly
                    // onChange={handleChange}
                  >
                    <option value="new">New</option>
                    <option value="pending">Pending</option>
                    <option value="inprogress">In Progress</option>
                    <option value="completed">Completed</option>
                  </Form.Control> */}
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
                  {isSubmitting ? "Submitting" : "Submit"}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default NewReport;
