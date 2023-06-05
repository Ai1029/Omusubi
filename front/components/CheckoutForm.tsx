import React, { useState } from "react";
import axios from "axios";
import { CardElement, PaymentElement, LinkAuthenticationElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { MyContext } from "@/pages/_app";

type Props = {
	order: any;
	apiURL: string;
	siteURL: string;
};

const CheckoutForm: React.FC<Props> = ({ order, apiURL, siteURL }) => {
	const stripe = useStripe();
	const elements = useElements();
	const contextValue = React.useContext(MyContext);
	const plan = contextValue.plan;
	const paidUser = contextValue.paidUser;
	const receivedUser = contextValue.receivedUser;
	const [isLoading, setIsLoading] = React.useState(false);
	const [message, setMessage] = React.useState<string | null>(null);
	const subscription = {
		plan_id: plan.id,
		paiduser_id: paidUser.id,
		receiveduser_id: receivedUser.id,
		is_active: false,
		stripe_customer_id: "",
		stripe_subscription_id: "",
	};
	const returnUrl = siteURL + "/register/complete";
	const redirectUrl = new URL(returnUrl);

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		if (!stripe || !elements) {
			// Stripe.js hasn't yet loaded.
			// Make sure to disable form submission until Stripe.js has loaded.
			return;
		}
		setIsLoading(true);
		const result = await stripe.confirmPayment({
			elements,
			confirmParams: {
				return_url: redirectUrl.toString(),
			},
		});
		// ここでresultの処理を行う;

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
