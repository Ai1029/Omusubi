import React from 'react';
import { useRouter } from 'next/router';
import EditButton from '@/components/EditButton';
import Layout from '@/components/Layout';


const Account = () => {
    const router = useRouter();
    const handleClick = () => {
        console.log("編集する")
    }
    return (
        <div className='text-center items-center'>
            <Layout>
                
            </Layout>
            <div className='font-medium'>
                <p className='text-lg pt-10'>にこ</p>
                <p className='pt-10'>
                    名前<EditButton onClick={handleClick}/>
                    </p>
                <p className='pt-10'>住所</p>
                <p className='pt-10'>電話番号</p>
                <p className='pt-10'>利用頻度</p>
            </div>
            
        </div>
    )
}

export default Account;