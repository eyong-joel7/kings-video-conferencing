import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { makeStyles } from "@mui/styles";


const useStyles = makeStyles((theme) => ({
  avatar: {
    width: 150,
    height: 150,
    fontSize: "2.5rem",
  },
  stack: {
    height: "100%",
    width: "100%",
    maxHeight: "350px",
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  const isArr = name.split(' ').length > 1;
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: isArr ? `${name.split(' ')[0][0]}${name.split(' ')[1][0]}` : `${name[0]}${name[1]}` ,
  };
}

export default function BackgroundLetterAvatars({name}) {
    const classes = useStyles();
  return (
    <Stack   className = {classes.stack} direction="row" spacing={2}>
      <Avatar className = {classes.avatar} {...stringAvatar(name.toUpperCase())} />
    </Stack>
  );
}