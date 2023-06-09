import { useState, useEffect } from "react";
import axios from "axios";
import Layout_admin from "../../components/Layout_admin";
import Link from "next/link";
import { S3 } from "aws-sdk";

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

// S3に上がっている写真を削除する
const deleteImageFromS3 = async (imageURL: string) => {
  if (!imageURL) {
    return;
  }

  const fileName = imageURL.split("/").pop();
  const params = {
    Bucket: process.env.S3_BUCKET_NAME ? process.env.S3_BUCKET_NAME : "",
    Key: `shop/${fileName}`,
  };

  try {
    await s3.deleteObject(params).promise();
    console.log("前の画像を削除しました");
  } catch (error) {
    console.error("画像の削除エラー", error);
  }
};

type Plan = {
  name: string;
  explanation: string;
  price: number;
  imageFile: File | null;
  imageURL: string;
};

const PlanForm = ({ data }: any) => {
  const [plan, setPlan] = useState<Plan>({
    name: "",
    explanation: "",
    price: 0,
    imageFile: null,
    imageURL: "",
  });

  useEffect(() => {
    setPlan({
      name: data.name,
      explanation: data.explanation,
      price: data.price,
      imageFile: null,
      imageURL: data.image,
    });
  }, [data]);

  const handleImageUpload = async (event: any) => {
    const file = event.target.files[0];
    const imageURL = await uploadImageToS3(file);

    // 前の画像を削除
    deleteImageFromS3(plan.imageURL);

    setPlan(
      (prevPlan) =>
        ({
          ...prevPlan,
          imageFile: file,
          imageURL: imageURL,
        } as typeof prevPlan)
    );
  };

  const handleEdit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    const planData = {
      name: plan.name,
      explanation: plan.explanation,
      price: plan.price,
      image: plan.imageURL,
    };

    try {
      await axios.patch(`http://localhost:8080/plan/${data.id}`, planData);
      console.log("修正内容が反映されました");
    } catch (error) {
      console.log(error);
    }

    // 保存したら値は空にする
    setPlan({
      name: "",
      explanation: "",
      price: 0,
      imageFile: null,
      imageURL: "",
    });
  };

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setPlan((prevPlan) => ({
      ...prevPlan,
      [name]: value,
    }));
  };

  return (
    <Layout_admin>
      <div className="container mt-10 mb-10 items-center mx-auto px-8 md:px-14 lg:px-24 w-full">
        <div>
          <form onSubmit={handleEdit} className="space-y-4">
            <p>定期便プラン</p>
            <input
              type="text"
              name="name"
              value={plan.name}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
            <p>定期便プラン詳細</p>
            <input
              type="text"
              name="explanation"
              value={plan.explanation}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
            <p>定期便プラン金額（円）</p>
            <input
              type="text"
              name="price"
              value={plan.price}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
            <p>定期便プラン画像</p>
            <img
              src={plan.imageURL}
              className="w-full object-contain max-w-[300px]"
            />
            <input type="file" onChange={handleImageUpload} />
            <div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                編集
              </button>
            </div>
            <div className="rounded-lg">
              <Link href={`/admin`}>
                <button className="border-2 border-blue-500 text-blue-600 px-4 py-2 rounded-md">
                  管理者トップページに戻る
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Layout_admin>
  );
};

export default PlanForm;

// プラン一覧をgetする
export const getServerSideProps = async (context: any) => {
  const id = Number(context.params.id);
  try {
    const res = await axios.get(`http://api:8080/plan/${id}`);
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
