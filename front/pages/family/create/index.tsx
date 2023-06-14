import React, { useState, useEffect } from "react";
import { NextPage } from "next";
import Link from "next/link";
import axios from "axios";
import { useRecoilValue, useRecoilSnapshot } from "recoil";
import { familyIDState } from "@/state/atom";
import Layout from "@/components/Layout";

type TypeUser = {
  family_id: number;
  name: string;
  email: string;
  phonetic: string;
  zipcode: string;
  prefecture: string;
  city: string;
  town: string;
  apartment: string;
  phone_number: string;
  is_owner: boolean;
  is_virtual_user: boolean;
};
const CreateFamily: NextPage = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const ENDPOINT_URL = apiUrl + "family";
  const [isMounted, setIsMounted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const snapshot = useRecoilSnapshot();
  const [inputProfile, setInputProfile] = useState<TypeUser>({
    family_id: 0,
    name: "",
    email: "",
    phonetic: "",
    zipcode: "",
    prefecture: "",
    city: "",
    town: "",
    apartment: "",
    phone_number: "",
    is_owner: false,
    is_virtual_user: true,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    const familyIDFromSnapshot = snapshot.getLoadable(familyIDState).contents;
    if (familyIDFromSnapshot) {
      setInputProfile((prevProfile) => ({
        ...prevProfile,
        family_id: familyIDFromSnapshot,
      }));
    }
  }, [snapshot]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleClick = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(inputProfile);
    // 空欄のチェック
    const emptyFields = Object.keys(inputProfile).filter((field) => {
      const value = inputProfile[field as keyof TypeUser];
      return field !== "apartment" && value === "";
    });

    if (emptyFields.length > 0) {
      alert("必須項目を入力してください");
      return;
    }

    axios.post(ENDPOINT_URL, inputProfile).then((res) => {
      console.log(res.data);
      let resMessage = "";
      if (res.status === 200) {
        resMessage = "家族の登録が完了しました";
      } else {
        resMessage = "エラーが発生しました。お問い合わせください。";
      }
      setSuccessMessage(resMessage);
    });
  };

  if (!isMounted) {
    return null; // マウント前は何も表示せずにロード中とする
  }

  return (
    <Layout>
      <div className="text-center items-center">
        <h2 className="text-center mb-10 mt-10">家族を追加</h2>
        {successMessage && (
          <div className="text-center mb-10">
            <p className="mb-10">{successMessage}</p>
            <div className="flex justify-center">
              <Link
                href="/"
                className="bg-blue-500 hover:bg-blue-700 text-white text-lg w-64 h-14 rounded-full flex justify-center items-center"
              >
                TOPページ
              </Link>
            </div>
          </div>
        )}
        <div>
          <form>
            <div className="pb-5">
              <div>
                <label>名前※</label>
              </div>
              <input
                name="name"
                type="text"
                value={inputProfile.name}
                onChange={handleChange}
                className="bg-slate-200 w-80 h-8 rounded-lg font-normal px-3"
              />
            </div>
            <div className="pb-5">
              <div>
                <label>フリガナ※</label>
              </div>
              <input
                name="phonetic"
                type="text"
                value={inputProfile.phonetic}
                onChange={handleChange}
                className="bg-slate-200 w-80 h-8 rounded-lg font-normal px-3"
              />
            </div>
            <div className="pb-5">
              <div>
                <label>メールアドレス※</label>
              </div>
              <input
                name="email"
                type="text"
                value={inputProfile.email}
                onChange={handleChange}
                className="bg-slate-200 w-80 h-8 rounded-lg font-normal px-3"
              />
            </div>
            <div className="pb-5">
              <div>
                <label>郵便番号※</label>
              </div>
              <input
                name="zipcode"
                type="text"
                value={inputProfile.zipcode}
                onChange={handleChange}
                className="bg-slate-200 w-80 h-8 rounded-lg font-normal px-3"
              />
            </div>
            <div className="pb-5">
              <div>
                <label>都道府県※</label>
              </div>
              <input
                name="prefecture"
                type="text"
                value={inputProfile.prefecture}
                onChange={handleChange}
                className="bg-slate-200 w-80 h-8 rounded-lg font-normal px-3"
              />
            </div>
            <div className="pb-5">
              <div>
                <label>市区町村※</label>
              </div>
              <input
                name="city"
                type="text"
                value={inputProfile.city}
                onChange={handleChange}
                className="bg-slate-200 w-80 h-8 rounded-lg font-normal px-3"
              />
            </div>
            <div className="pb-5">
              <div>
                <label>町名番地※</label>
              </div>
              <input
                name="town"
                type="text"
                value={inputProfile.town}
                onChange={handleChange}
                className="bg-slate-200 w-80 h-8 rounded-lg font-normal px-3"
              />
            </div>
            <div className="pb-5">
              <div>
                <label>アパート・マンション名</label>
              </div>
              <input
                name="apartment"
                type="text"
                value={inputProfile.apartment}
                onChange={handleChange}
                className="bg-slate-200 w-80 h-8 rounded-lg font-normal px-3"
              />
            </div>
            <div className="pb-5">
              <div>
                <label>電話番号※</label>
              </div>
              <input
                name="phone_number"
                type="text"
                value={inputProfile.phone_number}
                onChange={handleChange}
                className="bg-slate-200 w-80 h-8 rounded-lg font-normal px-3"
              />
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

export default CreateFamily;
