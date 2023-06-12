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
      <div className="container mt-10 items-center mx-auto px-8 md:px-14 lg:px-24 w-full">
        <h1 className="second-title-ja mb-5">次回のお届けプラン</h1>
        <section className="w-fll">
          <div className="lg:grid mx-auto mt-5 md:grid-cols-2 lg:grid-cols-2 lg:gap-10">
            <div className="col-span-2 lg:col-span-2 flex flex-col mb-3 overflow-hidden">
              <div className="lg:flex lg:space-x-4">
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
                        {item.plan.name}
                      </p>
                      <p className="text-sm text-gray-500 leading-6">
                        {item.plan.explanation}
                      </p>
                    </div>
                  ))}
                </div>
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
                          {item.plan.name}
                        </p>
                        <p className="text-sm text-gray-500 leading-6">
                          {item.plan.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="flex justify-center items-center mb-20">
          <button className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
            プランを変更する
          </button>
        </div>
      </div>
    </>
  );
};
export default Delivery;
