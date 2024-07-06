import React, { useEffect, useState } from "react";
import client from "../../Config/graphqlClient";
import { GET_HYGRAPH } from "../../Config/queries";
import { Link, useLocation } from "react-router-dom";

const Documentacion = () => {
  const [categorias, setCategorias] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await client.request(GET_HYGRAPH);
        setCategorias(data.categorias);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <ul className=" mt-4  ">
      {categorias.map((categoria) => (
        <li key={categoria.slug} className="ml-3">
          <span className="sidebar-title font-bold">{categoria.titulo}</span>
          <ul className="border-l border-slate-500 text-slate-400">
            {categoria.documentos.map((documento) => {
              const isActive =
                location.pathname === `/documentos/documento/${documento.slug}`;
              return (
                <li key={documento.slug} className="my-3">
                  <Link
                    className={`block border-l pl-4 -ml-px border-transparent hover:border-slate-100 ${isActive ? "text-white font-semibold border-white" : ""}`}
                    to={`/documentos/documento/${documento.slug}`}
                  >
                    {documento.titulo}
                  </Link>
                </li>
              );
            })}
          </ul>
        </li>
      ))}
    </ul>
  );
};

export default Documentacion;
