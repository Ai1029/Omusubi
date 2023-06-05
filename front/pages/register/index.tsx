import { GetServerSideProps, NextPage } from "next";
import React, { useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { MyContext } from "@/pages/_app";
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

type BuyProps = {
	apiURL: string;
	siteURL: string;
};

const stripePromis = loadStripe("pk_test_51NDJySI8t6lPUIZhP6TevYxPDeaLNxPRRv2BolNbnYJeZssBUXNTIJkUMRPIo5O5bAKqrgCsawixvTy1Aj53jgDN00y9IbQ6NI");

const CartConfirm: NextPage<BuyProps> = ({ apiURL, siteURL }) => {
	const data = {
		name: "",
		email: "",
	};
	const contextValue = React.useContext(MyContext);
	const plan = contextValue.plan;
	const paidUser = contextValue.paidUser;
	const receivedUser = contextValue.receivedUser;
	const quantity = contextValue.orderQuantity;
	const totalPrice = contextValue.orderTotalPrice;
	const order = {
		paiduser: paidUser,
		receiveduser: receivedUser,
		plan_id: plan.id,
		stripe_price_id: plan.stripe_price_id,
		price: totalPrice,
	};
	const [clientSecret, setClientSecret] = React.useState("");
	const [subscriptionId, setSubscriptionId] = React.useState("");

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

	const onCreateCheckoutSesstion = async (e: React.FormEvent) => {
		e.preventDefault();
		axios.post(`${apiURL}createsubscription`, order).then((res) => {
			setSubscriptionId(res.data.subscriptionId);
			setClientSecret(res.data.clientSecret);
			console.log(res.data);
		});
	};

	return (
		<Layout>
			<h2>注文情報</h2>
			<p>
				いつでも定期便の停止や解約が可能です。
				<br />
				また配送間隔やおかずセットの変更も可能です。
				{data.name}
			</p>
			<section>
				<div>
					<h3>自宅にお届け</h3>
					<div>
						<h4>お届け先住所</h4>
						<dl>
							<dt>名前</dt>
							<dd>{receivedUser.name}</dd>
							<dt>住所</dt>
							<dd>
								<span>〒{receivedUser.zipcode}</span>
								{receivedUser.prefecture}
								{receivedUser.city}
								{receivedUser.town}
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
						<p>数量：{quantity}</p>
					</div>
				</div>
			</section>
			<button onClick={onCreateCheckoutSesstion}>お支払情報を入力して購入手続きをする</button>
			<p>まだ購入は確定されません</p>

			{clientSecret && (
				<>
					{console.log(clientSecret)}
					{console.log(subscriptionId)}
					<Elements options={options} stripe={stripePromis}>
						<CheckoutForm order={order} apiURL={apiURL} siteURL={siteURL} />
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
