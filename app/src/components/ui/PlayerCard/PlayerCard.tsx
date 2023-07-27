import { usePlayerCardEvents } from "@/serverEvents/playerCardEvents.tsx";
import { useAppSelector } from "@/store";
import {
  getBuzzer,
  getIsHost,
  getRoomID,
  getTextRevealed,
  getUser,
} from "@/store/selectors/gameSelectors.ts";
import { Player } from "../../../../../backend";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  CorrectAnswer,
  IncorrectAnswer,
} from "@/serverEvents/functions/questionAnswer.ts";
import { Input } from "@/components/ui/input.tsx";
import { cn } from "@/lib/utils.ts";
import { TextTyping } from "@/serverEvents/functions/text.ts";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";

export const PlayerCard = ({ player }: { player: Player }) => {
  usePlayerCardEvents();
  const buzzer = useAppSelector(getBuzzer);
  const roomId = useAppSelector(getRoomID);
  const isHost = useAppSelector(getIsHost);
  const user = useAppSelector(getUser);
  const [typedText, setTypedText] = useState("");
  const textRevealed = useAppSelector(getTextRevealed);

  useEffect(() => {
    if ((!isMe && textRevealed) || isHost) {
      setTypedText(player.typedText ?? "");
    } else if (!textRevealed && !isHost && !isMe) {
      setTypedText("");
    }
  }, [isHost, player.typedText, textRevealed]);

  const isMe = useMemo(() => {
    return (
      user.userName === player.userName && user.socketId === player.socketId
    );
  }, [player, user]);

  const handleCorrectAnswer = useCallback(() => {
    const newPlayer: Player = { ...player, points: player.points + 4 };
    CorrectAnswer.in(roomId, newPlayer);
  }, [player, roomId]);

  const handleIncorrectAnswer = useCallback(() => {
    IncorrectAnswer.in(roomId, player);
  }, [roomId, player]);

  const hasBuzzered = useMemo(
    () => buzzer && buzzer.userName === player.userName,
    [buzzer, player.userName],
  );
  const showAnswerHandles = useMemo(
    () => hasBuzzered && isHost,
    [hasBuzzered, isHost],
  );

  const handleTextConfirm = useCallback(() => {
    TextTyping.in(roomId, player, typedText);
  }, [player, roomId, typedText]);

  const handleTextChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setTypedText(e.target.value);
  }, []);

  return (
    <div className="relative">
      <div
        className={
          "relative bg-gray-200 p-2 grid auto-rows-max gap-y-2 rounded-xl"
        }
      >
        {hasBuzzered && (
          <div
            className={cn(
              hasBuzzered
                ? "absolute animate-pingBorder -z-10 w-full h-full border-4 rounded-xl border-red-500"
                : "",
            )}
          ></div>
        )}
        <div className="flex gap-x-3">
          <div className="rounded-full w-[50px] h-[50px] bg-black"></div>
          <div className="flex flex-col items-start justify-start">
            <div className="text-xl">{player.userName}</div>
            <div className="flex items-center gap-x-2">
              <div className="h-fit">{player.points}</div>
              <small className="">Punkte</small>
            </div>
          </div>
        </div>

        <div className="flex relative">
          <Input
            disabled={!isMe}
            placeholder={
              !isMe && !textRevealed
                ? "Text nicht freigegeben"
                : "Deine Antwort"
            }
            className={cn("bg-white", isMe && "pr-10")}
            onChange={handleTextChange}
            value={typedText}
          />
          {isMe && (
            <Check
              className="bg-primary absolute right-2 cursor-pointer top-2 rounded stroke-white"
              onClick={handleTextConfirm}
            />
          )}
        </div>
      </div>
      {showAnswerHandles && (
        <div className="grid-cols-2 gap-x-5 justify-between grid mt-2">
          <Button
            className="bg-green-400 hover:bg-green-600"
            size="sm"
            onClick={handleCorrectAnswer}
          >
            Richtig
          </Button>
          <Button
            className="bg-red-400 hover:bg-red-600"
            size="sm"
            onClick={handleIncorrectAnswer}
          >
            Falsch
          </Button>
        </div>
      )}
    </div>
  );
};
