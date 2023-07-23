import { useEffect } from "react";
import { socket } from "@/index.tsx";
import { setActiveBuzzer } from "@/store/reducers/game.ts";
import { useAppDispatch } from "@/store";

export const useBuzzerEvents = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    socket.on("buzzer/out", ({ socketId, userName }) => {
      console.log(socketId, " has buzzered");
      dispatch(setActiveBuzzer({ socketId, userName }));
    });
  }, []);
};
