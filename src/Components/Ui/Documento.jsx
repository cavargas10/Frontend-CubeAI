import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../../graphqlClient";
import { GET_HYGRAPH } from "../../queries";

const Documento = () => {
  const { slug } = useParams();
  const [documento, setDocumento] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await client.request(GET_HYGRAPH);
        const documentoEncontrado = data.categorias
          .flatMap((categoria) => categoria.documentos)
          .find((doc) => doc.slug === slug);
        setDocumento(documentoEncontrado);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [slug]);

  if (!documento) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="documento">
      <h2 className="font-bold text-xl mb-3">{documento.titulo}</h2>
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: documento.contenido.html }}
      />{" "}
    </div>
  );
};

export default Documento;
