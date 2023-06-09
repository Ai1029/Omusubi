import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import Layout from "@/components/Layout";
import CheckoutForm from "@/components/CheckoutForm";
import { useRecoilValue } from "recoil";
import { orderState } from "@/state/atom";

type BuyProps = {
	apiURL: string;
	siteURL: string;
};

const stripePromis = loadStripe("pk_test_51NDJySI8t6lPUIZhP6TevYxPDeaLNxPRRv2BolNbnYJeZssBUXNTIJkUMRPIo5O5bAKqrgCsawixvTy1Aj53jgDN00y9IbQ6NI");

const CartConfirm: NextPage<BuyProps> = ({ apiURL, siteURL }) => {
	const order = useRecoilValue(orderState);

	const appearance = {
		theme: "stripe",
	};
	const options: any = {
		mode: "subscription",
		amount: Number(order.plan.price),
		currency: "jpy",
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

			<Elements options={options} stripe={stripePromis}>
				<CheckoutForm apiURL={apiURL} siteURL={siteURL} order={order} />
			</Elements>
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
