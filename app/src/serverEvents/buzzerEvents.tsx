import { useEffect } from "react";
import { socket } from "@/index.tsx";
import { setActiveBuzzer, setBuzzerLocked } from "@/store/reducers/game.ts";
import { useAppDispatch, useAppSelector } from "@/store";
import { getUser } from "@/store/selectors/gameSelectors.ts";

export const useBuzzerEvents = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(getUser);

  useEffect(() => {
    socket.on("buzzer/out", ({ socketId, userName }) => {
      dispatch(setActiveBuzzer({ socketId, userName }));
      if (
        user.userName &&
        user.socketId &&
        socketId !== user.socketId &&
        userName !== user.userName
      ) {
        dispatch(setBuzzerLocked(true));
      }
    });
  }, [user]);
};
