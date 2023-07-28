import { socket } from "../../index.tsx";
import { RoomData } from "../../../../backend";

const joinRoomIn = (roomId: string, userName: string) =>
  socket.emit("joinRoom/in", roomId, userName, socket.id);
const joinRoomOut = (listener: (roomData: RoomData[number]) => void) =>
  socket.on("joinRoom/out", listener);
const joinRoomError = (listener: (message: string) => void) =>
  socket.on("joinRoom/error", listener);

export const JoinRoomFunctions = {
  in: joinRoomIn,
  out: joinRoomOut,
  error: joinRoomError,
};
