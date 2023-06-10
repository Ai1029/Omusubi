import React from "react";
import { GetServerSideProps, NextPage } from "next";
import axios from "axios";
import { parseCookies } from "nookies";
import Button from "@/components/Button";
import Layout from "@/components/Layout";
import Link from "next/link";

type TypeUser = {
	id: number;
	name: string;
	email: string;
	postal_code: string;
	state: string;
	city: string;
	line1: string;
	line2: string;
	phone_number: string;
	is_owner: boolean;
	is_virtual_user: boolean;
};
type Props = {
	family: TypeUser[];
	cookies: any;
};
const Mypage: NextPage<Props> = ({ family, cookies }) => {
	console.log(family);
	const handleClick = () => {};
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
									<Link href={`/profile/${user.id}`}>{user.name}</Link>
								</li>
							))}
						</ul>
					</div>
				</div>
				<div className="pt-10 flex justify-center">
					<Link href="/family/create">家族を追加</Link>
				</div>
			</div>
		</Layout>
	);
};

export default Mypage;

// 家族一覧をgetする
export const getServerSideProps: GetServerSideProps = async (context) => {
	const cookies = parseCookies(context);
	const userID = cookies.id;
	let family: any[] = [];
	try {
		if (userID !== undefined) {
			const _family = await axios.get(`${process.env.API_URL_SSR}/family/${userID}`);
			family = _family.data;
		}
		return {
			props: {
				family: family,
				cookies: cookies,
			},
		};
	} catch (error) {
		console.error("データが取得できません");
		return {
			props: {
				family: null,
				cookies: null,
			},
		};
	}
};
