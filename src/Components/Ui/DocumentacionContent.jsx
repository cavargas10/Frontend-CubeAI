import React, { useEffect, useState } from "react";
import client from "../../graphqlClient";
import { GET_HYGRAPH } from "../../queries";

const DocumentacionContent = () => {
  const [categorias, setCategorias] = useState([]);

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
    <div>
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

export default DocumentacionContent;
