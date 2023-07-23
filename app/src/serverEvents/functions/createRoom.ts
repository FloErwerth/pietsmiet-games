import { GeneralTopicName } from "@/data";
import { socket } from "../../index.tsx";

const createRoomIn = (
  roomId: string,
  chosenTopic: GeneralTopicName,
  chosenPackname: string,
  userName: string,
) =>
  socket.emit("createRoom/in", roomId, chosenTopic, chosenPackname, userName);
const createRoomOut = (listener: () => void) =>
  socket.on("createRoom/out", listener);

export const CreateRoomFunctions = {
  in: createRoomIn,
  out: createRoomOut,
};
