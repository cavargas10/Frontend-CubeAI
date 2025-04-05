import React from "react";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

export const CardPlayer = ({ videoId }) => {
  
  return (
    <div className="border-1 border-black rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105">
      <LiteYouTubeEmbed
        id={videoId}/>
    </div>
  );
};