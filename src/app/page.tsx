'use client';

import GameBoard from '@/components/GameBoard';
import Layout from '@/components/layouts/Layout';
import { gameState, players, history } from '@/data/mockup';
import Image from 'next/image';
import { useRef } from 'react';

export default function Home() {
  const rocketRef = useRef(null);

  return (
    <Layout>
      <div className='w-[800px] h-[600px] mx-auto'>
        <GameBoard
          gameState={gameState}
          players={players}
          history={history}
          refer={rocketRef}
          mywin={[]}
        />
      </div>
    </Layout>
  );
}
