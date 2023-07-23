import { useAppDispatch, useAppSelector } from "@/store";
import {
  getConnectedPlayers,
  getGameStarted,
  getHostName,
  getIsJoining,
  getIsModerator,
  getRoomID,
} from "@/store/selectors/gameSelectors.ts";
import { getUserName } from "@/store/selectors/authSelectors.ts";
import { useNavigate, useParams } from "react-router-dom";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import {
  setConnected,
  setConnectedPlayers,
  setHostName,
  setRoomID,
  setStartGame,
} from "@/store/reducers/game.ts";
import {
  getChosenGeneralTopic,
  getChosenPackName,
} from "@/store/selectors/topicSelectors.ts";
import {
  setChosenGeneralTopic,
  setChosenPackName,
} from "@/store/reducers/topics.ts";
import { StartGameFunctions } from "@/serverEvents/functions/startGame.ts";
import { CreateRoomFunctions } from "@/serverEvents/functions/createRoom.ts";
import { JoinRoomFunctions } from "@/serverEvents/functions/joinRoom.ts";
import { useRegisterPagePreroomEvents } from "../../serverEvents/playPagePreroomEvents.tsx";
import { PlayerNameOverlay } from "@/components/ui/PlayerNameOverlay/PlayerNameOverlay.tsx";
import { Dialog, DialogContent } from "@/components/ui/dialog.tsx";

const HostContent = () => {
  const connectedPlayers = useAppSelector(getConnectedPlayers);
  const roomId = useAppSelector(getRoomID);
  const dispatch = useAppDispatch();
  const players = useAppSelector(getConnectedPlayers);
  const numberOfPlayers = useMemo(() => players.length, [players]);

  const handleStartGame = useCallback(() => {
    StartGameFunctions.in(roomId);
    dispatch(setStartGame(true));
  }, [dispatch, roomId]);

  return (
    <>
      <div>
        Beigetretene Spieler:
        {connectedPlayers.map((player) => (
          <>{player.userName}</>
        ))}
      </div>
      {numberOfPlayers >= 0 && (
        <button onClick={handleStartGame}>Spiel starten</button>
      )}
      <button>Raum schließen</button>
    </>
  );
};

const PlayerContent = () => {
  return <div>Warte bis der Moderator das Spiel startet...</div>;
};

interface PlayPagePreroomProps {
  shown: boolean;
  setShown: Dispatch<SetStateAction<boolean>>;
}
export const PlayPagePreroom = ({ shown, setShown }: PlayPagePreroomProps) => {
  const hostName = useAppSelector(getHostName);
  const chosenPackname = useAppSelector(getChosenPackName);
  const chosenTopic = useAppSelector(getChosenGeneralTopic);
  const userName = useAppSelector(getUserName);
  const roomId = useAppSelector(getRoomID);
  const isJoining = useAppSelector(getIsJoining);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isHost = useAppSelector(getIsModerator);
  const gameStarted = useAppSelector(getGameStarted);
  useRegisterPagePreroomEvents();

  useEffect(() => {
    if (isJoining && id) {
      dispatch(setRoomID(id));
    } else {
      if (chosenPackname && chosenTopic && roomId) {
        CreateRoomFunctions.in(roomId, chosenTopic, chosenPackname, userName);
        CreateRoomFunctions.out(() => {
          dispatch(setHostName(userName));
          dispatch(setConnected(true));
        });
      } else {
        navigate("/");
      }
    }
    JoinRoomFunctions.out((roomData) => {
      if (roomData.players) {
        dispatch(setConnectedPlayers(roomData.players));
        dispatch(setChosenPackName(roomData.packname));
        dispatch(setHostName(roomData.hostName));
        dispatch(setChosenGeneralTopic(roomData.generalTopic));
        dispatch(setConnected(true));
      }
    });
    StartGameFunctions.out(() => {
      dispatch(setStartGame(true));
    });
    JoinRoomFunctions.error((message) => {
      console.error(message);
      navigate("/");
    });
  }, []);

  useEffect(() => {
    if (gameStarted) {
      setShown(false);
    }
  }, [gameStarted]);

  return (
    <Dialog onOpenChange={setShown} open={shown}>
      {hostName ? (
        <DialogContent>
          {isHost ? <HostContent /> : <PlayerContent />}
        </DialogContent>
      ) : (
        <PlayerNameOverlay />
      )}
    </Dialog>
  );
};
