import { NextPage } from "next";
import axios from "axios";
import Layout from "@/components/Layout";

const order = {
	paiduser_id: 1,
	receiveduser_id: 2,
	plan_id: 1,
};

const onCreateCheckoutSesstion = async (e: React.FormEvent) => {
	e.preventDefault();
	await axios.post(`${process.env.NEXT_PUBLIC_API_URL}buy`, order).then((res) => {
		console.log(res.data);
	});
};

const Buy = () => {
	return (
		<Layout>
			<h2>購入確認画面</h2>
			<p>自宅用</p>
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
