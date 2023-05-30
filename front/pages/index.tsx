import Image from "next/image";
import { GetServerSideProps, NextPage } from "next";
import Layout from "@/component/layout";
import axios from "axios";
import Topimage from "../components/Topimage";
import Shop from "../components/Shop";
type TypeItem = {
	id: number;
	name: string;
	detail: string;
	quantity: number;
};

type Props = {
	posts: TypeItem[];
	user_id: number;
};

const HOME: NextPage<Props> = (props) => {
	// console.log(props.posts);
	const items = props.posts;
	return (
		<Layout>
			<main>
				<h2>TOPページ</h2>
				<ul>
					{items.map((item) => (
						<li key={item.id}>
							<div>
								<h3>{item.name}</h3>
								<p>{item.detail}</p>
								<p>{item.quantity}個</p>
							</div>
						</li>
					))}
				</ul>
      <Topimage />
      <Shop />
      {/* <p>次回のお届け</p>
      <p>同時配送</p>
      <p>もっと見る</p>
      <button>商品を追加・変更する</button>
      <h3>SHOP</h3>
      <p>定期便</p>
      <p>おかず</p> */}
			</main>
		</Layout>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	let posts = [];

	// console.log(process.env.API_URL_SSR);
	// console.log(process.env.NEXT_PUBLIC_API_URL);

	try {
		const res = await axios.get(`${process.env.API_URL_SSR}/allitem`);
		posts = await res.data;
	} catch (error) {
		console.log(error);
	}

	return { props: { posts } };
};

export default HOME;