import React, { FC, MouseEvent } from 'react';

interface ButtonProps {
 onClick: (event: MouseEvent<HTMLButtonElement>) => void;
 text: string;
}

const Button: FC<ButtonProps> = ({ onClick, text }) => {
 return (
 <div className='bg-sky-400 text-white text-lg w-64 h-14 rounded-full flex justify-center'>
 <button onClick={onClick}>{text}</button>
 </div>
 );
};

export default Button;
