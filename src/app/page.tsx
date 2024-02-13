"use client";
import GameBoard from "@/components/GameBoard";
import GamePanel from "@/components/GamePanel";
import UsernameModal from "@/components/UsernameModal";
import Layout from "@/components/layouts/Layout";
import { players, history } from "@/data/mockup";
import SocketProvider from "@/providers/socket";
import { store } from "@/store";
import { useRef } from "react";
import { Provider } from "react-redux";

export default function Home() {
  const rocketRef = useRef(null);

  return (
    <Layout>
      <UsernameModal />
      <div className="2-full flex gap-5">
        <div>
          <GamePanel />
        </div>
        <div className="w-[800px] h-[600px] mx-auto text-white">
          <GameBoard
            players={players}
            history={history}
            refer={rocketRef}
            mywin={[]}
          />
        </div>
      </div>
    </Layout>
  );
}
