import { useCallback, useState } from "react";

import { useAppDispatch } from "@/store";
import { setUserName } from "@/store/reducers/auth.ts";
import { useNavigate } from "react-router-dom";
import {
  setConnected,
  setIsJoining,
  setRoomID,
} from "@/store/reducers/game.ts";
import { useEffectOnce } from "react-use";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { HowTo } from "@/pages/MainPage/Components/HowTo/HowTo.tsx";

export const MainPage = () => {
  const [name, setName] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffectOnce(() => {
    dispatch(setIsJoining(false));
    return () => {
      dispatch(setConnected(false));

      dispatch(setRoomID(""));
    };
  });

  const handleSetName = useCallback(
    (value: string) => {
      if (name.length < 15) {
        setName(value);
      }
    },
    [name.length],
  );

  const handleConfirmName = useCallback(() => {
    if (name.length > 0) {
      dispatch(setUserName(name));
      navigate("/generalTopic");
    }
  }, [dispatch, name, navigate]);

  return (
    <div className="grid auto-rows-fr justify-center items-center gap-5">
      <h1 className="font-bold text-7xl text-center pb-5">50 Fragen Online</h1>
      <div className="border-2 m-auto p-5 rounded-xl">
        <div className="grid grid-rows-2 gap-5">
          <div className="mb-5">
            Um eine Spieleraum erstellen zu können brauchen wir einen Spitznamen
            von Dir
          </div>
          <div className="flex w-full m-auto max-w-sm items-center space-x-2">
            <Input
              onChange={(e) => handleSetName(e.target.value)}
              type="email"
              placeholder="Dein Spitzname"
            />
            <Button onClick={handleConfirmName} type="submit">
              bestätigen
            </Button>
          </div>
        </div>
      </div>
      <HowTo />
    </div>
  );
};
