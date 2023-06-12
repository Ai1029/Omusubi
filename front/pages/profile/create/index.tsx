import React, { useState } from "react";
import { NextPage } from "next";
import axios from "axios";
import Link from "next/link";
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
const CreateProfile: NextPage = () => {
  const apiURL = process.env.NEXT_PUBLIC_API_URL;
  const ENDPOINT_URL = apiURL + "users";
  const [successMessage, setSuccessMessage] = useState("");
  const [inputProfile, setInputProfile] = useState<InputProfile>({
    id: 0,
    name: "",
    phonetic: "",
    zipcode: "",
    prefecture: "",
    city: "",
    town: "",
    apartment: "",
    phone_number: "",
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
        setSuccessMessage("プロフィールの登録が完了しました");
    });
  };

  return (
    <Layout>
      <div className="items-center">
        <div><h2 className="text-center mb-10 mt-10">プロフィール登録</h2></div>
        {successMessage && (
          <div className="text-center mb-10">
            <p className="mb-10">{successMessage}</p>
            <div className="flex justify-center">
              <Link href="/" className="bg-sky-400 text-white text-lg w-64 h-14 rounded-full flex justify-center items-center">
                TOPページ
              </Link>
            </div>
          </div>
        )}
        <div className="flex justify-center">
          <form>
            <div className="pb-5">
              <div>
                <label>名前※</label>
              </div>
              <input name="name" type="text" value={inputProfile.name} onChange={handleChange} className="bg-slate-200 w-80 h-10 rounded-lg font-normal" />
            </div>
            <div className="pb-5">
              <div>
                <label>フリガナ※</label>
              </div>
              <input name="phonetic" type="text" value={inputProfile.phonetic} onChange={handleChange} className="bg-slate-200 w-80 h-10 rounded-lg font-normal" />
            </div>
            <div className="pb-5">
              <div>
                <label>郵便番号※</label>
              </div>
              <input name="zipcode" type="text" value={inputProfile.zipcode} onChange={handleChange} className="bg-slate-200 w-80 h-10 rounded-lg font-normal" />
            </div>
            <div className="pb-5">
              <div>
                <label>都道府県※</label>
              </div>
              <input name="prefecture" type="text" value={inputProfile.prefecture} onChange={handleChange} className="bg-slate-200 w-80 h-10 rounded-lg font-normal" />
            </div>
            <div className="pb-5">
              <div>
                <label>市区町村※</label>
              </div>
              <input name="city" type="text" value={inputProfile.city} onChange={handleChange} className="bg-slate-200 w-80 h-10 rounded-lg font-normal" />
            </div>
            <div className="pb-5">
              <div>
                <label>町名番地※</label>
              </div>
              <input name="town" type="text" value={inputProfile.town} onChange={handleChange} className="bg-slate-200 w-80 h-10 rounded-lg font-normal" />
            </div>
            <div className="pb-5">
              <div>
                <label>アパート・マンション名</label>
              </div>
              <input name="apartment" type="text" value={inputProfile.apartment} onChange={handleChange} className="bg-slate-200 w-80 h-10 rounded-lg font-normal" />
            </div>
            <div className="pb-5">
              <div>
                <label>電話番号※</label>
              </div>
              <input name="phone_number" type="text" value={inputProfile.phone_number} onChange={handleChange} className="bg-slate-200 w-80 h-10 rounded-lg font-normal" />
            </div>
            <div className="flex justify-center">
              <div className="bg-sky-400 text-white text-lg w-64 h-14 rounded-full flex justify-center">
                <button onClick={handleClick}>登録する</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProfile;
