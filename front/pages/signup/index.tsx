import React, { useState } from "react";
import { NextPage } from "next";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useRouter } from "next/router";
import { setCookie } from "nookies";
import axios from "axios";
import Layout from "@/component/layout";

type Inputs = {
    name: string;
    family_id: number;
    email: string;
    password: string;
}

const ENDPOINT_URL = "http://localhost:8080/users";

const SignUp: NextPage = () => {
    const [authError, setAuthError] = useState(false);
    const router = useRouter();
    const [inputs, setInputs] = useState<Inputs>({
        name: "",
        family_id: 0,
        email: "",
        password: "",
    });
    const onSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        createUserWithEmailAndPassword(auth, inputs.email, inputs.password).then(({user}: any) => {
            const createUser = {
                name: inputs.name,
                email: inputs.email,
                family_id: inputs.family_id,
                uid: user.uid,
            };
    
            try {
                axios.post(ENDPOINT_URL, createUser).then((res) => {
                    const targetId = res.data.id;
                    setCookie(null, "id", targetId, {
                        maxAge: 1 * 1 * 60 * 60,
                        pass: "/",
                    });
                    setCookie(null, "signedIn", "true", {
                        maxAge: 1 * 1 * 60 * 60,
                        path: "/",
                    })
                    router.push("/");
                });
            } catch (error) {
                console.log(error);
            }
        
    });
};
return (
    <Layout>
        <h2>ユーザー登録</h2>
        <form onSubmit={onSignUp}>
            <label htmlFor="name">ニックネーム</label>
            <input
                type="text"
                name="name"
                onChange={(e) =>
                    setInputs((prev) => ({
                        ...prev,
                        name: e.target.value,
                    }))
                }
            />
        
            <label htmlFor="email">メールアドレス</label>
            <input
                type="text"
                name="email"
                onChange={(e) =>
                    setInputs((prev) => ({
                        ...prev,
                        email: e.target.value,
                    }))
                }
            />
            <label htmlFor="password">パスワード</label>
            <input
                type="password"
                name="password"
                onChange={(e) =>
                    setInputs((prev) => ({
                        ...prev,
                        password: e.target.value,
                    }))
                }
            />
            <input type="submit" value="ログイン"　/>
        </form>

    </Layout>

    

    );
};

export default SignUp;
import React from 'react';
import Button from '@/components/Button';
import Input from '@/components/Input';

const SignUp = () => {
const handleClick = () => {
 console.log('ボタンがクリックされました！');
 };

 return (
 <div className='text-center items-center'>
    <img src="/images/logo.png" className='w-100 h-32 m-auto pt-10' alt='ロゴ'></img>
    <p className='pt-10'>認証に成功しました</p>
    <p className='pb-10'>以下からプロフィール登録をして下さい</p>
    <p className='pb-10'>プロフィール登録</p>
    <Input 
     label="名前"/>
    <Input 
    label="フリガナ"/>
    <Input 
    label="郵便番号"/>
    <Input 
    label="都道府県"/>
    <Input 
    label="市区町村"/>
    <Input 
    label="町名番地"/>
    <Input 
    label="アパート・マンション名"/>
    <Input 
    label="電話番号"/>
    <Button onClick={handleClick} text="登録" />
    </div>
    );
};

export default SignUp;
