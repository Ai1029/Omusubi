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
};

// 商品一覧ページ

const Plan: NextPage<Props> = ({ planList, family }) => {
	return (
		<>
		<div className="container mt-10 flex justify-between items-center mx-auto px-8 md:px-14 lg:px-24 w-full">
			<div className="flex items-center space-x-2 mb-5">
				<h2 className="second-title">PLAN</h2>
				<h3 className="text-xs bg-red text-white px-2 py-1">おかず</h3>
			</div>
				<div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3  mb-10">
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
			</div>	
		</>
	);
};

export default Plan;
