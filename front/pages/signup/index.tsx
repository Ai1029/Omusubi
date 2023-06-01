import React from 'react';
import { useRouter } from 'next/router';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Logo from '@/components/Logo';
import Dropdown from '@/components/Dropdown';


const SignUp = () => {
    const router = useRouter();
    const handleClick = () => {
        router.push("http://localhost:3000/signup/complete");
 };

 return (
 <div className='text-center items-center'>
    <Logo />
    <div className=' font-medium'>
    <p className='pt-10'>認証に成功しました</p>
    <p className='pb-10'>以下からプロフィール登録をして下さい</p>
    <p className='pb-10'>プロフィール登録</p>
    <Input 
     label="名前"/>
    <Input 
    label="フリガナ"/>
    <Input 
    label="郵便番号"/>
    <p>都道府県</p>
    <Dropdown />
    <Input 
    label="市区町村"/>
    <Input 
    label="町名番地"/>
    <Input 
    label="アパート・マンション名"/>
    <Input 
    label="電話番号"/>
    </div>
    <div className='pt-10 pb-10 flex justify-center'>
    <Button onClick={handleClick} text="登録する" />
    </div>
    </div>
    );
};

export default SignUp;
