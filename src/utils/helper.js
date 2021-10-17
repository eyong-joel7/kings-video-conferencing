/* eslint-disable import/no-anonymous-default-export */
export default {
 formatDate (timestamp) {
        const d = new Date(timestamp)
        const time = d.toLocaleTimeString('en-US')
        return time.substr(0, 5) + time.slice(-2) + ' | ' + d.toLocaleDateString()
      },
      
userMediaAvailable() {
    return !!( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia );
},


getUserFullMedia(constraints) {
    if ( this.userMediaAvailable() ) {
        return navigator.mediaDevices.getUserMedia(constraints);
    }

    else {
        throw new Error( 'User media not available' );
    }
},


getUserAudio() {
    if ( this.userMediaAvailable() ) {
        return navigator.mediaDevices.getUserMedia( {
            audio: {
                echoCancellation: true,
                noiseSuppression: true
            }
        } );
    }

    else {
        throw new Error( 'User media not available' );
    }
},



shareScreen() {
    if ( this.userMediaAvailable() ) {
        return navigator.mediaDevices.getDisplayMedia( {
            video: {
                cursor: "always"
            },
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                sampleRate: 44100
            }
        } );
    }

    else {
        throw new Error( 'User media not available' );
    }
},

replaceTrack(stream, recipientPeer ) {
recipientPeer.replaceTrack(recipientPeer.streams[0].getVideoTracks()[0], stream, recipientPeer.streams[0])
},


toggleVideoBtnDisabled( disabled ) {
    document.getElementById( 'playstop' ).disabled = disabled;
},



maximiseStream( id ) {
    let elem = document.getElementById(id);

    elem.requestFullscreen() || elem.mozRequestFullScreen() || elem.webkitRequestFullscreen() || elem.msRequestFullscreen();
},

setLocalStream(localVidElem, stream, mirrorMode = true ) {
    localVidElem.srcObject = stream;
    mirrorMode ? localVidElem.classList.add( 'mirror-mode' ) : localVidElem.classList.remove( 'mirror-mode' );
},

// saveRecordedStream( stream, user ) {
//     let blob = new Blob( stream, { type: 'video/webm' } );

//     let file = new File( [blob], `${ user }-${ moment().unix() }-record.webm` );

//     // saveAs( file );
// },

adjustVideoElemSize(isLaptop) {
    
    let elem = document.getElementsByClassName('remote-video-card');
    let totalRemoteVideosDesktop = elem.length;
    let newWidth = totalRemoteVideosDesktop === 1 && !isLaptop ? '100%' : (
        totalRemoteVideosDesktop <= 2 ? '50%' : (
        // eslint-disable-next-line eqeqeq
        totalRemoteVideosDesktop == 3 ? '33.33%' : (
            totalRemoteVideosDesktop <= 8 ? '25%' : (
                totalRemoteVideosDesktop <= 15 ? '20%' : (
                    totalRemoteVideosDesktop <= 18 ? '16%' : (
                        totalRemoteVideosDesktop <= 23 ? '15%' : (
                            totalRemoteVideosDesktop <= 32 ? '12%' : '10%'
                        )
                    )
                )
            )
        )
        )
    );


    for ( let i = 0; i < totalRemoteVideosDesktop; i++ ) {
        elem[i].style.width = newWidth;
    }
},

pictureInPicture(){
    // const myVideo  = document.getElementById('myVideo');
    if ( !document.pictureInPictureElement ) {
        // myVideo.style.visibility = 'hidden'
        document.getElementById( 'myVideo' ).requestPictureInPicture()
            .catch( error => {
                // Video failed to enter Picture-in-Picture mode.
                console.error( error );
            } );
    }
    else {
        document.exitPictureInPicture()
            .catch( error => {
                // Video failed to leave Picture-in-Picture mode.
                console.error( error );
            } ); 
}
}

}
