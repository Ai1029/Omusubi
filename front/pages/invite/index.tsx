import React from 'react';
import { useRouter } from 'next/router';
import Button from '@/components/Button';
import Layout from '@/components/Layout';


const Invite = () => {
    const router = useRouter();
    const handleClick = () => {
        console.log("編集する")
    }
    return (
            <Layout>
        <div className='text-center items-center'>
                
            <div className='font-medium'>
                <p className='text-lg pt-10 pb-20'>家族を招待</p>
            </div>
            
        </div>
            </Layout>
    )
}

export default Invite;