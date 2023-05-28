import Image from "next/image";
import { Inter } from "next/font/google";
import Layout from "../components/Layout";
import { NextPage } from "next";

const inter = Inter({ subsets: ["latin"] });

const Home: NextPage = () => {
  return <Layout>ここにメインの内容を入れる</Layout>;
};

export default Home;
