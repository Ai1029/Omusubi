import React from 'react';
import { useRouter } from 'next/router';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Layout from '@/components/Layout';
import Dropdown from '@/components/Dropdown';


const Create = () => {
    const router = useRouter();
    const handleClick = () => {
        console.log("ここにPost？");
 };

 return (
 <div className='text-center items-center'>
    <Layout>
        
    </Layout>
    
    <div className=' font-medium'>
    <p className='pt-10 pb-10 text-lg'>家族を登録</p>
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
    <Button onClick={handleClick} text="家族を登録する" />
    </div>
    </div>
    );
};

export default Create;
