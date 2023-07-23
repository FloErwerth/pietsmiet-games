import { socket } from "../../index.tsx";
import { Player } from "../../../../backend";

const correctAnswerIn = (roomId: string, player: Player) => socket.emit("correctAnswer/in", roomId, player);
const correctAnswerOut = (listener: (player: Player[]) => void) => socket.on("correctAnswer/out", listener);
const incorrectAnswerIn = (roomId: string, player: Player) => socket.emit("incorrectAnswer/in", roomId, player);
const incorrectAnswerOut = (listener: (player: Player[]) => void) => socket.on("incorrectAnswer/out", listener);
const revealAnswerIn = (roomId: string) => socket.emit("revealAnswer/in", roomId);
const reavealAnswerOut = (listener: () => void) => socket.on("revealAnswer/out", listener);
const questionNextIn = (roomId: string) => socket.emit("question/next/in", roomId);
const questionNextOut = (listener: () => void) => socket.on("question/next/out", listener);
const questionPreviousIn = (roomId: string) => socket.emit("question/previous/in", roomId);
const questionPreviousOut = (listener: () => void) => socket.on("question/previous/out", listener);
export const AnswerFunctions = {
    in: revealAnswerIn,
    out: reavealAnswerOut,
};
export const QuestionNext = {
    in: questionNextIn,
    out: questionNextOut,
};
export const QuestionPrevious = {
    in: questionPreviousIn,
    out: questionPreviousOut,
};
export const CorrectAnswer = {
    in: correctAnswerIn,
    out: correctAnswerOut,
};
export const IncorrectAnswer = {
    in: incorrectAnswerIn,
    out: incorrectAnswerOut,
};
