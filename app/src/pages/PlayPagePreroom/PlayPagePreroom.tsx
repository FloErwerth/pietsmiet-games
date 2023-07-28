import { useAppDispatch, useAppSelector } from "@/store";
import {
  getAvatar,
  getConnectedPlayers,
  getGameStarted,
  getIsHost,
  getIsJoining,
  getRoomID,
  getUser,
} from "@/store/selectors/gameSelectors.ts";
import { useNavigate, useParams } from "react-router-dom";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  setConnected,
  setConnectedPlayers,
  setProfilePicture,
  setRoomID,
  setStartGame,
  setUser,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
} from "@/components/ui/alert-dialog.tsx";
import { socket } from "@/index.tsx";
import { Check, Copy } from "lucide-react";
import { Popover, PopoverContent } from "@/components/ui/popover.tsx";
import { PopoverTrigger } from "@radix-ui/react-popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import Compressor from "compressorjs";

const HostContent = () => {
  const connectedPlayers = useAppSelector(getConnectedPlayers);
  const roomId = useAppSelector(getRoomID);
  const dispatch = useAppDispatch();
  const players = useAppSelector(getConnectedPlayers);
  const numberOfPlayers = useMemo(() => players.length, [players]);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const playersConnected = useMemo(
    () => connectedPlayers.length > 0,
    [connectedPlayers],
  );

  const handleStartGame = useCallback(() => {
    StartGameFunctions.in(roomId);
    dispatch(setStartGame(true));
  }, [dispatch, roomId]);

  const handleLinkCopy = useCallback(() => {
    setPopoverOpen(true);
    setTimeout(() => setPopoverOpen(false), 1000);
    navigator.clipboard.writeText(document.location.href);
  }, []);

  return (
    <>
      <div>
        <div className="mb-3">
          <div>Teile diese Internetadresse, um spieler einzuladen</div>
          <div className="flex justify-between accent-muted align-middle border-2 rounded mt-1 p-2 pb-0.5">
            {document.location.href}
            <Popover open={popoverOpen}>
              <PopoverTrigger>
                <Tooltip>
                  <TooltipTrigger>
                    <Copy className="cursor-pointer" onClick={handleLinkCopy} />
                  </TooltipTrigger>
                  <TooltipContent>Link kopieren</TooltipContent>
                </Tooltip>
              </PopoverTrigger>
              <PopoverContent className="w-fit flex gap-x-1">
                Link kopiert
                <Check className="stroke-green-500" />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        {playersConnected ? (
          <>
            <div className="mb-5">Beigetretene Spieler:</div>
            <div className="grid auto-rows-min gap-y-2 mb-10">
              {connectedPlayers.map((player) => (
                <div className="border-2 p-1 text-center">
                  {player.userName}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="animate-pulse">Warte auf Beitritt von Spielern</div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-x-5">
        {numberOfPlayers >= 0 && (
          <AlertDialogAction onClick={handleStartGame}>
            Spiel starten
          </AlertDialogAction>
        )}
        <AlertDialogCancel>Raum schließen</AlertDialogCancel>
      </div>
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
  const chosenPackname = useAppSelector(getChosenPackName);
  const chosenTopic = useAppSelector(getChosenGeneralTopic);
  const userName = useAppSelector(getUser).userName;
  const roomId = useAppSelector(getRoomID);
  const isJoining = useAppSelector(getIsJoining);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isHost = useAppSelector(getIsHost);
  const gameStarted = useAppSelector(getGameStarted);
  const avatar = useAppSelector(getAvatar);
  useRegisterPagePreroomEvents();

  useEffect(() => {
    if (isJoining && id) {
      dispatch(setRoomID(id));
    } else {
      if (chosenPackname && chosenTopic && roomId) {
        CreateRoomFunctions.in(roomId, chosenTopic, chosenPackname, userName);
        CreateRoomFunctions.out(() => {
          dispatch(setUser({ isHost: true, socketId: socket.id }));
          dispatch(setConnected(true));
        });
      } else {
        navigate("/");
      }
    }
    socket.on("sendProfilePicture/out", (pictureBlob, senderId) => {
      const blob = new Blob([pictureBlob]);
      const url = URL.createObjectURL(blob);
      dispatch(setProfilePicture({ picture: url, senderId }));
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
    JoinRoomFunctions.out((roomData) => {
      if (roomData.players) {
        dispatch(setConnectedPlayers(roomData.players));
        dispatch(setChosenPackName(roomData.packname));
        dispatch(setUser({ socketId: socket.id }));
        dispatch(setChosenGeneralTopic(roomData.generalTopic));
        dispatch(setConnected(true));
        if (avatar) {
          fetch(avatar).then((response) => {
            response.blob().then((blob) => {
              const file = new File([blob], "", { type: "image/jpeg" });
              new Compressor(file, {
                maxWidth: 100,
                maxHeight: 100,
                quality: 100,
                success(compressedBlob) {
                  compressedBlob.arrayBuffer().then((buffer) => {
                    socket.emit(
                      "sendProfilePicture/in",
                      roomId,
                      buffer,
                      socket.id,
                    );
                  });
                },
              });
            });
          });
        }
      }
    });
  }, [avatar]);

  useEffect(() => {
    if (gameStarted) {
      setShown(false);
    }
  }, [gameStarted]);

  return (
    <AlertDialog onOpenChange={setShown} open={shown}>
      <AlertDialogContent>
        <>
          {isHost !== undefined ? (
            <>{isHost ? <HostContent /> : <PlayerContent />}</>
          ) : (
            <PlayerNameOverlay />
          )}
        </>
      </AlertDialogContent>
    </AlertDialog>
  );
};
