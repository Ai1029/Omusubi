import Image from "next/image";
import { GetServerSideProps, NextPage } from "next";
import axios from "axios";
import { parseCookies } from "nookies";
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
	family: TypeUser[];
	cookies: any;
};
const HOME: NextPage<Props> = ({ planList, family, cookies }) => {
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
	const cookies = parseCookies(context);
	const userID = cookies.id;
	let family: any[] = [];
	try {
		const plan = await axios.get(`${process.env.API_URL_SSR}/plans`);
		if (userID !== undefined) {
			const _family = await axios.get(`${process.env.API_URL_SSR}/family/${userID}`);
			family = _family.data;
		}
		return {
			props: {
				planList: plan.data,
				family: family,
				cookies: cookies,
			},
		};
	} catch (error) {
		console.error("データが取得できません");
		return {
			props: {
				planList: null,
				family: null,
				cookies: null,
			},
		};
	}
};
