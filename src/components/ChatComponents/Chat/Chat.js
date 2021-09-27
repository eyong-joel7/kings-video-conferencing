import React from "react";

import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

import './Chat.css';



const Chat = (props) => {
const { toggleControls,users,setIsNewMessage, roomid:room, message, messages, displayUser, setDisplayUser, sendMessage, setMessage, name}  = props;
  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar setIsNewMessage = {setIsNewMessage} room={room} toggleControls={toggleControls} />
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
          users={users}
          name={name}
          
          displayUser ={displayUser}
          setDisplayUser = {setDisplayUser}
        />
      </div>
    </div>
  );
}
export default Chat;
