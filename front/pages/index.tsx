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

type PlanProps = {
	data: Plan[];
};

const HOME: NextPage<PlanProps> = ({ data }) => {
	return (
		<Layout>
			<main>
				<Topimage />
				<Delivery />
				<Shop data={data} />
				<Orderhistory />

				{/* <p>次回のお届け</p>

      <p>同時配送</p>
      <p>もっと見る</p>
      <button>商品を追加・変更する</button>
      <h3>SHOP</h3>
      <p>定期便</p>
      <p>おかず</p> */}
			</main>
		</Layout>
	);
};

// プラン一覧をgetする
export const getServerSideProps: GetServerSideProps = async () => {
	try {
		const res = await axios.get(`${process.env.API_URL_SSR}/plans`);
		console.log(res.data);
		return {
			props: {
				data: res.data,
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
