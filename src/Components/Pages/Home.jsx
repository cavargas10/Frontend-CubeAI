import { SeccionHero } from "../Secciones/SeccionHero";
import { SeccionLogos } from "../Secciones/SeccionLogos";
import { SeccionMetodos } from "../Secciones/SeccionMetodos";
import { SeccionFuncionamiento } from "../Secciones/SeccionFuncionamiento";
import { SeccionBeneficios } from "../Secciones/SeccionBeneficios";
import { SeccionFondo } from "../Secciones/SeccionFondo";
import { SeccionCarrusel } from "../Secciones/SeccionCarrusel";
import { SeccionFooter } from "../Secciones/SeccionFooter";
import { ParticleBackground }from "../Ui/ParticleBackground";

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