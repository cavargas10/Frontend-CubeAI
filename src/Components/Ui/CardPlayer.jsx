import React, { useState } from "react";
import YouTube from "react-youtube";

export const CardPlayer = ({ videoId, onLoad }) => {
  const [isReady, setIsReady] = useState(false);

  const opts = {
    height: "200px",
    width: "100%",
    playerVars: {
      autoplay: 0,
    },
  };

  const onReady = (event) => {
    event.target.pauseVideo();
    setIsReady(true);
    onLoad();
  };

  return (
    <div className="border-1 border-black rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105">
      {!isReady && (
        <div className="h-[200px] w-full bg-gray-200 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={onReady}
        className={isReady ? 'block' : 'hidden'}
      />
    </div>
  );
};