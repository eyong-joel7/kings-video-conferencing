

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useEffect } from "react";
import {Close } from "@material-ui/icons";

const NotificationModal = ({
  action,
  actionText,
  rejectText,
  message,
  timer,
  show,
  handleClose,
}) => {
  useEffect(() => {
    if (timer) {
      const timer1 = setTimeout(() => {
        handleClose();
      }, 1000);
      return () => clearTimeout(timer1);
    }
  }, [handleClose, timer]);

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body>{message}</Modal.Body>
        {!timer && (
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              {rejectText ? rejectText :<Close/>}
            </Button>
            {action && (
              <Button variant="primary" onClick={action}>
                {actionText}
              </Button>
            )}
          </Modal.Footer>
        )}
      </Modal>
    </>
  );
};

export default NotificationModal;
