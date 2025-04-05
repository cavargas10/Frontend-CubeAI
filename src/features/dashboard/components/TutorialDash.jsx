import React, { useEffect, useState } from "react";
import hygraphClient from "../../../config/client";
import { GET_HYGRAPH } from "../../../lib/hygraph/queries";
import { TutorialCard } from "../../../components/ui/TutorialCard";

export const TutorialDash = ({ isCollapsed }) => {
  const [tutoriales, setTutoriales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutoriales = async () => {
      try {
        setLoading(true);
        const data = await hygraphClient.request(GET_HYGRAPH);
        setTutoriales(data.tutoriales);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchTutoriales();
  }, []);

  return (
    <section
      className={`sm:ml-64 pb-8 pr-5 w-full bg-fondologin transition-all duration-300 ease-in-out ${
        isCollapsed
          ? "sm:ml-[80px] xl:ml-[80px] 2xl:ml-[80px]"
          : "sm:ml-[264px] md:ml-[267px] xl:ml-[250px] 2xl:ml-[300px]"
      }`}
    >
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