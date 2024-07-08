import React, { useEffect, useState } from "react";
import hygraphClient from "../../Config/graphqlClient";
import { GET_HYGRAPH } from "../../Config/queries";
import { TutorialCard } from "../Ui/TutorialCard";

export const TutorialDash = () => {
  const [tutoriales, setTutoriales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutoriales = async () => {
      try {
        setLoading(true);
        const data = await hygraphClient.request(GET_HYGRAPH);
        setTutoriales(data.tutoriales);
      } catch (error) {
        console.error("Error fetching tutoriales:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTutoriales();
  }, []);

  return (
    <section className="ml-60 pb-8 pr-5 w-full bg-fondologin border-l-2 border-linea">
      <div className="mt-8 ml-8 flex justify-center">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-screen-xl">
            {tutoriales.map((tutorial) => (
              <TutorialCard
                key={tutorial.id || tutorial.titulo}
                tutorial={tutorial}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};