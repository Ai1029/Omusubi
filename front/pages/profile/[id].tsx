import React from "react";
import { GetServerSideProps, NextPage } from "next";
import axios from "axios";
import Link from "next/link";
import Layout from "@/components/Layout";

type User = {
  id: string;
  name: string;
  phonetic: string;
  zipcode: string;
  prefecture: string;
  city: string;
  town: string;
  apartment: string;
  phone_number: string;
};
type Props = {
  user: User;
};
const Profile: NextPage<Props> = ({ user }) => {
  return (
    <Layout>
      <div className="container mt-10 items-center mx-auto px-8 md:px-14 lg:px-24 w-full">
        <div>
          <h2 className="second-title-ja mr-4 mb-5">プロフィール</h2>
        </div>
        <div className="flex justify-center pt-10">
          <form>
            <div className="pb-5">
              <div>
                <p className="text-sm font-bold">名前</p>
              </div>
              <p>{user.name}</p>
            </div>
            <div className="pb-5">
              <div>
                <p className="text-sm font-bold">フリガナ</p>
              </div>
              <p>{user.phonetic}</p>
            </div>
            <div className="pb-5">
              <div>
                <p className="text-sm font-bold">郵便番号</p>
              </div>
              <p>{user.zipcode}</p>
            </div>
            <div className="pb-5">
              <div>
                <p className="text-sm font-bold">都道府県</p>
              </div>
              <p>{user.prefecture}</p>
            </div>
            <div className="pb-5">
              <div>
                <p className="text-sm font-bold">市区町村</p>
              </div>
              <p>{user.city}</p>
            </div>
            <div className="pb-5">
              <div>
                <p className="text-sm font-bold">町名番地</p>
              </div>
              <p>{user.town}</p>
            </div>
            <div className="pb-5">
              <div>
                <p className="text-sm font-bold">アパート・マンション名</p>
              </div>
              <p>{user.apartment}</p>
            </div>
            <div className="pb-5">
              <div>
                <p className="text-sm font-bold">電話番号</p>
              </div>
              <p>{user.phone_number}</p>
            </div>
            <div className="flex justify-center pb-10">
              <Link href={`/profile/update/${user.id}`} className="bg-blue-500 hover:bg-blue-700 text-white text-lg w-64 h-14 rounded-full flex justify-center items-center">
                修正する
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  let user = {
    id: 0,
    name: "",
    family_id: 0,
    phonetic: "",
    zipcode: "",
    prefecture: "",
    city: "",
    town: "",
    apartment: "",
    phone_number: "",
  };

  if (id !== undefined) {
    try {
      const response = await axios.get(`${process.env.API_URL_SSR}/users/${id}`);
      const data = response.data;
      user = data;
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
  return {
    props: {
      user: user,
    },
  };
};
