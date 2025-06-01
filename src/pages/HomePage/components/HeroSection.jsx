import logo from "../../../assets/logo.webp";
import { Button } from "../../../components/ui/Button";
import { CaretRight } from "@phosphor-icons/react";

export function HeroSection() {
  return (
    <section className="py-10 md:py-14">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-gradient-to-r from-azul-gradient via-primary to-morado-gradient bg-clip-text text-transparent text-glow">
                Transforma Cualquier Entrada en Objetos 3D Asombrosos
              </h1>
              <p className="max-w-[600px] text-foreground/80 md:text-xl">
                Nuestra plataforma impulsada por IA convierte tus imágenes, descripciones de texto o bocetos en
                impresionantes modelos 3D en segundos.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button
                to="/login"
                className="inline-flex items-center justify-center py-3 px-6 rounded-md bg-gradient-to-r  from-azul-gradient to-morado-gradient text-white text-base font-medium shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 transform hover:scale-105 hover:brightness-110"
              >
                Pruébalo Gratis
                <CaretRight className="ml-2 h-5 w-5 text-white" weight="bold" />
              </Button>
            </div>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-[500px] overflow-hidden rounded-xl bg-secondary/30 lg:order-last">
            <img
              src={logo} 
              alt="Muestra de modelo 3D"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-background/20" />
          </div>
        </div>
      </div>
    </section>
  );
}