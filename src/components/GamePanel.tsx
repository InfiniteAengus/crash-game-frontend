"use client";

import { SocketEventNames } from "@/data/constants";
import { socket } from "@/providers/socket";
import { RootState } from "@/store";
import { setBetAmount, updateBalance } from "@/store/reducers/gameStateReducer";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const GamePanel = () => {
  const dispatch = useDispatch();

  const player = useSelector((state: RootState) => state.gameState.player);
  const gameState = useSelector(
    (state: RootState) => state.gameState.gameState
  );
  const betAmount = useSelector(
    (state: RootState) => state.gameState.betAmount
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const placeBet = () => {
    if (gameState.timeElapsed < 5) {
      if (inputRef.current?.value && inputRef.current?.value !== "") {
        const amount = parseFloat(inputRef.current.value);
        dispatch(setBetAmount(amount));
        dispatch(updateBalance(-1 * amount));
        socket.emit(SocketEventNames.Bet, player.id, amount);
      }
    } else {
      dispatch(setBetAmount(0));
      socket.emit(SocketEventNames.CashOut, player.id);
    }
  };

  useEffect(() => {
    if (inputRef.current && betAmount) {
      inputRef.current.value = betAmount + "";
    }
  }, [betAmount]);

  return (
    <div className="w-[300px] bg-[#292261] rounded-3xl shadow-lg shadow-[#0b0329]">
      <div className="flex justify-center border-b-2 border-[#473988]">
        <img src="/images/logo.png" alt="logo" height={80} className="h-20" />
      </div>
      <div className="px-5 py-8 flex flex-col gap-3">
        <div className="flex justify-between items-end">
          <div className="text-[#5F5C92] font-bold text-[14px]">
            Player Name
          </div>
          <div className="text-[#bebce0] font-bold text-[18px]">
            {player.name}
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div className="text-[#5F5C92] font-bold text-[14px]">Balance</div>
          <div className="text-[#bebce0] font-bold text-[18px]">
            {parseFloat(player.balance.toFixed(2))}
          </div>
        </div>
        <div></div>

        <div className="flex items-center justify-between">
          <div className="text-[#5F5C92] font-bold text-[14px]">Bet Amount</div>
          <input
            type="number"
            className="rounded-lg outline-none px-3 py-1 text-[16px] bg-bg-2 shadow-inner block text-[#bebce0] w-28 font-bold text-right disabled:bg-transparent disabled:shadow-none transition-all"
            ref={inputRef}
            disabled={betAmount > 0}
            onChange={(e) => {
              if (
                e.target.value !== "" &&
                parseFloat(e.target.value) > player.balance
              ) {
                e.target.value = player.balance + "";
              }
            }}
          />
        </div>

        <button
          className="block w-full py-2 text-center rounded-xl bg-gradient-to-br font-bold from-[#796CFF] to-[#574AFF] text-[#bebce0] mt-5 disabled:bg-gray disabled:cursor-not-allowed disabled:from-[#4f4d72] disabled:to-[#4f4d72]"
          disabled={
            (gameState.timeElapsed < 5 && betAmount > 0) ||
            (gameState.timeElapsed > 5 && betAmount === 0) ||
            !gameState.isRising
          }
          onClick={placeBet}
        >
          {gameState.timeElapsed > 5 && betAmount > 0
            ? "Cash Out"
            : "Place A Bet"}
        </button>
      </div>
    </div>
  );
};

export default GamePanel;
