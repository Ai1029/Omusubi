import React from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { auth } from "@/firebase/firebase";
import { signOut } from "firebase/auth";
import nookies from "nookies";
import Layout from "@/components/Layout";


const Logout: NextPage = () => {
  const router = useRouter();
  const onSubmitLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    signOut(auth)
      .then(() => {
        // Signed out
        nookies.destroy(null, "id");
        nookies.destroy(null, "signedIn");
        router.push("/login");
        // ...
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
