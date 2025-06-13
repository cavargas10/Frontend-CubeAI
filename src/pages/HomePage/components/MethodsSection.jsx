import {
  Image,
  TextT,
  PencilSimple,
  ImagesSquare,
  Cube,
} from "@phosphor-icons/react";
import { GenerationMethod } from "./GenerationMethod";
import { useTranslation } from "react-i18next";

export function MethodsSection() {
  const { t } = useTranslation();
  const methodsT = t("methods", { returnObjects: true });

  return (
    <section id="caracteristicas" className="py-20 bg-transparent">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary/10 border border-primary/20 px-3 py-1 text-sm text-primary mb-2 bg-azul-gradient">
              {methodsT.badge}
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-azul-gradient to-morado-gradient bg-clip-text text-transparent text-glow">
              {methodsT.title}
            </h2>
            <p className="max-w-[900px] text-slate-600 dark:text-foreground/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {methodsT.subtitle}
            </p>
          </div>
        </div>

        <div className="grid gap-8 mt-12">
          <GenerationMethod
            title={methodsT.image_to_3d.title}
            description={methodsT.image_to_3d.description}
            inputType={methodsT.image_to_3d.input_type}
            outputLabel={methodsT.output_label}
            inputImage="/Bot.webp"
            outputImage="/Bot.webm"
            icon={<Image className="h-5 w-5 text-primary" weight="bold" />} 
            index={0}
          />

          <GenerationMethod
            title={methodsT.text_to_3d.title}
            description={methodsT.text_to_3d.description}
            inputType={methodsT.text_to_3d.input_type}
            inputText={methodsT.text_to_3d.input_text}
            outputLabel={methodsT.output_label}
            outputImage="/Bot.webm"
            icon={<TextT className="h-5 w-5 text-primary" weight="bold" />} 
            index={1}
          />

          <GenerationMethod
            title={methodsT.unique_to_3d.title}
            description={methodsT.unique_to_3d.description}
            inputType={methodsT.unique_to_3d.input_type}
            outputLabel={methodsT.output_label}
            inputImage="/Bot.webp"
            outputImage="/Bot.webm"
            icon={<Cube className="h-5 w-5 text-primary" weight="bold" />} 
            index={2}
          />

          <GenerationMethod
            title={methodsT.text_to_image_to_3d.title}
            description={methodsT.text_to_image_to_3d.description}
            inputType={methodsT.text_to_image_to_3d.input_type}
            inputText={methodsT.text_to_image_to_3d.input_text}
            intermediateLabel={methodsT.text_to_image_to_3d.intermediate_label}
            outputLabel={methodsT.output_label}
            intermediateImage="/Bot.webp"
            outputImage="/Bot.webm"
            icon={<TextT className="h-5 w-5 text-primary" weight="bold" />} 
            index={3}
          />

          <GenerationMethod
            title={methodsT.multi_image_to_3d.title}
            description={methodsT.multi_image_to_3d.description}
            inputType={methodsT.multi_image_to_3d.input_type}
            views={methodsT.multi_image_to_3d.views}
            outputLabel={methodsT.output_label}
            inputImages={["/Bot.webp", "/Bot.webp", "/Bot.webp"]}
            outputImage="/Bot.webm"
            icon={<ImagesSquare className="h-5 w-5 text-primary" weight="bold" />} 
            index={4}
          />

          <GenerationMethod
            title={methodsT.sketch_to_3d.title}
            description={methodsT.sketch_to_3d.description}
            inputType={methodsT.sketch_to_3d.input_type}
            intermediateLabel={methodsT.text_to_image_to_3d.intermediate_label}
            outputLabel={methodsT.output_label}
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