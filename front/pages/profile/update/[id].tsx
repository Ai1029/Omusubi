import React, { useState } from "react";
import { GetServerSideProps, NextPage } from "next";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import { useRecoilState } from "recoil";
import { cartState } from "@/state/atom";
import Layout from "@/components/Layout";

type InputProfile = {
  id: number;
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
  user: InputProfile;
};
const UpdateProfile: NextPage<Props> = ({ user }) => {
  const apiURL = process.env.NEXT_PUBLIC_API_URL;
  const ENDPOINT_URL = apiURL + "users";
  const router = useRouter();
  const [cart, setCart] = useRecoilState(cartState);
  const [successMessage, setSuccessMessage] = useState("");
  const [inputProfile, setInputProfile] = useState<InputProfile>({
    id: user.id || 0,
    name: user.name || "",
    phonetic: user.phonetic || "",
    zipcode: user.zipcode || "",
    prefecture: user.prefecture || "",
    city: user.city || "",
    town: user.town || "",
    apartment: user.apartment || "",
    phone_number: user.phone_number || "",
  });
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };
  const handleClick = (e: React.FormEvent) => {
    e.preventDefault();
    // 空欄のチェック
    const emptyFields = Object.keys(inputProfile).filter((field) => {
      const value = inputProfile[field as keyof InputProfile];
      return field !== "apartment" && value === "";
    });

    if (emptyFields.length > 0) {
      alert("必須項目を入力してください");
      return;
    }
    axios.patch(ENDPOINT_URL, inputProfile).then((res) => {
      const updatedCart = cart.map((item) => {
        if (item.paidUser.id === user.id) {
          // paidUserのidが一致する場合、データを修正
          return {
            ...item,
            paidUser: { ...item.paidUser, ...res.data },
          };
        }
        if (item.receivedUser.id === user.id) {
          // receivedUserのidが一致する場合、データを修正
          return {
            ...item,
            receivedUser: { ...item.receivedUser, ...res.data },
          };
        }
        return item;
      });
      setCart(updatedCart);
      localStorage.setItem("cart-items", JSON.stringify(updatedCart));
      router.push("/profile/update/complete");
    });
  };

  return (
    <Layout>
      <div className="container mt-10 items-center mx-auto px-8 md:px-14 lg:px-24 w-full">
        <div>
          <h2 className="second-title-ja mr-4 mb-5">プロフィール修正</h2>
        </div>
        <div className="flex justify-center pt-10">
          <form>
            <div className="pb-5">
              <div>
                <label>名前※</label>
              </div>
              <input name="name" type="text" value={inputProfile.name} onChange={handleChange} className="bg-slate-200 w-80 h-8 rounded-lg font-normal px-3" />
            </div>
            <div className="pb-5">
              <div>
                <label>フリガナ※</label>
              </div>
              <input name="phonetic" type="text" value={inputProfile.phonetic} onChange={handleChange} className="bg-slate-200 w-80 h-8 rounded-lg font-normal px-3" />
            </div>
            <div className="pb-5">
              <div>
                <label>郵便番号※</label>
              </div>
              <input name="zipcode" type="text" value={inputProfile.zipcode} onChange={handleChange} className="bg-slate-200 w-80 h-8 rounded-lg font-normal px-3" />
            </div>
            <div className="pb-5">
              <div>
                <label>都道府県※</label>
              </div>
              <input name="prefecture" type="text" value={inputProfile.prefecture} onChange={handleChange} className="bg-slate-200 w-80 h-8 rounded-lg font-normal px-3" />
            </div>
            <div className="pb-5">
              <div>
                <label>市区町村※</label>
              </div>
              <input name="city" type="text" value={inputProfile.city} onChange={handleChange} className="bg-slate-200 w-80 h-8 rounded-lg font-normal px-3" />
            </div>
            <div className="pb-5">
              <div>
                <label>町名番地※</label>
              </div>
              <input name="town" type="text" value={inputProfile.town} onChange={handleChange} className="bg-slate-200 w-80 h-8 rounded-lg font-normal px-3" />
            </div>
            <div className="pb-5">
              <div>
                <label>アパート・マンション名</label>
              </div>
              <input name="apartment" type="text" value={inputProfile.apartment} onChange={handleChange} className="bg-slate-200 w-80 h-8 rounded-lg font-normal px-3" />
            </div>
            <div className="pb-5">
              <div>
                <label>電話番号※</label>
              </div>
              <input name="phone_number" type="text" value={inputProfile.phone_number} onChange={handleChange} className="bg-slate-200 w-80 h-8 rounded-lg font-normal px-3" />
            </div>
            <div className="flex justify-center">
              <div className="bg-blue-500 hover:bg-blue-700 text-white text-lg w-64 h-14 rounded-full flex justify-center mb-10 mt-5">
                <button onClick={handleClick}>登録する</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProfile;

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
      const keysToCheck = ["name", "phonetic", "zipcode", "prefecture", "city", "town", "phone_number"];
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
