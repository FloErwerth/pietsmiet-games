import { socket } from "../../index.tsx";

const startGameIn = (roomId: string) => socket.emit("startGame/in", roomId);
const startGameOut = (listener: () => void) => socket.on("startGame/out", listener);

export const StartGameFunctions = {
    in: startGameIn,
    out: startGameOut,
};
