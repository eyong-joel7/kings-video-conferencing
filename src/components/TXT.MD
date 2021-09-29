// import React, { useState, useEffect } from "react";
// import {
//   Button,
//   TextField,
//   Grid,
//   Typography,
//   Container,
//   Paper,
// } from "@material-ui/core";
// import {
// } from "@material-ui/icons";
// import { makeStyles } from "@material-ui/core/styles";

import { GroupAdd, Videocam } from "@material-ui/icons";

// import NotificationModal from "./Modals";
// import { useHistory } from "react-router-dom";

// // const useStyles = makeStyles((theme) => ({
// //   root: {
// //     display: "flex",
// //     flexDirection: "column",
// //   },
// //   gridContainer: {
// //     width: "100%",
// //     [theme.breakpoints.down("xs")]: {
// //       flexDirection: "column",
// //     },
// //   },
// //   container: {
// //     width: "auto",
// //     margin: "35px 0",
// //     padding: 0,
// //     [theme.breakpoints.down("xs")]: {
// //       width: "80%",
// //     },
// //   },
// //   margin: {
// //     marginTop: 20,
// //   },
// //   padding: {
// //     padding: 10,
// //   },
// //   paper: {
// //     padding: "10px 20px",
// //   },
// // }));

// // const Card = (props) => {
// //   const { children, join, host } = props;
// //   const history = useHistory();
// //   const [show, setShow] = useState(false);
// //   const [idToCall, setIdToCall] = useState("");
 
// //   const [message, setMessage] = useState("");
// //   const [firstName, setFirstName] = useState('');


// //   useEffect(() => {
// //     if(props.redirect) setIdToCall(props.redirect)
// //     const storedName = localStorage.getItem("firstName");
// //     if (storedName) {
// //       setFirstName(storedName);
// //     }

// //   }, [props.redirect]);


// //   const handleClose = () => setShow(false);

// //   const classes = useStyles();



// //   const joinMeeting = (idToCall) => {
// //     if (firstName && idToCall) {
// //       localStorage.setItem("firstName", firstName);
// //       idToCall &&
// //       history.push({
// //         pathfirstName: `/conference-room/${(idToCall).replace(/\s+/g, '')}`,
// //         state: { roomid: (idToCall).replace(/\s+/g, ''), firstName: firstName },
// //       });
// //     } else {
// //       setShow(true);
// //       setMessage(`Please fill in all reqiured fields`);
// //     }
// //   };
// //   const startMeeting = () => {
// //     if (firstName && idToCall) {
// //       localStorage.setItem("firstName", firstName);
// //       idToCall &&
// //       history.push({
// //         pathfirstName: `/conference-room/${(idToCall).replace(/\s+/g, '')}`,
// //         state: { roomid:  (idToCall).replace(/\s+/g, ''), firstName: firstName, host:true},
// //       });
// //     } else {
// //       setShow(true);
// //       setMessage(`Please fill in all required fields`);
// //     }
// //   };

// //   return (
// //     <>
// //       <Container className={classes.container}>
// //         <Paper elevation={10} className={classes.paper}>
// //           <form className={classes.root} noValidate autoComplete="off">
// //             <Grid container className={classes.gridContainer}>
// //               {host && (
// //                 <Grid item className={classes.padding}>
// //                   <Typography gutterBottom variant="h6">
// //                     Meeting Info
// //                   </Typography>
// //                   <TextField
// //                     label="Enter Name"
// //                     value={firstName}
// //                     onChange={(e) => setFirstName(e.target.value)}
// //                     fullWidth
// //                   />
// //                   <TextField
// //                     label="Meeting ID"
// //                     value={idToCall}
// //                     onChange={(e) => {setIdToCall(e.target.value)}}
// //                     fullWidth
// //                   />
// //                     <Button
// //                       className={classes.margin}
// //                       onClick={() => startMeeting()}
// //                       variant="contained"
// //                       color="primary"
// //                       fullWidth
// //                     >
// //                        Start Meeting
// //                     </Button>
// //                 </Grid>
// //               )}

// //               {join && (
// //                 <Grid item xs={12} md={6} className={classes.padding}>
// //                   <Typography gutterBottom variant="h6">
// //                     Join Meeting
// //                   </Typography>
// //                   <TextField
// //                     label="Name"
// //                     value={firstName}
// //                     required
// //                     onChange={(e) => setFirstName(e.target.value)}
// //                     fullWidth
// //                   />
// //                   <TextField
// //                     label="Meeting ID"
// //                     value={idToCall}
// //                     required
// //                     onChange={(e) => setIdToCall(e.target.value)}
// //                     fullWidth
// //                   />
                
// //                     <Button
// //                       onClick={() => joinMeeting(idToCall)}
// //                       className={classes.margin}
// //                       variant="contained"
// //                       color="primary"
// //                       fullWidth
                      
// //                     >
// //                       JOIN
// //                     </Button>
                  
// //                 </Grid>
// //               )}
// //             </Grid>
// //           </form>
// //           {children}
// //         </Paper>
// //       </Container>
// //       {show && (
// //         <NotificationModal
// //           show={show}
// //           handleClose={handleClose}
// //           message={message}
// //         />
// //       )}
// //     </>
// //   );
// // };

// // export default Card;

      <Button
        className={classes.margin}
        style = {{marginLeft: '3px'}}
        onClick={() => pageControl("home")}
        variant="contained"
        color="primary"
        startIcon={<ArrowBackIos fontSize="large" />}
      >
        Back
      </Button>

      <Container>
        <JoinContainer style = {{order: isMobile? '1': '0'}}>
          <ImageContainer isMobile = {isMobile}>
            <Image
              src={`${process.env.PUBLIC_URL}images/videoconference.svg`}
              className="icon"
              alt="join-meeting-icon"
            />
          </ImageContainer>
          <TextWrapper>
            <Text>Please enter your name and the meeting ID</Text>
          </TextWrapper>
       
        </JoinContainer>
        <JoinContainer>
        
        </JoinContainer>
        </Container>
   