import React, { useEffect, useState } from "react";
import client from "../../../config/client";
import { GET_HYGRAPH } from "../../../lib/hygraph/queries";

export const DocsContentAll = () => {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await client.request(GET_HYGRAPH);
        setCategorias(data.categorias);
      } catch (error) {
      }
    };

    fetchData();
  }, []);

  return (
    <div className="">
      {categorias.map((categoria) => (
        <div key={categoria.slug}>
          <h2>{categoria.titulo}</h2>
          {categoria.documentos.map((documento) => (
            <div key={documento.slug} id={documento.slug}>
              <h3>{documento.titulo}</h3>
              <div
                dangerouslySetInnerHTML={{ __html: documento.contenido.html }}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};