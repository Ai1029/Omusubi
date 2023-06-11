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
      <div className="text-center items-center">
        <h2 className="text-center mb-10 mt-10">MY PAGE</h2>
        <div>
          <h3 className="mb-10">家族一覧</h3>
          <div>
            <ul>
              {family.map((user) => (
                <li key={user.id}>
                  <Link href={`/profile/${user.id}`}>{user.name} →</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="pt-10 flex justify-center">
          <Link href="/family/create" className="bg-sky-400 text-white text-lg w-64 h-14 rounded-full flex justify-center items-center">
            家族を追加
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Mypage;
