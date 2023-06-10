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

type Props = {
  apiURL: string;
};

const SignUp: NextPage = () => {
  const ENDPOINT_URL_USER = API_URL + "users";
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
        <input type="submit" value="ユーザー登録をする" />
      </form>
    </Navbar>
  );
};

export default SignUp;

export const getServerSideProps: GetServerSideProps = async () => {
  const apiURL = process.env.API_URL;
  return {
    props: {
      apiURL: apiURL,
    },
  };
};
