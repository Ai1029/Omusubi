import React from 'react';
import { useRouter } from 'next/router';
import Button from '@/components/Button';
import Layout from '@/components/Layout';


const Family = () => {
    const router = useRouter();
    const handleClick = () => {
        router.push("http://localhost:3000/family/create")
    }
    return (
        <div className='text-center items-center'>
            <Layout>
                
            </Layout>
            <div className='font-medium'>
                <p className='text-lg pt-10'>Mypage</p>
                <p className='pt-10'>家族一覧</p>
            </div>
            <div className='pt-10 flex justify-center'>
                <Button onClick={handleClick} text="家族を登録する" />
            </div>
        </div>
    )
}

export default Family;