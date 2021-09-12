/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import { useHistory, useLocation } from "react-router";

import { useMediaQuery } from "react-responsive";
import MainControls from "./MainControls";
import Participants from "./Participants";
import Chat from "./ChatComponents/Chat/Chat";
import NotificationModal from "./Modals";
import '../components/Conferenceroom/conferenceElements.css';

export const ServicesContainer = styled.div`
    width: 100%;
    margin-right: auto;
    margin-left: auto;
    padding-right: 15px;
    padding-left: 15px;
     max-height: 100%;
    justify-items:center;
    @media (min-width: 576px)
 {
    max-width: 540px;
}
@media (min-width: 768px)
 {
    max-width: 720px;
}
    @media (min-width: 992px)
{
    max-width: 960px;
}
@media screen and (min-width: 1200px){
max-width: 1140px;
}

`;
export const ServicesWrapper = styled.div`

display: grid;
grid-template-columns: 1fr 1fr 1fr;
justify-items: center;
grid-gap: 10px;
height:100%;
width: 100%;
@media screen and (max-width: 1000px){
    grid-template-columns: 1fr 1fr;
};
@media screen and (max-width: 768px){
   grid-template-columns: 1fr;
};
`;

export const ServicesCard = styled.video`
background: #fff;
display: flex;
flex-direction: column;
justify-content: flex-start;
align-items: center;
border-radius: 5px;
width: 100%;
height: 100%;
box-shadow: 0 1px 3px rgba(0,0,0,0.5);
transition: all 0.2s ease-in-out;

&:hover{
    transform: scale(1.01);
}
`;



const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <ServicesCard playsInline autoPlay ref={ref} />
    );
}


const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2
};

const Room = (props) => {
    const [peers, setPeers] = useState([]);
    const [users, setUsers] = useState([]);
    const socketRef = useRef();
    const userVideo = useRef();
    const peersRef = useRef([]);
    const main__mute_button = useRef();
    const main__video_button = useRef();
    const [stream, setStream] = useState();
    const [isToggled, setIsToggled] = useState(false);
    const [selected, setSelected] = useState('');
 
    const [show, setShow] = useState(false);
    const [timer, setTimer] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
    
  const location = useLocation();
  ;
  window.onbeforeunload = function(e){
    leaveCall();
  }
    
   
    const hiddenClass = useMediaQuery({
      query: '(min-device-width: 1200px)',
    });
    const toggleHamburger = () => {
      setIsToggled(!isToggled);
    };
  
  const closeNav = ()=>{
    if((!hiddenClass && isToggled)){
    toggleHamburger();
    }
  }
    const history  = useHistory();

    const userName = location.state?.name;
    const room = location.state?.roomid;
    const roomID = room?.trim().toLowerCase();

    useEffect(() => {
        if(!roomID || !userName){
            history.push('/');
             }
             
        socketRef.current = io.connect("http://localhost:5000/");
        navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
            userVideo.current.srcObject = stream;
            setStream(stream);
            socketRef.current.emit("join room", {roomID, userName}, (error) => {
                if(error) {
                    setShow(true);
                 setErrorMessage(error);
                }
            });
            socketRef.current.on("all users", users => {
                const peers = [];
                users.forEach(userID => {
                    const peer = createPeer(userID, socketRef.current.id, stream);
                    peersRef.current.push({
                        peerID: userID,
                        peer,
                    })
                    peers.push({
                        peerID: userID,
                        peer});
                })
                setPeers(peers);
            })

            socketRef.current.on("user joined", payload => {
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                })
           
                const peerObj = {
                    peer, 
                    peerID: payload.callerID
                  }
                  setPeers(users => [...users, peerObj])
                 
            });

            socketRef.current.on("receiving returned signal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                if(item) item.peer.signal(payload.signal);
                
            });
            socketRef.current.on('user left', id => {
                const peerObj = peersRef.current.find(p => p.peerID === id);
                if(peerObj){
                  peerObj.peer.destroy();
                  const peers = peersRef.current.filter(p => p.peerID !== id);
                peersRef.current = peers;
                setPeers(peers);
               
                }
                
              })
            socketRef.current.on('message', message => {
                setMessages(messages => [ ...messages, message ]);
                const user = message.user.trim().toLowerCase();
                console.log(user)
                if(user === 'admin'){
                    setErrorMessage(message.text);
                    setTimer(true);
                    setShow(true);
                }
              });
              
              socketRef.current.on("roomData", ({ users }) => {
                setUsers(users);
               
              });
              if (hiddenClass) {
                  setIsToggled(true)
                setSelected("chat");
              }
        })
        .catch(function (error){
            setShow(true);
            if (error.name === "ConstraintNotSatisfiedError") {
              setErrorMessage(
                "The resolution is not supported by your device."
              );
            } else if (error.name === "PermissionDeniedError") {
              setErrorMessage(
                "Permissions have not been granted to use your camera and " +
                  "microphone, you need to allow the page access to your devices"
              );
            } else
              setErrorMessage("getUserMedia error: " + error.name + `error: ${error}`);
          
        })
    }, []);

    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
        })

        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            socketRef.current.emit("returning signal", { signal, callerID })
        })

        peer.signal(incomingSignal);

        return peer;
    }

    const sendMessage = (event) => {
        event.preventDefault();
        if(message) {
          const user = users.find(user => user.name.trim().toLowerCase === userName.trim().toLowerCase())
          socketRef.current.emit('sendMessage', {message, userID:user?.id }, () => setMessage(''));
        }
      }
      const leaveCall = () => {
        socketRef.current.destroy();
      window.location.replace('/')
      };
      const muteUnmute = () => {
        const enabled = stream.getAudioTracks()[0].enabled;
        if (enabled) {
          stream.getAudioTracks()[0].enabled = false;
          setUnmuteButton();
        } else {
          setMuteButton();
          stream.getAudioTracks()[0].enabled = true;
        }
      }
      
      const playStop = () => {
        let enabled = stream.getVideoTracks()[0].enabled;
        if (enabled) {
          stream.getVideoTracks()[0].enabled = false;
          setPlayVideo()
        } else {
          setStopVideo()
          stream.getVideoTracks()[0].enabled = true;
        }
      }
      
      const setMuteButton = () => {
        const html = `
          <i class="fas fa-microphone"></i>
          <span>Mute</span>
        `
        main__mute_button.current.innerHTML = html;
      }
      
      const setUnmuteButton = () => {
        const html = `
          <i class="unmute fas fa-microphone-slash"></i>
          <span>Unmute</span>
        `
        main__mute_button.current.innerHTML = html;
      }
      
      const setStopVideo = () => {
        const html = `
          <i class="fas fa-video"></i>
          <span>Stop Video</span>
        `
        main__video_button.current.innerHTML = html;
      }
      
      const setPlayVideo = () => {
        const html = `
        <i class="stop fas fa-video-slash"></i>
          <span>Play Video</span>
        `
        main__video_button.current.innerHTML = html;
      }

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
            {/* Put video thumbnail here */}
            <div
              className="content-area"
              style={{ backgroundColor: "#f1f1f1" }}
            >
              <div aria-hidden="true" className="hidden-header">
                <div className="video_app__header">
                  <div>
                    <div>
                      <div className="_header-content--header--3mdiS shared--outer-container--3eppq">
                        <div className="_header-content--part-info--3iVwL">
                          <h1>Kings' Room</h1>
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
                    <ServicesContainer>
                      <ServicesWrapper>
                        <ServicesCard
                          muted
                          ref={userVideo}
                          autoPlay
                          playsInline
                        />
                      
                        {peersRef.current.map((peer) => {
                          return <Video key={peer.peerID} peer={peer.peer} />;
                        })}
                      </ServicesWrapper>
                    </ServicesContainer>
                  </div>
                  <span className="footer-link--footer-link--3EuAW">
                    <div className="footer-link--contents--1AXQE shared--outer-container--3eppq">
                      <MainControls
                        toggleHamburger={toggleHamburger}
                        setSelected={setSelected}
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
            </div>{" "}
          </main>{" "}
        </div>
        {show && (
          <NotificationModal
            show={show}
            handleClose={() => {setShow(false); setTimer(false)}}
            message={errorMessage}
            actionText = 'Go Back'
            action = {() => leaveCall()}
            timer = {timer}
          />
        )}
      </div>
    );
};

export default Room;
