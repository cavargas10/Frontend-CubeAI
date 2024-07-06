import { SeccionOne } from "../Secciones/SeccionOne";
import { SeccionIA } from "../Secciones/SeccionIA";
import { SeccionTextIA } from "../Secciones/SeccionTextIA";

import { SeccionFuncionamiento } from "../Secciones/SeccionFuncionamiento";
import { SeccionFondo } from "../Secciones/SeccionFondo";
import { SeccionCarrusel } from "../Secciones/SeccionCarrusel";
import { SeccionFooter } from "../Secciones/SeccionFooter";

export const Home = () => {
  return (
    <main className="mt-16">
      <div className="w-full px-10">
        <SeccionOne />
        <SeccionIA />
        <SeccionTextIA />
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
