import { Card, Button, InputGroup, Form, Row, Col } from "react-bootstrap";

const ReportsFilters = ({
  searchTerm,
  filterStatus,
  filterPriority,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onReset,
}) => (
  <Card className="border-0 shadow-sm mb-4">
    <Card.Body>
      <Row className="g-3">
        
        {/* Search */}
        <Col md={4}>
          <Form.Label className="text-secondary mb-1">
            <i className="fas fa-search me-2"></i>Search
          </Form.Label>
          <InputGroup>
            <InputGroup.Text>
              <i className="fas fa-search"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by ID, type, or location..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchTerm && (
              <Button
                variant="outline-secondary"
                onClick={() => onSearchChange("")}
              >
                <i className="fas fa-times"></i>
              </Button>
            )}
          </InputGroup>
        </Col>

        {/* Status Filter */}
        <Col md={3}>
          <Form.Label className="text-secondary mb-1">
            <i className="fas fa-filter me-2"></i>Status
          </Form.Label>
          <Form.Select
            value={filterStatus}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="investigation">Investigation</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </Form.Select>
        </Col>

        {/* Priority Filter */}
        <Col md={3}>
          <Form.Label className="text-secondary mb-1">
            <i className="fas fa-flag me-2"></i>Priority
          </Form.Label>
          <Form.Select
            value={filterPriority}
            onChange={(e) => onPriorityChange(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </Form.Select>
        </Col>

        {/* Reset Button */}
        <Col md={2}>
          <Form.Label className="mb-1">&nbsp;</Form.Label>
          <Button className="w-100 reports-reset-btn" onClick={onReset}>
            <i className="fas fa-undo-alt me-2"></i>Reset
          </Button>
        </Col>
      </Row>
    </Card.Body>
  </Card>
);

export default ReportsFilters;
