import Image from "next/image";
import { Inter } from "next/font/google";
import Layout from "../components/Layout";
import Topimage from "../components/Topimage";
import Shop from "../components/Shop";

import { NextPage } from "next";

const inter = Inter({ subsets: ["latin"] });

const Home: NextPage = () => {
  return (
    <Layout>
      <Topimage />
      <Shop />
      {/* <p>次回のお届け</p>
      <p>同時配送</p>
      <p>もっと見る</p>
      <button>商品を追加・変更する</button>
      <h3>SHOP</h3>
      <p>定期便</p>
      <p>おかず</p> */}
    </Layout>
  );
};

export default Home;
