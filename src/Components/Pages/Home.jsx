import { SeccionHero } from "../secciones/SeccionHero";
import { SeccionLogos } from "../secciones/SeccionLogos";
import { SeccionMetodos } from "../secciones/SeccionMetodos";
import { SeccionFuncionamiento } from "../secciones/SeccionFuncionamiento";
import { SeccionBeneficios } from "../secciones/SeccionBeneficios";
import { SeccionFondo } from "../secciones/SeccionFondo";
import { SeccionCarrusel } from "../secciones/SeccionCarrusel";
import { SeccionFooter } from "../secciones/SeccionFooter";
import { ParticleBackground }from "../ui/ParticleBackground";

export const Home = () => {
  return (
    <main className="pt-24 relative">
      {/* Agrega el fondo de partículas */}
      <ParticleBackground />

      {/* Contenido principal */}
      <div className="w-full px-10 2xl:px-44 relative z-10">
        <SeccionHero />
        <SeccionLogos />
        <SeccionMetodos />
        <SeccionCarrusel />
        <SeccionFuncionamiento />
        <SeccionBeneficios />
      </div>

      <SeccionFondo />
      <div className="px-10 relative z-10">
        <SeccionFooter />
      </div>
    </main>
  );
};