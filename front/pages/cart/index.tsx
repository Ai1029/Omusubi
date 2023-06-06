import React, { useContext, useState, useEffect } from "react";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import { CartContext } from "@/pages/_app";
import { loadStripe } from "@stripe/stripe-js";
import QuantityButton from "@/components/QuantityButton";
import axios from "axios";

type Props = {
	apiURL: string;
	siteURL: string;
	updateClientSecret: (newClientSecret: string) => void;
	updateSubscriptionId: (newSubscriptionId: string) => void;
	updateOrder: (newOrder: any) => void;
};
const stripePromis = loadStripe("pk_test_51NDJySI8t6lPUIZhP6TevYxPDeaLNxPRRv2BolNbnYJeZssBUXNTIJkUMRPIo5O5bAKqrgCsawixvTy1Aj53jgDN00y9IbQ6NI");
// カートを見るページ
const CartPage: NextPage<Props> = ({ apiURL, siteURL, updateClientSecret, updateSubscriptionId, updateOrder }) => {
	const { cartState, clientSecret, subscriptionId } = useContext(CartContext);
	const router = useRouter();

	const handlePurchase = async (index: any) => {
		console.log(cartState[index]);
		try {
			// POSTリクエストを作成
			const response = await axios.post(`${apiURL}createsubscription`, cartState[index]);
			// レスポンスを処理
			// console.log(response.data); // レスポンスデータを表示
			updateClientSecret(response.data.clientSecret);
			updateSubscriptionId(response.data.subscriptionId);
      updateOrder(cartState[index])
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
						<h2>自宅に配送</h2>
						<h3>Plan: {item.plan?.name}</h3>
						<h3>Price: {item.plan?.price}</h3>
						<p>Paid User: {item.paidUser?.name}</p>
						<p>Received User: {item.receivedUser?.name}</p>
						<button onClick={() => handlePurchase(index)}>購入する</button>
					</div>
				))}
			</div>
		</Layout>
	);
};

export default CartPage;

export const getServerSideProps: GetServerSideProps = async () => {
	const apiURL = process.env.API_URL;
	const siteURL = process.env.SITE_URL;
	return {
		props: {
			apiURL: apiURL,
			siteURL: siteURL,
		},
	};
};
