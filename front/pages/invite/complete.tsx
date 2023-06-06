import React from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Button from '@/components/Button';

const InviteComplete = () => {
    const router = useRouter();
    const ClickTop = () => {
        console.log('TopページのURL');
        };
    return(
        <div className='text-center items-center'>
            <Layout>

            </Layout>
            <p className='text-lg font-medium pb-5 pt-10'>家族を招待完了</p>
            <p className='pb-10'>家族の招待が完了しました！</p>
            <div className='flex justify-center'>
                <Button onClick={ClickTop} text="TOPページへ" />
            </div>
        </div>
    );
};

export default InviteComplete;