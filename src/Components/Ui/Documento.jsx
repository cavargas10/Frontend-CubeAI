import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../../config/client";
import { GET_HYGRAPH } from "../../lib/hygraph/queries";

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
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [slug]);

  useEffect(() => {
    if (documento) {
      const images = document.querySelectorAll(".documento img");
      images.forEach((img) => {
        img.setAttribute("loading", "lazy");
        img.setAttribute(
          "alt",
          img.getAttribute("alt") || "Descripción de imagen"
        );
        img.setAttribute("rel", "preload");
      });
    }
  }, [documento]);

  if (!documento) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="documento">
      <h2 className="font-bold text-2xl">{documento.titulo}</h2>
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: documento.contenido.html }}
      />
    </div>
  );
};

export default Documento;