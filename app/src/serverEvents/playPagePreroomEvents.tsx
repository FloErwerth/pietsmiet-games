import { socket } from "../index.tsx";
import { setConnectedPlayers } from "../store/reducers/game.ts";
import { useEffect } from "react";
import { useAppDispatch } from "@/store";

export const useRegisterPagePreroomEvents = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    socket.on("leaveRoom/success", (roomData) => {
      if (roomData.players) {
        dispatch(setConnectedPlayers(roomData.players));
      }
    });
  }, []);
};
