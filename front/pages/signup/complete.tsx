import React from 'react';
import Logo from '@/components/Logo';
import Button from '@/components/Button';

const Complete = () => {
    const handleClick = () => {
        console.log('ボタンがクリックされました！');
        };
    return(
        <div className='text-center items-center'>
            <Logo />
            <p className='text-lg font-medium pb-5 pt-10'>プロフィールの登録完了</p>
            <p className='pb-10'>プロフィールの登録が完了しました！</p>
            <div className='flex justify-center'>
                <Button onClick={handleClick} text="TOPページへ" />
            </div>
            <p className='pt-20 pb-10'>引き続き、家族を登録しましょう</p>
            <div className='flex justify-center'>
                <Button onClick={handleClick} text="家族を登録" />
            </div>
        </div>
    );
};

export default Complete;