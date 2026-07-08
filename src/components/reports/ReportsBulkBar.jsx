import { Button } from "react-bootstrap";

const ReportsBulkBar = ({ selectedCount, onBulkAction, onClearSelection }) => {
  if (selectedCount === 0) return null;

  return (
    <div className="mb-3 p-3 bg-primary bg-opacity-10 rounded border border-primary">
      <div className="d-flex justify-content-between align-items-center">
        <span>
          <i className="fas fa-check-circle me-2 text-primary"></i>
          <strong>{selectedCount}</strong> report(s) selected
        </span>
        <div className="d-flex gap-2">
          <Button
            size="sm"
            variant="success"
            onClick={() => onBulkAction("Resolve")}
          >
            <i className="fas fa-check me-2"></i>Resolve/Assign Selected
          </Button>
          <Button size="sm" variant="secondary" onClick={onClearSelection}>
            <i className="fas fa-times me-2"></i>Clear Selection
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportsBulkBar;
