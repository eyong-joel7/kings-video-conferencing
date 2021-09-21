import { useEffect, useRef } from "react";
import MicOffIcon from "@mui/icons-material/MicOff";
import MicIcon from "@mui/icons-material/Mic";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import { makeStyles } from "@material-ui/styles";
import { FooterContainer, UserNameText, VideoCard, VideoStream } from "../roomElements";


const useStyles = makeStyles((theme) => ({
    color: {
      color: "#fff",
      fontSize: "1rem",
    },
  
    iconsEnabled: {
      backgroundColor: "#1a3050",
      borderRadius: "50%",
      padding: "5px",
      margin: "0 2px",
    },
    iconsDisabled: {
      backgroundColor: "red",
      borderRadius: "50%",
      padding: "5px",
      margin: "0 2px",
    },
    controls: {
      display: "flex",
      justifyContent: "space-between",
    },
  }));

const Video = (props) => {
    const ref = useRef();
    const socketRef = props.socketRef;
    const user = props.user;
    useEffect(() => {
      props.peer.peer.on("stream", (stream) => {
        ref.current.srcObject = stream;
      });
    }, [props.peer.peer]);
    const classes = useStyles();
    function capitalize(s) {
      return s && s[0].toUpperCase() + s.slice(1);
    }
    const togglePeerMedia = (command, peerID, userUpdate) => {
      if (command && peerID) {
        socketRef.current.emit("admin playstop muteunmute", {
          peerID,
          command,
          userUpdate,
        });
      }
    };
    return (
      <VideoCard>
        <VideoStream playsInline autoPlay ref={ref} />
        <FooterContainer>
          <UserNameText>{capitalize(props.peer.peerUsername)}</UserNameText>
          <div className={classes.controls}>
            <div
              onClick={() =>
                user?.isAdmin &&
                togglePeerMedia("video", props.peer.peerID, props.userUpdate)
              }
              className={
                props.videoFlagTemp ? classes.iconsEnabled : classes.iconsDisabled
              }
            >
              {props.videoFlagTemp ? (
                <VideocamIcon className={classes.color} />
              ) : (
                <VideocamOffIcon className={classes.color} />
              )}{" "}
            </div>
            <div
              onClick={() =>
                user?.isAdmin &&
                togglePeerMedia("audio", props.peer.peerID, props.userUpdate)
              }
              className={
                props.audioFlagTemp ? classes.iconsEnabled : classes.iconsDisabled
              }
            >
              {" "}
              {props.audioFlagTemp ? (
                <MicIcon className={classes.color} />
              ) : (
                <MicOffIcon className={classes.color} />
              )}
            </div>
          </div>
        </FooterContainer>
      </VideoCard>
    );
  };
  
  export default Video;