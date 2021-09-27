import React from 'react';

import './Message.css';

import ReactEmoji from 'react-emoji';
import { Lock } from '@material-ui/icons';
import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme) => ({
  icon: {
    fontSize: "1rem !important",
  },
}))

const Message = ({ message: { text, user, isPrivate}, name }) => {
  let isSentByCurrentUser = false;
  const trimmedName = name.trim().toLowerCase();

  if(user === trimmedName) {
    isSentByCurrentUser = true;
  }
const classes = useStyles();
  return (
    isSentByCurrentUser
      ? (
        <div className="messageContainer justifyEnd">
          <p className="sentText pr-10"><span>{isPrivate && <Lock className = {classes.icon} />}</span></p>
          <div className="messageBox backgroundBlue">
            <p className="messageText colorWhite">{ReactEmoji.emojify(text)}</p> 
          </div>
        </div>
        )
        : (
          <div className="messageContainer justifyStart">
            <div className="messageBox backgroundLight">
              <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p>
            </div>
            <p className="sentText pl-10 ">{isPrivate && <Lock className = {classes.icon}/>}{user}</p>
          </div>
        )
  );
}

export default Message;