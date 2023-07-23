import { useBuzzerEvents } from "@/serverEvents/buzzerEvents.tsx";
import { useCallback } from "react";
import { BuzzerFunctions } from "@/serverEvents/functions/buzzer.ts";
import { useAppSelector } from "@/store";
import { getRoomID, getUser } from "@/store/selectors/gameSelectors.ts";

export const Buzzer = () => {
  useBuzzerEvents();
  const roomId = useAppSelector(getRoomID);
  const user = useAppSelector(getUser);

  const handleBuzzerClick = useCallback(() => {
    BuzzerFunctions.in(roomId, user.userName);
  }, [roomId, user.userName]);

  return (
    <button
      onClick={handleBuzzerClick}
      className="cursor-pointer rounded-full bg-gray-200 w-[125px] h-[125px]"
    />
  );
};
