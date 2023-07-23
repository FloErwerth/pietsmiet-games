import { useAppSelector } from "@/store";
import { useCallback, useMemo, useState } from "react";
import { socket } from "../../index.tsx";
import {
  getBuzzer,
  getConnectedPlayers,
  getCurrentPairs,
  getCurrentQuestion,
  getIsAnswerRevealed,
  getIsBuzzerLocked,
  getIsModerator,
  getQuestionAnserIndex,
  getRoomID,
} from "@/store/selectors/gameSelectors.ts";
import { useRegisterPageEvents } from "../../serverEvents/playPageEvents.tsx";
import {
  BuzzerFunctions,
  LockBuzzerFunctions,
  ResetBuzzerFunctions,
} from "@/serverEvents/functions/buzzer.ts";
import { getUserName } from "@/store/selectors/authSelectors.ts";
import {
  AnswerFunctions,
  QuestionNext,
  QuestionPrevious,
} from "@/serverEvents/functions/questionAnswer.ts";
import { PlayerCard } from "@/components/ui/PlayerCard/PlayerCard.tsx";
import { QuestionTracker } from "@/components/ui/QuestionTracker/QuestionTracker.tsx";
import { PlayPagePreroom } from "@/pages/PlayPagePreroom/PlayPagePreroom.tsx";

export const PlayPage = () => {
  const roomId = useAppSelector(getRoomID);
  const connectedPlayers = useAppSelector(getConnectedPlayers);
  const buzzer = useAppSelector(getBuzzer);
  const isModerator = useAppSelector(getIsModerator);
  const currentQuestionAnswerPair = useAppSelector(getCurrentQuestion);
  const currentQuestionAnswerIndex = useAppSelector(getQuestionAnserIndex);
  const pairs = useAppSelector(getCurrentPairs);
  const name = useAppSelector(getUserName);
  const buzzerLocked = useAppSelector(getIsBuzzerLocked);
  const answerRevealed = useAppSelector(getIsAnswerRevealed);
  const [preroomVisible, setPreroomVisible] = useState(true);
  useRegisterPageEvents();

  const handleBuzzer = useCallback(() => {
    BuzzerFunctions.in(roomId, name);
  }, [name, roomId]);

  const buzzerClassName = useMemo(
    () =>
      `${buzzerLocked && "play-page-buzzer-locked"} ${
        Boolean(buzzer && buzzer.socketId === socket.id) && "play-page-buzzered"
      } play-page-buzzer`,
    [buzzerLocked, buzzer],
  );

  const handleLockBuzzer = useCallback(() => {
    LockBuzzerFunctions.in(roomId, !buzzerLocked);
  }, [buzzerLocked, roomId]);

  const handleRevealAnswer = useCallback(() => {
    AnswerFunctions.in(roomId);
  }, [roomId]);

  const handleNextQuestion = useCallback(() => {
    QuestionNext.in(roomId);
  }, [roomId]);

  const handlePreviousQuestion = useCallback(() => {
    QuestionPrevious.in(roomId);
  }, [roomId]);

  const handleBuzzerReset = useCallback(() => {
    ResetBuzzerFunctions.in(roomId);
  }, [roomId]);

  return (
    <>
      <PlayPagePreroom shown={preroomVisible} setShown={setPreroomVisible} />
      <div className="play-page">
        <QuestionTracker />
        <div className={"play-page-question"}>
          {answerRevealed
            ? currentQuestionAnswerPair?.answer
            : currentQuestionAnswerPair?.question}
        </div>
        {isModerator ? (
          <div>
            {pairs?.[currentQuestionAnswerIndex + 1] && (
              <button onClick={handleNextQuestion}>Nächste Frage</button>
            )}
            {currentQuestionAnswerIndex > 0 && (
              <button onClick={handlePreviousQuestion}>Vorherige Frage</button>
            )}
            <button onClick={handleLockBuzzer}>
              {buzzerLocked ? "Buzzer entsperren" : "Buzzer sperren"}
            </button>
            <button onClick={handleRevealAnswer}>Antwort anzeigen</button>
            {buzzer && (
              <button onClick={handleBuzzerReset}>Buzzer zurücksetzen</button>
            )}
          </div>
        ) : (
          <button onClick={handleBuzzer} className={buzzerClassName} />
        )}
        <div className="play-page-players">
          {connectedPlayers.map((player) => (
            <PlayerCard player={player} />
          ))}
        </div>
      </div>
    </>
  );
};
