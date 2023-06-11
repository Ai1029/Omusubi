import { atom } from "recoil";

type Plan = {
  id: number;
  name: string;
  explanation: string;
  price: string;
  image: string;
  stripe_price_id: string;
};
type Subscription = {
  id: number;
  stripe_subscription_id: string;
  next_payment: string;
  plan: Plan;
  paid_user: User;
  received_user: User;
};
type User = {
  id: number;
  name: string;
  email: string;
  uid: string;
  family_id: number;
  phonetic: string;
  zipcode: string;
  prefecture: string;
  city: string;
  town: string;
  apartment: string | null;
  phone_number: string;
  is_owner: boolean;
  is_virtual_user: boolean;
};
type CartItem = {
  plan: Plan;
  paidUser: User;
  receivedUser: User;
};

export const cartState = atom<CartItem[]>({
  key: "cartState",
  default: [],
});

export const orderState = atom<CartItem[]>({
  key: "orderState",
  default: [],
});

export const isLoggedInState = atom<boolean>({
  key: "isLoggedInState",
  default: false,
});

export const userIDState = atom<number>({
  key: "userIDState",
  default: 0,
});

export const familyIDState = atom<number>({
  key: "familyIDState",
  default: 0,
});

export const familyState = atom<User[]>({
  key: "familyState",
  default: [],
});

// my subscription state
export const mySubState = atom<Subscription[]>({
  key: "mySubState",
  default: [],
});
// family subscription state
export const familySubState = atom<Subscription[]>({
  key: "familySubState",
  default: [],
});
