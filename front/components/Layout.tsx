import Head from "next/head";
import Link from "next/link";
import { ReactNode, useState } from "react";
import React, { useContext } from "react";
import { CartContext } from "@/pages/_app";

interface Props {
  children: ReactNode;
}

export const Navbar = () => {
  const { cart } = useContext(CartContext);
  const cartItemCount = cart.length; // カートに入っている商品の数

  return (
    <div className="text-sm space-x-5 hidden md:flex items-center">
      <Link
        href="/"
        className="hover:text-selected-text transition-all duration-300"
      >
        TOP
      </Link>
      <Link
        href="#"
        className="hover:text-selected-text transition-all duration-300"
      >
        MyPage
      </Link>
      <Link
        href="#"
        className="hover:text-selected-text transition-all duration-300"
      >
        おすすめ登録
      </Link>
      <Link
        href="/cart"
        className="hover:text-selected-text transition-all duration-300"
      >
        カートを見る
        <span className="bg-red text-white text-xs rounded-full px-2 py-1 ml-1">
          {cartItemCount}
        </span>
      </Link>
      <Link
        href="#"
        className="hover:text-selected-text transition-all duration-300"
      >
        お問い合わせ
      </Link>
    </div>
  );
};

const Layout = ({ children }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  console.log("isOpen", isOpen);
  const { cart } = useContext(CartContext);
  const cartItemCount = cart.length; // カートに入っている商品の数

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <link rel="icon" href="/favicon.ico"></link>
        <title>Omusubi</title>
      </Head>
      <header className="py-6 bg-body-yellow">
        <div className="container mx-auto flex justify-between items-center px-8 md:px-14 lg:px-24 w-full">
          <Link href="/" className="hover:opacity-50">
            <img
              src="/images/logo.png"
              className="w-[150px] h-auto"
              alt="画像"
            />
          </Link>

          {/* 幅が768以上になるとナビゲーションメニュが出る */}
          <div className="hidden md:block">
            <Navbar />
          </div>

          {/* 幅が768未満になるとハンバーガーメニューが出る */}
          <div className="md:hidden">
            <div>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-block text-gray-600 hover:text-black focus:text-black focus:outline-none"
              >
                {isOpen ? (
                  //メニューが開いている時のアイコン
                  <i className="fa-solid fa-xmark fa-2x"></i>
                ) : (
                  //メニューが閉じている時のアイコン
                  <i className="fa-solid fa-bars fa-2x"></i>
                )}
              </button>
            </div>

            {/* メニューの表示非表示を制御 */}
            <div>
              <div
                className={`md:flex md:items-center md:w-auto ${
                  isOpen ? "block" : "hidden"
                }`}
              >
                <ul className="fixed left-0 px-8 mt-7 bg-body-yellow w-full text-center">
                  <li className="py-3 border-b">
                    <Link
                      href="/"
                      onClick={() => setIsOpen(false)} // リンクがクリックされたときにハンバーガーメニューを閉じる
                      className="hover:text-selected-text transition-all duration-300"
                    >
                      TOP
                    </Link>
                  </li>
                  <li className="py-3 border-b">
                    <Link
                      href="#"
                      onClick={() => setIsOpen(false)} // リンクがクリックされたときにハンバーガーメニューを閉じる
                      className="hover:text-selected-text transition-all duration-300"
                    >
                      MyPage
                    </Link>
                  </li>
                  <li className="py-3 border-b">
                    <Link
                      href="#"
                      onClick={() => setIsOpen(false)} // リンクがクリックされたときにハンバーガーメニューを閉じる
                      className="hover:text-selected-text transition-all duration-300"
                    >
                      おすすめ登録
                    </Link>
                  </li>
                  <li className="py-3 border-b">
                    <Link
                      href="/cart"
                      onClick={() => setIsOpen(false)} // リンクがクリックされたときにハンバーガーメニューを閉じる
                      className="hover:text-selected-text transition-all duration-300"
                    >
                      カートを見る
                      <span className="bg-red text-white text-xs rounded-full px-2 py-1 ml-1">
                        {cartItemCount}
                      </span>
                    </Link>
                  </li>
                  <li className="py-3">
                    <Link
                      href="#"
                      onClick={() => setIsOpen(false)} // リンクがクリックされたときにハンバーガーメニューを閉じる
                      className="hover:text-selected-text transition-all duration-300"
                    >
                      お問い合わせ
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

export default Layout;
