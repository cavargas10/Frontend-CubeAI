import {
  Image,
  TextT,
  PencilSimple,
  ImagesSquare,
  Cube,
} from "@phosphor-icons/react";
import {GenerationMethod} from "./GenerationMethod"; 

export function MethodsSection() {
  return (
    <section id="caracteristicas" className="py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 border border-primary/20 px-3 py-1 text-sm text-primary mb-2 bg-azul-gradient">
              Características
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-azul-gradient to-morado-gradient bg-clip-text text-transparent text-glow">
              Métodos de Generación
            </h2>
            <p className="max-w-[900px] text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Nuestra IA puede generar objetos 3D a partir de prácticamente
              cualquier tipo de entrada que proporciones.
            </p>
          </div>
        </div>

        <div className="grid gap-8 mt-12">
          <GenerationMethod
            title="Imagen a 3D"
            description="Sube una imagen y nuestra IA generará un modelo 3D detallado basado en ella."
            inputType="Imagen"
            inputImage="/Bot.webp"
            outputImage="/Bot.webm"
            icon={<Image className="h-5 w-5 text-primary" weight="bold" />} 
            index={0}
          />

          <GenerationMethod
            title="Texto a 3D"
            description="Describe lo que quieres en lenguaje natural y observa cómo nuestra IA da vida a tus ideas."
            inputType="Texto"
            inputText="Un robot futurista con detalles cibernéticos"
            outputImage="/Bot.webm"
            icon={<TextT className="h-5 w-5 text-primary" weight="bold" />} 
            index={1}
          />

          <GenerationMethod
            title="Único a 3D"
            description="Método especializado para objetos únicos o complejos que requieren un enfoque personalizado."
            inputType="Entrada personalizada"
            inputImage="/Bot.webp"
            outputImage="/Bot.webm"
            icon={<Cube className="h-5 w-5 text-primary" weight="bold" />} 
            index={2}
          />

          <GenerationMethod
            title="Texto a Imagen a 3D"
            description="Describe tu idea en texto, conviértela en una imagen y luego genera un modelo 3D."
            inputType="Texto"
            inputText="Un dragón volando sobre una montaña"
            intermediateImage="/Bot.webp"
            outputImage="/Bot.webm"
            icon={<TextT className="h-5 w-5 text-primary" weight="bold" />} 
            index={3}
          />

          <GenerationMethod
            title="Múltiples imágenes a 3D"
            description="Proporciona varias imágenes desde diferentes ángulos para crear un modelo 3D más preciso y detallado."
            inputType="Múltiples imágenes"
            inputImages={["/Bot.webp", "/Bot.webp", "/Bot.webp"]}
            outputImage="/Bot.webm"
            icon={<ImagesSquare className="h-5 w-5 text-primary" weight="bold" />} 
            index={4}
          />

          <GenerationMethod
            title="Boceto a 3D"
            description="Dibuja un simple boceto y nuestra IA lo transformará en un objeto 3D completamente realizado."
            inputType="Boceto"
            inputImage="/Bot.webp"
            intermediateImage="/Bot.webp"
            outputImage="/Bot.webm"
            icon={<PencilSimple className="h-5 w-5 text-primary" weight="bold" />} 
            index={5}
          />
        </div>
      </div>
    </section>
  );
}