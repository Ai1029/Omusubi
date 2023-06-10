import React, { useState } from "react";
import { GetServerSideProps, NextPage } from "next";
import { parseCookies } from "nookies";
import axios from "axios";
import Link from "next/link";
import Layout from "@/components/Layout";

type InputProfile = {
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
	apiURL: string;
	user: InputProfile;
	isProfileExist: boolean;
};
const Profile: NextPage<Props> = ({ apiURL, user, isProfileExist }) => {
	console.log(isProfileExist);
	const ENDPOINT_URL = apiURL + "users";
	const [successMessage, setSuccessMessage] = useState("");
	const [inputProfile, setInputProfile] = useState<InputProfile>({
		id: user.id || "",
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
		console.log(inputProfile);
		axios.patch(ENDPOINT_URL, inputProfile).then((res) => {
			if (isProfileExist) {
				setSuccessMessage("プロフィールの修正が完了しました");
			} else {
				setSuccessMessage("プロフィールの登録が完了しました");
			}
			console.log(res.data);
		});
	};

	return (
		<Layout>
			<div className="items-center">
				<div>{isProfileExist ? <h2 className="text-center mb-10 mt-10">プロフィール修正</h2> : <h2 className="text-center mb-10 mt-10">プロフィール登録</h2>}</div>
				{successMessage && (
					<div className="text-center mb-10">
						<p className="mb-10">{successMessage}</p>
						<div className="flex justify-center">
							<Link href="/" className="bg-sky-400 text-white text-lg w-64 h-14 rounded-full flex justify-center items-center">TOPページ</Link>
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

export default Profile;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const cookies = parseCookies(context);
	const userID = cookies.id;
	const apiURL = process.env.API_URL;
	let user = null; // 初期化
	let isProfileExist = false; // 初期化

	if (userID !== undefined) {
		try {
			const response = await axios.get(`${process.env.API_URL_SSR}/users/${userID}`);
			const data = response.data;
			user = data;
			const keysToCheck = ["name", "phonetic", "zipcode", "prefecture", "city", "town", "phone_number"];
			isProfileExist = keysToCheck.every((key) => data[key] !== null && data[key] !== "");
		} catch (error) {
			console.error("Error fetching user data:", error);
		}
	}
	return {
		props: {
			apiURL: apiURL,
			user: user,
			isProfileExist: isProfileExist,
		},
	};
};
