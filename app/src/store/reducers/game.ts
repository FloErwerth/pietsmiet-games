import { createAction, createReducer } from "@reduxjs/toolkit";
import { Player } from "../../../../backend";

export const setRoomID = createAction<string>("game/set_room_id");
export const setConnected = createAction<boolean>("game/connected");
export const setIsJoining = createAction<boolean>("game/joining");
export const setConnectedPlayers = createAction<Player[]>(
  "game/add_connected_player",
);
export const setUser = createAction<Partial<Player>>("game/set_user");
export const setActiveBuzzer = createAction<Omit<Player, "points"> | undefined>(
  "game/buzzer",
);
export const resetBuzzer = createAction<undefined>("game/buzzer_reset");
export const setBuzzerLocked = createAction<boolean>("game/buzzer_lock");
export const setStartGame = createAction<boolean>("game/set_start_game");
export const setProfilePicture = createAction<{
  picture: string;
  senderId: string;
}>("game/set_profile_picture");
export const setQuestionAnswerIndex = createAction<number>(
  "game/set_question_anser_index",
);
export const setAnswerRevealed = createAction<boolean>(
  "game/set_answer_revealed",
);
export const setText = createAction<{ player: Player; text: string }>(
  "game/set_text",
);
export const setTextRevealed = createAction<boolean>("game/set_text_revealed");
export type GameState = {
  gameStarted: boolean;
  buzzer: Omit<Player, "points"> | undefined;
  buzzerLocked: boolean;
  answerRevealed: boolean;
  roomId: string;
  connected: boolean;
  isJoining: boolean;
  connectedPlayers: Player[];
  user: Player;
  questionAnserIndex: number;
  textRevealed: boolean;
};

const initialGameState: GameState = {
  questionAnserIndex: 0,
  gameStarted: false,
  answerRevealed: false,
  buzzer: undefined,
  buzzerLocked: false,
  roomId: "",
  connected: false,
  isJoining: true,
  connectedPlayers: [],
  user: { userName: "", points: 0, socketId: "" },
  textRevealed: false,
};

const gameReducer = createReducer<GameState>(initialGameState, (builder) => {
  builder
    .addCase(setText, (state, action) => {
      state.connectedPlayers = state.connectedPlayers.map((player) => {
        if (player.socketId === action.payload.player.socketId) {
          return { typedText: action.payload.text, ...action.payload.player };
        } else {
          return player;
        }
      });
    })
    .addCase(setRoomID, (state, action) => {
      if (state) {
        state.roomId = action.payload;
      }
    })
    .addCase(setProfilePicture, (state, action) => {
      if (state && state.connectedPlayers) {
        const foundPlayerIndex = state.connectedPlayers.findIndex((player) => {
          return player.socketId === action.payload.senderId;
        });
        if (foundPlayerIndex >= 0) {
          const playerWithPic: Player = {
            ...state.connectedPlayers[foundPlayerIndex],
            avatarURL: action.payload.picture,
          };
          const newPlayers = [...state.connectedPlayers];
          newPlayers.splice(foundPlayerIndex, 1, playerWithPic);
          state.connectedPlayers = newPlayers;
        }
      }
    })
    .addCase(setTextRevealed, (state, action) => {
      if (state) {
        state.textRevealed = action.payload;
      }
    })
    .addCase(setAnswerRevealed, (state, action) => {
      state.answerRevealed = action.payload;
    })
    .addCase(setQuestionAnswerIndex, (state, action) => {
      if (state) {
        state.questionAnserIndex = action.payload;
      }
    })
    .addCase(setStartGame, (state, action) => {
      if (state) {
        state.gameStarted = action.payload;
      }
    })
    .addCase(setUser, (state, action) => {
      if (state) {
        const isHost = state.user.isHost ?? action.payload.isHost ?? undefined;
        state.user = { isHost, ...state.user, ...action.payload };
      }
    })
    .addCase(setActiveBuzzer, (state, action) => {
      if (!state.buzzer) {
        state.buzzer = action.payload;
      }
    })
    .addCase(resetBuzzer, (state, action) => {
      state.buzzer = action.payload;
    })
    .addCase(setBuzzerLocked, (state, action) => {
      state.buzzerLocked = action.payload;
    })
    .addCase(setConnected, (state, action) => {
      if (state) {
        state.connected = action.payload;
      }
    })
    .addCase(setIsJoining, (state, action) => {
      if (state) {
        state.isJoining = action.payload;
      }
    })
    .addCase(setConnectedPlayers, (state, action) => {
      if (state && state.connectedPlayers.length < 4) {
        state.connectedPlayers = action.payload;
      }
    });
});

export default gameReducer;
