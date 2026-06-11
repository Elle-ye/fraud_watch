import { useState, useEffect } from "react";
import { supabase } from "../config/supabase";
import { Link, useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import toast from "react-hot-toast";

const Login = () => {
  // Navigation
  const navigate = useNavigate();

  // Mobile detection
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Error state
  const [error, setError] = useState(null);

  // Loading state
  const [loading, setLoading] = useState(false);

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      const loginPromise = supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      const { error } = await toast.promise(
        loginPromise,
        {
          loading: "Logging in...",
          success: ({ error }) => {
            if (error) throw error;
            return "Welcome back!";
          },
          error: (err) => {
            return err.message === "Invalid login credentials"
              ? "Invalid email or password"
              : err.message;
          },
        }
      );
  
      if (error) return;
  
      navigate("/dashboard");
  
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // lOGIN VIEW
  return (
    <Card className="d-flex justify-content-center align-items-center w-100 h-100  border-0 shadow-none">
      <Card.Body
        className={`p-3 ${isMobile ? "w-100" : "w-50"} mx-auto border border shadow rounded-3`}
      >
        <div className="mb-4 text-center">
          <h1 className="h2 mb-2 reports-page-title">
            <i className="fas fa-user-shield me-3"></i>
            Staff Login
          </h1>
          <p className="text-secondary">
            Sign in to access dashboards and report management tools.
          </p>
        </div>

        <div className="mb-4">
          <div className="p-4">
            <Form onSubmit={handleLogin}>
              <Row className="g-3">
                <Col md={12}>
                  <Form.Label className="text-secondary mb-1">
                    <i className="fas fa-envelope me-2"></i>Email
                  </Form.Label>
                  <InputGroup>
                    {/* <InputGroup.Text>
                      <i className="fas fa-at"></i>
                    </InputGroup.Text> */}
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
                    {/* <InputGroup.Text>
                      <i className="fas fa-key"></i>
                    </InputGroup.Text> */}
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
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </Col>
                <Col md={12} className="text-center">
                  <Link to={"/register"}>Register</Link>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Login;
