import React, { useState } from "react";
import { CardPlayer } from "./CardPlayer";

export const TutorialCard = ({ tutorial }) => {
  const { titulo, subtitulo, tipos, youtubeId } = tutorial;

  const formatTipos = (text) => {
    return text.includes("_") ? text.split("_").join(" a ") : text;
  };

  return (
    <div className="text-left">
      <div className="">
        <CardPlayer videoId={youtubeId}/>
      </div>
      <p className="mt-4 bg-[#292faa] bg-opacity-60 inline-block p-2 rounded-lg uppercase">
        {formatTipos(tipos)}
      </p>
      <h2 className="mt-2 font-bold text-xl">{titulo}</h2>
      <h3 className="mt-2">{subtitulo}</h3>
    </div>
  );
};