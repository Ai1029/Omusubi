import React from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import { auth } from "@/firebase/firebase";
import { signOut } from "firebase/auth";
import Layout from "@/components/Layout";

const Logout: NextPage = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const ENDPOINT_URL = apiUrl + "logout";
  const router = useRouter();
  const onSubmitLogout = async (e: React.FormEvent) => {
    signOut(auth)
      .then(() => {
        axios
          .get(ENDPOINT_URL, { withCredentials: true })
          .then(() => {
            localStorage.removeItem("cart-items");
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
        <div className="text-center items-center">
          <h2 className="pt-10 font-medium text-lg">ログアウト</h2>
          <div className="pt-10">
            <button className="px-6 py-3 text-sm font-medium text-center my-5 text-blue-500 hover:text-blue-700 transition duration-500 ease-in-out transform border-2 border-blue-500 hover:border-blue-700 rounded-md" onClick={onSubmitLogout}>
              ログアウト
            </button>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Logout;
