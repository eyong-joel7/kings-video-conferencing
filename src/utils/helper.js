/* eslint-disable import/no-anonymous-default-export */
export default {

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

toggleShareIcons( share ) {
    let shareIconElem = document.querySelector( '#share-screen' );

    if ( share ) {
        shareIconElem.setAttribute( 'title', 'Stop sharing screen' );
        shareIconElem.children[0].classList.add( 'text-primary' );
        shareIconElem.children[0].classList.remove( 'text-white' );
    }

    else {
        shareIconElem.setAttribute( 'title', 'Share screen' );
        shareIconElem.children[0].classList.add( 'text-white' );
        shareIconElem.children[0].classList.remove( 'text-primary' );
    }
},

maximiseStream( e ) {
    let elem = e.target.parentElement.previousElementSibling;

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

adjustVideoElemSize() {
    let elem = document.getElementsByClassName( 'card' );
    let totalRemoteVideosDesktop = elem.length;
    let newWidth = totalRemoteVideosDesktop <= 2 ? '50%' : (
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
    );


    for ( let i = 0; i < totalRemoteVideosDesktop; i++ ) {
        elem[i].style.width = newWidth;
    }
},


}