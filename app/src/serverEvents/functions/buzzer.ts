import { socket } from "../../index.tsx";
import { Player } from "../../../../backend";

const buzzerIn = (roomId: string, playerName: string) => socket.emit("buzzer/in", roomId, { userName: playerName, socketId: socket.id });
const buzzerOut = (listener: (fromPlayer: Omit<Player, "points">) => void) => socket.on("buzzer/out", listener);
const resetBuzzerIn = (roomId: string) => socket.emit("resetBuzzer/in", roomId);
const resetBuzzerOut = (listener: () => void) => socket.on("resetBuzzer/out", listener);
const lockBuzzerIn = (roomId: string, locked: boolean) => socket.emit("lockBuzzer/in", roomId, locked);
const lockBuzzerOut = (listener: (locked: boolean) => void) => socket.on("lockBuzzer/out", listener);

export const BuzzerFunctions = {
    in: buzzerIn,
    out: buzzerOut,
};
export const ResetBuzzerFunctions = {
    in: resetBuzzerIn,
    out: resetBuzzerOut,
};
export const LockBuzzerFunctions = {
    in: lockBuzzerIn,
    out: lockBuzzerOut,
};
