import { useBuzzerEvents } from "@/serverEvents/buzzerEvents.tsx";
import { useCallback } from "react";
import { BuzzerFunctions } from "@/serverEvents/functions/buzzer.ts";
import { useAppSelector } from "@/store";
import {
  getIsBuzzerLocked,
  getRoomID,
  getUser,
} from "@/store/selectors/gameSelectors.ts";
import { cn } from "@/lib/utils.ts";
import { Lock } from "lucide-react";

export const Buzzer = () => {
  useBuzzerEvents();
  const roomId = useAppSelector(getRoomID);
  const user = useAppSelector(getUser);
  const buzzerLocked = useAppSelector(getIsBuzzerLocked);

  const handleBuzzerClick = useCallback(() => {
    if (!buzzerLocked) {
      BuzzerFunctions.in(roomId, user.userName);
    }
  }, [buzzerLocked, roomId, user.userName]);

  return (
    <button
      onClick={handleBuzzerClick}
      className={cn(
        "transition cursor-pointer rounded-full bg-gray-200 w-[125px] h-[125px]",
        buzzerLocked &&
          "bg-gray-500 cursor-auto flex justify-center items-center",
      )}
    >
      {buzzerLocked && <Lock />}
    </button>
  );
};
