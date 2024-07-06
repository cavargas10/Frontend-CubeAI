import React from "react";
import YouTube from "react-youtube";

export const CardPlayer = ({ videoId }) => {
  const opts = {
    height: "200px",
    width: "100%",

    playerVars: {
      autoplay: 0,
    },
  };

  const onReady = (event) => {
    event.target.pauseVideo();
  };

  return (
    <div className="border-1 border-black rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 ">
      <YouTube videoId={videoId} opts={opts} onReady={onReady} />
    </div>
  );
};
