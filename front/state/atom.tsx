import { atom } from "recoil";

type Plan = {
	id: number;
	name: string;
	explanation: string;
	price: string;
	image: string;
	stripe_price_id: string;
};

const initialCart: Plan[] = [];

export const cartState = atom({
	key: "cartState",
	default: initialCart,
});
export const orderState = atom({
	key: "orderState",
	default: {
		plan: {
			id: 0,
			name: "",
			explanation: "",
			price: "",
			image: "",
			stripe_price_id: "",
		},
		paidUser: {
			id: 0,
			name: "",
			email: "",
			postal_code: "",
			state: "",
			city: "",
			line1: "",
			line2: "",
			phone_number: "",
			is_owner: true,
			is_virtual_user: false,
		},
		receivedUser: {
			id: 0,
			name: "",
			email: "",
			postal_code: "",
			state: "",
			city: "",
			line1: "",
			line2: "",
			phone_number: "",
			is_owner: true,
			is_virtual_user: false,
		},
	},
});
