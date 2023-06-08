import React from 'react';
import { useRouter } from 'next/router';
import EditButton from '@/components/EditButton';
import Layout from '@/components/Layout';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { data } from 'autoprefixer';


const detail = {
    name : "山田花子",
    address : "〒100-1234 東京都渋谷区渋谷1-2-3",
    phonenumber : "03-1234-1234",
    frequency : "週に1回"
}

const Account = () => {
    const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get("/api/users")
      .then(response => response.data)
      .then(data => setMessage(data.message))
      .catch(error => console.error(error));
  }, []);

    const router = useRouter();
    const handleClick = () => {
        console.log("編集する")
    }
    return (
        <div>
            <Layout>
                
            </Layout>
            <div className='pt-10'>
                <p className='text-2xl font-medium pb-10 pt-10 text-center'>にこ</p>
            </div>
            <div className='pb-10 px-[150px] font-lg'>
                <div className='pt-10 pb-5 font-bold text-xl'>名前</div>
                    <p>{detail.name}<EditButton onClick={handleClick}/></p>
                <div className='pt-10 pb-5 font-bold text-xl'>住所</div>
                    <p>{detail.address}<EditButton onClick={handleClick}/></p>
                <div className='pt-10 pb-5 font-bold text-xl'>電話番号</div>
                    <p>{detail.phonenumber}<EditButton onClick={handleClick}/></p>
                <div className='pt-10 pb-5 font-bold text-xl'>利用頻度</div>                    <p>{detail.frequency}<EditButton onClick={handleClick}/></p>
            </div>
        </div>
    )
}

export default Account;