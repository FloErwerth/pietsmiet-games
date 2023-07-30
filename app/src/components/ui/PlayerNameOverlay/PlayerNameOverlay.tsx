import { useCallback, useState } from "react";
import { JoinRoomFunctions } from "@/serverEvents/functions/joinRoom.ts";
import { useAppDispatch, useAppSelector } from "@/store";
import { getRoomID } from "@/store/selectors/gameSelectors.ts";
import { Input } from "@/components/ui/input.tsx";
import {
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog.tsx";
import { setUser } from "@/store/reducers/game.ts";
import { AvatarWithUpload } from "@/components/ui/Avatar/AvatarWithUpload.tsx";

export const PlayerNameOverlay = () => {
  const [userName, setUserName] = useState("");
  const dispatch = useAppDispatch();
  const roomId = useAppSelector(getRoomID);
  const handleNameChange = useCallback((name: string) => {
    setUserName(name);
  }, []);

  const handleNameConfirm = useCallback(() => {
    if (userName && roomId) {
      dispatch(setUser({ userName, isHost: false }));
      JoinRoomFunctions.in(roomId, userName);
    }
  }, [userName, roomId, dispatch]);

  return (
    <div className="w-full flex flex-col gap-y-5">
      <div>Gib deinen Spitznamen ein und lade einen Avatar hoch</div>
      <div className="flex md:flex-row items-center flex-col md:gap-x-5 gap-y-5">
        <AvatarWithUpload />
        <Input
          placeholder="Dein Spitzname"
          onChange={(e) => handleNameChange(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 items-center justify-center gap-x-5">
        <AlertDialogAction onClick={handleNameConfirm}>
          Bestätigen
        </AlertDialogAction>
        <AlertDialogCancel className="m-0">Abbrechen</AlertDialogCancel>
      </div>
    </div>
  );
};
