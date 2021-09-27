import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { Avatar } from "@material-ui/core";
import userIcon from '../../icons/headphones.svg'
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import UserOptionDialog from "../Dialogs/UserOptionDialog";




const useStyles = makeStyles((theme) => ({
  root: {
    color:'#f1f1f1',
    width: "100%",
    minWidth: 260,
    maxWidth:380,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: "transparent",
    height: "100%"
  },
  text:{
    color:"#f1f1f1",
    textTransform: 'capitalize',
  }
}));
export const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

export default function SimpleList({ users, user, setSelected, setDisplayUser }) {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');

 const username = user.toLowerCase();
  const classes = useStyles();
const thisUser = users.filter(_user => _user.name.toLowerCase() === username);
const otherUsers = users.filter( _user => _user.name.toLowerCase() !== username);
let usersList = thisUser.concat(otherUsers);

const handleClickOpen = (user) => {
  setOpen(true);
  setDisplayUser(user.name)

};

const handleClose = (value) => {
  setOpen(false);
  setSelectedValue(value);
  // for more options, check for value === send message before the below line 
   value && setSelected('chat')
};
  return (
    <div className={classes.root}>
      <List
        component="nav"
        aria-label="main mailbox folders"
        style={{ backgroundColor: "transparent" }}
      >
        {usersList.map((user) => (
          <ListItem button key={user.name}>
            <ListItemIcon>
              <Avatar alt="headphones" src={userIcon} />
            </ListItemIcon>
            <ListItemText  onClick={ user.name.toLowerCase() !==username ? () => handleClickOpen(user) : null} className={classes.text} primary= {user.name.toLowerCase() === username ? user.name + ' (me)' : user.name } />
            <IconButton aria-label="admin">
              <StyledBadge
                badgeContent={user.isAdmin ? "Admin" : null}
                color="secondary"
              ></StyledBadge>
            </IconButton>
          </ListItem>
        ))}
      </List>
      <UserOptionDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
     
      />
    </div>
  );
}
