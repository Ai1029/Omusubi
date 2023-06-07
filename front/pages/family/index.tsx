import React from 'react';
import { useRouter } from 'next/router';
import Button from '@/components/Button';
import Layout from '@/components/Layout';
import Link from "next/link";


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
                <Link href="/create"><Button onClick={handleClick} text="家族を登録する" /></Link>
            </div>
        </div>
    )
}

export default Family;