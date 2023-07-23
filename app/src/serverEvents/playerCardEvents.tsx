import { useAppDispatch } from "@/store";
import { useEffect } from "react";
import { CorrectAnswer, IncorrectAnswer } from "./functions/questionAnswer.ts";
import { resetBuzzer, setConnectedPlayers } from "../store/reducers/game.ts";

export const usePlayerCardEvents = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    CorrectAnswer.out((players) => {
      dispatch(resetBuzzer());
      dispatch(setConnectedPlayers(players));
    });
    IncorrectAnswer.out((players) => {
      dispatch(setConnectedPlayers(players));
      dispatch(resetBuzzer());
    });
  }, [dispatch]);
};
