import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import Layout from "@/components/Layout";
import CheckoutForm from "@/components/CheckoutForm";
import { useRecoilValue } from "recoil";
import { orderState } from "@/state/atom";

let stripePromis: any;
if (process.env.NEXT_PUBLIC_STRIPE_PROMIS) {
  stripePromis = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PROMIS);
}

const CartConfirm: NextPage = () => {
  const order = useRecoilValue(orderState);
  console.log(order);

  const appearance = {
    theme: "stripe",
  };
  const options: any = {
    mode: "subscription",
    amount: Number(order.plan.price),
    currency: "jpy",
    appearance,
  };
  if (!order) {
    return (
      <Layout>
        <p>Loading...</p>
      </Layout>
    );
  }

  const { paidUser, receivedUser, plan } = order;

  return (
    <Layout>
      <div className="container mt-10 items-center mx-auto px-8 md:px-14 lg:px-24 w-full">
        <div>
          <h2 className="second-title-ja mr-4 mb-5">注文情報</h2>
          <p className="text-sm mb-5">
            いつでも定期便の停止や解約が可能です。
            <br />
            また配送間隔やおかずセットの変更も可能です。
          </p>
        </div>
        <div>
          <section>
            <div>
              <div className="bg-red p-2 mb-5">{paidUser.id == receivedUser.id ? <h3 className="text-white text-sm">自宅にお届け</h3> : <h3 className="text-white text-sm">{receivedUser.name} 様にお届け</h3>}</div>
              <div className="flex flex-col bg-white border shadow-sm rounded-xl">
                <div className="bg-gray-100 border-b rounded-t-xl py-3 px-4 md:py-4 md:px-5">
                  <h4 className="text-sm font-bold mt-1 mb-1">請求先詳細</h4>
                </div>
                <div className="p-4 md:p-5">
                  <dl>
                    <div className="flex flex-wrap">
                      <dt className="mb-2 w-40">名前</dt>
                      <dd className="w-60">{paidUser.name}</dd>
                    </div>
                    <div className="flex flex-wrap">
                      <dt className="mb-2 w-40">住所</dt>
                      <dd className="w-60">
                        <span>〒{paidUser.zipcode} </span>
                        {paidUser.prefecture}
                        {paidUser.city}
                        {paidUser.town}
                        {paidUser.apartment}
                      </dd>
                    </div>
                    <div className="flex flex-wrap">
                      <dt className="mb-2 w-40">電話番号</dt>
                      <dd>{paidUser.phone_number}</dd>
                    </div>
                  </dl>
                </div>
              </div>
              <div>
                <button className="px-6 py-3 text-sm font-medium text-center my-5 text-blue-500 hover:text-blue-700 transition duration-500 ease-in-out transform border-2 border-blue-500 hover:border-blue-700 rounded-md">
                  <Link href={`/profile/update/${paidUser.id}`}>請求先の変更</Link>
                </button>
              </div>

              <div className="flex flex-col bg-white border shadow-sm rounded-xl mt-5">
                <div className="bg-gray-100 border-b rounded-t-xl py-3 px-4 md:py-4 md:px-5">
                  <h4 className="text-sm font-bold mt-1 mb-1">お届け先住所</h4>
                </div>
                <div className="p-4 md:p-5">
                  <dl>
                    <div className="flex flex-wrap">
                      <dt className="mb-2 w-40">名前</dt>
                      <dd className="w-60">{receivedUser.name}</dd>
                    </div>
                    <div className="flex flex-wrap">
                      <dt className="mb-2 w-40">住所</dt>
                      <dd className="w-60">
                        <span>〒{receivedUser.zipcode} </span>
                        {receivedUser.prefecture}
                        {receivedUser.city}
                        {receivedUser.town}
                        {receivedUser.apartment}
                      </dd>
                    </div>
                    <div className="flex flex-wrap">
                      <dt className="mb-2 w-40">電話番号</dt>
                      <dd className="w-60">{receivedUser.phone_number}</dd>
                    </div>
                  </dl>
                </div>
              </div>
              <h4 className="text-sm font-bold mb-3 mt-5">注文プラン情報</h4>
              <div className="flex flex-wrap item-center">
                <div>
                  <img src={plan.image} alt={plan.name} className="w-60 rounded-lg mr-4 overflow-hidden" />
                </div>
                <div>
                  <span className="text-sm font-bold mb-3 mt-3">定期便</span>
                  <p>{plan.name}</p>
                  <p>{plan.explanation}</p>
                  <p>数量：1</p>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className="w-3/5 mt-10 mb-10">
          <h4 className="text-sm font-bold mb-3 mt-10">支払いカード情報</h4>
          <Elements options={options} stripe={stripePromis}>
            <CheckoutForm order={order} />
          </Elements>
        </div>
      </div>
    </Layout>
  );
};

export default CartConfirm;
