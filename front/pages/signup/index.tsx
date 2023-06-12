import React, { useState } from "react";
import { GetServerSideProps, NextPage } from "next";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { sendEmailVerification } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useRouter } from "next/router";
import { setCookie } from "nookies";
import axios from "axios";
import Navbar from "../../components/Layout";
import Link from "next/link";
import Button from "@/components/Button";

type Inputs = {
  name: string;
  email: string;
  password: string;
};

const SignUp: NextPage = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const ENDPOINT_URL_USER = apiUrl + "users";
  const [authError, setAuthError] = useState(false);
  const router = useRouter();
  const [inputs, setInputs] = useState<Inputs>({
    name: "",
    email: "",
    password: "",
  });

  //   const [emailSent, setEmailSent] = useState(false);

  const onSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    createUserWithEmailAndPassword(auth, inputs.email, inputs.password).then(
      ({ user }: any) => {
        const createUser = {
          name: inputs.name,
          email: inputs.email,
          uid: user.uid,
        };

        // sendEmailVerification(user)
        //   .then(() => {
        //     // メールの送信に成功した場合の処理
        //     setEmailSent(true);
        //     console.log("Email verification sent");
        //   })
        //   .catch((error) => {
        //     // メールの送信に失敗した場合の処理
        //     console.error("Failed to send email verification:", error);
        //   });

        try {
          axios.post(ENDPOINT_URL_USER, createUser).then((res) => {
            const targetId = res.data.id;
            // setCookie(null, "id", targetId, {
            //     maxAge: 1 * 1 * 60 * 60,
            //     pass: "/",
            // });
            // setCookie(null, "signedIn", "true", {
            //     maxAge: 1 * 1 * 60 * 60,
            //     path: "/",
            // })
            router.push("/profile/update");
          });
        } catch (error) {
          console.log(error);
        }
      }
    );
  };
  return (
    <Navbar>
      <div className="text-center items-center">
      <h2 className="font-medium py-10 text-lg">ユーザー登録</h2>
      <form onSubmit={onSignUp}>
        <div className="pb-10">
          <label htmlFor="name">ニックネーム</label><br></br>
          <input
            type="text"
            name="name"
            onChange={(e) =>
              setInputs((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            className='bg-slate-200 w-80 h-7 rounded-lg font-normal'
          />
      </div>
      <div className="pb-10">
        <label htmlFor="email">メールアドレス</label><br></br>
        <input
          type="text"
          name="email"
          onChange={(e) =>
            setInputs((prev) => ({
              ...prev,
              email: e.target.value,
            }))
          }
          className='bg-slate-200 w-80 h-7 rounded-lg font-normal'
        />
        </div>
        <div className="pb-10">
        <label htmlFor="password">パスワード</label><br></br>
        <input
          type="password"
          name="password"
          onChange={(e) =>
            setInputs((prev) => ({
              ...prev,
              password: e.target.value,
            }))
          }
          className='bg-slate-200 w-80 h-7 rounded-lg font-normal'
        />
        </div>
        <div className="button-container inline-block pt-10">
        <Button type="submit" text="ユーザー登録をする" />
        </div>
      </form>
      </div>
    </Navbar>
  );
};

export default SignUp;
