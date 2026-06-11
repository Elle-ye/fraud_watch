const ReportsPageHeader = ({ title, icon, subtitle }) => (
  <div className="mb-4">
    <h1 className="h2 mb-2 reports-page-title">
      <i className={`${icon} me-3`}></i>
      {title}
    </h1>
    {subtitle && <p className="text-secondary">{subtitle}</p>}
  </div>
);

export default ReportsPageHeader;
