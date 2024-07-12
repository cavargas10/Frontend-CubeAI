import { SeccionOne } from "../Secciones/SeccionOne";
import { SeccionIA } from "../Secciones/SeccionIA";

import { SeccionFuncionamiento } from "../Secciones/SeccionFuncionamiento";
import { SeccionFondo } from "../Secciones/SeccionFondo";
import { SeccionCarrusel } from "../Secciones/SeccionCarrusel";
import { SeccionFooter } from "../Secciones/SeccionFooter";

export const Home = () => {
  return (
    <main className="pt-24">
      <div className="w-full px-12 2xl:px-44">
        <SeccionOne />
        <SeccionIA />
        <SeccionCarrusel />
        <SeccionFuncionamiento />
      </div>

      <SeccionFondo />
      <div className="px-10">
        <SeccionFooter />
      </div>
    </main>
  );
};