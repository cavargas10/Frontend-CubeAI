import club from "../../Assets/club.png";
import utpl from "../../Assets/utpl.png";
import xrlab from "../../Assets/xrlab.png";

export function SeccionLogos() {
  // Array de logos con sus respectivas importaciones
  const logos = [
    { src: utpl, alt: "UTPL logo" },
    { src: club, alt: "Club logo" },
    { src: xrlab, alt: "XRLab logo" },
  ];

  return (
    <section className="w-full py-14">
      <div className="container px-4 md:px-6">
        {/* Encabezado */}
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
          <div className="inline-block rounded-lg bg-primary/10 border border-primary/20 px-3 py-1 text-sm text-primary mb-2">
            Colaboraciones
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter bg-gradient-to-r from-azul-gradient to-morado-gradient bg-clip-text text-transparent">
            Empresas que confían en nosotros
          </h2>
        </div>

        {/* Logos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {logos.map((logo, index) => (
            <div
              key={index}
              className="relative group flex flex-col items-center justify-center h-40 rounded-xl border border-gray-300 bg-secondary/30 p-6 shadow-lg transition-all duration-300 hover:border-azul-gradient hover:bg-[#3333EA]/10 hover:shadow-[0_0_15px_rgba(51,51,234,0.8)]"
            >
              {/* Fondo con gradiente más claro en hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent group-hover:from-[#3333EA]/10 group-hover:to-[#A975FF]/10 transition-all duration-500"></div>

              {/* Imagen del logo */}
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={logo.src} // Usamos la ruta importada
                  alt={logo.alt}
                  className="max-h-20 w-auto object-contain transition-all duration-500 opacity-90 group-hover:opacity-100 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(51,51,234,0.8)]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}