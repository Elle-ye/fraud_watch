import { Form, Card, Row, Col, InputGroup, Button, Alert } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase";
import toast from "react-hot-toast";
import "./Login.css";

const Register = () => {

    // Initial States
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

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
    const handleRegister = async (e) => {
        e.preventDefault();

        if (!fullName || !email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const registerPromise = supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                },
            });

            const { error } = await toast.promise(registerPromise, {
                loading: "Creating your account...",
                success: ({ error }) => {
                    if (error) throw error;
                    return "Account created successfully!";
                },
                error: (err) =>
                    err.message || "Registration failed. Please try again.",
            });

            if (error) return;

            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            setError(err.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };



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
                  <InputGroup
                    className={`password-wrapper ${showPassword ? "show-password" : ""}`}
                  >
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <span
                      id="togglePassword"
                      className="eye"
                      onClick={() => setShowPassword(!showPassword)}
                      title={showPassword ? "Hide Password" : "Show Password"}
                      style={{ cursor: "pointer" }}
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill="currentColor"
                            d="m10.12 10.827l4.026 4.027a.5.5 0 0 0 .708-.708l-13-13a.5.5 0 1 0-.708.708l3.23 3.23A6 6 0 0 0 3.2 6.182a6.7 6.7 0 0 0-1.117 1.982c-.021.061-.047.145-.047.145l-.018.062s-.076.497.355.611a.5.5 0 0 0 .611-.355l.001-.003l.008-.025l.035-.109a5.7 5.7 0 0 1 .945-1.674a5 5 0 0 1 1.124-1.014L6.675 7.38a2.5 2.5 0 1 0 3.446 3.446m-.74-.74A1.5 1.5 0 1 1 7.413 8.12zM6.32 4.2l.854.854Q7.564 5 8 5c2.044 0 3.286.912 4.028 1.817a5.7 5.7 0 0 1 .945 1.674q.025.073.035.109l.008.025v.003l.001.001a.5.5 0 0 0 .966-.257v-.003l-.001-.004l-.004-.013a2 2 0 0 0-.06-.187a6.7 6.7 0 0 0-1.117-1.982C11.905 5.089 10.396 4 8.002 4c-.618 0-1.177.072-1.681.199"
                          />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="currentColor" d="M2.984 8.625v.003a.5.5 0 0 1-.612.355c-.431-.114-.355-.611-.355-.611l.018-.062s.026-.084.047-.145a6.7 6.7 0 0 1 1.117-1.982C4.096 5.089 5.605 4 8 4s3.904 1.089 4.802 2.183a6.7 6.7 0 0 1 1.117 1.982a4 4 0 0 1 .06.187l.003.013v.004l.001.002a.5.5 0 0 1-.966.258l-.001-.004l-.008-.025l-.035-.109a5.7 5.7 0 0 0-.945-1.674C11.286 5.912 10.045 5 8 5s-3.285.912-4.028 1.817a5.7 5.7 0 0 0-.945 1.674l-.035.109zM8 7a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5M6.5 9.5a1.5 1.5 0 1 1 3 0a1.5 1.5 0 0 1-3 0"/></svg>
                      )}
                    </span>
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
