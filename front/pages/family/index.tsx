import React from 'react';
import { useRouter } from 'next/router';
import Logo2 from '@/components/Logo2';
import Button from '@/components/Button';


const Family = () => {
    const router = useRouter();
    const handleClick = () => {
        console.log("ここにPost？");
    }
    return (
        <div className='text-center items-center'>
            <Logo2 />
            <div className='font-medium'>
                <p className='text-lg pt-10'>Mypage</p>
                <p className='pt-10'>家族一覧</p>
            </div>
            <Button onClick={handleClick} text="家族を登録する" />
        </div>
    )
}

export default Family;