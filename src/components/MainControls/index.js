
import { useMediaQuery } from 'react-responsive';
import { useContext, React} from 'react';
import { SocketContext } from '../../Context';
import './style.css';

const MainControls = ()=>{
    const {callAccepted, leaveCall,playStop, muteUnmute, main__mute_button, main__video_button, stream} = useContext(SocketContext);
    const isMobile = useMediaQuery({
        query: "(max-device-width: 480px)",
      });
    
    return (
        <div class="main__controls">
           {
               stream && (
                <div class="main__controls__block">
                <div ref = {main__mute_button} onClick={muteUnmute} class="main__controls__button main__mute_button">
                   <i class="fas fa-microphone"></i>
                   <span>Mute</span> 
           
                </div>
                <div ref = {main__video_button} onClick={playStop} class="main__controls__button main__video_button" >
                   <i class="fas fa-video"></i>
                   <span>Stop Video</span>
               
                </div>
             </div>
             
               )
           }
           
            <div class="main__controls__block">
            {
                   !isMobile && <div class="main__controls__button">
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