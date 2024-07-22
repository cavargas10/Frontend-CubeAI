import {
  CloudArrowUp,
  Download,
  MagicWand,
  Brain,
  PaintBrush,
} from "@phosphor-icons/react";

export const SeccionFuncionamiento = () => {
  return (
    <div className="text-white font-inter font-bold mt-15 mb-20">
      <div className="sm:flex sm:flex-col xl:grid xl:grid-cols-8 gap-10">
        <h3 className="telefono:text-3xl flex justify-center items-center xl:col-span-5 text-5xl bg-gradient-to-r from-azul-gradient to-morado-gradient text-transparent bg-clip-text font-inter font-bold">
          Funcionamiento del Generador de Imágenes con Inteligencia Artificial
        </h3>

        <p className="mt-4 2xl:text-2xl xl:col-span-3 xl:text-justify xl:flex xl:flex-col xl:justify-center text-lg">
          Este servicio brinda una plataforma para la creación de modelos 3D
          empleando inteligencia artificial, capaz de convertir textos e
          imágenes en modelos 3D completamente operativos, acorde a tus
          requerimientos específicos.
        </p>
      </div>

      <div className="mt-10 sm:grid sm:grid-cols-2 xl:grid xl:grid-cols-5 xl:mt-20 gap-6">
        {[
          {
            icon: <Brain size={60} color="#6666ff" />,
            title: "IA",
            description: "Deja de perder días modelando. El 3D se puede hacer en sólo unos minutos utilizando nuestra IA."
          },
          {
            icon: <MagicWand size={60} color="#6666ff" />,
            title: "Amigable",
            description: "Interfaz sencilla e intuitiva. No es necesario convertirse en un experto en modelaje o en avisos."
          },
          {
            icon: <Download size={60} color="#6666ff" />,
            title: "Descargar",
            description: "Exporte su modelo 3D como un archivo OBJ o GLB para usarlo sin problemas donde quieras."
          },
          {
            icon: <CloudArrowUp size={60} color="#6666ff" />,
            title: "Guardar",
            description: "Genera el objeto 3D que necesites y guárdalo en nuestra base de datos, para que lo puedas utilizar en un futuro"
          },
          {
            icon: <PaintBrush size={60} color="#6666ff" />,
            title: "Estilos",
            description: "Elige entre varios estilos como: Anime, Pixar, Disney, Realista, Chibi para personalizar tus creaciones 3D."
          }
        ].map((item, index) => (
          <div key={index} className="sm:mt-10 xl:mt-0 col-span-1 border-l-2 border-linea flex flex-col items-start justify-between px-6 h-full py-6">
            <div>
              {item.icon}
              <h1 className="text-2xl 2xl:text-3xl mt-4">{item.title}</h1>
            </div>
            <p className="2xl:text-lg mt-4">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};