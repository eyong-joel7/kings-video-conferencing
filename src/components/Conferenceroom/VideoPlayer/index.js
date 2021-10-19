import { useEffect, useRef } from "react";
import MicOffIcon from "@mui/icons-material/MicOff";
import MicIcon from "@mui/icons-material/Mic";

import { makeStyles } from "@material-ui/styles";
import helper from "../../../utils/helper";
import {
  FooterContainer,
  UserNameText,
  VideoCard,
  VideoStream,
} from "../conferenceRoomElements";
import BackgroundLetterAvatars from "../../StringAvatar";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";

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
  expand: {
    color: '#6dbe6d',
    cursor: 'pointer',
   
  }
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
    // className = 'remote-video-card'
    <VideoCard >
      <VideoStream
        id={props.id}
        style={{ display: props.videoFlagTemp ? "block" : "none" }}
        playsInline
        autoPlay
        ref={ref}
      />
      {!props.videoFlagTemp && (
        <BackgroundLetterAvatars name={props.peer.peerUsername} />
      )}
      <FooterContainer>
        <UserNameText>{props.peer.peerUsername.toLowerCase()}</UserNameText>
        <div className={classes.controls}>
          <div
            className={
              props.videoFlagTemp && classes.iconsEnabled 
            }
          >
            {props.videoFlagTemp && <AspectRatioIcon className = {classes.expand} onClick = {() => helper.maximiseStream(props.id) } />}{" "}
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
