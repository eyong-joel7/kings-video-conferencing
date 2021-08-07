import React, { useContext, useState } from 'react';
// import { Button } from '@material-ui/core';

import { SocketContext } from '../Context';
import NotificationModal from './Modals';

const Notifications = () => {

  const { answerCall, call, callAccepted } = useContext(SocketContext);
   const [show, setShow] = useState(true);

    const handleClose = () => setShow(false);
  
  return (
    <>
      {call.isReceivingCall && !callAccepted && (
        // <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      
        //   {/* <Button variant="contained" color="primary" onClick={answerCall}>
        //     Accept
        //   </Button> */}
        // </div>
            <NotificationModal show = {show} handleClose = {handleClose} message = {`${call.name} wants to join`} action = {answerCall} actionText = {`Accept`} rejectText = {`Reject`}/>
      )}
    </>
  );
};

export default Notifications;
