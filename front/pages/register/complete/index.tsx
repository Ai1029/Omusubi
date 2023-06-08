import { GetServerSideProps, NextPage } from "next";
import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import Layout from "@/components/Layout";
import Link from "next/link";
import axios from "axios";

type Props = {
	apiURL: string;
};

const stripePromise = loadStripe("pk_test_51NDJySI8t6lPUIZhP6TevYxPDeaLNxPRRv2BolNbnYJeZssBUXNTIJkUMRPIo5O5bAKqrgCsawixvTy1Aj53jgDN00y9IbQ6NI");

const CartRegister: NextPage<Props> = ({ apiURL }) => {
	React.useEffect(() => {
		const clientSecret = new URLSearchParams(window.location.search).get("payment_intent_client_secret");
		if (!clientSecret) {
			return;
		}
		stripePromise.then((stripe) => {
			if (!stripe) {
				return;
			}
			stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
				if (!paymentIntent) {
					return;
				}

				switch (paymentIntent.status) {
					case "succeeded":
						console.log("Success! Payment received.");
						// axios.post(`${apiURL}createSubscript`).then((res) => {
						// console.log(res.data);
						// });
						break;

					case "processing":
						console.log("Payment processing. We'll update you when payment is received.");
						break;

					case "requires_payment_method":
						console.log("Payment failed. Please try another payment method.");
						// Redirect your user back to your payment page to attempt collecting
						// payment again
						break;

					default:
						console.log("Something went wrong.");
						break;
				}
			});
		});
	}, []);

	return (
		<Layout>
			<h2>ご購入ありがとうございました</h2>
			<p>引き続きお買い物をお楽しみください</p>
			<Link href="/">TOPへ戻る</Link>
		</Layout>
	);
};

export default CartRegister;

export const getServerSideProps: GetServerSideProps = async () => {
	const apiURL = process.env.API_URL;
	return {
		props: {
			apiURL: apiURL,
		},
	};
};
