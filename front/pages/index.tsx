import Image from "next/image";
import { GetServerSideProps, NextPage } from "next";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "@/components/Layout";
import { useRecoilValue } from "recoil";
import { userIDState } from "@/state/atom";
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

type TypeUser = {
	id: number;
	name: string;
	email: string;
	postal_code: string;
	state: string;
	city: string;
	line1: string;
	line2: string;
	phone_number: string;
	is_owner: boolean;
	is_virtual_user: boolean;
};

type Props = {
	planList: TypePlan[];
};

const HOME: NextPage<Props> = ({ planList }) => {
	const [isMounted, setIsMounted] = useState(false);
	const userID = useRecoilValue(userIDState);
	const apiUrl = process.env.NEXT_PUBLIC_API_URL;
	const ENDPINST_URL = apiUrl + "family";
	const [family, setFamily] = useState<TypeUser[]>([]);

	useEffect(() => {
		const fetchFamily = async () => {
			try {
				const response = await axios.get(`${ENDPINST_URL}/${userID}`);
				const familyData = response.data;
				setFamily(familyData);
			} catch (error) {
				console.error(error);
			}
		};
		if (userID) {
			fetchFamily();
		}
	}, [userID]);
	useEffect(() => {
		setIsMounted(true);
	}, []);
	if (!isMounted) {
		return null; // マウント前は何も表示せずにロード中とする
	}
	console.log(family);

	return (
		<Layout>
			<Topimage />
			<Delivery />
			<Plan planList={planList} family={family} />
			<Orderhistory />
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
