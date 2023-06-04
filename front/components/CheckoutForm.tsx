import React, { useState } from "react";
import axios from "axios";
import { CardElement, PaymentElement, LinkAuthenticationElement, useStripe, useElements } from "@stripe/react-stripe-js";

type Props = {
	order: any;
	apiURL: string;
};

const CheckoutForm: React.FC<Props> = ({ order, apiURL }) => {
	const stripe = useStripe();
	const elements = useElements();
	const [isLoading, setIsLoading] = React.useState(false);
	const [message, setMessage] = React.useState<string | null>(null);

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		if (!stripe || !elements) {
			// Stripe.js hasn't yet loaded.
			// Make sure to disable form submission until Stripe.js has loaded.
			return;
		}

		setIsLoading(true);
		const { error } = await stripe.confirmPayment({
			elements,
			confirmParams: {
				return_url: "http://localhost:3000/buy/success",
			},
		});
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
