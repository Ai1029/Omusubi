import { NextPage } from "next";
import React from "react";
import Link from "next/link";
import Layout from "@/components/Layout";

const ProfileUpdateComplete: NextPage = () => {
  return (
    <Layout>
      <div className="container mt-10 items-center mx-auto px-8 md:px-14 lg:px-24 w-full">
        <div>
          <h2 className="second-title-ja mr-4 mb-5">修正完了</h2>
          <p className="text-sm mb-5">プロフィールの修正が完了しました</p>
        </div>
        <div className="pt-10">
          <div className="text-center mb-10">
            <div className="flex justify-center">
              <Link href="/" className="bg-blue-500 hover:bg-blue-700 text-white text-lg w-64 h-14 rounded-full flex justify-center items-center">
                TOPページ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfileUpdateComplete;
