import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

export const CardPlayer = ({ videoId }) => {
  const videoTitle = `Tutorial: ${videoId}`;

  return (
    <div className="relative rounded-lg overflow-hidden bg-black border border-transparent">
      {" "}
      <div className="aspect-video w-full">
        <LiteYouTubeEmbed
          id={videoId}
          title={videoTitle}
          thumbnail="maxresdefault"
          poster="maxresdefault"
          webp={true}
          noCookie={true}
        />
      </div>
    </div>
  );
};