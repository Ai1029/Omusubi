import { atom } from "recoil";

type Plan = {
  id: number;
  name: string;
  explanation: string;
  price: string;
  image: string;
  stripe_price_id: string;
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
    price: "",
    image: "",
    stripe_price_id: "",
  },
  paidUser: {
    id: 0,
    name: "",
    email: "",
    zipcode: "",
    prefecture: "",
    city: "",
    town: "",
    apartment: "",
    phone_number: "",
    is_owner: false,
    is_virtual_user: false,
  },
  receivedUser: {
    id: 0,
    name: "",
    email: "",
    zipcode: "",
    prefecture: "",
    city: "",
    town: "",
    apartment: "",
    phone_number: "",
    is_owner: false,
    is_virtual_user: false,
  },
};
const initialCart: CartItem[] = [];

export const cartState = atom({
  key: "cartState",
  default: initialCart,
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
