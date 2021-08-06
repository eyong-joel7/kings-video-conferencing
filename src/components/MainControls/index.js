
import { useMediaQuery } from 'react-responsive';
import { useContext, React} from 'react';
import { SocketContext } from '../../Context';
import './style.css';

const MainControls = ()=>{
    const { stream:myVideoStream, callAccepted, leaveCall} = useContext(SocketContext);
    const isMobile = useMediaQuery({
        query: "(max-device-width: 480px)",
      });
    const muteUnmute = () => {
        const enabled = myVideoStream.getAudioTracks()[0].enabled;
        if (enabled) {
          myVideoStream.getAudioTracks()[0].enabled = false;
          setUnmuteButton();
        } else {
          setMuteButton();
          myVideoStream.getAudioTracks()[0].enabled = true;
        }
      }
      
      const playStop = () => {
        console.log('object')
        let enabled = myVideoStream.getVideoTracks()[0].enabled;
        if (enabled) {
          myVideoStream.getVideoTracks()[0].enabled = false;
          setPlayVideo()
        } else {
          setStopVideo()
          myVideoStream.getVideoTracks()[0].enabled = true;
        }
      }
      
      const setMuteButton = () => {
        const html = `
          <i class="fas fa-microphone"></i>
          <span>Mute</span>
        `
        document.querySelector('.main__mute_button').innerHTML = html;
      }
      
      const setUnmuteButton = () => {
        const html = `
          <i class="unmute fas fa-microphone-slash"></i>
          <span>Unmute</span>
        `
        document.querySelector('.main__mute_button').innerHTML = html;
      }
      
      const setStopVideo = () => {
        const html = `
          <i class="fas fa-video"></i>
          <span>Stop Video</span>
        `
        document.querySelector('.main__video_button').innerHTML = html;
      }
      
      const setPlayVideo = () => {
        const html = `
        <i class="stop fas fa-video-slash"></i>
          <span>Play Video</span>
        `
        document.querySelector('.main__video_button').innerHTML = html;
      }
    return (
        <div class="main__controls">
            <div class="main__controls__block">
               <div onClick={()=> muteUnmute()} class="main__controls__button main__mute_button">
                  <i class="fas fa-microphone"></i>
                  <span>Mute</span>
               </div>
               <div onClick={()=> playStop()} class="main__controls__button main__video_button" >
                  <i class="fas fa-video"></i>
                  <span>Stop Video</span>
               </div>
            </div>
            
            <div class="main__controls__block">
            {
                   !isMobile &&      <div class="main__controls__button">
                   <i class="fas fa-shield-alt"></i>
                   <span>Security</span>
                </div>
               }
           
               <div class="main__controls__button">
                  <i class="fas fa-user-friends"></i>
                  <span>Participants</span>
               </div>
               {
                   !callAccepted &&  <div class="main__controls__button">
                   <i class="fas fa-comment-alt"></i>
                   <span>Chat</span>
                </div>
               }
              
            </div>
            {
                callAccepted &&   <div class="main__controls__block">
                <div class="main__controls__button leave">
                   <span class="leave_meeting" onClick = {leaveCall}>Leave</span>
                </div>
             </div>
            }
          
         </div>
    )
}
export default MainControls;