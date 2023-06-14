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
        <div className="container mt-10 items-center mx-auto px-8 md:px-14 lg:px-24 w-full">
          <div>
            <h2 className="second-title-ja mr-4">ログアウト</h2>
          </div>
        </div>
        <div className="text-center items-center">
          <div className="pt-10">
            <div className="flex justify-center">
              <button className="bg-blue-500 items-center hover:bg-blue-700 text-white text-lg w-64 h-14 rounded-full flex justify-center mb-10 mt-5" onClick={onSubmitLogout}>
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Logout;
