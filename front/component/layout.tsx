import { ReactNode } from "react";
import Link from "next/link";
import Head from "next/head";

interface Props {
	children: ReactNode;
}
const Layout = ({ children }: Props) => {
	return (
		<>
			<Head>
				<title>Omusubi</title>
			</Head>
			<header>
				<h1>Omusubi</h1>
				<nav>
					<ul>
						<li>
							<div>
								<Link href="/">HOME</Link>
							</div>
						</li>
					</ul>
				</nav>
			</header>
			<main>{children}</main>
		</>
	);
};

export default Layout;
