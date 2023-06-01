import React, { FC, MouseEvent } from 'react';

interface ButtonProps {
 onClick: (event: MouseEvent<HTMLButtonElement>) => void;
 text: string;
}

const Button: FC<ButtonProps> = ({ onClick, text }) => {
 return (
 <div className='bg-sky-400 text-white w-32 rounded-2xl '>
 <button onClick={onClick}>{text}</button>
 </div>
 );
};

export default Button;
