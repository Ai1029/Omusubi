import React, { useState } from "react";
import { NextPage } from "next";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { sendEmailVerification } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useRouter } from "next/router";
import { setCookie } from "nookies";
import axios from "axios";
import Navbar from "../../components/Layout";
import Link from "next/link";


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

const [emailSent, setEmailSent] = useState(false); 

    const onSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        createUserWithEmailAndPassword(auth, inputs.email, inputs.password).then(({user}: any) => {
            const createUser = {
                name: inputs.name,
                email: inputs.email,
                family_id: inputs.family_id,
                uid: user.uid,
            };

            sendEmailVerification(user)
                .then(() => {
                // メールの送信に成功した場合の処理
                setEmailSent(true);
                console.log("Email verification sent");
            })
                .catch((error) => {
                // メールの送信に失敗した場合の処理
            console.error("Failed to send email verification:", error);
            });
            
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
    <Navbar>
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
            <Link href="/complete"><input type="submit" value="ユーザー登録をする"　/></Link>
        </form>
        

    </Navbar>
    );
};

export default SignUp;