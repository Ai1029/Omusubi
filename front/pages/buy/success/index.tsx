import { NextPage } from "next";
import axios from "axios";
import Layout from "@/components/Layout";
import Link from "next/link";


const Success = () => {
	return (
		<Layout>
			<h2>購入完了</h2>
			<p>購入が完了しました</p>
		</Layout>
	);
};

export default Success;
