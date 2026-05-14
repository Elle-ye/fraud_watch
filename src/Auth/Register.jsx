import { Form, Card, Row, Col, InputGroup, Button, Alert } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase";

const Register = () => {

    // Initial States
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Navigation
    const navigate = useNavigate();

    // Window resize handler
    useEffect(()=>{
        const handleResize = ()=>{
            setIsMobile(window.innerWidth < 768);
        }
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    },[]);

    // Registration Handler
    const handleRegister = async(e) => {
        e.preventDefault();
        setIsLoading(true);

        setError(null);

        try{
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options :{
                    data:{
                        full_name: fullName
                    }
                }
            })
    
            if (error) {
                throw error
            } 

            navigate("/dashboard")
        } catch(err){
            console.log("err")

            setError(
                err.message || "Registration Failed"
            )
        } finally {
            setIsLoading(false)
        }
    }



  return (
    <Card className="d-flex justify-content-center align-items-center w-100 h-100  border-0 shadow-none">
      <Card.Body
        className={`p-3 ${isMobile ? "w-100" : "w-50"} mx-auto border border shadow rounded-3`}
      >
        <div className="mb-4 text-center">
          <h1 className="h2 mb-2 reports-page-title">
            <i className="fas fa-user-shield me-3"></i>
            Staff Register
          </h1>
          <p className="text-secondary">
            Register to access dashboards and report management tools.
          </p>
        </div>

        <div className="mb-4">
          <div className="p-4">
            <Form onSubmit={handleRegister}>
              <Row className="g-3">
              <Col md={12}>
                  <Form.Label className="text-secondary mb-1">
                    <i className="fas fa-envelope me-2"></i>Full Name
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </InputGroup>
                </Col>
                <Col md={12}>
                  <Form.Label className="text-secondary mb-1">
                    <i className="fas fa-envelope me-2"></i>Email
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="email"
                      placeholder="you@organization.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </InputGroup>
                </Col>

                <Col md={12}>
                  <Form.Label className="text-secondary mb-1">
                    <i className="fas fa-lock me-2"></i>Password
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </InputGroup>
                </Col>

                {error && (
                  <Col md={12}>
                    <Alert variant="danger" className="mb-0">
                      <i className="fas fa-triangle-exclamation me-2"></i>
                      {error}
                    </Alert>
                  </Col>
                )}

                <Col md={12}>
                  <Button type="submit" disabled={loading} className="w-100">
                    <i className="fas fa-right-to-bracket me-2"></i>
                    {loading ? "Registering User..." : "Register"}
                  </Button>
                </Col>
                <Col md={12} className="text-center"><Link to={"/login"}>Login</Link></Col>
              </Row>
            </Form>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Register;
