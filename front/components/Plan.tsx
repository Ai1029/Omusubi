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
const Plan: NextPage<Props> = ({ planList, family }) => {
	return (
		<>
			<h2>PLAN</h2>
			<h3>おかず</h3>
			<div>
				{planList ? (
					<ul>
						{planList.map((plan) => (
							<li key={plan.id}>
								<PlanItem plan={plan} family={family} />
							</li>
						))}
					</ul>
				) : (
					<p>準備中...</p>
				)}
			</div>
		</>
	);
};

export default Plan;
