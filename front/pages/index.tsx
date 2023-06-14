import Image from "next/image";
import { GetServerSideProps, NextPage } from "next";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { isLoggedInState } from "@/state/atom";
import Layout from "@/components/Layout";
import Topimage from "@/components/Topimage";
import Plan from "@/components/Plan";
import Delivery from "@/components/Delivery";
import Orderhistory from "@/components/Orderhistory";

type TypePlan = {
  id: number;
  name: string;
  explanation: string;
  price: string;
  image: string;
  stripe_price_id: string;
};

type Props = {
  planList: TypePlan[];
};

const HOME: NextPage<Props> = ({ planList }) => {
  const [isMounted, setIsMounted] = useState(false);
  const isLogined = useRecoilValue(isLoggedInState);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null; // マウント前は何も表示せずにロード中とする
  }
  return (
    <Layout>
      <Topimage />
      {isLogined && <Delivery />}
      <Plan planList={planList} />
      {isLogined && <Orderhistory />}
    </Layout>
  );
};

export default HOME;

// プラン一覧をgetする
export const getServerSideProps: GetServerSideProps = async (context) => {
  let plan: TypePlan[] = [];
  try {
    const _plan = await axios.get(`${process.env.API_URL_SSR}/plans`);
    plan = _plan.data;
  } catch (error) {
    console.error("データが取得できません", error);
  }
  return {
    props: {
      planList: plan,
    },
  };
};
