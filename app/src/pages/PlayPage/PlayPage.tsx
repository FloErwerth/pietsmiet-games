import { useAppSelector } from "@/store";
import { useCallback, useState } from "react";
import {
  getBuzzer,
  getConnectedPlayers,
  getCurrentPairs,
  getCurrentQuestion,
  getIsAnswerRevealed,
  getIsBuzzerLocked,
  getIsHost,
  getQuestionAnserIndex,
  getRoomID,
  getTextRevealed,
} from "@/store/selectors/gameSelectors.ts";
import { useRegisterPageEvents } from "../../serverEvents/playPageEvents.tsx";
import {
  LockBuzzerFunctions,
  ResetBuzzerFunctions,
} from "@/serverEvents/functions/buzzer.ts";
import {
  QuestionNext,
  QuestionPrevious,
  RevealAnswer,
} from "@/serverEvents/functions/questionAnswer.ts";
import { PlayerCard } from "@/components/ui/PlayerCard/PlayerCard.tsx";
import { QuestionTracker } from "@/components/ui/QuestionTracker/QuestionTracker.tsx";
import { PlayPagePreroom } from "@/pages/PlayPagePreroom/PlayPagePreroom.tsx";
import { Buzzer } from "@/components/ui/Buzzer/Buzzer.tsx";
import { TextReveal } from "@/serverEvents/functions/text.ts";
import { Button } from "@/components/ui/button.tsx";

const ModeratorHandles = () => {
  const roomId = useAppSelector(getRoomID);

  const buzzer = useAppSelector(getBuzzer);
  const currentQuestionAnswerIndex = useAppSelector(getQuestionAnserIndex);
  const pairs = useAppSelector(getCurrentPairs);
  const buzzerLocked = useAppSelector(getIsBuzzerLocked);
  const textRevealed = useAppSelector(getTextRevealed);

  const handleLockBuzzer = useCallback(() => {
    LockBuzzerFunctions.in(roomId, !buzzerLocked);
  }, [buzzerLocked, roomId]);

  const handleRevealAnswer = useCallback(() => {
    RevealAnswer.in(roomId);
  }, [roomId]);

  const handleRevealText = useCallback(() => {
    TextReveal.in(roomId, !textRevealed);
  }, [roomId, textRevealed]);

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
    <div className="grid auto-rows-max justify-self-center w-fit">
      <div>Fragen</div>
      {pairs?.[currentQuestionAnswerIndex + 1] && (
        <Button onClick={handleNextQuestion}>Nächste Frage</Button>
      )}
      {currentQuestionAnswerIndex > 0 && (
        <Button onClick={handlePreviousQuestion}>Vorherige Frage</Button>
      )}
      <div>Buzzer</div>
      <Button onClick={handleLockBuzzer}>
        {buzzerLocked ? "Buzzer entsperren" : "Buzzer sperren"}
      </Button>
      {buzzer && (
        <Button onClick={handleBuzzerReset}>Buzzer zurücksetzen</Button>
      )}
      <div>Antworten</div>
      <Button onClick={handleRevealAnswer}>Antwort anzeigen</Button>
      <div>Textfelder</div>
      <Button onClick={handleRevealText}>
        {textRevealed ? "Textfelder verstecken" : "Textfelder anzeigen"}
      </Button>
    </div>
  );
};

export const PlayPage = () => {
  const connectedPlayers = useAppSelector(getConnectedPlayers);
  const isModerator = useAppSelector(getIsHost);
  const currentQuestionAnswerPair = useAppSelector(getCurrentQuestion);

  const answerRevealed = useAppSelector(getIsAnswerRevealed);
  const [preroomVisible, setPreroomVisible] = useState(true);
  useRegisterPageEvents();

  return (
    <>
      <PlayPagePreroom shown={preroomVisible} setShown={setPreroomVisible} />
      <div className="grid grid-rows-3 h-[calc(100vh-40px)] text-center items-start gap-y-3">
        <div className="w-1/2 justify-self-center grid grid-rows-2 justify-center border-2 rounded-3xl p-5">
          <QuestionTracker />
          <div className="font-bold text-xl">
            {answerRevealed
              ? currentQuestionAnswerPair?.answer
              : currentQuestionAnswerPair?.question}
          </div>
        </div>
        {isModerator ? (
          <ModeratorHandles />
        ) : (
          <div>Informationen zum Spiel im Bezug auf den Moderator</div>
        )}
        <div className="grid grid-cols-5 grid-rows-1 gap-x-5 justify-evenly">
          <div className="w-fit justify-self-center col-start-3 col-end-3 row-start-1 row-end-1">
            {!isModerator && <Buzzer />}
          </div>
          {connectedPlayers.map((player) => (
            <PlayerCard player={player} />
          ))}
        </div>
      </div>
    </>
  );
};
