import React, { useContext } from "react";
import { useRecoilValue } from "recoil";
import { orderHistory } from "@/state/atom";

// 注文履歴ページ
const Orderhistory = () => {
  const data = useRecoilValue(orderHistory);
  return (
    <>
      <div className="container mt-10 mx-auto px-8 md:px-14 lg:px-24 w-full mb-10">
        <section>
          <p className="second-title-ja mb-5">注文履歴</p>
          {/* {data.map((item, index) => (
            <div key={index}>
              <p>
                {item.payment_date}
                これは注文日なので計算して配送日を入れるかそのままにするか
              </p>
              <p>{item.plan_name}</p>
              <p>{item.received_user.name}さんにお届け</p>
            </div>
          ))} */}

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
                          注文日
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
                      {data.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                            {item.payment_date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                            {item.plan_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                            {item.received_user.name}さんにお届け
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <a
                              className="text-blue-500 hover:text-blue-700"
                              href="#"
                            >
                              おすすめ度の評価
                            </a>
                          </td>
                        </tr>
                      ))}
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
