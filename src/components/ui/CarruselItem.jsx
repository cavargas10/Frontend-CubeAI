import React from "react";
import { motion } from "framer-motion";
import { Star } from "@phosphor-icons/react";

export const CarruselItem = ({ texts, from, to }) => {
  return (
    <div className="flex MyGradient">
      <motion.div
        initial={{ x: `${from}` }}
        animate={{ x: `${to}` }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="flex flex-shrink-0 "
      >
        {texts.map((text, index) => {
          return (
            <div className=" flex items-center justify-center  " key={index}>
              <Star size={40} weight="fill" color="#A975FF" />
              <span className=" py-4 text-5xl bg-gradient-to-r from-azul-gradient to-morado-gradient text-transparent bg-clip-text  font-bold">
                {text}
              </span>
            </div>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ x: `${from}` }}
        animate={{ x: `${to}` }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="flex flex-shrink-0 "
      >
        {texts.map((text, index) => {
          return (
            <div className="  flex items-center justify-center " key={index}>
              <Star size={40} weight="fill" color="#A975FF" />
              <span className="py-4 text-5xl bg-gradient-to-r from-azul-gradient to-morado-gradient text-transparent bg-clip-text  font-inter font-bold">
                {text}
              </span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};