"use client";

import environment from "@/config";
import { setGameState } from "@/store/reducers/gameStateReducer";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Socket, io } from "socket.io-client";

type Props = {};

const socket: Socket = io(environment.socket);

const SocketProvider = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("socketasdfasdf");
    socket.on("stateInfo", (data: any) => {
      dispatch(setGameState(data));
    });

    return () => {
      socket.off("stateInfo");
    };
  }, []);

  return <></>;
};

export default SocketProvider;
