import Image from "next/image";
import React from "react";
import { GetServerSideProps, NextPage } from "next";
import axios from "axios";
import Layout from "@/components/Layout";
import Topimage from "@/components/Topimage";
import Shop from "@/components/Shop";
import Delivery from "@/components/Delivery";
import Orderhistory from "@/components/Orderhistory";

type Plan = {
	id: number;
	name: string;
	explanation: string;
	price: string;
	image: string;
	stripe_price_id: string;
};
type User = {
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
type PlanProps = {
	data: Plan[];
	family: User[];
};

const HOME: NextPage<PlanProps> = ({ data, family }) => {
	return (
		<Layout>
			<main>
				<Topimage />
				<Delivery />
				<Shop data={data} family={family} />
				<Orderhistory />
			</main>
		</Layout>
	);
};

// プラン一覧をgetする
export const getServerSideProps: GetServerSideProps = async () => {
	try {
		const res = await axios.get(`${process.env.API_URL_SSR}/plans`);
		const _family = await axios.get(`${process.env.API_URL_SSR}/cartusers/1`);
		const family = _family.data;
		return {
			props: {
				data: res.data,
				family: family,
			},
		};
	} catch (error) {
		console.error("データが取得できません", error);
		return {
			props: {
				data: null,
			},
		};
	}
};

export default HOME;
