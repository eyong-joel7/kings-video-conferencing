
import React, { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CssBaseline from '@material-ui/core/CssBaseline';

import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { ChevronLeft } from '@material-ui/icons';
import {SELECTED_CAMERA_DEVICE_ID, SELECTED_MIC_DEVICE_ID, SELECTED_SPEAKER_DEVICE_ID} from '../../CONSTANTS'


const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: '#f1f1f1',
        padding: 20,
    },
  paper: {
    marginTop: theme.spacing(6),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form:{
      width: 280,
      marginBottom: 20,
      [theme.breakpoints.up('sm')]: {
          width:480
      }
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
    width: '5rem',
    height: '5rem',
  },
  svg: {
    width: '4rem !important',
    height: '4rem !important',
  },
  text: {
    marginBottom: 20,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SettingScreen({pageControl}) {
  const classes = useStyles();
  const [selectedCamera, setSelectedCamera] = useState('');
  const [selectedMic, setSelectedMic] = useState('');
  const [selectedSpeaker, setSelectedSpeaker] = useState('');
  const [cameraList, setCameraList] = useState([]);
  const [audioList, setAudioList] = useState([]);
  const [audioOutputList, setAudioOutputList] = useState([]);

  useEffect(()=> {

    function getConnectedDevices(type, callback) {
        navigator.mediaDevices.enumerateDevices()
            .then(devices => {
                const filtered = devices.filter(device => device.kind === type);
                callback(filtered);
            });
    }
    if(!selectedCamera){
      getConnectedDevices('videoinput', cameras => setCameraList(cameras));
      const defaultCamera = localStorage.getItem(SELECTED_CAMERA_DEVICE_ID);
      const camIndex =  defaultCamera && cameraList.findIndex(camera => camera.deviceId === defaultCamera);
      if(camIndex>-1) setSelectedCamera(cameraList[camIndex]?.deviceId)
    }
   if(!selectedMic){
    getConnectedDevices('audiooutput', devices => setAudioOutputList(devices));
    const defaultMic = localStorage.getItem(SELECTED_MIC_DEVICE_ID);
    const micIndex =  defaultMic && audioList.findIndex(mic => mic.deviceId === defaultMic);
    if(micIndex>-1) setSelectedMic(audioList[micIndex]?.deviceId)
   }
   if(!selectedSpeaker){
    getConnectedDevices('audioinput', mics => setAudioList(mics));
    const defaultSpeaker = localStorage.getItem(SELECTED_SPEAKER_DEVICE_ID);
    const speakerIndex =  defaultSpeaker && audioOutputList.findIndex(speaker => speaker.deviceId === defaultSpeaker);
    if(speakerIndex>-1) setSelectedSpeaker(audioOutputList[speakerIndex]?.deviceId)
   }
    
   
  
  },[audioList, audioOutputList, cameraList, selectedCamera, selectedMic, selectedSpeaker])


const handleClose = () => {pageControl('home')}
const handleChange = (event) => {
    const device_id = event.target.value;
  setSelectedCamera(device_id);
  device_id && localStorage.setItem(SELECTED_CAMERA_DEVICE_ID, device_id )
};
const handleChangeMic = (event) => {
    const device_id = event.target.value;
  setSelectedMic(device_id);
  device_id && localStorage.setItem(SELECTED_MIC_DEVICE_ID, device_id )
};
const handleChangeSpeaker = (event) => {
    const device_id = event.target.value;
  setSelectedSpeaker(device_id);
  device_id && localStorage.setItem(SELECTED_SPEAKER_DEVICE_ID, device_id )
};


  return (
    <Container className = {classes.root} component="main">
      <CssBaseline />
     <div onClick = {handleClose} style = {{display: 'flex', alignItems:'center',cursor:'pointer'}}> <ChevronLeft/><span>Back</span></div>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
           <MiscellaneousServicesIcon className={classes.svg}/>
        </Avatar>
        <Typography className={classes.text} component="h1" variant="h5">
          Settings
        </Typography>
    
      <FormControl sx={{ m: 1}} className = {classes.form}>
        <InputLabel id="cameras">Connected Cameras</InputLabel>
        <Select
          labelId="cameras"
          id="cameras"
          value={selectedCamera?selectedCamera:''}
          label="Connected Cameras"
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>

          {
              cameraList && cameraList.map((camera) => (
                <MenuItem key = {camera.deviceId} value={camera.deviceId}>{camera.label}</MenuItem>
              ) )
          }
        </Select>
      </FormControl>
     
      <FormControl sx={{ m: 1 }} className = {classes.form}>
        <InputLabel id="mics">Connected Microphones</InputLabel>
        <Select
          labelId="mics"
          id="mics"
          value={selectedMic ? selectedMic : ''}
          label="Connected Microphones"
          onChange={handleChangeMic}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {
              audioList && audioList.map((mic) => (
                <MenuItem key = {mic.deviceId} value={mic.label}>{mic.label}</MenuItem>
              ) )
          }
        </Select>
      </FormControl>
     
      <FormControl sx={{ m: 1 }} className = {classes.form}>
        <InputLabel id="mics">Audio Outputs</InputLabel>
        <Select
          labelId="mics"
          id="mics"
          value={selectedSpeaker?selectedSpeaker:''}
          label="Connected Output Devices"
          onChange={handleChangeSpeaker}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {
              audioOutputList && audioOutputList.map((speaker) => (
                <MenuItem key = {speaker.deviceId} value={speaker.label}>{speaker.label}</MenuItem>
              ) )
          }
        </Select>
      </FormControl>
     
      </div>
    </Container>
  );
}