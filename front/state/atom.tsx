import { atom } from "recoil";

type Plan = {
  id: number;
  name: string;
  explanation: string;
  price: number;
  image: string;
  stripe_price_id: string;
};
type Subscription = {
  id: number;
  create_at: string;
  stripe_subscription_id: string;
  next_payment: string;
  plan: Plan;
  paid_user: User;
  received_user: User;
};
type Order = {
  id: number;
  plan_id: number;
  plan_name: string;
  plan_explanation: string;
  price: number;
  payment_date: string;
  stripe_subscription_id: string;
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

const initialOrder = {
  plan: {
    id: 0,
    name: "",
    explanation: "",
    price: 0,
    image: "",
    stripe_price_id: "",
  },
  paidUser: {
    id: 0,
    name: "",
    email: "",
    uid: "",
    family_id: "",
    phonetic: "",
    zipcode: "",
    prefecture: "",
    city: "",
    town: "",
    apartment: "",
    phone_number: "",
    is_owner: true,
    is_virtual_user: false,
  },
  receivedUser: {
    id: 0,
    name: "",
    email: "",
    uid: "",
    family_id: "",
    phonetic: "",
    zipcode: "",
    prefecture: "",
    city: "",
    town: "",
    apartment: "",
    phone_number: "",
    is_owner: true,
    is_virtual_user: false,
  },
};

export const cartState = atom<CartItem[]>({
  key: "cartState",
  default: [],
});

export const orderState = atom({
  key: "orderState",
  default: initialOrder,
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

// family subscription state
export const orderHistory = atom<Order[]>({
  key: "orderHistory",
  default: [],
});
