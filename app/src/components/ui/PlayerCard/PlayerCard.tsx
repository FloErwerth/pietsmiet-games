import { usePlayerCardEvents } from "@/serverEvents/playerCardEvents.tsx";
import { useAppSelector } from "@/store";
import {
  getBuzzer,
  getIsModerator,
  getRoomID,
} from "@/store/selectors/gameSelectors.ts";
import { Player } from "../../../../../backend";
import { useCallback, useMemo } from "react";
import {
  CorrectAnswer,
  IncorrectAnswer,
} from "@/serverEvents/functions/questionAnswer.ts";

export const PlayerCard = ({ player }: { player: Player }) => {
  usePlayerCardEvents();
  const buzzer = useAppSelector(getBuzzer);
  const roomId = useAppSelector(getRoomID);
  const isHost = useAppSelector(getIsModerator);

  const buzzerClasses = useMemo(
    () =>
      `${
        Boolean(buzzer && buzzer.userName === player.userName) && "buzzered"
      } buzzer`,
    [buzzer, player],
  );

  const playerCardClasses = useMemo(
    () =>
      `${Boolean(buzzer && buzzer.userName === player.userName) && "bg-red"}`,
    [buzzer, player],
  );

  const handleCorrectAnswer = useCallback(() => {
    const newPlayer: Player = { ...player, points: player.points + 4 };
    CorrectAnswer.in(roomId, newPlayer);
  }, [player, roomId]);

  const handleIncorrectAnswer = useCallback(() => {
    IncorrectAnswer.in(roomId, player);
  }, [roomId, player]);

  return (
    <div className={playerCardClasses}>
      <div className={"player-name-wrapper"}>
        <div className={"player-name"}>{player.userName}</div>
        <div className={buzzerClasses}></div>
        <>
          {buzzer && buzzer.userName === player.userName && isHost && (
            <div>
              <button onClick={handleCorrectAnswer}>Richtig</button>
              <button onClick={handleIncorrectAnswer}>Falsch</button>
            </div>
          )}
        </>
      </div>

      <div>Textfeld</div>
      <div>{player.points}</div>
    </div>
  );
};
