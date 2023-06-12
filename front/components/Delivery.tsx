import React from "react";
import { useRecoilValue } from "recoil";
import { mySubState, familySubState } from "@/state/atom";

// Subscripttionsの仮データ
//const data = [
//{
//id: 1,
//plan_id: 1,
//paiduser_id: 1,
//receiveduser_id: 2,
//is_active: true,
//plan: {
//name: "ワクワクプラン",
//price: "1000円",
//explanation: "季節の野菜をふんだんに使ったプラン",
//nextdelivery: "筑前煮:200g、ほうれん草のおひたし:100g", // ER図に入ってないけど〜〜
//image: "https://s3.ap-northeast-1.amazonaws.com/omusubi.inc/shop/1685513575374-25670817_s.jpg",
//},
//},
//];

// 商品一覧ページ
const Delivery = () => {
  const myData = useRecoilValue(mySubState);
  const familyData = useRecoilValue(familySubState);
  console.log(myData);
  console.log(familyData);
  return (
    <>
      <div className="container mt-10 flex justify-between items-center mx-auto px-8 md:px-14 lg:px-24 w-full">
        {myData ? (
          <div>
            <p>自宅にお届け</p>
            {myData.map((item, index) => (
              <div key={index}>
                <p>{item.plan.name}</p>
                <div>
                  <img className="object-cover w-full h-48 rounded-lg mt-4" src={item.plan.image} alt="" />
                </div>
                <p>{item.plan.explanation}</p>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <p>自宅にお届けする商品はまだありません</p>
          </div>
        )}
        {familyData ? (
          <div>
            <p>家族にお届け</p>
            {familyData.map((item, index) => (
              <div key={index}>
                <p>{item.received_user.name}さんにお届け</p>
                <p>{item.plan.name}</p>
                <div>
                  <img className="object-cover w-full h-48 rounded-lg mt-4" src={item.plan.image} alt="" />
                </div>
                <p>{item.plan.explanation}</p>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <p>家族にお届けする商品はまだありません</p>
          </div>
        )}
        {/*
          <div key={index}>
            <section>
              <div className="lg:grid max-w-70 mx-auto mt-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
                <div className="col-span-2 lg:col-span-2 flex flex-col mb-3 overflow-hidden lg:2/3">
                  <div className="flex-shrink-0">
                    <h1 className="text-base font-bold text-white bg-font-yellow py-1 px-4 mb-5">次回のお届けプラン</h1>
                    <p>2023年6月16日（金）配送予定</p>
                    <p>{item.received_user.name}様にお届け</p>
                    <img className="object-cover w-full h-55 rounded-lg mt-4" src={item.plan.image} alt="" />
                  </div>

                  <div className="flex flex-col justify-between flex-1">
                    <div className="flex-1">
                      <div className="flex pt-2 space-x-1 text-xs text-gray-500">
                        <span> ※写真はイメージです </span>
                      </div>

                      <div className="block mt-4">
                        <h3 className="text-2xl font-semibold leading-none tracking-tighter text-gray-600 mb-4">{item.plan.name}</h3>
                        <p className="text text-gray-500 leading-6">{item.plan.nextdelivery}</p>
                        <p className="text text-gray-500 leading-6">数量：1</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:grid lg:grid-cols-1 lg:gap-8">
                  <div className="col-span-1 lg:col-span-1 flex flex-col mb-12 overflow-hidden lg:w-full">
                    <div className="flex-shrink-0">
                      <h1 className="text-base font-bold text-white bg-font-yellow py-1 px-4 mb-5">同時配送</h1>
                      <div>
                        <p>2023年6月16日（金）配送予定</p>
                        <p>〇〇様にお届け</p>
                        <img className="object-cover w-full h-48 rounded-lg mt-4" src={item.plan.image} alt="" />
                      </div>
                      <div className="flex flex-col justify-between flex-1">
                        <div className="flex-1">
                          <div className="flex pt-2 space-x-1 text-xs text-gray-500">
                            <span> ※写真はイメージです </span>
                          </div>
                          <div className="block mt-4">
                            <h3 className="text-2xl font-semibold leading-none tracking-tighter text-neutral-600 mb-4">{item.plan.name}</h3>
                            <p className="text text-gray-500 leading-6">{item.plan.nextdelivery}</p>
                            <p className="text text-gray-500 leading-6">数量：1</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
                     */}
      </div>
      {/*
      <div className="flex justify-center items-center mb-20">
        <button className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md">プランを変更する</button>
      </div>
      */}
    </>
  );
};
export default Delivery;
