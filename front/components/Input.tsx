import React, { useState } from 'react';

interface InputProps {
 label: string;
 }

function Input({ label }: InputProps) {
 const [value, setValue] = useState('');

 const handleChange = (event : React.ChangeEvent<HTMLInputElement>) => {
 setValue(event.target.value);
 };

 return (
 <div className='pb-5'>
    <form>
        <label>{label}</label><br></br>
        <input
        type="text"
        value=""
        onChange={handleChange}
        className='bg-slate-200 w-80 h-7 rounded-lg font-normal'
        />
    </form>
 </div>
 );
}

export default Input;
