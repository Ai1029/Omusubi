import React, { useState } from "react";
import { GetServerSideProps, NextPage } from "next";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useRouter } from "next/router";
import { setCookie } from "nookies";
import axios from "axios";
import Navbar from "../../components/Layout";
import Link from "next/link";
import Button from "@/components/Button";

type Inputs = {
	email: string;
	password: string;
};

type Props = {
	apiURL: string;
};

const LoginPage: NextPage<Props> = ({ apiURL }) => {
	const ENDPOINT_URL = apiURL + "login";
	console.log(ENDPOINT_URL);
	const [authError, setAuthError] = useState(false);
	const [dbError, setDbError] = useState(false);
	const router = useRouter();
	const [inputs, setInputs] = useState<Inputs>({ email: "", password: "" });
	const onLogin = async (e: React.FormEvent) => {
		e.preventDefault();

		signInWithEmailAndPassword(auth, inputs.email, inputs.password)
			.then(({ user }: any) => {
				user.getIdToken().then((idToken: any) => {
					const config = {
						headers: {
							Authorization: `Bearer ${idToken}`,
						},
					};
					axios.post(ENDPOINT_URL, idToken, config).then((res) => {
						if (res.data === false) {
							setDbError(true);
						} else {
							console.log(res.data);
							const targetId = res.data.id;
							setCookie(null, "id", targetId, {
								maxAge: 1 * 1 * 60 * 60,
								path: "/",
							});
							setCookie(null, "signedIn", "true", {
								maxAge: 1 * 1 * 60 * 60,
								path: "/",
							});
							router.push("/");
						}
					});
				});
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				if (errorCode === "auth/user-not-found") {
					router.push("/signup");
				} else {
					setAuthError(true);
				}
			});
	};
	return (
		<Navbar>
			<h2>ログインページ</h2>
			{authError && <p>メールアドレスとパスワードを確認してください</p>}
			{dbError && <p>登録されていないユーザーです</p>}
			<form onSubmit={onLogin}>
				<label htmlFor="email">メールアドレス</label>
				<input
					type="text"
					name="email"
					onChange={(e) =>
						setInputs((prev) => ({
							...prev,
							email: e.target.value,
						}))
					}
				/>
				<label htmlFor="password">パスワード</label>
				<input
					type="password"
					name="password"
					onChange={(e) =>
						setInputs((prev) => ({
							...prev,
							password: e.target.value,
						}))
					}
				/>
				<input type="submit" value="ログイン" />
			</form>
			<h2>アカウント作成はこちら</h2>
			<Link href="/signup">ユーザー登録</Link>
		</Navbar>
	);
};

export default LoginPage;

export const getServerSideProps: GetServerSideProps = async () => {
	const apiURL = process.env.API_URL;
	return {
		props: {
			apiURL: apiURL,
		},
	};
};
