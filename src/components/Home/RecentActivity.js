import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import HistoryIcon from '@material-ui/icons/History';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { ExitToApp, Info} from '@material-ui/icons';
import { Divider } from '@material-ui/core';
import { useHistory } from 'react-router';
import LoadingBackdrop from '../LoadingBackdrop';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    width:'100%',
    alignSelf: 'center',
  },
typo: {
  display: 'flex',
  alignItems:'center',
},
  demo: {
    backgroundColor: '#f1f1f1',
  },
  span:{
marginLeft: 10,
  },

  title: {
    margin: theme.spacing(4, 0, 2),
    display: 'flex',
    alignItems:'center',
  },
}));



export default function RecentActivity({recentActivitiesList}) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
   if(recentActivitiesList) setOpen(false);
    else setOpen(true)
  },[recentActivitiesList])
  const classes = useStyles();
const history = useHistory();
  return (
    <div className={classes.root} >
    
      <Grid container spacing={2}>
       
        <Grid item xs={12} md={6}>
          
          <Typography variant="h6" className={classes.title}>
          <HistoryIcon />
         <span className = {classes.span}> Recent meetings </span>
          </Typography>
          <Divider/>
          <div className={classes.demo}>
            <List dense= {true}>
               { recentActivitiesList?.length > 0 ?(recentActivitiesList.sort((a,b) => -1).map(activity => (
                <ListItem key = {activity.dateTime} >
                <ListItemAvatar onClick = {() => history.push({pathname: `/conference-room/${activity.meetingID}`, state: {host:activity.host}})}>
                  <Avatar>
                   <Info/>
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={activity.meetingID}
                  secondary= {activity.dateTime}
                />
                <ListItemSecondaryAction  onClick = {() => history.push(`/conference-room/${activity.meetingID}`)}>
                  <IconButton edge="end" aria-label="delete">
                    <ExitToApp/>
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
          
               ))):

               <p>No recent activity. Your recent meetings will appear here</p> 
            }
            </List>
          </div>
        </Grid>
      </Grid>
      <LoadingBackdrop open = {open}/>
    </div>
  );
}
