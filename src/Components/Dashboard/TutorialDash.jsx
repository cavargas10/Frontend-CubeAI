import React, { useEffect, useState } from "react";
import hygraphClient from "../../Config/graphqlClient";
import { GET_HYGRAPH } from "../../Config/queries";
import { TutorialCard } from "../Ui/TutorialCard";

export const TutorialDash = () => {
  const [tutoriales, setTutoriales] = useState([]);

  useEffect(() => {
    const fetchTutoriales = async () => {
      try {
        const data = await hygraphClient.request(GET_HYGRAPH);
        setTutoriales(data.tutoriales);
      } catch (error) {
        console.error("Error fetching tutoriales:", error);
      }
    };
    fetchTutoriales();
  }, []);

  return (
    <>
      <section className="ml-[250px] w-full pr-6  bg-fondologin border-l-2  border-linea">
        <div className=" mt-8  ml-8 flex justify-center ">
          <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-screen-xl">
            {tutoriales.map((tutorial) => (
              <TutorialCard
                key={tutorial.id || tutorial.titulo}
                tutorial={tutorial}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
