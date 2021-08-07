import React, { useState, useContext } from 'react';
import { Button, TextField, Grid, Typography, Container, Paper } from '@material-ui/core';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Assignment, Phone, PhoneDisabled } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import { SocketContext } from '../Context';
import NotificationModal from './Modals';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  gridContainer: {
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  container: {
    width: '600px',
    margin: '35px 0',
    padding: 0,
    [theme.breakpoints.down('xs')]: {
      width: '80%',
    },
  },
  margin: {
    marginTop: 20,
  },
  padding: {
    padding: 20,
  },
  paper: {
    padding: '10px 20px',
    border: '2px solid black',
  },
}));

const Sidebar = ({ children }) => {

  const [show, setShow] = useState(false);
  console.log(`i am in sidebar`);
    const handleClose = () => setShow(false);

  const { me, callAccepted, name, setName, callEnded, leaveCall, callUser } = useContext(SocketContext);
  const [idToCall, setIdToCall] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isJoin, setIsJoin] = useState(false);
  const [message, setMessage] = useState("");

  const classes = useStyles();
 const joinMeeting = (idToCall) =>{
   if(name){
   if(!isJoin && idToCall !==''){
    callUser(idToCall);
    setIsJoin(true);
   }
   else {
     setShow(true);
setMessage('Please insert the Meeting ID you want to join');
    //  <NotificationModal show = {show} handleClose = {handleClose} message = {`Please insert the Meeting ID you want to join`} />
   }
  }
  else{
    setShow(true);
    setMessage(`Name is Required`);
    // <NotificationModal show = {show} handleClose = {handleClose} message = {`Name is Required`}  />
  }
  
 }

 const copyID = ()=>{
   if(name){


   setIsCopied(true);
  }
  else{
    setShow(true);
    setMessage(`Name is Required`);
    // <NotificationModal show = {show} handleClose = {handleClose} message = {`Name is Required`} />
  }
 }
  return (
    <>
  
    <Container className={classes.container}>
      <Paper elevation={10} className={classes.paper}>
        <form className={classes.root} noValidate autoComplete="off">
          <Grid container className={classes.gridContainer}>
            {
              !isJoin && (   <Grid item xs={12} md={6} className={classes.padding}>
                <Typography gutterBottom variant="h6">Meeting Info</Typography>
                <TextField label="Enter Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
                <CopyToClipboard text={me} className={classes.margin}>
                  <Button onClick = {()=> copyID()} variant="contained" color="primary" fullWidth  startIcon={<Assignment fontSize="large" />}>
                   {!isCopied  ? `Copy & Share Your ID` : 'ID Copied'} 
                  </Button>
                </CopyToClipboard>
              </Grid>
          )
            }
         
            {
              !isCopied && (
                <Grid item xs={12} md={6} className={classes.padding}>
                <Typography gutterBottom variant="h6">Join Meeting</Typography>
                <TextField label="Paste Meeting ID" value={idToCall} required onChange={(e) => setIdToCall(e.target.value)} fullWidth />
                {(callAccepted && !callEnded) || isJoin ? (
                  <Button variant="contained" color="secondary" startIcon={<PhoneDisabled fontSize="large" />} fullWidth onClick={leaveCall} className={classes.margin}>
                    Joining...
                  </Button>
                ) : (
                  <Button variant="contained" color="primary" startIcon={<Phone fontSize="large" />} fullWidth onClick={() => joinMeeting(idToCall)} className={classes.margin}>
                   {
                     !isJoin && 'JOIN' 
                   } 
                  </Button>
                )}
              </Grid>
          
              )
            }
          
          </Grid>
        </form>
        {children}
      </Paper>
    </Container>
   {
     show && <NotificationModal show = {show} handleClose = {handleClose} message = {message} />
   } 
    </>
  );
};

export default Sidebar;
