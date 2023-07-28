import { useCallback, useState } from "react";
import { JoinRoomFunctions } from "@/serverEvents/functions/joinRoom.ts";
import { useAppDispatch, useAppSelector } from "@/store";
import { getRoomID } from "@/store/selectors/gameSelectors.ts";
import { Input } from "@/components/ui/input.tsx";
import { AlertDialogCancel } from "@/components/ui/alert-dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
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
    <>
      <div>
        Damit deine Mitspieler wissen wer Du bist, musst Du noch einen
        Spitznamen eingeben und optional auch einen Avatar für dich hochladen
      </div>
      <div className="flex gap-x-5">
        <AvatarWithUpload />
        <Input
          placeholder="Dein Spitzname"
          onChange={(e) => handleNameChange(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-x-5">
        <Button onClick={handleNameConfirm}>Spitznamen bestätigen</Button>
        <AlertDialogCancel>Abbrechen</AlertDialogCancel>
      </div>
    </>
  );
};
