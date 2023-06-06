import React from 'react';
import { useRouter } from 'next/router';
import Button from '@/components/Button';
import Layout from '@/components/Layout';
import Input from '@/components/Input';


const Invite = () => {
    const router = useRouter();
    const handleClick = () => {
        console.log("編集する")
    }
    return (
        <div className='text-center items-center'>
            <Layout>
                
            </Layout>
            <div className='font-medium'>
                <p className='text-lg pt-10 pb-20'>家族を招待</p>
                <Input 
                label="招待する家族のemail"/>
                <div className='flex justify-center pt-10'>
                    <Button 
                        onClick={handleClick} 
                        text="家族を招待する"></Button>
                </div>
            </div>
            
        </div>
    )
}

export default Invite;