import { socket } from "../../index.tsx";
import { Player } from "../../../../backend";

const textIn = (roomId: string, player: Player, text: string) =>
  socket.emit("text/in", roomId, player, text);
const textOut = (listener: (player: Player, text: string) => void) =>
  socket.on("text/out", listener);

const textRevealIn = (roomId: string, reveal: boolean) =>
  socket.emit("textReveal/in", roomId, reveal);
const textRevealOut = (listener: (reveal: boolean) => void) =>
  socket.on("textReveal/out", listener);

export const TextTyping = {
  in: textIn,
  out: textOut,
};
export const TextReveal = {
  in: textRevealIn,
  out: textRevealOut,
};
