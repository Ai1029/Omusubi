import { GetServerSideProps, NextPage } from "next";
import axios from "axios";
import Layout from "@/components/Layout";
import Link from "next/link";

const order = {
	paiduser_id: 1,
	receiveduser_id: 2,
	plan_id: 1,
	stripe_id: "price_1NDZZSI8t6lPUIZhQOPQFe8D",
};

type BuyProps = {
	apiURL: string;
};

const Buy: NextPage<BuyProps> = ({ apiURL }) => {
	const onCreateCheckoutSesstion = async (e: React.FormEvent) => {
		e.preventDefault();
		console.log(apiURL)
		console.log(process.env.NEXT_PUBLIC_API_URL);
		await axios.post(`${apiURL}buy`, order).then((res) => {
			console.log(res.data.sessionURL);
			const sessionURL = res.data.sessionURL;
			window.location.href = sessionURL;
		});
	};

	console.log(apiURL)
	return (
		<Layout>
			<h2>購入確認画面</h2>
			<p>自宅用</p>
			<div>
				<a href="https://buy.stripe.com/test_5kAcPZfl68kVeIwdQQ">支払い</a>
			</div>
			<div>
				<ul>
					<li>
						<h3>プラン名</h3>
						<p>詳細テキスト</p>
						<p>価格：1000円</p>
					</li>
				</ul>
			</div>
			<form onSubmit={onCreateCheckoutSesstion}>
				<input type="submit" value="送信" />
			</form>
		</Layout>
	);
};

export default Buy;

export const getServerSideProps: GetServerSideProps = async () => {
	const apiURL = process.env.API_URL;
	return {
		props: {
			apiURL: apiURL,
		},
	};
};
