import React, { useState } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, PaymentElement, LinkAuthenticationElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { CartContext } from "@/pages/_app";

type Props = {
	apiURL: string;
	siteURL: string;
	order: any;
};

const stripePromis = loadStripe("pk_test_51NDJySI8t6lPUIZhP6TevYxPDeaLNxPRRv2BolNbnYJeZssBUXNTIJkUMRPIo5O5bAKqrgCsawixvTy1Aj53jgDN00y9IbQ6NI");

const CheckoutForm: React.FC<Props> = ({ apiURL, siteURL, order }) => {
	const stripe = useStripe();
	const elements = useElements();
	const [isLoading, setIsLoading] = React.useState(false);
	const [message, setMessage] = React.useState<string | null>(null);
	const returnUrl = siteURL + "/register/complete";

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		if (!stripe || !elements) {
			// Stripe.js hasn't yet loaded.
			// Make sure to disable form submission until Stripe.js has loaded.
			return;
		}
		setIsLoading(true);
		try {
			// POSTリクエストを作成
			const { error: submitError } = await elements.submit();
			const response = await axios.post(`${apiURL}createsubscription`, order);
			// レスポンスを処理
			const clientSecret = response.data.clientSecret;
			console.log(clientSecret); // レスポンスデータを表示
			const result = await stripe.confirmPayment({
				elements,
				clientSecret,
				confirmParams: {
					payment_method_data: {
						billing_details: {
							email: order.paidUser.email,
							name: order.paidUser.name,
						},
					},
					return_url: returnUrl,
				},
			});
		} catch (error) {
			// エラーハンドリング
			console.error(error);
		}

		setIsLoading(false);
	};

	return (
		<form id="payment-form" onSubmit={handleSubmit}>
			<PaymentElement id="payment-element" />
			{/* Show any error or success messages */}
			<button>submit</button>
			{message && <div id="payment-message">{message}</div>}
		</form>
	);
};

export default CheckoutForm;
