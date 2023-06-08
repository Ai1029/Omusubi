<<<<<<< HEAD
import React from "react";
import { useRouter } from "next/router";
import Logo from "@/components/Logo";
import Button from "@/components/Button";

const Complete = () => {
  const router = useRouter();
  const ClickTop = () => {
    console.log("TopページのURL");
  };
  const ClickFamily = () => {
    router.push("http://localhost:3000/family/create");
  };
  return (
    <div className="text-center items-center">
      <Logo />
      <p className="text-lg font-medium pb-5 pt-10">プロフィールの登録完了</p>
      <p className="pb-10">プロフィールの登録が完了しました！</p>
      <div className="flex justify-center">
        <Button onClick={ClickTop} text="TOPページへ" />
      </div>
      <p className="pt-20 pb-10">引き続き、家族を登録しましょう</p>
      <div className="flex justify-center">
        <Button onClick={ClickFamily} text="家族を登録" />
      </div>
    </div>
  );
};

export default Complete;
=======
import React, { useState } from "react";
import { useRouter } from "next/router";
import { NextPage } from "next";

// const Complete : NextPage = () => {
// return (
// <div>
// <p>認証メールを送信しました</p>
// <p>認証メールに記載されたURLからプロフィール登録に進んでください</p>
// </div>

// )
// }

const Complete = () => {
	const router = useRouter();
	const ClickTop = () => {
		router.push("http://localhost:3000/");
	};
	const ClickFamily = () => {
		router.push("http://localhost:3000/family/create");
	};
	return (
		<div className="text-center items-center">
			{/* <Logo /> */}
			<p className="text-lg font-medium pb-5 pt-10">プロフィールの登録完了</p>
			<p className="pb-10">プロフィールの登録が完了しました！</p>
			<div className="flex justify-center">{/*<Button onClick={ClickTop} text="TOPページへ" /> */}</div>
			<p className="pt-20 pb-10">引き続き、家族を登録しましょう</p>
			<div className="flex justify-center">{/*<Button onClick={ClickFamily} text="家族を登録" /> */}</div>
		</div>
	);
};

<<<<<<< HEAD

export default Complete;
>>>>>>> a180a66f7bbed65e5003ff6cec3bccc9849d583d
=======
export default Complete;
>>>>>>> c9d5cf5a5be32fc9d072e7bde9389970d3e2693b
