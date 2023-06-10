import { NextPage } from "next";
import PlanItem from "./PlanItem";

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

// 商品一覧ページ
const Plan: NextPage<Props> = ({ planList }) => {
	return (
		<>
			<div className="container mt-10 flex justify-between items-center mx-auto px-8 md:px-14 lg:px-24 w-full">
				<section>
					<div className="flex items-center mb-5">
						<h2 className="second-title mr-4">PLAN</h2>
						<div className="bg-red p-2">
							<h3 className="text-white text-sm">おかず</h3>
						</div>
					</div>
					{planList ? (
						<ul className="justify-between items-start mx-auto grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3  mb-10">
							{planList.map((plan) => (
								<li key={plan.id}>
									<PlanItem plan={plan} />
								</li>
							))}
						</ul>
					) : (
						<p>準備中...</p>
					)}
				</section>
			</div>
		</>
	);
};

export default Plan;
