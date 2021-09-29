import React, { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';


import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import { ChevronLeft, GroupAdd,Videocam } from '@material-ui/icons';
import { useHistory } from "react-router-dom";
import NotificationModal from './Modals';


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(6),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
    width: 100,
    height: 100,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  svg: {
    fontSize: '2.5rem'
  }
}));

export default function ProfileScreen(props) {
  const {host, pageControl} = props;
  const classes = useStyles();
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const history = useHistory();

  useEffect(()=> {
    if(props.redirect) setIdToCall(props.redirect);
    const storedName = localStorage.getItem("firstName");
    if (storedName) {
      setFirstName(storedName)
    }
   
      if(localStorage.getItem('email')!==''){
          setEmail(localStorage.getItem('email'))
      }
  },[props.redirect]);


  const startMeeting = () => {

   firstName && localStorage.setItem('firstName',firstName);
   email && localStorage.setItem('email', email);
    if (firstName && idToCall) {
      history.push({
        pathname: `/conference-room/${(idToCall).replace(/\s+/g, '')}`,
        state: { roomid:  (idToCall).replace(/\s+/g, ''), firstName: firstName, host},
      });
    } else {
      setShow(true);
      setMessage(`Meeting ID or Username is missing`);
    }
  };
 


const handleClose = () => {setShow(false); pageControl('home')}

  return (
    <div style ={{width: '100%', padding:'20px'}}>
       <div onClick = {()=> handleClose()} style = {{display: 'flex', alignItems:'center', cursor:'pointer'}}> <ChevronLeft/><span>Back</span></div>
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
        {host? <Videocam className = {classes.svg}/> : <GroupAdd className = {classes.svg}/>} 
        </Avatar>
        <Typography component="h1" variant="h5">
         {host? 'Start a Meeting' : 'Join a Meeting'}
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="firstName"
               value={firstName}
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                onChange = {(e) => setFirstName(e.target.value)}
              />
            </Grid>
           
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                fullWidth
                id="email"
                label="Email Address"
                value={email}
                autoComplete="email"
                onChange = {(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Meeting ID"
                value={idToCall}
                autoComplete="idToCall"
                onChange = {(e) => setIdToCall(e.target.value)}
              />
            </Grid>
           
          </Grid>
          {
            host? (
              <Button
    
                fullWidth
                variant="contained"
                color="primary"
                disabled = {firstName ==='' || idToCall === ''}
                className={classes.submit}
                onClick  = {startMeeting}
              >
               Start Meeting
              </Button>
            ) :(
              <Button
              onClick  = {startMeeting}
                fullWidth
                variant="contained"
                color="primary"
                disabled = {firstName ==='' || idToCall === ''}
                className={classes.submit}
              >
                Join Meeting
              </Button>
          
            )
          }
        
      </form>
      </div>
   
      <NotificationModal message = {message}  show  = {show} handleClose = {() => setShow(false)}/>
    </Container>
    </div>
  );
}