import React from "react";
import { useRecoilValue } from "recoil";
import { mySubState, familySubState } from "@/state/atom";

// 次回のお届けプランページ
const Delivery = () => {
  const myData = useRecoilValue(mySubState);
  const familyData = useRecoilValue(familySubState);
  console.log(myData);
  console.log(familyData);
  return (
    <>
<<<<<<< HEAD
      <div className="container mt-10 items-center mx-auto px-8 md:px-14 lg:px-24 w-full">
        <h1 className="second-title-ja mb-5">次回のお届けプラン</h1>
        <section className="w-fll">
          <div className="lg:grid mx-auto mt-5 md:grid-cols-2 lg:grid-cols-2 lg:gap-10">
            <div className="col-span-2 lg:col-span-2 flex flex-col mb-3 overflow-hidden">
              <div className="lg:flex lg:space-x-4">
                {myData ? (
                  <div className="flex-shrink-0 lg:w-2/3">
                    <p className="text-base font-bold text-white bg-font-yellow py-1 px-4 mb-5">
                      自宅にお届け
                    </p>
                    {myData.map((item, index) => (
                      <div key={index} className="lg:col-span-1">
                        <div>
                          <img
                            className="object-cover w-full h-52 rounded-lg mb-3"
                            src={item.plan.image}
                            alt=""
                          />
                        </div>
                        <p className="text-sm text-gray-500 leading-6">
                          {new Date(
                            new Date(item.next_payment).getTime() +
                              2 * 24 * 60 * 60 * 1000
                          ).toLocaleDateString("ja-JP", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          })}
                          予定
                        </p>
                        <p className="text-sm text-gray-500 leading-6">
                          {item.plan.name}
                        </p>
                        <p className="text-sm text-gray-500 leading-6 mb-5">
                          {item.plan.explanation}
                        </p>
=======
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
>>>>>>> main
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <p>自宅にお届けする商品はまだありません</p>
                  </div>
                )}
                {familyData ? (
                  <div className="flex-shrink-0 lg:w-1/3">
                    <p className="text-base font-bold text-white bg-font-yellow py-1 px-4 mb-5">
                      家族にお届け
                    </p>
                    <div className="lg:grid lg:grid-cols-1 lg:gap-8">
                      {familyData.map((item, index) => (
                        <div key={index}>
                          <div>
                            <img
                              className="object-cover w-full h-32 rounded-lg mb-3"
                              src={item.plan.image}
                              alt=""
                            />
                          </div>
                          <p className="text-lg font-semibold text-gray-600 pb-1">
                            {item.received_user.name}さんにお届け
                          </p>
                          <p className="text-sm text-gray-500 leading-6">
                            {new Date(
                              new Date(item.next_payment).getTime() +
                                2 * 24 * 60 * 60 * 1000
                            ).toLocaleDateString("ja-JP", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            })}
                            予定
                          </p>
                          <p className="text-sm text-gray-500 leading-6">
                            {item.plan.name}
                          </p>
                          <p className="text-sm text-gray-500 leading-6">
                            {item.plan.explanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <p>家族にお届けする商品はまだありません</p>
                  </div>
                )}
              </div>
            </div>
          </div>
<<<<<<< HEAD
        </section>
        {myData ? (
          <div className="flex justify-center items-center mb-20">
            <button className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
              プランを変更する
            </button>
          </div>
        ) : (
          <div></div>
        )}
=======
                     */}
      </div>
      {/*
      <div className="flex justify-center items-center mb-20">
        <button className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md">プランを変更する</button>
>>>>>>> main
      </div>
      */}
    </>
  );
};
export default Delivery;
