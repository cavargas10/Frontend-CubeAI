import { gql } from "graphql-request";

export const GET_HYGRAPH = gql`
  query MyQuery($locales: [Locale!]!) {
    categorias(locales: $locales) {
      titulo
      slug
      documentos(locales: $locales) {
        titulo
        slug
        contenido {
          html
        }
      }
    }

    tutoriales(locales: $locales) {
      titulo
      subtitulo
      tipos
      youtubeId
    }
  }
`;