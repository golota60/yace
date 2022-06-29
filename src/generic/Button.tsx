import clsx from "clsx";
import React from "react";

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {}

const Button = ({ className, children, ...props }: ButtonProps) => {
  return (
    <button className={clsx("btn", className)} {...props}>
      {children}
    </button>
  );
};

export default Button;
