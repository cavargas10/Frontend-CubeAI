import {
  CloudArrowUp,
  Download,
  MagicWand,
  Brain,
} from "@phosphor-icons/react";

export const SeccionFuncionamiento = () => {
  return (
    <div className="text-white font-inter font-bold  mt-20 mb-20">
      <div className=" sm:flex sm:flex-col xl:grid xl:grid-cols-8 gap-10">
        <h3 className="telefono:text-3xl  flex justify-center items-center xl:col-span-5 text-5xl bg-gradient-to-r from-azul-gradient to-morado-gradient text-transparent bg-clip-text  font-inter font-bold">
          Funcionamiento del Generador de Imágenes con Inteligencia Artificial
        </h3>

        <p className="mt-4 2xl:text-2xl xl:col-span-3 xl:text-justify  xl:flex xl:flex-col xl:justify-center  text-lg ">
          Este servicio brinda una plataforma para la creación de modelos 3D
          empleando inteligencia artificial, capaz de convertir textos e
          imágenes en modelos 3D completamente operativos, acorde a tus
          requerimientos específicos.
        </p>
      </div>

      <div className="mt-10 sm:grid-cols-2 sm:grid xl:grid xl:grid-cols-4 xl:mt-20">
        <div className="sm:mt-10 xl:mt-0  col-span-1 border-l-2 border-linea flex  flex-col items-start sm:justify-around xl:justify-between px-6 h-60">
          <Brain size={60} color="#6666ff" className=" " />
          <h1 className="text-2xl 2xl:text-3xl ">IA</h1>
          <p className="2xl:text-lg">
            Deja de perder días modelando y texturizando. El 3D se puede hacer
            en sólo unos minutos utilizando nuestra IA.
          </p>
        </div>

        <div className=" sm:mt-10 xl:mt-0 col-span-1 border-l-2 border-linea flex  flex-col items-start sm:justify-around xl:justify-between px-6 h-60">
          <MagicWand size={60} color="#6666ff" className="" />
          <h1 className="text-2xl 2xl:text-3xl">Amigable</h1>
          <p className="sm:mb-0 xl:mb-6 2xl:text-lg 2xl:mb-0">
            Interfaz sencilla e intuitiva. No es necesario convertirse en un
            experto en modelaje o en avisos.
          </p>
        </div>

        <div className="col-span-1 border-l-2 border-linea flex  flex-col items-start sm:justify-around xl:justify-between px-6 h-60">
          <Download size={60} color="#6666ff" className="" />
          <h1 className="text-2xl 2xl:text-3xl">Descargar</h1>
          <p className="sm:mb-0 xl:mb-6 2xl:text-lg ">
            Exporte su modelo 3D como OBJ, FBX o GLB para usarlo sin problemas
            en otro software.
          </p>
        </div>

        <div className="col-span-1 border-l-2 border-linea flex  flex-col items-start sm:justify-around xl:justify-between px-6 h-60">
          <CloudArrowUp size={60} color="#6666ff" className="" />
          <h1 className="text-2xl 2xl:text-3xl">Guardar</h1>
          <p className="2xl:text-lg">
            Genera el objeto 3D que necesites y guárdalo en nuestra base de
            datos, para que lo puedas utilizar en un futuro
          </p>
        </div>
      </div>
    </div>
  );
};