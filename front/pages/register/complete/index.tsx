import { NextPage } from "next";
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import Link from "next/link";
import { useRecoilState } from "recoil";
import { cartState } from "@/state/atom";
import Layout from "@/components/Layout";

let stripePromise: any;
if (process.env.NEXT_PUBLIC_STRIPE_PROMIS) {
  stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PROMIS);
}

const CartRegister: NextPage = () => {
  const [isMounted, setIsMounted] = useState(false);

  const [cart, setCart] = useRecoilState(cartState);

  React.useEffect(() => {
    const clientSecret = new URLSearchParams(window.location.search).get("payment_intent_client_secret");
    if (!clientSecret) {
      return;
    }
    stripePromise
      .then((stripe: any) => {
        if (!stripe) {
          return;
        }
        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }: any) => {
          if (!paymentIntent) {
            return;
          }
          switch (paymentIntent.status) {
            case "succeeded":
              const orderItem = localStorage.getItem("order-item");
              const cartItems = localStorage.getItem("cart-items");
              if (orderItem && cartItems) {
                const orderItemObj = JSON.parse(orderItem);
                const cartItemsObj = JSON.parse(cartItems);
                const orderPlanId = orderItemObj.plan.id;
                const orderReceivedUserId = orderItemObj.receivedUser.id;
                const updateCartItems = cartItemsObj.filter((item: any) => item.plan.id !== orderPlanId || item.receivedUser.id !== orderReceivedUserId);
                localStorage.setItem("cart-items", JSON.stringify(updateCartItems));
                setCart(updateCartItems);
                if (updateCartItems.length > 0) {
                  console.log(updateCartItems);
                  console.log(updateCartItems.length);
                }
              }
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
      })
      .then(() => {
        setIsMounted(true);
      });
  }, []);

  if (!isMounted) {
    return null; // マウント前は何も表示せずにロード中とする
  }
  return (
    <Layout>
      <div className="container mt-10 items-center mx-auto px-8 md:px-14 lg:px-24 w-full">
        <div>
          <h2 className="second-title-ja mr-4 mb-5">購入完了</h2>
          <p className="text-sm mb-5">定期便が届くのをお楽しみにお待ちください。</p>
        </div>
        <div>
          <button className="px-6 py-3 text-sm font-medium text-center my-5 text-blue-500 hover:text-blue-700 transition duration-500 ease-in-out transform border-2 border-blue-500 hover:border-blue-700 rounded-md">
            <Link href="/">TOPへ戻る</Link>
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default CartRegister;
