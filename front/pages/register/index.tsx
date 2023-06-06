import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useContext } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { CartContext } from "@/pages/_app";
import Layout from "@/components/Layout";
import AddressFormBilling from "@/components/AddressFormBilling";
import CheckoutForm from "@/components/CheckoutForm";
import AddressFormShipping from "@/components/AddressFormShipping";

type TypePlan = {
	id: number;
	name: string;
	explanation: string;
	price: number;
	image: string;
	stripe_price_id: string;
};

type TypeUser = {
	id: number;
	name: string;
	email: string;
	family_id: number;
	phonetic: string;
	state: string;
	city: string;
	postal_code: string;
	line1: string;
	line2: string;
	apartment: string;
	phone_number: string;
	is_owner: boolean;
};

type CartState = {
	id: number;
	name: string;
	explanation: string;
	price: string;
	image: string;
};
type BuyProps = {
	apiURL: string;
	siteURL: string;
};

const stripePromis = loadStripe("pk_test_51NDJySI8t6lPUIZhP6TevYxPDeaLNxPRRv2BolNbnYJeZssBUXNTIJkUMRPIo5O5bAKqrgCsawixvTy1Aj53jgDN00y9IbQ6NI");

const CartConfirm: NextPage<BuyProps> = ({ apiURL, siteURL }) => {
	const { order, clientSecret, subscriptionId } = useContext(CartContext);
	console.log(clientSecret);
	console.log(subscriptionId);
	console.log(order);

	const appearance = {
		theme: "stripe",
	};
	const options: any = {
		clientSecret: clientSecret,
		automatic_payment_methods: {
			enabled: true,
		},
		appearance,
	};
	if (!order) {
		return (
			<Layout>
				<p>Loading...</p>
			</Layout>
		);
	}

	const { paidUser, receivedUser, plan } = order;

	return (
		<Layout>
			<h2>注文情報</h2>
			<p>
				いつでも定期便の停止や解約が可能です。
				<br />
				また配送間隔やおかずセットの変更も可能です。
			</p>
			<section>
				<div>
					<h3>自宅にお届け</h3>
					<div>
						<h4>請求先詳細</h4>
						<dl>
							<dt>名前</dt>
							<dd>{paidUser.name}</dd>
							<dt>住所</dt>
							<dd>
								<span>〒{paidUser.postal_code}</span>
								{paidUser.state}
								{paidUser.city}
								{paidUser.line1}
								{paidUser.line2}
								{paidUser.apartment}
							</dd>
							<dt>電話番号</dt>
							<dd>{paidUser.phone_number}</dd>
						</dl>
					</div>
					<div>
						<h4>お届け先住所</h4>
						<dl>
							<dt>名前</dt>
							<dd>{receivedUser.name}</dd>
							<dt>住所</dt>
							<dd>
								<span>〒{receivedUser.postal_code}</span>
								{receivedUser.state}
								{receivedUser.city}
								{receivedUser.line1}
								{receivedUser.line2}
								{receivedUser.apartment}
							</dd>
							<dt>電話番号</dt>
							<dd>{receivedUser.phone_number}</dd>
						</dl>
						<div>変更</div>
					</div>
					<div>
						<div>
							<img src={plan.image} alt={plan.name} />
						</div>
						<h4>
							<span>定期便</span>
							<p>{plan.explanation}</p>
						</h4>
						<p></p>
						<p>数量：1</p>
					</div>
				</div>
			</section>

			{clientSecret && (
				<>
					{console.log(clientSecret)}
					{console.log(subscriptionId)}
					<Elements options={options} stripe={stripePromis}>
						<CheckoutForm apiURL={apiURL} siteURL={siteURL} />
					</Elements>
				</>
			)}
		</Layout>
	);
};

export default CartConfirm;

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