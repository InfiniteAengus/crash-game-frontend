"use client";

import environment from "@/config";
import { SocketEventNames } from "@/data/constants";
import { RootState } from "@/store";
import { setGameState } from "@/store/reducers/gameStateReducer";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket, io } from "socket.io-client";

type Props = {};

const socket: Socket = io(environment.socket);

const SocketProvider = () => {
  const dispatch = useDispatch();

  const player = useSelector((state: RootState) => state.gameState.player);

  useEffect(() => {
    socket.on(SocketEventNames.StateInfo, (data: any) => {
      dispatch(setGameState(data));
    });

    return () => {
      socket.off(SocketEventNames.StateInfo);
    };
  }, []);

  useEffect(() => {
    if (player.name !== "") {
      console.log(player);
      socket.emit(SocketEventNames.NewUser, player);
    }
  }, [player.name]);

  return <></>;
};

export default SocketProvider;
