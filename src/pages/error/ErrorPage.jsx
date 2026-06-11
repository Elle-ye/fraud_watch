import { Card, Button, Row, Col } from "react-bootstrap";
import "./ErrorPage.css"
import errorImage from "../../assets/images/Error/error-404-concept-landing-page.png"
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-0 err-page">
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="border-0">
            <Card.Body className="d-flex flex-column align-items-center text-center py-4">
              <img
                src={errorImage}
                alt="404 Page"
                className="img-fluid mb-4 err-img"
                // style={{
                //   maxWidth: "100%",
                //   maxHeight: "70vh",
                //   objectFit: "contain",
                // }}
              />
              <Button onClick={()=>{navigate("/dashboard")}}>Go To Dashboard</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ErrorPage;
