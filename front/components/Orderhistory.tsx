import React, { useContext } from "react";

// Subscripttionsの仮データ
const data = [
  {
    id: 1,
    plan_id: 1,
    paiduser_id: 1,
    receiveduser_id: 2,
    is_active: true,
    plan: {
      name: "ワクワクプラン",
      price: "1000円",
      explanation: "季節の野菜をふんだんに使ったプラン",
      nextdelivery: "筑前煮:200g、ほうれん草のおひたし:100g", // ER図に入ってないけど〜〜
      image:
        "https://s3.ap-northeast-1.amazonaws.com/omusubi.inc/shop/1685513575374-25670817_s.jpg",
    },
  },
];

// 商品一覧ページ
const Orderhistory = () => {
  return (
    <>
      <div className="container mt-10 flex justify-between items-center mx-auto px-8 md:px-14 lg:px-24 w-full mb-10">
        <section>
          <p className="second-title mb-5">注文履歴</p>

          <div className="flex flex-col">
            <div className="-m-1.5 overflow-x-auto">
              <div className="p-1.5 min-w-full inline-block align-middle">
                <div className="border rounded-lg overflow-hidden dark:border-gray-700">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400"
                        >
                          配送日
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400"
                        >
                          注文プラン
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400"
                        >
                          宛先
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400"
                        >
                          おすすめ度
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                          2023/5/25
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                          ワクワクプラン
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                          〇〇様に〇〇個、〇〇様に〇〇個お届け
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <a
                            className="text-blue-500 hover:text-blue-700"
                            href="#"
                          >
                            おすすめ度の評価
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
export default Orderhistory;
