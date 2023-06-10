import React, { useState } from "react";
import { GetServerSideProps, NextPage } from "next";
import { parseCookies } from "nookies";

import Button from "@/components/Button";
import ProfileInput from "@/components/ProfileInput";
import Link from "next/link";

type Props = {
	apiURL: string;
	cookies: any;
};
const Profile: NextPage<Props> = ({ apiURL, cookies }) => {
	const ENDPOINT_URL = apiURL + "profile";
	const [inputProfile, setInputProfile] = useState({
		id: cookies.id,
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
	};

	return (
		<div className="items-center">
			<h1 className="mb-10">
				<img src="/images/logo.png" className="w-100 h-32 m-auto pt-10" alt="おむすび"></img>
			</h1>
			<h2 className="text-center mb-10">プロフィール登録</h2>
			<div className="text-center">
				<p>ユーザー登録が完了しました</p>
				<p className="mb-10">プロフィール登録をして下さい</p>
			</div>
			<div className="flex justify-center">
				<form>
					<div className="pb-5">
						<div>
							<label>名前</label>
						</div>
						<input name="name" type="text" value={inputProfile.name} onChange={handleChange} className="bg-slate-200 w-80 h-10 rounded-lg font-normal" />
					</div>
					<div className="pb-5">
						<div>
							<label>フリガナ</label>
						</div>
						<input name="phonetic" type="text" value={inputProfile.phonetic} onChange={handleChange} className="bg-slate-200 w-80 h-10 rounded-lg font-normal" />
					</div>
					<div className="pb-5">
						<div>
							<label>郵便番号</label>
						</div>
						<input name="zipcode" type="text" value={inputProfile.zipcode} onChange={handleChange} className="bg-slate-200 w-80 h-10 rounded-lg font-normal" />
					</div>
					<div className="pb-5">
						<div>
							<label>都道府県</label>
						</div>
						<input name="prefecture" type="text" value={inputProfile.prefecture} onChange={handleChange} className="bg-slate-200 w-80 h-10 rounded-lg font-normal" />
					</div>
					<div className="pb-5">
						<div>
							<label>市区町村</label>
						</div>
						<input name="city" type="text" value={inputProfile.city} onChange={handleChange} className="bg-slate-200 w-80 h-10 rounded-lg font-normal" />
					</div>
					<div className="pb-5">
						<div>
							<label>町名番地</label>
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
							<label>電話番号</label>
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
	);
};

export default Profile;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const apiURL = process.env.API_URL;
	const cookies = parseCookies(context);
	return {
		props: {
			apiURL: apiURL,
			cookies: cookies,
		},
	};
};
