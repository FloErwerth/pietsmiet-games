import { useCallback, useState } from "react";
import { setUserName } from "@/store/reducers/auth.ts";
import { JoinRoomFunctions } from "@/serverEvents/functions/joinRoom.ts";
import { useAppDispatch, useAppSelector } from "@/store";
import { getRoomID } from "@/store/selectors/gameSelectors.ts";
import { Dialog } from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";

export const PlayerNameOverlay = () => {
  const [name, setName] = useState("");
  const dispatch = useAppDispatch();
  const roomId = useAppSelector(getRoomID);
  const handleNameChange = useCallback((name: string) => {
    setName(name);
  }, []);

  const handleNameConfirm = useCallback(() => {
    if (name && roomId) {
      dispatch(setUserName(name));
      JoinRoomFunctions.in(roomId, name);
    }
  }, [name, roomId, dispatch]);

  return (
    <Dialog open={true}>
      <div>
        Damit deine Mitspieler wissen wer Du bist, musst Du noch einen
        Spitznamen eingeben
      </div>
      <Input
        placeholder="Dein Spitzname"
        onChange={(e) => handleNameChange(e.target.value)}
      />
      <Button onClick={handleNameConfirm}>Spitznamen bestätigen</Button>
      <Button>Abbrechen</Button>
    </Dialog>
  );
};
