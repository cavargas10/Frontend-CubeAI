import {
  Image,
  TextT,
  PencilSimple,
  ImagesSquare,
  Cube,
} from "@phosphor-icons/react";
import GenerationMethod from "../Ui/GenerationMethod"; // Importar como default

export function SeccionMetodos() {
  return (
    <section id="caracteristicas" className="py-20">
      <div className="container px-4 md:px-6">
        {/* Encabezado */}
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 border border-primary/20 px-3 py-1 text-sm text-primary mb-2">
              Características
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-blue-400 via-primary to-purple-400 bg-clip-text text-transparent text-glow">
              Métodos de Generación
            </h2>
            <p className="max-w-[900px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Nuestra IA puede generar objetos 3D a partir de prácticamente
              cualquier tipo de entrada que proporciones.
            </p>
          </div>
        </div>

        {/* Métodos de generación */}
        <div className="grid gap-8 mt-12">
          {/* Imagen a 3D */}
          <GenerationMethod
            title="Imagen a 3D"
            description="Sube una imagen y nuestra IA generará un modelo 3D detallado basado en ella."
            inputType="Imagen"
            inputImage="/Bot.webp"
            outputImage="/Bot.webm"
            icon={
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-azul-gradient to-morado-gradient opacity-70"></div>
                <div className="relative z-10 rounded-full bg-primary/20 p-3 shadow-inner transition-transform duration-300 hover:scale-125">
                  <Image className="h-5 w-5 text-primary" weight="bold" />
                </div>
              </div>
            }
            index={0}
          />

          {/* Texto a 3D */}
          <GenerationMethod
            title="Texto a 3D"
            description="Describe lo que quieres en lenguaje natural y observa cómo nuestra IA da vida a tus ideas."
            inputType="Texto"
            inputText="Un robot futurista con detalles cibernéticos"
            outputImage="/Bot.webm"
            icon={
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-azul-gradient to-morado-gradient opacity-70"></div>
                <div className="relative z-10 rounded-full bg-primary/20 p-3 shadow-inner transition-transform duration-300 hover:scale-125">
                  <TextT className="h-5 w-5 text-primary" weight="bold" />
                </div>
              </div>
            }
            index={1}
          />

          {/* Único a 3D */}
          <GenerationMethod
            title="Único a 3D"
            description="Método especializado para objetos únicos o complejos que requieren un enfoque personalizado."
            inputType="Entrada personalizada"
            inputImage="/Bot.webp"
            outputImage="/Bot.webm"
            icon={
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-azul-gradient to-morado-gradient opacity-70"></div>
                <div className="relative z-10 rounded-full bg-primary/20 p-3 shadow-inner transition-transform duration-300 hover:scale-125">
                  <Cube className="h-5 w-5 text-primary" weight="bold" />
                </div>
              </div>
            }
            index={2}
          />

          {/* Texto a Imagen a 3D */}
          <GenerationMethod
            title="Texto a Imagen a 3D"
            description="Describe tu idea en texto, conviértela en una imagen y luego genera un modelo 3D."
            inputType="Texto"
            inputText="Un dragón volando sobre una montaña"
            intermediateImage="/Bot.webp"
            outputImage="/Bot.webm"
            icon={
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-azul-gradient to-morado-gradient opacity-70"></div>
                <div className="relative z-10 rounded-full bg-primary/20 p-3 shadow-inner transition-transform duration-300 hover:scale-125">
                  <TextT className="h-5 w-5 text-primary" weight="bold" />
                </div>
              </div>
            }
            index={3}
          />

          {/* Múltiples imágenes a 3D */}
          <GenerationMethod
            title="Múltiples imágenes a 3D"
            description="Proporciona varias imágenes desde diferentes ángulos para crear un modelo 3D más preciso y detallado."
            inputType="Múltiples imágenes"
            inputImages={["/Bot.webp", "/Bot.webp", "/Bot.webp"]}
            outputImage="/Bot.webm"
            icon={
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-azul-gradient to-morado-gradient opacity-70"></div>
                <div className="relative z-10 rounded-full bg-primary/20 p-3 shadow-inner transition-transform duration-300 hover:scale-125">
                  <ImagesSquare className="h-5 w-5 text-primary" weight="bold" />
                </div>
              </div>
            }
            index={4}
          />

          {/* Boceto a 3D */}
          <GenerationMethod
            title="Boceto a 3D"
            description="Dibuja un simple boceto y nuestra IA lo transformará en un objeto 3D completamente realizado."
            inputType="Boceto"
            inputImage="/Bot.webp"
            intermediateImage="/Bot.webp"
            outputImage="/Bot.webm"
            icon={
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-azul-gradient to-morado-gradient opacity-70"></div>
                <div className="relative z-10 rounded-full bg-primary/20 p-3 shadow-inner transition-transform duration-300 hover:scale-125">
                  <PencilSimple className="h-5 w-5 text-primary" weight="bold" />
                </div>
              </div>
            }
            index={5}
          />
        </div>
      </div>
    </section>
  );
}