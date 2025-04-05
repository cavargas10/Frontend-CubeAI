import { Link } from "react-router-dom";

export const Button = ({ children, to, ...props }) => {
  return (
    <Link
      to={to}
      className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      {...props}
    >
      {children}
    </Link>
  );
};