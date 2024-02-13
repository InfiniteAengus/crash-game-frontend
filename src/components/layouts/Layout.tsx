"use client";
import Head from "next/head";
import cx from "classnames";
import Header from "./Header";
import { Provider } from "react-redux";
import { store } from "@/store";
import SocketProvider from "@/providers/socket";

interface LayoutProps {
  children?: React.ReactNode;
  className?: string;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({
  title,
  children = <></>,
  className,
}) => {
  return (
    <>
      <Head>{title && <title>{title}</title>}</Head>
      <div className="flex h-screen w-full flex-col overflow-y-auto overflow-x-hidden">
        <Provider store={store}>
          <SocketProvider />
          <Header />
          <main className={cx(className)}>{children}</main>
        </Provider>
      </div>
    </>
  );
};

export default Layout;
