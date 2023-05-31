import { S3 } from "aws-sdk";
import { useState } from "react";
import axios from "axios";
import Layout_admin from "../components/Layout_admin";
import Link from "next/link";

// S3の設定
const s3 = new S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
});

// S3に画像をアップロードし、そのURLを取得する
const uploadImageToS3 = async (file: File) => {
  // アップロード時のファイル名を作成
  const fileName = `shop/${Date.now()}-${file.name}`;
  // S3へのアップロードに必要な情報をまとめるオブジェクト
  const params: AWS.S3.PutObjectRequest = {
    Bucket: process.env.S3_BUCKET_NAME ? process.env.S3_BUCKET_NAME : "",
    Key: fileName,
    ContentType: file.type,
    Body: file,
  };

  try {
    // S3に画像をアップロード
    const data = await s3.upload(params).promise();
    // アップロード成功時の処理
    console.log("画像アップロード成功しました", data.Location);
    // アップロードされた画像のURLを取得
    return data.Location;
  } catch (error) {
    console.error("画像アップロードエラー", error);
    return null;
  }
};

type Plan = {
  name: string;
  explanation: string;
  price: string;
  imageFile: File | null;
  imageURL: string;
};

const PlanForm = ({ data }) => {
  const [plan, setPlan] = useState<Plan>({
    name: "",
    explanation: "",
    price: "",
    imageFile: null,
    imageURL: "",
  });

  const handleImageUpload = async (event: any) => {
    const file = event.target.files[0];
    const imageURL = await uploadImageToS3(file);
    setPlan(
      (prevPlan) =>
        ({
          ...prevPlan,
          imageFile: file,
          imageURL: imageURL,
        } as typeof prevPlan)
    );
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    const planData = {
      name: plan.name,
      explanation: plan.explanation,
      price: plan.price,
      image: plan.imageURL,
    };

    try {
      await axios.post("http://localhost:8080/plans", planData);
      console.log("正しく保存されました");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
    // 保存したら値は空にする
    setPlan({
      name: "",
      explanation: "",
      price: "",
      imageFile: null,
      imageURL: "",
    });
  };

  const handleDelete = async (id: number) => {
    try {
      // データベースからデータを削除するリクエストを送信
      await axios.delete(`http://localhost:8080/plan/${id}`);
      console.log("データベースから削除されました");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout_admin>
      <div className="container mt-10 items-center mx-auto px-8 md:px-14 lg:px-24 w-full">
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <p>定期便プラン</p>
            <input
              type="text"
              name="name"
              value={plan.name}
              onChange={(event) =>
                setPlan((prevPlan) => ({
                  ...prevPlan,
                  name: event.target.value,
                }))
              }
              className="border border-gray-300 rounded-md p-2 w-full"
            />
            <p>定期便プラン詳細</p>
            <input
              type="text"
              name="explanation"
              value={plan.explanation}
              onChange={(event) =>
                setPlan((prevPlan) => ({
                  ...prevPlan,
                  explanation: event.target.value,
                }))
              }
              className="border border-gray-300 rounded-md p-2 w-full"
            />
            <p>定期便プラン金額</p>
            <input
              type="text"
              name="price"
              value={plan.price}
              onChange={(event) =>
                setPlan((prevPlan) => ({
                  ...prevPlan,
                  price: event.target.value,
                }))
              }
              className="border border-gray-300 rounded-md p-2 w-full"
            />
            <p>定期便プラン画像</p>
            <input type="file" onChange={handleImageUpload} />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              新しい定期便プランを追加
            </button>
          </form>
        </div>

        <p className="mt-20 mb-10">プラン一覧</p>
        <section className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4  mb-10">
          {data.map((item) => (
            <>
              <div
                key={item.id}
                className="mx-auto flex w-50 flex-col justify-center bg-white rounded-2xl shadow-xl shadow-gray-400/20"
              >
                <img
                  className="aspect-video w-50 rounded-t-2xl object-cover object-center"
                  src={item.image}
                  alt={item.name}
                />
                <div className="flex flex-col justify-between h-full p-6">
                  <h1 className="text-2xl font-medium text-gray-700 pb-2">
                    {item.name}
                  </h1>
                  <p className="text text-gray-500 leading-6">
                    {item.explanation}
                  </p>
                  <p className="text text-gray-500 leading-6">{item.price}円</p>
                </div>
                <div className="flex justify-center mt-4 mb-4">
                  <div className="rounded-lg">
                    <Link href={`/admin_edit/${item.id}`}>
                      <button className="items-center block w-full h-full px-4 py-2 text-sm font-medium text-center text-blue-600 transition duration-500 ease-in-out transform border-2 border-blue-500 rounded-md">
                        編集
                      </button>
                    </Link>
                  </div>
                  <div className="ml-4 rounded-lg">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="items-center block w-full h-full px-4 py-2 text-sm font-medium text-center text-white transition duration-500 ease-in-out transform bg-blue-500 rounded-md hover:bg-blue-700"
                    >
                      削除
                    </button>
                  </div>
                </div>
              </div>
            </>
          ))}
        </section>
      </div>
    </Layout_admin>
  );
};

export default PlanForm;

// プラン一覧をgetする
export const getServerSideProps = async () => {
  try {
    const res = await axios.get("http://api:8080/plans");
    console.log("res", res);
    return {
      props: {
        data: res.data,
      },
    };
  } catch (error) {
    console.error("データが取得できません", error);
    return {
      props: {
        data: null,
      },
    };
  }
};
