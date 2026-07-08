import { Badge } from "react-bootstrap";

export const PriorityBadge = ({ priority }) => {
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

export const StatusBadge = ({ status }) => {
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
    <Badge
      bg={variants[value] || "secondary"}
      className="px-3 py-2 text-capitalize"
    >
      {label}
    </Badge>
  );
};
