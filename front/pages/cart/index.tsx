import React, { useContext, useState, useEffect } from "react";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { CartContext } from "@/pages/_app";
import QuantityButton from "@/components/QuantityButton";
import axios from "axios";

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

type Props = {
	apiURL: string;
	siteURL: string;
	familyUserList: User[];
	updateClientSecret: (newClientSecret: string) => void;
	updateSubscriptionId: (newSubscriptionId: string) => void;
	updateOrder: (newOrder: any) => void;
};
// カートを見るページ
const CartPage: NextPage<Props> = ({ apiURL, siteURL, familyUserList, updateClientSecret, updateSubscriptionId, updateOrder }) => {
	const { cartState } = useContext(CartContext);
	const router = useRouter();
	const paidUser = familyUserList.filter((item) => item.is_owner)[0];

	const handlePurchase = async (index: number, user_index: number) => {
		const order = {
			paidUser: paidUser,
			plan: cartState[index],
			receivedUser: familyUserList[user_index],
		};
		updateOrder(order);
		console.log(order);
		console.log(apiURL);
		console.log(siteURL);
		try {
			// POSTリクエストを作成
			router.push("/register");
		} catch (error) {
			// エラーハンドリング
			console.error(error);
		}
	};

	return (
		<Layout>
			<div>
				<h1>Cart</h1>
				{cartState.map((item, index) => (
					<div key={index}>
						{familyUserList.map((user, user_index) => (
							<div key={user.id}>
								{user.is_owner ? <h2>自宅に配送</h2> : <h2>{user.name}に配送</h2>}
								<div>
									<h3>商品: {item.name}</h3>
									<p>価格: {item.price}</p>
									<p>詳細: {item.explanation}</p>
									<div>
										<img src={item.image} />
									</div>
								</div>
								<div>
									<h3>配送先</h3>
									<p>{user.name}</p>
									<p>{user.postal_code}</p>
									<p>{user.state}</p>
									<p>{user.city}</p>
									<p>{user.line1}</p>
									<p>{user.line2}</p>
									<p>{user.phone_number}</p>
								</div>
								<button onClick={() => handlePurchase(index, user_index)}>購入する</button>
							</div>
						))}
					</div>
				))}
			</div>
		</Layout>
	);
};

export default CartPage;

export const getServerSideProps: GetServerSideProps = async () => {
	const res = await axios.get(`${process.env.API_URL_SSR}/cartusers/1`);
	const familyUserList = res.data;
	const apiURL = process.env.API_URL;
	const siteURL = process.env.SITE_URL;
	return {
		props: {
			apiURL: apiURL,
			siteURL: siteURL,
			familyUserList: familyUserList,
		},
	};
};
