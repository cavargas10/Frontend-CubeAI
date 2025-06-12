import { CarruselItem } from "../../../components/ui/CarruselItem";
import { useTranslation } from "react-i18next";

export const MarqueeSection = () => {
  const { t } = useTranslation();
  const marqueeItems = t("marquee.items", { returnObjects: true });
  const upperMarquee = marqueeItems;
  const lowerMarquee = marqueeItems;

  return (
    <div className=" overflow-hidden font-inter font-bold my-12 ">
      <CarruselItem texts={upperMarquee} from={0} to={"-100%"} />
      <CarruselItem texts={lowerMarquee} from={"-100%"} to={0} />
    </div>
  );
};