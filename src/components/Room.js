/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";

import { useHistory, useLocation } from "react-router";
import { useMediaQuery } from "react-responsive";
import MainControls from "./MainControls";
import Participants from "./Participants";
import Chat from "./ChatComponents/Chat/Chat";
import NotificationModal from "./Modals";
import "../components/Conferenceroom/conferenceElements.css";
import Cop2CB from "./Modals/Copy2C";
import { RECENT_ACTIVITIES } from "../CONSTANTS";

import MicOffIcon from "@mui/icons-material/MicOff";
import MicIcon from "@mui/icons-material/Mic";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import { makeStyles } from "@material-ui/styles";
import {
  SELECTED_CAMERA_DEVICE_ID,
  SELECTED_MIC_DEVICE_ID,
} from "../CONSTANTS";
import {
  FooterContainer,
  UserNameText,
  VideoCard,
  VideoContainer,
  VideoStream,
  VideoWrapper,
} from "./roomElements";
import LoadingBackdrop from "./LoadingBackdrop";
import { AudioPlayer } from "./AudioPlayer";
import Video from "./VideoPlayer";

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


const Room = (props) => {
  const cameraID = localStorage.getItem(SELECTED_CAMERA_DEVICE_ID);
  const audioID = localStorage.getItem(SELECTED_MIC_DEVICE_ID);
  const constraints = {
    audio: { echoCancellation: true },
    video: {
      width: { min: 640 },
      height: { min: 480 },
    },
  };

  const [peers, setPeers] = useState([]);
  const [users, setUsers] = useState([]);
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const main__mute_button = useRef();
  const main__video_button = useRef();
  const [stream, setStream] = useState();
  const [isToggled, setIsToggled] = useState(false);
  const [selected, setSelected] = useState("");

  const [audioFlag, setAudioFlag] = useState(true);
  const [videoFlag, setVideoFlag] = useState(true);
  const [userUpdate, setUserUpdate] = useState([]);

  const [show, setShow] = useState(false);
  const [copyInfo, setCopyInfo] = useState(false);
  const [timer, setTimer] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [playMusic, setPlayMusic] = useState(false);

  const music = document.getElementById("music");

  const location = useLocation();
  const hiddenClass = useMediaQuery({
    query: "(min-device-width: 1200px)",
  });
  const toggleHamburger = () => {
    setIsToggled(!isToggled);
  };

  function capitalize(s) {
    return s && s[0].toUpperCase() + s.slice(1);
  }

  const closeNav = () => {
    if (!hiddenClass && isToggled) {
      toggleHamburger();
    }
  };
  const history = useHistory();
  const getUrl = window.location.href && window.location.href.split("/")[4];
  const userName = location.state?.name || localStorage.getItem("firstName");
  const room = location.state?.roomid || getUrl;
  const roomID = room?.trim().toLowerCase();

  const storedActivityList = JSON.parse(
    localStorage.getItem(RECENT_ACTIVITIES)
  );
  const activity =
    storedActivityList &&
    storedActivityList.find((activity) => activity.meetingID === roomID);

  const host = location.state?.host || activity?.host;

  const URL = "https://kings-video-conferencing.herokuapp.com/";
  // "/http://localhost:5000"
  useEffect(() => {
    setOpen(true);
    if (!roomID || !userName) {
      // Need to inform the user of this before executing redirect
      history.push("/");
    }
    if (cameraID) constraints.video["deviceId"] = cameraID;
    if (audioID) constraints.audio["deviceId"] = audioID;

    socketRef.current = io.connect(URL);
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        setOpen(false);
        userVideo.current.srcObject = stream;
        setStream(stream);

        !host &&
          socketRef.current.emit("join room", { roomID, userName }, (error) => {
            if (error) {
              setShow(true);
              setErrorMessage(error);
            }
          });
        host &&
          socketRef.current.emit(
            "start a meeting",
            { roomID, userName },
            (error) => {
              if (error) {
                setShow(true);
                setErrorMessage(error);
              }
            }
          );

        socketRef.current.on("all users", (users) => {
          const peers = [];
          users.forEach((user) => {
            const peer = createPeer(user.id, socketRef.current.id, stream);
            peersRef.current.push({
              peerID: user.id,
              peer,
              peerUsername: user.userName,
            });
            peers.push({
              peerID: user.id,
              peer,
              peerUsername: user.userName,
            });
          });
          setPeers(peers);
        });

        socketRef.current.on("user joined", (payload) => {
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peerID: payload.callerID,
            peer,
            peerUsername: payload.userName,
          });

          const peerObj = {
            peer,
            peerID: payload.callerID,
            peerUsername: payload.userName,
          };
          setPeers((users) => [...users, peerObj]);
        });

        socketRef.current.on("receiving returned signal", (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          if (item) item.peer.signal(payload.signal);
        });
        socketRef.current.on("user left", (id) => {
          const peerObj = peersRef.current.find((p) => p.peerID === id);
          if (peerObj) {
            peerObj.peer.destroy();
            const peers = peersRef.current.filter((p) => p.peerID !== id);
            peersRef.current = peers;
            setPeers(peers);
          }
        });
        socketRef.current.on("message", (message) => {
          setMessages((messages) => [...messages, message]);
          const user = message.user.trim().toLowerCase();
          if (user === "admin") {
            setErrorMessage(message.text);
            setTimer(true);
            setShow(true);
          }
        });

        socketRef.current.on("roomData", ({ users }) => {
          setUsers(users);
        });

        socketRef.current.on("change", (payload) => {
          setUserUpdate(payload);
        });

        socketRef.current.on("admin playstop muteunmute", (payload) => {
          if (payload.peerID === socketRef.current.id) {
            payload.userUpdate && setUserUpdate([...payload.userUpdate]);
            if (payload.command === "audio") {
              console.log("audio clicked");
              muteUnmute();
            }
            if (payload.command === "video") {
              playStop();
            }
          }
        });

        if (hiddenClass) {
          setIsToggled(true);
          setSelected("chat");
        }
      })
      .catch(function (error) {
        setShow(true);
        setOpen(false);
        if (error.name === "ConstraintNotSatisfiedError") {
          setErrorMessage("The resolution is not supported by your device.");
        } else if (error.name === "PermissionDeniedError") {
          setErrorMessage(
            "Permissions have not been granted to use your camera and " +
              "microphone, you need to allow the page access to your devices"
          );
        } else
          setErrorMessage(
            "getUserMedia error: " + error.name + `error: ${error}`
          );
      });

    return () => {
      stream?.getTracks() &&
        stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    };
  }, []);

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
      });
    });

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  const sendMessage = (event, recipient) => {
    event.preventDefault();
    if (message) {
      const user = users.find(
        (user) =>
          user.name.trim().toLowerCase() === userName.trim().toLowerCase()
      );
      socketRef.current.emit(
        "sendMessage",
        { message, userID: user?.id, recipient },
        () => setMessage("")
      );
    }
  };

  const goBack = () => {
    socketRef.current?.destroy();
    window.location.replace("/");
  };

  const leaveCall = () => {
    let newList = [];
    const storedActivityList = JSON.parse(
      localStorage.getItem(RECENT_ACTIVITIES)
    );
    const today = new Date();
    const date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    const time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date + " " + time;
    const newActivity = {
      meetingID: roomID,
      dateTime: dateTime,
      host: host,
    };
    if (storedActivityList) {
      const currentMeetingDetails = storedActivityList.find(
        (activity) => activity.meetingID === roomID
      );
      if (currentMeetingDetails) {
        newList = storedActivityList.map((listItem) =>
          listItem.meetingID !== roomID
            ? listItem
            : Object.assign({}, listItem, { dateTime: dateTime })
        );
        localStorage.setItem(RECENT_ACTIVITIES, JSON.stringify(newList));
      } else {
        localStorage.setItem(
          RECENT_ACTIVITIES,
          JSON.stringify([...storedActivityList, newActivity])
        );
      }
    } else {
      localStorage.setItem(RECENT_ACTIVITIES, JSON.stringify([newActivity]));
    }
    socketRef.current?.destroy();
    window.location.replace("/");
  };

  const muteUnmute = () => {
    if (userVideo.current.srcObject) {
      const updateExist = userUpdate.find(
        (obj) => obj.id === socketRef.current.id
      );
      userVideo.current.srcObject.getTracks().forEach(function (track) {
        if (track.kind === "audio") {
          if (track.enabled) {
            if (updateExist) {
              const userUpdateTemp = userUpdate.map((updateObj) =>
                updateObj.id !== socketRef.current.id
                  ? updateObj
                  : Object.assign({}, updateObj, { audioFlag: false })
              );
              socketRef.current.emit("change", userUpdateTemp);
            } else {
              socketRef.current.emit("change", [
                ...userUpdate,
                {
                  id: socketRef.current.id,
                  videoFlag,
                  audioFlag: false,
                },
              ]);
            }
            track.enabled = false;
            setAudioFlag(false);
            setUnmuteButton();
          } else {
            if (updateExist) {
              const userUpdateTemp = userUpdate.map((updateObj) =>
                updateObj.id !== socketRef.current.id
                  ? updateObj
                  : Object.assign({}, updateObj, { audioFlag: true })
              );
              socketRef.current.emit("change", userUpdateTemp);
            } else {
              socketRef.current.emit("change", [
                ...userUpdate,
                {
                  id: socketRef.current.id,
                  videoFlag,
                  audioFlag: true,
                },
              ]);
            }
            track.enabled = true;
            setAudioFlag(true);
            setMuteButton();
          }
        }
      });
    }
  };

  const playStop = () => {
    if (userVideo.current.srcObject) {
      const updateExist = userUpdate.find(
        (obj) => obj.id === socketRef.current.id
      );
      userVideo.current.srcObject.getTracks().forEach(function (track) {
        if (track.kind === "video") {
          if (track.enabled) {
            if (updateExist) {
              const userUpdateTemp = userUpdate.map((updateObj) =>
                updateObj.id !== socketRef.current.id
                  ? updateObj
                  : Object.assign({}, updateObj, { videoFlag: false })
              );
              socketRef.current.emit("change", userUpdateTemp);
            } else {
              socketRef.current.emit("change", [
                ...userUpdate,
                {
                  id: socketRef.current.id,
                  videoFlag: false,
                  audioFlag,
                },
              ]);
            }
            track.enabled = false;
            setVideoFlag(false);
            setPlayVideo();
          } else {
            if (updateExist) {
              const userUpdateTemp = userUpdate.map((updateObj) =>
                updateObj.id !== socketRef.current.id
                  ? updateObj
                  : Object.assign({}, updateObj, { videoFlag: true })
              );
              socketRef.current.emit("change", userUpdateTemp);
            } else {
              socketRef.current.emit("change", [
                ...userUpdate,
                {
                  id: socketRef.current.id,
                  videoFlag: true,
                  audioFlag,
                },
              ]);
            }

            track.enabled = true;
            setVideoFlag(true);
            setStopVideo();
          }
        }
      });
    }
  };

  const setMuteButton = () => {
    const html = `
          <i class="fas fa-microphone"></i>
          <span>Mute</span>
        `;
    main__mute_button.current.innerHTML = html;
  };

  const setUnmuteButton = () => {
    const html = `
          <i class="unmute fas fa-microphone-slash"></i>
          <span>Unmute</span>
        `;
    main__mute_button.current.innerHTML = html;
  };

  const setStopVideo = () => {
    const html = `
          <i class="fas fa-video"></i>
          <span>Stop Video</span>
        `;
    main__video_button.current.innerHTML = html;
  };

  const setPlayVideo = () => {
    const html = `
        <i class="stop fas fa-video-slash"></i>
          <span>Play Video</span>
        `;
    main__video_button.current.innerHTML = html;
  };
  const classes = useStyles();
  if (stream) peersRef.current.length > 0 ? music.pause() : music.play();
  console.log(peersRef.current);
  return (
    <div>
      <div className="conference video_app__container">
        <nav
          className={
            !isToggled
              ? "conference video_app__nav primary-and-secondary hidden"
              : "conference video_app__nav primary-and-secondary"
          }
        >
          <div className="nav__contents">
            {selected === "chat" ? (
              <Chat
                toggleControls={toggleHamburger}
                sendMessage={sendMessage}
                roomid={roomID}
                message={message}
                messages={messages}
                setMessage={setMessage}
                name={userName}
                users={users}
              />
            ) : selected === "users" ? (
              <Participants toggleControls={toggleHamburger} users={users} />
            ) : null}
          </div>
        </nav>
        <main className=" conference video_app__main">
          <div className="conference title-area">
            <div className="conference video_app__header">
              <div>
                <div>
                  <div className="_header-content--header--3mdiS shared--outer-container--3eppq">
                    <div className="_header-content--part-info--3iVwL">
                      <h1>Kingsroom</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="content-area" style={{ backgroundColor: "#2c4364" }}>
            <div aria-hidden="true" className="hidden-header">
              <div className="video_app__header">
                <div>
                  <div>
                    <div className="_header-content--header--3mdiS shared--outer-container--3eppq">
                      <div className="_header-content--part-info--3iVwL">
                        <h1>Kingsroom</h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              id="content"
              className="video_app__body"
              onClick={() => closeNav()}
            >
              <div className="index--container--uI0r1">
                <div className="index--body--3G2lS">
                  <VideoContainer>
                    <VideoWrapper>
                      <VideoCard>
                        <VideoStream
                          muted
                          ref={userVideo}
                          autoPlay
                          playsInline
                        />
                        <FooterContainer>
                          <UserNameText>{capitalize(userName)}</UserNameText>
                          <div className={classes.controls}>
                            <div
                              className={
                                videoFlag
                                  ? classes.iconsEnabled
                                  : classes.iconsDisabled
                              }
                              onClick={playStop}
                            >
                              {videoFlag ? (
                                <VideocamIcon className={classes.color} />
                              ) : (
                                <VideocamOffIcon className={classes.color} />
                              )}
                            </div>
                            <div
                              className={
                                audioFlag
                                  ? classes.iconsEnabled
                                  : classes.iconsDisabled
                              }
                              onClick={muteUnmute}
                            >
                              {audioFlag ? (
                                <MicIcon className={classes.color} />
                              ) : (
                                <MicOffIcon className={classes.color} />
                              )}
                            </div>
                          </div>
                        </FooterContainer>
                      </VideoCard>
                      {peersRef.current.map((peer) => {
                        let audioFlagTemp = true;
                        let videoFlagTemp = true;

                        const user = users.find(
                          (user) =>
                            user.name.toLowerCase() === userName.toLowerCase()
                        );
                        if (userUpdate) {
                          userUpdate.forEach((entry) => {
                            if (
                              peer &&
                              peer.peerID &&
                              peer.peerID === entry.id
                            ) {
                              audioFlagTemp = entry.audioFlag;
                              videoFlagTemp = entry.videoFlag;
                            }
                          });
                        }
                        return (
                          <Video
                            key={peer.peerID}
                            peer={peer}
                            audioFlagTemp={audioFlagTemp}
                            videoFlagTemp={videoFlagTemp}
                            userUpdate={userUpdate}
                            socketRef={socketRef}
                            user={user}
                          />
                        );
                      })}
                    </VideoWrapper>
                  </VideoContainer>
                </div>
                <span className="footer-link--footer-link--3EuAW">
                  <div className="footer-link--contents--1AXQE shared--outer-container--3eppq">
                    <MainControls
                      toggleHamburger={toggleHamburger}
                      setSelected={setSelected}
                      setCopyInfo={setCopyInfo}
                      playStop={playStop}
                      muteUnmute={muteUnmute}
                      leaveCall={leaveCall}
                      main__mute_button={main__mute_button}
                      main__video_button={main__video_button}
                      stream={stream}
                      users={users}
                    />
                  </div>
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
      {copyInfo && (
        <Cop2CB handleClose={() => setCopyInfo(false)} show={copyInfo} />
      )}
      {show && (
        <NotificationModal
          show={show}
          handleClose={() => {
            setShow(false);
            setTimer(false);
          }}
          message={errorMessage}
          actionText="Go Back"
          action={() => goBack()}
          timer={timer}
        />
      )}
      <LoadingBackdrop open={open} />
      <AudioPlayer />
    </div>
  );
};

export default Room;
