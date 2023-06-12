import React, { useState } from "react";
import { GetServerSideProps, NextPage } from "next";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useRouter } from "next/router";
import { setCookie } from "nookies";
import axios from "axios";
import Navbar from "../../components/Layout";
import Link from "next/link";
import Button from "@/components/Button";

type Inputs = {
  email: string;
  password: string;
};

type Props = {
  apiURL: string;
};

const LoginPage: NextPage<Props> = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const ENDPOINT_URL = apiUrl + "login";
  const ENDPOINT_URL_SESSION = apiUrl + "check-session";
  const [authError, setAuthError] = useState(false);
  const [dbError, setDbError] = useState(false);
  const router = useRouter();
  const [inputs, setInputs] = useState<Inputs>({ email: "", password: "" });
  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(ENDPOINT_URL)
    signInWithEmailAndPassword(auth, inputs.email, inputs.password)
      .then(({ user }: any) => {
        user.getIdToken().then((idToken: any) => {
          console.log(user);
          const config = {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          };
          axios.post(ENDPOINT_URL, idToken, { withCredentials: true, ...config }).then((res) => {
            console.log("エンドポイント", ENDPOINT_URL);
            if (res.data === false) {
              setDbError(true);
            } else {
              console.log(res.data);
              const targetId = res.data.id;
              // setCookie(null, "id", targetId, {
              //   maxAge: 1 * 1 * 60 * 60,
              //   path: "/",
              // });
              // setCookie(null, "signedIn", "true", {
              //   maxAge: 1 * 1 * 60 * 60,
              //   path: "/",
              // });
              router.push("/");
              axios
                .get(ENDPOINT_URL_SESSION, {
                  withCredentials: true,
                })
                .then((res) => {
                  if (res.data) {
                    console.log("セットできた");
                  }
                });
            }
          });
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === "auth/user-not-found") {
          router.push("/signup");
        } else {
          setAuthError(true);
        }
      });
  };
  return (
    <Navbar>
      <div className="text-center items-center">
        <h2 className="pt-10 font-medium text-lg">ログインページ</h2>
        {authError && <p>メールアドレスとパスワードを確認してください</p>}
        {dbError && <p>登録されていないユーザーです</p>}
        <form onSubmit={onLogin}>
        <div className="py-10">
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
        <div>
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
        <div className="pt-20 button-container inline-block ">
          <Button type="submit" text="ログイン" />
        </div>
      </form>
      <h2 className="pt-20 pb-10">アカウント作成はこちら</h2>
      <div className="button-container inline-block">
      <Link href="/signup">
        <div>
          <Button type="submit" text="ユーザー登録をする"/>
        </div>
      </Link>
      </div>
      </div>
    </Navbar>
  );
};

export default LoginPage;
