/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import Draggable from "react-draggable";
import { useHistory, useLocation } from "react-router";
import { useMediaQuery } from "react-responsive";
import MainControls from "../MainControls";
import Participants from "../Participants";
import Chat from "../ChatComponents/Chat/Chat";
import NotificationModal from "../Modals";
import "./conferenceElements.css";
import Cop2CB from "../Modals/Copy2C";
import { RECENT_ACTIVITIES } from "../../CONSTANTS";

import {
  SELECTED_CAMERA_DEVICE_ID,
  SELECTED_MIC_DEVICE_ID,
} from "../../CONSTANTS";
import {
  VideoContainer,
  VideoStream,
  VideoWrapper,
} from "./conferenceRoomElements";
import LoadingBackdrop from "../LoadingBackdrop";
import Video from "./VideoPlayer";
import { AudioPlayer } from "./AudioPlayer";
import BackgroundLetterAvatars from "../StringAvatar";
import helper from "../../utils/helper";

const ConferenceRoom = (props) => {
  const cameraID = localStorage.getItem(SELECTED_CAMERA_DEVICE_ID);
  const audioID = localStorage.getItem(SELECTED_MIC_DEVICE_ID);
  const constraints = {
    audio: { echoCancellation: true },
    video: {
      width: { min: 640, ideal: 1280, max: 1920 },
      height: { min: 480, ideal: 720, max: 1080 },
    },
  };

  // eslint-disable-next-line no-unused-vars
  const [peers, setPeers] = useState([]);
  const [users, setUsers] = useState([]);
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const main__mute_button = useRef();
  const main__video_button = useRef();

  const [stream, setStream] = useState();
  const [screen, setScreen] = useState(null);
  const [isToggled, setIsToggled] = useState(false);
  const [selected, setSelected] = useState("");
  const [displayUser, setDisplayUser] = useState("");

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
  const [isNewMessage, setIsNewMessage] = useState(false);
  const [displayStream, setdisplayStream] = useState(false);

  useEffect(() => {
    //When the stop sharing button shown by the browser is clicked
    !!screen &&
      screen.getVideoTracks()[0].addEventListener("ended", () => {
        stopSharingScreen();
      });
  }, [screen]);

  const music = document.getElementById("music");
  const location = useLocation();
  const hiddenClass = useMediaQuery({
    query: "(min-device-width: 1200px)",
  });
  // const isDesktop = useMediaQuery({
  //   query: "(min-device-width: 768px)",
  // });
  const toggleHamburger = () => {
    setIsToggled(!isToggled);
    setSelected("");
  };

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

  useEffect(() => {
    setOpen(true);
    if (!roomID) history.push("/");
    else if (!userName) {
      history.push(`/?redirect = ${roomID}`);
    }
    if (cameraID) constraints.video["deviceId"] = cameraID;
    if (audioID) constraints.audio["deviceId"] = audioID;
    // 'http://localhost:5000/'
    socketRef.current = io(URL);
    // we will check is user accept to use both audio and video before getting full media else we will call get getUserAudio from helper without contraints
    helper
      .getUserFullMedia(constraints)
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
          // helper.adjustVideoElemSize(isDesktop);
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
          // helper.adjustVideoElemSize(isDesktop);
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
            // helper.adjustVideoElemSize(isDesktop);
          }
        });
        socketRef.current.on("message", (message) => {
          setMessages((messages) => [...messages, message]);
          const user = message.user.trim().toLowerCase();
          if (user === "admin") {
            !message.text.toLowerCase().includes("welcome") &&
              setErrorMessage(message.text);
          }
          if (user !== userName) setIsNewMessage(true);
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
        } else setErrorMessage(`getUserMedia error: error: ${error}`);
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
    const today = Date.now();
  //  const dateTime = helper.formatDate(today)
    const newActivity = {
      meetingID: roomID,
      dateTime: today,
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
            : Object.assign({}, listItem, { dateTime: today })
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

  function shareScreen() {
    helper
      .shareScreen()
      .then((stream) => {
        setdisplayStream(true);

        //disable the video toggle btns while sharing screen. This is to ensure clicking on the btn does not interfere with the screen sharing
        //It will be enabled was user stopped sharing screen
        // helper.toggleVideoBtnDisabled( true );
        setPlayVideo();

        //save my screen stream

        setScreen(stream);

        //share the new stream with all partners
        broadcastNewTracks(stream, "video", false);
      })
      .catch((e) => {
        console.error(e);
      });
  }

  async function stopSharingScreen() {
    //enable video toggle btn
    //  helper.toggleVideoBtnDisabled(false)

    try {
      await new Promise((res, rej) => {
        // eslint-disable-next-line no-unused-expressions
        screen.getTracks().length
          ? screen.getTracks().forEach((track) => track.stop())
          : "";
        res();
      });
      setStopVideo();
      setdisplayStream(false);
      broadcastNewTracks(stream, "video");
    } catch (e) {
      console.error(e);
    }
  }

  function broadcastNewTracks(stream, type, mirrorMode = true) {
    helper.setLocalStream(userVideo.current, stream, mirrorMode);
    let track =
      type === "audio"
        ? stream.getAudioTracks()[0]
        : stream.getVideoTracks()[0];
    for (let p in peersRef.current) {
      let peer = peersRef.current[p].peer;

      if (typeof peer == "object") {
        helper.replaceTrack(track, peer);
      }
    }
  }

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

  const shareStop = () => {
    if (
      screen &&
      screen.getVideoTracks().length &&
      screen.getVideoTracks()[0].readyState !== "ended"
    ) {
      stopSharingScreen();
    } else {
      shareScreen();
    }
  };

  const setPlayVideo = () => {
    const html = `
        <i class="stop fas fa-video-slash"></i>
          <span>Play Video</span>
        `;
    main__video_button.current.innerHTML = html;
  };

  if (stream)
    peersRef.current.length > 0 || errorMessage ? music.pause() : music.play();
  let isVideoEnabled =
    userVideo.current?.srcObject?.getVideoTracks()[0]?.enabled;
  return (
    <>
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
                setIsNewMessage={setIsNewMessage}
                displayUser={displayUser}
                setDisplayUser={setDisplayUser}
              />
            ) : selected === "users" ? (
              <Participants
                setSelected={setSelected}
                toggleControls={toggleHamburger}
                users={users}
                user={userName}
                displayUser={displayUser}
                setDisplayUser={setDisplayUser}
              />
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
              <Draggable>
                <div className="local-video">
                  {stream && !isVideoEnabled && (
                    <BackgroundLetterAvatars name={userName} />
                  )}
                  <VideoStream
                    mirrorMode={screen ? '0' : '1'}
                    id={`myVideo`}
                    style={{
                      display: stream && isVideoEnabled ? "block" : "none",
                      visibility:
                        stream && isVideoEnabled ? "visible" : "hidden",
                    }}
                    muted
                    ref={userVideo}
                    autoPlay
                    playsInline
                  />
                </div>
              </Draggable>

              <VideoContainer>
                <VideoWrapper>
                  {peersRef.current.map((peer) => {
                    let audioFlagTemp = true;
                    let videoFlagTemp = true;
                    const user = users.find(
                      (user) =>
                        user.name.toLowerCase() === userName.toLowerCase()
                    );
                    if (userUpdate) {
                      userUpdate.forEach((entry) => {
                        if (peer && peer.peerID && peer.peerID === entry.id) {
                          audioFlagTemp = entry.audioFlag;
                          videoFlagTemp = entry.videoFlag;
                        }
                      });
                    }
                    return (
                      <Video
                        id={`remote-video-${peer.peerID}`}
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
            <div>
              <span className="footer-link--footer-link--3EuAW">
                <div className="footer-link--contents--1AXQE shared--outer-container--3eppq">
                  <MainControls
                    toggleHamburger={toggleHamburger}
                    setSelected={setSelected}
                    selected={selected}
                    isNewMessage={isNewMessage}
                    setIsNewMessage={setIsNewMessage}
                    setCopyInfo={setCopyInfo}
                    playStop={playStop}
                    muteUnmute={muteUnmute}
                    leaveCall={leaveCall}
                    main__mute_button={main__mute_button}
                    main__video_button={main__video_button}
                    shareStop={shareStop}
                    isShareToggled={displayStream}
                    stream={stream}
                    users={users}
                    host={host ? host : null}
                  />
                </div>
              </span>
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
    </>
  );
};

export default ConferenceRoom;
