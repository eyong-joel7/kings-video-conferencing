import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import CopyToClipboard from 'react-copy-to-clipboard';
import { useEffect, useState } from "react";
const Cop2CB = ({
  show,
  handleClose,
}) => {

  const [isCopied, setIsCopied] = useState(false);
  const [timer, setTimer] = useState(false);
  useEffect(() => {
    if (timer) {
      const timer1 = setTimeout(() => {
        handleClose();
      }, 1500);
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
        <Modal.Body>
          <h3>Meeting Info</h3>
          <p style = {{color: 'rgb(232,213,213', marginTop: '5px', border: '2px solid #1ed3d3', padding: '10px'}}>{(window.location.href).toLowerCase()}</p>
         </Modal.Body>
          <Modal.Footer>
            <CopyToClipboard text={`${window.location.href}`.toLowerCase()}>
                      <Button
                        onClick={() => {setTimer(true); setIsCopied(true)}}
                        variant="primary"
                      >
                        {isCopied ? 'Copied' : `Copy meeting info`}
                      </Button>
                    </CopyToClipboard>
          </Modal.Footer>
   
      </Modal>
    </>
  );
};

export default Cop2CB;
