import React, { useEffect, useState } from "react";
import hygraphClient from "../../Config/graphqlClient";
import { GET_HYGRAPH } from "../../Config/queries";
import { TutorialCard } from "../Ui/TutorialCard";

export const Tutoriales = () => {
  const [tutoriales, setTutoriales] = useState([]);

  useEffect(() => {
    const fetchTutoriales = async () => {
      try {
        const data = await hygraphClient.request(GET_HYGRAPH);
        setTutoriales(data.tutoriales);
      } catch (error) {
      }
    };
    fetchTutoriales();
  }, []);

  return (
    <div className="text-center ">
      <div className="pt-20">
        <h2 className="font-bold text-3xl">Tutoriales </h2>
        <div className="flex justify-center mt-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full  px-14 pb-10">
          {tutoriales.map((tutorial) => (
            <TutorialCard
              key={tutorial.id || tutorial.titulo}
              tutorial={tutorial}
            />
          ))}
        </div>
      </div>
    </div>
  );
};