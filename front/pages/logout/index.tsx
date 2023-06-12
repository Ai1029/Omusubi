import React from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import axios from "axios";
import { auth } from "@/firebase/firebase";
import { signOut } from "firebase/auth";
import { parseCookies, setCookie, destroyCookie } from "nookies";
import Layout from "@/components/Layout";

const Logout: NextPage = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const ENDPOINT_URL = apiUrl + "logout";
  const router = useRouter();
  const onSubmitLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    signOut(auth)
      .then(() => {
        axios
          .get(ENDPOINT_URL, { withCredentials: true })
          .then(() => {
            router.push("/login");
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };
  return (
    <>
      <Layout>
        <div className="content-inner u-t-center">
          <p>ログアウト</p>
          <form onSubmit={onSubmitLogout}>
            <input type="submit" value="ログアウト" />
          </form>
        </div>
      </Layout>
    </>
  );
};

export default Logout;
