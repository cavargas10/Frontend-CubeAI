import logo from "../../../assets/logo.webp";
import { Button } from "../../../components/ui/Button";
import { CaretRight } from "@phosphor-icons/react";

export const FooterSection = () => {
  return (
    <footer className="text-white py-12 px-4 sm:px-8 bg-gradient-to-b from-background via-secondary/30 to-primary/10">
      {/* Fondo con Partículas */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-primary/10 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* Contenedor Principal */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 relative z-10">
        {/* Logo Section */}
        <div className="sm:col-span-1 flex flex-col items-center justify-center sm:border-r-2 border-opacity-20 border-gray-300">
          <img
            src={logo}
            alt="Logo"
            className="w-40 h-auto object-contain transition-all duration-300 transform hover:scale-110"
          />
        </div>

        {/* Content Section */}
        <div className="sm:col-span-2 flex flex-col justify-center">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-6 sm:space-y-0 sm:space-x-12">
            {/* Texto Descriptivo */}
            <div className="text-center sm:text-left max-w-md">
              <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-azul-gradient via-primary to-morado-gradient animate-text-glow">
                COMIENZA TU AVENTURA
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Empieza a generar objetos 3D únicos gracias al texto o imagen
                que proporciones como entrada.
              </p>
            </div>

            {/* Botón */}
            <div className="flex items-center justify-center">
              <Button
                to="/login"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-azul-gradient via-primary to-morado-gradient rounded-md shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 transform hover:scale-105 hover:brightness-110"
              >
                Comenzar
                <CaretRight className="ml-2 h-5 w-5 text-white" weight="bold" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="text-center text-gray-400 mt-12 pt-6 border-t border-opacity-10 border-gray-300">
        <p className="text-sm">
          Copyright © Instant3D 2024. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};