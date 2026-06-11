import { Modal, Button } from "react-bootstrap";
import { supabase } from "../config/supabase";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./LogoutModal.css";

const LogoutModal = ({ isMobile, onClose, show, onHide }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/login");

    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      className="logout-modal"
      contentClassName="logout-modal__content border-0"
      aria-labelledby="logout-modal-title"
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton className="logout-modal__header">
        <Modal.Title id="logout-modal-title" className="logout-modal__title">
          <span className="logout-modal__icon" aria-hidden="true">
            <i className="fas fa-sign-out-alt" />
          </span>
          Sign out
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="logout-modal__body">
        <p className="logout-modal__message mb-0">
          You&apos;ll need to sign in again to access dashboards and reports.
        </p>
      </Modal.Body>
      <Modal.Footer className="logout-modal__footer">
        <Button
          type="button"
          variant="outline-secondary"
          className="logout-modal__btn-cancel"
          onClick={onHide}
        >
          Stay signed in
        </Button>
        <Button
          type="button"
          variant="danger"
          className="logout-modal__btn-confirm"
          onClick={handleLogout}
        >
          <i className="fas fa-sign-out-alt me-2" aria-hidden="true" />
          Sign out
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LogoutModal;
