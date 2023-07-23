import { createSelector } from "@reduxjs/toolkit";
import { getState } from "./baseSelectors";
import { getUserName } from "./authSelectors.ts";
import { topics } from "@/data";
import { getChosenGeneralTopic, getChosenPackName } from "./topicSelectors.ts";

const getGameState = createSelector([getState], (state) => state.gameModel);
export const getRoomID = createSelector(
  [getGameState],
  (gameState) => gameState.roomId,
);
export const getIsConnected = createSelector(
  [getGameState],
  (gameState) => gameState.connected,
);
export const getIsJoining = createSelector(
  [getGameState],
  (gameState) => gameState.isJoining,
);
export const getConnectedPlayers = createSelector(
  [getGameState],
  (gameState) => {
    return gameState.connectedPlayers;
  },
);
export const getBuzzer = createSelector(
  [getGameState],
  (state) => state.buzzer,
);
export const getIsBuzzerLocked = createSelector(
  [getGameState],
  (state) => state.buzzerLocked,
);
export const getHostName = createSelector(
  [getGameState],
  (state) => state.hostName,
);
export const getGameStarted = createSelector(
  [getGameState],
  (state) => state.gameStarted,
);
export const getIsModerator = createSelector(
  [getHostName, getUserName],
  (hostname, username) => hostname === username,
);
export const getQuestionAnserIndex = createSelector(
  [getGameState],
  (state) => state.questionAnserIndex,
);
export const getCurrentPairs = createSelector(
  [getChosenPackName, getChosenGeneralTopic, getQuestionAnserIndex],
  (packname, generalTopic) =>
    generalTopic && topics[generalTopic].packs[packname ?? ""].pairs,
);
export const getNumberOfQuestions = createSelector(
  [getCurrentPairs],
  (pairs) => pairs?.length,
);
export const getCurrentQuestion = createSelector(
  [getCurrentPairs, getQuestionAnserIndex],
  (pairs, index) => pairs && pairs[index],
);
export const getIsAnswerRevealed = createSelector(
  [getGameState],
  (state) => state.answerRevealed,
);
