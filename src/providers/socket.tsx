"use client";

import environment from "@/config";
import { SocketEventNames } from "@/data/constants";
import { RootState } from "@/store";
import {
  setBetAmount,
  setGameState,
  updateBalance,
} from "@/store/reducers/gameStateReducer";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket, io } from "socket.io-client";

export const socket: Socket = io(environment.socket);

const SocketProvider = () => {
  const dispatch = useDispatch();

  const player = useSelector((state: RootState) => state.gameState.player);

  useEffect(() => {
    socket.on(SocketEventNames.StateInfo, (data: any) => {
      dispatch(setGameState(data));
    });

    socket.on(
      SocketEventNames.CashOut,
      (playerId: string, cashOutAmount: number) => {
        if (player.id === playerId) {
          console.log("cashOut", player.balance, cashOutAmount);
          dispatch(updateBalance(cashOutAmount));
        }
      }
    );

    socket.on(SocketEventNames.NewRound, () => {
      dispatch(setBetAmount(0));
    });

    return () => {
      socket.off(SocketEventNames.StateInfo);
      socket.off(SocketEventNames.CashOut);
      socket.off(SocketEventNames.NewRound);
    };
  }, [player.id]);

  useEffect(() => {
    if (player.name !== "") {
      console.log(player);
      socket.emit(SocketEventNames.NewUser, player);
    }
  }, [player.name]);

  return <></>;
};

export default SocketProvider;
