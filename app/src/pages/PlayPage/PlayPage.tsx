import { useAppSelector } from "@/store";
import { useCallback, useState } from "react";
import {
  getBuzzer,
  getConnectedPlayers,
  getCurrentQuestion,
  getIsAnswerRevealed,
  getIsBuzzerLocked,
  getIsHost,
  getRoomID,
  getTextRevealed,
} from "@/store/selectors/gameSelectors.ts";
import { useRegisterPageEvents } from "../../serverEvents/playPageEvents.tsx";
import {
  LockBuzzerFunctions,
  ResetBuzzerFunctions,
} from "@/serverEvents/functions/buzzer.ts";
import { RevealAnswer } from "@/serverEvents/functions/questionAnswer.ts";
import { PlayerCard } from "@/components/ui/PlayerCard/PlayerCard.tsx";
import { QuestionTracker } from "@/components/ui/QuestionTracker/QuestionTracker.tsx";
import { PlayPagePreroom } from "@/pages/PlayPagePreroom/PlayPagePreroom.tsx";
import { Buzzer } from "@/components/ui/Buzzer/Buzzer.tsx";
import { TextReveal } from "@/serverEvents/functions/text.ts";
import { Button } from "@/components/ui/button.tsx";

const ModeratorHandles = () => {
  const roomId = useAppSelector(getRoomID);

  const buzzer = useAppSelector(getBuzzer);
  const textRevealed = useAppSelector(getTextRevealed);

  const handleRevealText = useCallback(() => {
    TextReveal.in(roomId, !textRevealed);
  }, [roomId, textRevealed]);

  const handleBuzzerReset = useCallback(() => {
    ResetBuzzerFunctions.in(roomId);
  }, [roomId]);

  return (
    <div className="flex flex-row gap-x-5 justify-self-center w-fit">
      {buzzer && (
        <Button onClick={handleBuzzerReset}>Buzzer zurücksetzen</Button>
      )}
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
  const buzzerLocked = useAppSelector(getIsBuzzerLocked);
  const roomId = useAppSelector(getRoomID);

  const handleRevealAnswer = useCallback(() => {
    RevealAnswer.in(roomId, !answerRevealed);
  }, [answerRevealed, roomId]);

  const handleLockBuzzer = useCallback(() => {
    LockBuzzerFunctions.in(roomId, !buzzerLocked);
  }, [buzzerLocked, roomId]);

  return (
    <>
      <PlayPagePreroom shown={preroomVisible} setShown={setPreroomVisible} />
      <div className="grid grid-auto-col h-screen justify-center sm:items-start md:items-center gap-y-5">
        <div className="flex flex-col mt-5 justify-center items-center">
          <QuestionTracker />
          <div className="font-bold text-xl sm:w-full md:w-2/3 lg:w-1/2 text-center border-2 rounded-xl mt-5 p-5">
            {answerRevealed
              ? currentQuestionAnswerPair?.answer
              : currentQuestionAnswerPair?.question}
          </div>
          {isModerator && (
            <Button className="mt-2" onClick={handleRevealAnswer}>
              {answerRevealed ? "Antwort verstecken" : "Antwort anzeigen"}
            </Button>
          )}
        </div>
        {isModerator ? (
          <ModeratorHandles />
        ) : (
          <div className="justify-self-center">
            Informationen zum Spiel im Bezug auf den Moderator
          </div>
        )}
        <div className="flex flex-col md:grid md:grid-cols-5 md:grid-rows-1 md:gap-x-5 md:justify-evenly">
          <div className="md:w-fit md:justify-self-center md:col-start-3 md:col-end-3 md:row-start-1 md:row-end-1">
            <>
              {" "}
              {!isModerator ? (
                <Buzzer />
              ) : (
                <Button onClick={handleLockBuzzer}>
                  {buzzerLocked ? "Buzzer entsperren" : "Buzzer sperren"}
                </Button>
              )}
            </>
          </div>
          {connectedPlayers.map((player) => (
            <PlayerCard player={player} />
          ))}
        </div>
      </div>
    </>
  );
};
