import React, { useEffect, useState } from "react";
import client from "../../Config/graphqlClient";
import { GET_HYGRAPH } from "../../Config/queries";
import { Link, useLocation } from "react-router-dom";
import { Queue } from "@phosphor-icons/react";

const Documentacion = () => {
  const [categorias, setCategorias] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await client.request(GET_HYGRAPH);
        setCategorias(data.categorias);
      } catch (error) {}
    };

    fetchData();
  }, []);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuButtonActive, setIsMenuButtonActive] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsMenuButtonActive(!isMenuButtonActive);
  };

  return (
    <div className="relative mb-4">
      <button
        className={`block relative mr-4 sm:hidden ${isMenuButtonActive ? "outline outline-linea rounded-lg bg-gray-700" : ""}`}
        onClick={toggleMenu}
      >
        <Queue size={32} color="#ffffff" />
      </button>

      {isMenuOpen && (
        <ul className="mt-4  sm:hidden top-12 left-0 bg-fondologin z-50 sm:w-[357px] border border-linea rounded-lg shadow-lg ">
          {categorias.map((categoria) => (
            <li key={categoria.slug} className="ml-3">
              <span className="sidebar-title font-bold">
                {categoria.titulo}
              </span>
              <ul className="border-l-2 border-slate-500 text-slate-400">
                {categoria.documentos.map((documento) => {
                  const isActive =
                    location.pathname ===
                    `/documentos/documento/${documento.slug}`;
                  return (
                    <li key={documento.slug} className="my-3">
                      <Link
                        className={`block border-l pl-4 -ml-px border-transparent hover:border-slate-100 ${isActive ? "text-white font-semibold border-white" : ""}`}
                        to={`/documentos/documento/${documento.slug}`}
                        onClick={toggleMenu}
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
      )}

      <div className="hidden sm:block  sm:mt-10  ">
        {categorias.map((categoria) => (
          <div key={categoria.slug} className="ml-0">
            <span className="sidebar-title font-bold">{categoria.titulo}</span>
            <ul className="border-l-2 border-slate-500 text-slate-400">
              {categoria.documentos.map((documento) => {
                const isActive =
                  location.pathname ===
                  `/documentos/documento/${documento.slug}`;
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default Documentacion;