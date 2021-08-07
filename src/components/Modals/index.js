
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'

const  NotificationModal  =  ({action, actionText, rejectText, message, show, handleClose}) => {
    // const [show, setShow] = useState(false);
  
    // const handleClose = () => setShow(false);
    // const handleShow = () => setShow(true);
  console.log(`i am in Notofication Modal`)
    return (
      <>
        {/* <Button variant="primary" onClick={handleShow}>
          Launch static backdrop modal
        </Button> */}

        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          {/* <Modal.Header closeButton>
            <Modal.Title>Modal title</Modal.Title>
          </Modal.Header> */}
          <Modal.Body>{message}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              {rejectText ? rejectText : "Close"}
            </Button>
            {action && (
              <Button variant="primary" onClick={action}>
                {actionText}
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </>
    );
  }
  
export default NotificationModal;