import { usePlayerCardEvents } from "@/serverEvents/playerCardEvents.tsx";
import { useAppSelector } from "@/store";
import {
  getBuzzer,
  getIsHost,
  getRoomID,
  getUser,
} from "@/store/selectors/gameSelectors.ts";
import { Player } from "../../../../../backend";
import { useCallback, useMemo } from "react";
import {
  CorrectAnswer,
  IncorrectAnswer,
} from "@/serverEvents/functions/questionAnswer.ts";
import { Input } from "@/components/ui/input.tsx";
import { cn } from "@/lib/utils.ts";

export const PlayerCard = ({ player }: { player: Player }) => {
  usePlayerCardEvents();
  const buzzer = useAppSelector(getBuzzer);
  const roomId = useAppSelector(getRoomID);
  const isHost = useAppSelector(getIsHost);
  const user = useAppSelector(getUser);

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

  return (
    <div>
      {showAnswerHandles && (
        <div>
          <button onClick={handleCorrectAnswer}>Richtig</button>
          <button onClick={handleIncorrectAnswer}>Falsch</button>
        </div>
      )}
      <div
        className={
          "relative bg-gray-200 p-2 grid grid-rows-2 gap-y-2 rounded-xl"
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
        <div className="grid grid-cols-2 align-middle items-center">
          <div className="text-lg">{player.userName}</div>
          <div>{player.points}</div>
        </div>
        <Input
          disabled={!isMe}
          placeholder="Deine Antwort"
          className={"bg-white"}
        />
      </div>
    </div>
  );
};
