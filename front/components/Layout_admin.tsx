import Head from "next/head";
import Link from "next/link";
import { ReactNode, useState } from "react";

interface Props {
  children: ReactNode;
}

const Layout_admin = ({ children }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  console.log("isOpen", isOpen);
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
        <title>Omusubi_admin</title>
      </Head>
      <header className="py-6 bg-body-yellow">
        <div className="container mx-auto flex justify-between items-center px-8 md:px-14 lg:px-24 w-full">
          <Link href="/admin" className="hover:opacity-50">
            <img
              src="/images/logo.png"
              className="w-[150px] h-auto"
              alt="画像"
            />
          </Link>
          <p>管理者画面</p>
        </div>
      </header>
      <main>{children}</main>
    </>
  );
};

export default Layout_admin;
