import { SeccionOne } from "../Secciones/SeccionOne";
import { SeccionIA } from "../Secciones/SeccionIA";
import { SeccionTextIA } from "../Secciones/SeccionTextIA";

import { SeccionFuncionamiento } from "../Secciones/SeccionFuncionamiento";
import { SeccionFondo } from "../Secciones/SeccionFondo";
import { SeccionCarrusel } from "../Secciones/SeccionCarrusel";
import { SeccionFooter } from "../Secciones/SeccionFooter";

export const Home = () => {
  return (
    <main className="pt-24">
      <div className="w-full px-12">
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