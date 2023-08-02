import { socket } from "../index.tsx";
import {
  resetBuzzer,
  setActiveBuzzer,
  setAnswerRevealed,
  setBuzzerLocked,
  setConnectedPlayers,
  setQuestionAnswerIndex,
  setText,
  setTextRevealed,
} from "../store/reducers/game.ts";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { getQuestionAnserIndex } from "../store/selectors/gameSelectors.ts";
import {
  QuestionNext,
  QuestionPrevious,
  RevealAnswer,
} from "./functions/questionAnswer.ts";
import {
  LockBuzzerFunctions,
  ResetBuzzerFunctions,
} from "./functions/buzzer.ts";
import { TextReveal, TextTyping } from "@/serverEvents/functions/text.ts";

export const useRegisterPageEvents = () => {
  const dispatch = useAppDispatch();
  const answerIndex = useAppSelector(getQuestionAnserIndex);
  useEffect(() => {
    socket.on("leaveRoom/success", (roomData) => {
      if (roomData.players) {
        dispatch(setConnectedPlayers(roomData.players));
      }
    });
    TextReveal.out((reveal) => {
      dispatch(setTextRevealed(reveal));
    });
    TextTyping.out((player, text) => {
      dispatch(setText({ player, text }));
    });
    ResetBuzzerFunctions.out(() => {
      dispatch(resetBuzzer());
    });
    LockBuzzerFunctions.out((locked) => {
      dispatch(setBuzzerLocked(locked));
    });
    RevealAnswer.out((revealed) => {
      dispatch(setAnswerRevealed(revealed));
    });
    QuestionNext.out(() => {
      dispatch(setAnswerRevealed(false));
      dispatch(setQuestionAnswerIndex(answerIndex + 1));
    });
    QuestionPrevious.out(() => {
      dispatch(setQuestionAnswerIndex(answerIndex - 1));
    });
    ResetBuzzerFunctions.out(() => {
      dispatch(setActiveBuzzer(undefined));
    });
  }, [answerIndex]);
};
