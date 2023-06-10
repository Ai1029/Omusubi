import Head from "next/head";
import Link from "next/link";
import React, { ReactNode, useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { cartState } from "@/state/atom";

interface Props {
	children: ReactNode;
}

const Layout = ({ children }: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	const [cart, setCart] = useRecoilState(cartState);
	const [isMounted, setIsMounted] = useState(false);
	useEffect(() => {
		const storedValue = localStorage.getItem("cart-items");
		if (storedValue) {
			const parsedCart = JSON.parse(storedValue);
			setCart(parsedCart);
		}
		setIsMounted(true);
	}, []);
	if (!isMounted) {
		return null; // マウント前は何も表示せずにロード中とする
	}

	return (
		<>
			<Head>
				<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
				<link rel="icon" href="/favicon.ico"></link>
				<title>Omusubi</title>
			</Head>
			<header className="py-6 bg-body-yellow">
				<div className="container mx-auto flex justify-between items-center px-8 md:px-14 lg:px-24 w-full">
					<Link href="/" className="hover:opacity-50">
						<img src="/images/logo.png" className="w-[150px] h-auto" alt="画像" />
					</Link>

					<div className="hidden md:block">
						<Navbar cartCount={cart.length > 0 ? cart.length : 0} />
					</div>

					<div className="md:hidden">
						<div>
							<button onClick={() => setIsOpen(!isOpen)} className="inline-block text-gray-600 hover:text-black focus:text-black focus:outline-none">
								{isOpen ? <i className="fa-solid fa-xmark fa-2x"></i> : <i className="fa-solid fa-bars fa-2x"></i>}
							</button>
						</div>

						<div>
							<div className={`md:flex md:items-center md:w-auto ${isOpen ? "block" : "hidden"}`}>
								<ul className="fixed left-0 px-8 mt-7 bg-body-yellow w-full text-center">
									<li className="py-3 border-b">
										<Link href="/" onClick={() => setIsOpen(false)} className="hover:text-selected-text transition-all duration-300">
											TOP
										</Link>
									</li>
									<li className="py-3 border-b">
										<Link href="/mypage" onClick={() => setIsOpen(false)} className="hover:text-selected-text transition-all duration-300">
											MyPage
										</Link>
									</li>
									{/*
									<li className="py-3 border-b">
										<Link href="#" onClick={() => setIsOpen(false)} className="hover:text-selected-text transition-all duration-300">
											おすすめ登録
										</Link>
									</li>
									*/}
									<li className="py-3 border-b">
										<Link href="/cart" onClick={() => setIsOpen(false)} className="hover:text-selected-text transition-all duration-300">
											カートを見る
											<span className="bg-red text-white text-xs rounded-full px-2 py-1 ml-1">{cart.length > 0 ? cart.length : 0}</span>
										</Link>
									</li>
									<li className="py-3">
										<Link href="#" onClick={() => setIsOpen(false)} className="hover:text-selected-text transition-all duration-300">
											サインイン
										</Link>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</header>
			<main>{children}</main>
		</>
	);
};

type NavProps = {
	cartCount: number;
};
export const Navbar: React.FC<NavProps> = ({ cartCount }) => {
	return (
		<div className="text-sm space-x-5 hidden md:flex items-center">
			<Link href="/" className="hover:text-selected-text transition-all duration-300">
				TOP
			</Link>
			<Link href="/mypage" className="hover:text-selected-text transition-all duration-300">
				MyPage
			</Link>
			{/*
			<Link href="#" className="hover:text-selected-text transition-all duration-300">
				おすすめ登録
			</Link>
			*/}
			<Link href="/cart" className="hover:text-selected-text transition-all duration-300">
				カートを見る
				<span className="bg-red text-white text-xs rounded-full px-2 py-1 ml-1">{cartCount}</span>
			</Link>
			<Link href="#" className="hover:text-selected-text transition-all duration-300">
				お問い合わせ
			</Link>
		</div>
	);
};

export default Layout;
