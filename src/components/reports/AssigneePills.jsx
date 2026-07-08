import "./AssigneePills.css";

const getAssigneeName = (entry) => {
  if (!entry) return null;
  if (typeof entry === "string") return entry;
  return entry.assigned_to?.full_name ?? entry.full_name ?? null;
};

const AssigneePills = ({
  assignments,
  emptyLabel = "Unassigned",
  className = "",
}) => {
  const names = (assignments ?? [])
    .map(getAssigneeName)
    .filter(Boolean);

  if (names.length === 0) {
    return <span className="text-secondary">{emptyLabel}</span>;
  }

  return (
    <div className={`assign-pills ${className}`.trim()}>
      {names.map((name, idx) => (
        <span key={`${name}-${idx}`} className="assign-pill">
          {name}
        </span>
      ))}
    </div>
  );
};

export default AssigneePills;
