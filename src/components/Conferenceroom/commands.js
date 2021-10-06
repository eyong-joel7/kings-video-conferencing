/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
/* eslint-disable eqeqeq */
import helper from '../../utils/helper'

 function broadcastNewTracks(userVideo, pc, stream, type, mirrorMode = true ) {
    helper.setLocalStream(userVideo, stream, mirrorMode );
    let track = type === 'audio' ? stream.getAudioTracks()[0] : stream.getVideoTracks()[0];

    for ( let p in pc ) {
        let pName = pc[p];

        if ( typeof pc[pName] == 'object' ) {
            helper.replaceTrack( track, pc[pName] );
        }
    }
}
 function shareScreen( setIsShareToggled, userVideo, pc, setScreen, screen ) {
    helper.shareScreen().then( ( stream ) => {
        setIsShareToggled( true );

        //disable the video toggle btns while sharing screen. This is to ensure clicking on the btn does not interfere with the screen sharing
        //It will be enabled was user stopped sharing screen
        // helper.toggleVideoBtnDisabled( true );
        //save my screen stream
        setScreen(stream);
        //share the new stream with all partners
        broadcastNewTracks(userVideo, pc, stream, 'video', false );

        //When the stop sharing button shown by the browser is clicked
        screen.getVideoTracks()[0].addEventListener( 'ended', () => {
            stopSharingScreen();
        } );
    } ).catch( ( e ) => {
        console.error( e );
    } );
}



function stopSharingScreen( setIsShareToggled, userVideo, pc, screen, myStream) {
    //enable video toggle btn
    // helper.toggleVideoBtnDisabled( false );

    return new Promise( ( res, rej ) => {
        // eslint-disable-next-line no-unused-expressions
        screen.getTracks().length ? screen.getTracks().forEach( track => track.stop() ) : '';
        res();
    } ).then( () => {
        setIsShareToggled( false );
        broadcastNewTracks(userVideo, pc, myStream, 'video');
    } ).catch( ( e ) => {
        console.error( e );
    } );

}
function getVideoAudioStream (video = true, audio =true){
    // let quality = settings.params?.quality;
    // if (quality) quality = parseInt(quality);
    // @ts-ignore
    const myNavigator = navigator.mediaDevices.getUserMedia || navigator.mediaDevices.webkitGetUserMedia || navigator.mediaDevices.mozGetUserMedia || navigator.mediaDevices.msGetUserMedia;
    return myNavigator({
        video: video ? {
            frameRate: 12,
            noiseSuppression: true,
            width: {min: 640, ideal: 1280, max: 1920},
            height: {min: 480, ideal: 720, max: 1080}
        } : false,
        audio: audio,
    });
}
function listenToEndStream(socket, stream, status){
    const videoTrack = stream.getVideoTracks();
    if (videoTrack[0]) {
        videoTrack[0].onended = () => {
            socket.emit('display-media', false);
            reInitializeStream(status.video, status.audio, 'userMedia');
            // settings.updateInstance('displayStream', false);
            toggleVideoTrack(status);
        }
    }
};


//    function reInitializeStream(peers, video, audio, type='userMedia', userVideo){
//         const media = type === 'userMedia' ? getVideoAudioStream(video, audio) : 
//         navigator.mediaDevices.getDisplayMedia();
//         return new Promise((resolve) => {
//             media.then((stream) => {
//                 if (type === 'displayMedia') {
//                     toggleVideoTrack({audio, video});
//                 }
//                helper.setLocalStream(userVideo, stream, true );
//                 replaceStream(stream, peers);
//                 resolve(true);
//             });
//         });
//     }
    
    function reInitializeStream(socket, peers, video, audio, type='userMedia', userVideo){
        // @ts-ignore
        const media = type === 'userMedia' ? getVideoAudioStream(video, audio) : navigator.mediaDevices.getDisplayMedia();
        return new Promise((resolve) => {
            media.then((stream) => {
                // @ts-ignore
                const myVideo = userVideo;
                if (type === 'displayMedia') {
                    toggleVideoTrack({audio, video});
                    listenToEndStream(socket, stream, {video, audio});
                    socket.emit('display-media', true);
                }
                checkAndAddClass(myVideo, type);
                helper.setLocalStream(userVideo, stream, true );
                replaceStream(stream, peers);
                resolve(true);
            });
        });
    }
  
    

 function toggleVideoTrack(status){
        const myVideo = status.id;
        if (myVideo && !status.video) 
            myVideo.srcObject?.getVideoTracks().forEach((track) => {
                if (track.kind === 'video') {
                    !status.video && track.stop();
                }
            });
        else if (myVideo) {
            reInitializeStream(status.video, status.audio, status.id);
        }
    }

     function replaceStream(mediaStream, peers){
        peers.map((peer) => {
            console.log(peer)
            peer.peer.peerConnection?.getSenders().map((sender) => {
                if(sender.track.kind == "audio") {
                    if(mediaStream.getAudioTracks().length > 0){
                        sender.replaceTrack(mediaStream.getAudioTracks()[0]);
                    }
                }
                if(sender.track.kind == "video") {
                    if(mediaStream.getVideoTracks().length > 0){
                        sender.replaceTrack(mediaStream.getVideoTracks()[0]);
                    }
                }
            });
        })
    }
     
    function toggleAudioTrack(status){
        const myVideo = status.id;
        // @ts-ignore
        if (myVideo) myVideo.srcObject?.getAudioTracks().forEach((track) => {
            if (track.kind === 'audio')
                track.enabled = status.audio;
                status.audio ? reInitializeStream(status.video, status.audio) : track.stop();
        });
    }
    const checkAndAddClass = (video, type ='userMedia') => {
        if (video?.classList?.length === 0 && type === 'displayMedia')  
            video.classList.add('display-media');
        else 
            video.classList.remove('display-media');
    }
    
    const changeMediaView = (userID, status) => {
        const userVideoDOM = document.getElementById(userID);
        if (status) {
            const clientPosition = userVideoDOM.getBoundingClientRect();
            const createdCanvas = document.createElement("SPAN");
            createdCanvas.className = userID;
            createdCanvas.style.position = 'absolute';
            createdCanvas.style.left = `${clientPosition.left}px`;
            createdCanvas.style.top = `${clientPosition.top}px`;
            // createdCanvas.style.width = `${userVideoDOM.videoWidth}px`;
            // createdCanvas.style.height = `${clientPosition.height}px`;
            createdCanvas.style.width = '100%';
            createdCanvas.style.height = '100%';
            createdCanvas.style.backgroundColor = 'green';
            userVideoDOM.parentElement.appendChild(createdCanvas);
        } else {
            const canvasElement = document.getElementsByClassName(userID);
            if (canvasElement[0]) canvasElement[0].remove();
        }
    }

export {shareScreen, stopSharingScreen, toggleVideoTrack, reInitializeStream}