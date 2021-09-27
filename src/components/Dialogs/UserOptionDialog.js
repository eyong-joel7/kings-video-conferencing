import * as React from 'react';
import PropTypes from 'prop-types';

import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import ChatIcon from '@mui/icons-material/Chat';





function UserOptionDialog(props) {
  const { onClose, selectedValue, open} = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Choose an action</DialogTitle>
      <List sx={{ pt: 0 }}>

        <ListItem autoFocus button onClick={() => handleListItemClick('send message')}>
          <ListItemAvatar>
            <Avatar>
              <ChatIcon/>
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Send private message" />
        </ListItem>
      </List>
    </Dialog>
  );
}

UserOptionDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

export default UserOptionDialog;

