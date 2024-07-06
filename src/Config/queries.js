import { gql } from "graphql-request";

export const GET_HYGRAPH = gql`
  query MyQuery {
    categorias {
      titulo
      slug
      documentos {
        titulo
        slug
        contenido {
          html
        }
      }
    }

    tutoriales {
      titulo
      subtitulo
      tipos
      youtubeId
    }
  }
`;
