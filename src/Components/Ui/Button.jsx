import { Link } from "react-router-dom";
export const Button = () => {
  return (
    <Link
      to="/login"
      className="font-bold text-lg bg-gradient-to-r  from-azul-gradient to-morado-gradient py-2 px-6 rounded-lg"
    >
      Descubrelo
    </Link>
  );
};
