import React, { FC, MouseEvent, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

const Button: FC<ButtonProps> = ({ text, ...props }) => {
  return (
    <div className="bg-blue-500 hover:bg-blue-700 text-white text-lg w-64 h-14 rounded-full flex justify-center">
      <button {...props}>{text} </button>
    </div>
  );
};

export default Button;
