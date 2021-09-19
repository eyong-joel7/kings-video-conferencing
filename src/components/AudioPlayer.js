import React from "react";
import WhenWePray from '../media/WHEN-WE-PRAY.mp3'
export const AudioPlayer = () => {
  return (
    <div id="content-container" style = {{height:'0px', visibility:'hidden'}}>
      <audio id="music" loop>
        <source src={WhenWePray} type="audio/mpeg" />
      </audio>
      <button id="play-music-button" className="play"></button>
    </div>
  );
};
