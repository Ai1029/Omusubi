import React from "react";
import { NextPage } from "next";
import { useRecoilValue } from "recoil";
import { familyState, isLoggedInState } from "@/state/atom";
import Layout from "@/components/Layout";
import Link from "next/link";

const Mypage: NextPage = () => {
  const family = useRecoilValue(familyState);
  const isLogined = useRecoilValue(isLoggedInState);
  // isLoginedはログインしている時にtrue
  // 未ログイン時に表示を変える場合は、このフラグを使用する
  return (
    <Layout>
      <div className="container mt-10 items-center mx-auto px-8 md:px-14 lg:px-24 w-full">
        <div>
          <h2 className="second-title-ja mr-4 mb-10">マイページ</h2>
        </div>
        <div>
          <h3 className="text-center mb-5">家族一覧</h3>
          <div className="flex justify-center">
            <ul className="flex flex-col w-80">
              {family.map((user) => (
                <li key={user.id} className="inline-flex items-center gap-x-3.5 py-3 px-4 text-sm font-medium border text-blue-600 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-700">
                  <Link href={`/profile/${user.id}`}>{user.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="pt-10 flex justify-center">
          <Link href="/family/create" className="bg-blue-500 hover:bg-blue-700 text-white text-lg w-64 h-14 rounded-full flex justify-center items-center">
            家族を追加
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Mypage;
