// src/pages/AllReports.jsx - With search, filter, and select functionality
import { useState } from 'react';
import { Card, Button, InputGroup, Form, Badge, Row, Col } from 'react-bootstrap';
import './ReportsTable.css';

const AllReports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedRows, setSelectedRows] = useState([]);

  // Just 2 dummy data rows with more fields
  const data = [
    { 
      id: 'FR-2024-001', 
      date: '2024-01-15', 
      time: '09:23 AM', 
      type: 'Financial Fraud', 
      location: 'New York, NY', 
      status: 'Under Review', 
      priority: 'High',
      assignedTo: 'Detective Smith',
      victim: 'John Doe',
      amount: '$50,000'
    },
    { 
      id: 'FR-2024-002', 
      date: '2024-01-15', 
      time: '11:45 AM', 
      type: 'Identity Theft', 
      location: 'Los Angeles, CA', 
      status: 'Investigation', 
      priority: 'Critical',
      assignedTo: 'Agent Johnson',
      victim: 'Jane Smith',
      amount: '$25,000'
    },
  ];

  // Filter logic
  const filteredData = data.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || item.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Handle row selection
  const handleSelectAll = () => {
    if (selectedRows.length === filteredData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredData.map(item => item.id));
    }
  };

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // Handle bulk actions
  const handleBulkAction = (action) => {
    if (selectedRows.length === 0) {
      alert('Please select at least one report');
      return;
    }
    alert(`${action} ${selectedRows.length} report(s): ${selectedRows.join(', ')}`);
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      Critical: 'danger',
      High: 'warning',
      Medium: 'info',
      Low: 'success'
    };
    return <Badge bg={variants[priority]} className="px-3 py-2">{priority}</Badge>;
  };

  const getStatusBadge = (status) => {
    const variants = {
      'Under Review': 'info',
      'Investigation': 'warning',
      'Resolved': 'success',
      'Pending': 'secondary'
    };
    return <Badge bg={variants[status]} className="px-3 py-2">{status}</Badge>;
  };

  return (
    <div className="p-0 reports-page">
      <div className="mb-4">
        <h1 className="h2 mb-2 reports-page-title">
          <i className="fas fa-database me-3"></i>
          All Reports
        </h1>
        <p className="text-secondary">Complete history of all fraud and crime reports</p>
      </div>

      {/* Filters Section */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={5}>
              <Form.Label className="text-secondary mb-1">
                <i className="fas fa-search me-2"></i>Search
              </Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <i className="fas fa-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by ID, type, location, or assigned to..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => setSearchTerm('')}
                  >
                    <i className="fas fa-times"></i>
                  </Button>
                )}
              </InputGroup>
            </Col>
            
            <Col md={3}>
              <Form.Label className="text-secondary mb-1">
                <i className="fas fa-filter me-2"></i>Status
              </Form.Label>
              <Form.Select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Under Review">Under Review</option>
                <option value="Investigation">Investigation</option>
                <option value="Resolved">Resolved</option>
                <option value="Pending">Pending</option>
              </Form.Select>
            </Col>
            
            <Col md={2}>
              <Form.Label className="text-secondary mb-1">
                <i className="fas fa-flag me-2"></i>Priority
              </Form.Label>
              <Form.Select 
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </Form.Select>
            </Col>
            
            <Col md={2}>
              <Form.Label className="mb-1">&nbsp;</Form.Label>
              <Button 
                className="w-100 reports-reset-btn"
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                  setFilterPriority('all');
                }}
              >
                <i className="fas fa-undo-alt me-2"></i>Reset
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Bulk Actions Bar */}
      {selectedRows.length > 0 && (
        <div className="mb-3 p-3 bg-primary bg-opacity-10 rounded border border-primary">
          <div className="d-flex justify-content-between align-items-center">
            <span>
              <i className="fas fa-check-circle me-2 text-primary"></i>
              <strong>{selectedRows.length}</strong> report(s) selected
            </span>
            <div className="d-flex gap-2">
              <Button 
                size="sm" 
                variant="success" 
                onClick={() => handleBulkAction('Resolve')}
              >
                <i className="fas fa-check me-2"></i>Resolve Selected
              </Button>
              <Button 
                size="sm" 
                variant="danger" 
                onClick={() => handleBulkAction('Delete')}
              >
                <i className="fas fa-trash me-2"></i>Delete Selected
              </Button>
              <Button 
                size="sm" 
                variant="secondary" 
                onClick={() => setSelectedRows([])}
              >
                <i className="fas fa-times me-2"></i>Clear Selection
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Data Table */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="reports-table-head">
                <tr>
                  <th className="reports-checkbox-col">
                    <Form.Check 
                      type="checkbox"
                      checked={selectedRows.length === filteredData.length && filteredData.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="reports-table-header">Report ID</th>
                  <th className="reports-table-header">Date & Time</th>
                  <th className="reports-table-header">Crime Type</th>
                  <th className="reports-table-header">Location</th>
                  <th className="reports-table-header">Victim</th>
                  <th className="reports-table-header">Amount</th>
                  <th className="reports-table-header">Status</th>
                  <th className="reports-table-header">Priority</th>
                  <th className="reports-table-header">Assigned To</th>
                  <th className="reports-table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((report) => (
                  <tr key={report.id} className={selectedRows.includes(report.id) ? 'reports-row-selected' : ''}>
                    <td>
                      <Form.Check 
                        type="checkbox"
                        checked={selectedRows.includes(report.id)}
                        onChange={() => handleSelectRow(report.id)}
                      />
                    </td>
                    <td className="fw-bold text-primary">{report.id}</td>
                    <td>{report.date} {report.time}</td>
                    <td>{report.type}</td>
                    <td>{report.location}</td>
                    <td>{report.victim}</td>
                    <td className="text-danger fw-bold">{report.amount}</td>
                    <td>{getStatusBadge(report.status)}</td>
                    <td>{getPriorityBadge(report.priority)}</td>
                    <td>{report.assignedTo}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => alert(`Viewing ${report.id}`)}
                          title="View Details"
                        >
                          <i className="fas fa-eye"></i>
                        </Button>
                        <Button 
                          variant="outline-info" 
                          size="sm"
                          onClick={() => alert(`Editing ${report.id}`)}
                          title="Edit Report"
                        >
                          <i className="fas fa-edit"></i>
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => alert(`Delete ${report.id}?`)}
                          title="Delete Report"
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredData.length === 0 && (
              <div className="text-center py-5">
                <i className="fas fa-inbox fa-3x text-secondary mb-3"></i>
                <p className="text-secondary">No reports found matching your criteria</p>
              </div>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Summary Stats */}
      <div className="mt-3 d-flex justify-content-between align-items-center">
        <div className="text-secondary">
          <i className="fas fa-chart-bar me-2"></i>
          Showing {filteredData.length} of {data.length} reports
        </div>
        <div className="d-flex gap-3">
          <Button 
            variant="link" 
            className="text-decoration-none"
            onClick={() => alert('Exporting to CSV...')}
          >
            <i className="fas fa-download me-1"></i> Export
          </Button>
          <Button 
            variant="link" 
            className="text-decoration-none"
            onClick={() => alert('Printing...')}
          >
            <i className="fas fa-print me-1"></i> Print
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AllReports;