import React from 'react';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Logo from '@/components/Logo';

const SignUp = () => {
const handleClick = () => {
 console.log('ボタンがクリックされました！');
 };

 return (
 <div className='text-center items-center'>
    <Logo />
    <p className='pt-10'>認証に成功しました</p>
    <p className='pb-10'>以下からプロフィール登録をして下さい</p>
    <p className='pb-10'>プロフィール登録</p>
    <Input 
     label="名前"/>
    <Input 
    label="フリガナ"/>
    <Input 
    label="郵便番号"/>
    <Input 
    label="都道府県"/>
    <Input 
    label="市区町村"/>
    <Input 
    label="町名番地"/>
    <Input 
    label="アパート・マンション名"/>
    <Input 
    label="電話番号"/>
    <Button onClick={handleClick} text="登録" />
    </div>
    );
};

export default SignUp;
