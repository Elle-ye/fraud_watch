export const normalize = (value) => String(value ?? "").toLowerCase();

// Short ID formatter
export const formatShortReportId = (id) => {
  if (!id) return "N/A";
  const short = String(id).split("-")[0]?.toUpperCase()?.slice(0, 6);
  return `FR-${short}`;
};

export const filterReports = (data, { searchTerm, filterStatus, filterPriority }) => {
  const searchText = searchTerm.toLowerCase();

  return data.filter((item) => {
    const formattedId = formatShortReportId(item.id);
    const idText = normalize(formattedId);
    const typeText = normalize(item.incident_type);
    const locationText = normalize(item.incident_location);
    const statusText = normalize(item.report_status);
    const priorityText = normalize(item.report_priority);

    const matchesSearch =
      searchTerm === "" ||
      idText.includes(searchText) ||
      typeText.includes(searchText) ||
      locationText.includes(searchText);

    const matchesStatus =
      filterStatus === "all" || statusText === filterStatus.toLowerCase();

    const matchesPriority =
      filterPriority === "all" ||
      priorityText === filterPriority.toLowerCase();

    return matchesSearch && matchesStatus && matchesPriority;
  });
};
