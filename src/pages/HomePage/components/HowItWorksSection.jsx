import { StackSimple, Lightning, Clock } from "@phosphor-icons/react";

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-20 bg-secondary/5">
      <div className="container px-4 md:px-6">
        {/* Encabezado */}
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 border border-primary/20 px-3 py-1 text-sm font-bold text-primary mb-2 bg-azul-gradient">
              Proceso
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter bg-gradient-to-r from-azul-gradient to-morado-gradient bg-clip-text text-transparent">
              Cómo Funciona
            </h2>
            <p className="max-w-[900px] text-white md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Nuestra avanzada IA hace que crear objetos 3D sea simple e
              intuitivo.
            </p>
          </div>
        </div>

        {/* Tarjetas de Pasos */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {/* Paso 1 */}
          <div className="relative flex flex-col items-center space-y-4 rounded-2xl border border-gray-700 backdrop-blur-xl p-6 shadow-lg">
            <div className="absolute top-[-1rem] left-1/2 transform -translate-x-1/2 rounded-full bg-azul-gradient px-3 py-1 text-base font-bold text-white font-heading">
              Paso 1
            </div>
            <div className="rounded-full bg-gradient-to-r from-azul-gradient to-morado-gradient p-6">
              <StackSimple
                className="h-8 w-8 text-white transition-transform duration-300 hover:scale-125"
                weight="bold"
              />
            </div>
            <h3 className="text-xl font-bold font-heading text-white">
              Sube o Crea
            </h3>
            <p className="text-center text-white">
              Sube una imagen, escribe una descripción o dibuja un boceto de lo
              que quieres crear.
            </p>
          </div>

          {/* Paso 2 */}
          <div className="relative flex flex-col items-center space-y-4 rounded-2xl border border-gray-700 backdrop-blur-xl p-6 shadow-lg">
            <div className="absolute top-[-1rem] left-1/2 transform -translate-x-1/2 rounded-full bg-azul-gradient px-3 py-1 text-base font-bold text-white font-heading">
              Paso 2
            </div>
            <div className="rounded-full bg-gradient-to-r from-azul-gradient to-morado-gradient p-6">
              <Lightning
                className="h-8 w-8 text-white transition-transform duration-300 hover:scale-125"
                weight="bold"
              />
            </div>
            <h3 className="text-xl font-bold font-heading text-white">
              Procesamiento IA
            </h3>
            <p className="text-center text-white">
              Nuestra avanzada IA analiza tu entrada y genera un modelo 3D
              detallado en tiempo real.
            </p>
          </div>

          {/* Paso 3 */}
          <div className="relative flex flex-col items-center space-y-4 rounded-2xl border border-gray-700 backdrop-blur-xl p-6 shadow-lg">
            <div className="absolute top-[-1rem] left-1/2 transform -translate-x-1/2 rounded-full bg-azul-gradient px-3 py-1 text-base font-bold text-white font-heading">
              Paso 3
            </div>
            <div className="rounded-full bg-gradient-to-r from-azul-gradient to-morado-gradient p-6">
              <Clock
                className="h-8 w-8 text-white transition-transform duration-300 hover:scale-125"
                weight="bold"
              />
            </div>
            <h3 className="text-xl font-bold font-heading text-white">
              Descarga y Usa
            </h3>
            <p className="text-center text-white">
              Descarga tu modelo 3D en varios formatos para usar en juegos,
              AR/VR, impresión y más.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}