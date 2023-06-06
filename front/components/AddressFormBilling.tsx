import React from "react";
import { AddressElement } from "@stripe/react-stripe-js";

const AddressFormBilling = () => {
	return (
		<form>
			<h3>Shipping</h3>
			<AddressElement
				options={{
					mode: "billing",
					defaultValues: {
						name: "Jane Doe",
						address: {
							line1: "三宿2-2-2",
							line2: "",
							city: "世田谷区",
							state: "東京都",
							postal_code: "1540005",
							country: "JP",
						},
					},
				}}
			/>
		</form>
	);
};

export default AddressFormBilling;
