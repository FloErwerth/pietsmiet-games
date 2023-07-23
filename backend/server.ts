import type { Server as ServerType, Socket } from "socket.io";
import { GeneralTopicName } from "../app/src/data/";

const express = require("express");
const { Server } = require("socket.io");
export const SERVER_PORT = 5121;

const app = express();
const server = app.listen(SERVER_PORT, () => {
  console.log(`Server is listening on port ${SERVER_PORT}`);
});

export type Player = {
  socketId: string;
  userName: string;
  points: number;
  isHost?: boolean;
};
export type Host = Omit<Player, "points">;

export type RoomData = {
  [key: string]: {
    packname: string;
    generalTopic: GeneralTopicName;
    hostName: string;
    players?: Array<Player>;
    gameStarted: boolean;
  };
};

const roomData: RoomData = {};

export type IncommingMessages = {
  connection: "connection";
  ["createRoom/in"]: (
    roomNumber: string,
    chosenGeneralTopic: GeneralTopicName,
    chosenPackname: string,
    hostName: string,
  ) => void;
  ["joinRoom/in"]: (
    roomNumber: string,
    userName: string,
    socketId: string,
  ) => void;
  ["leaveRoom/in"]: (roomNumber: string, userName: string) => void;
  ["buzzer/in"]: (roomNumber: string, player: Omit<Player, "points">) => void;
  ["lockBuzzer/in"]: (roomNumber: string, locked: boolean) => void;
  ["resetBuzzer/in"]: (roomNumber: string) => void;
  ["startGame/in"]: (roomNumber: string) => void;
  ["revealAnswer/in"]: (roomNumber: string) => void;
  ["question/next/in"]: (roomNumber: string) => void;
  ["question/previous/in"]: (roomNumber: string) => void;
  ["correctAnswer/in"]: (roomNumber: string, player: Player) => void;
  ["incorrectAnswer/in"]: (roomNumber: string, player: Player) => void;
};

export type OutgoingMessages = {
  connection: "connection";
  ["createRoom/out"]: (roomId: string) => void;
  ["leaveRoom/out"]: (roomId: string, userName: string) => void;
  ["joinRoom/out"]: (roomData: RoomData[string]) => void;
  ["joinRoom/error"]: (message: string) => void;
  ["leaveRoom/success"]: (roomData: RoomData[string]) => void;
  ["leaveRoom/error"]: (message?: string) => void;
  ["buzzer/out"]: (player: Omit<Player, "points">) => void;
  ["lockBuzzer/out"]: (locked: boolean) => void;
  ["resetBuzzer/out"]: () => void;
  ["startGame/out"]: () => void;
  ["revealAnswer/out"]: () => void;
  ["question/next/out"]: () => void;
  ["question/previous/out"]: () => void;
  ["correctAnswer/out"]: (players: Player[]) => void;
  ["incorrectAnswer/out"]: (players: Player[]) => void;
};

export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
}) as ServerType<IncommingMessages, OutgoingMessages>;

io.on("connection", (socket: Socket<IncommingMessages, OutgoingMessages>) => {
  console.log("socket connected");

  socket.on("disconnect", () => {
    console.log("socket disconnected");
  });

  socket.on("correctAnswer/in", (roomNumber, player) => {
    const players = roomData[roomNumber].players;
    if (players) {
      players.splice(
        players.findIndex(
          (storedPlayer) => storedPlayer.socketId === player.socketId,
        ),
        1,
        player,
      );
      roomData[roomNumber].players = players;
      io.to(roomNumber).emit("correctAnswer/out", players);
    }
  });

  socket.on("incorrectAnswer/in", (roomNumber, player) => {
    const players = roomData[roomNumber].players;
    if (players) {
      players.forEach((storedPlayer) => {
        if (storedPlayer.socketId !== player.socketId) {
          storedPlayer.points += 1;
        }
      });
      io.to(roomNumber).emit("correctAnswer/out", players);
    }
  });

  socket.on("question/next/in", (roomNumber) => {
    io.to(roomNumber).emit("question/next/out");
  });
  socket.on("question/previous/in", (roomNumber) => {
    io.to(roomNumber).emit("question/previous/out");
  });

  socket.on("revealAnswer/in", (roomNumber) => {
    io.in(roomNumber).emit("revealAnswer/out");
  });

  socket.on("buzzer/in", (roomNumber, player) => {
    io.to(roomNumber).emit("buzzer/out", player);
  });

  socket.on("resetBuzzer/in", (roomNumber) => {
    io.to(roomNumber).emit("resetBuzzer/out");
  });

  socket.on("lockBuzzer/in", (roomNumber, locked) => {
    io.to(roomNumber).emit("lockBuzzer/out", locked);
  });

  socket.on("disconnecting", () => {
    const roomNumbers = Object.keys(roomData);
    const roomNumber = Array.from(socket.rooms.values()).find((number) =>
      roomNumbers.find((roomNumber) => roomNumber === number),
    );
    if (roomNumber && roomData[roomNumber]) {
      const room = roomData[roomNumber];
      if (room.players) {
        room.players = room.players.filter(
          ({ socketId }) => socketId !== socket.id,
        );
        io.to(roomNumber).emit("leaveRoom/success", room);
      }
    } else {
      //handle
      socket.emit("leaveRoom/error");
    }
  });

  socket.on(
    "createRoom/in",
    (roomNumber, chosenGeneralTopic, chosenPackname, hostName) => {
      if (!Array.from(socket.rooms.values()).includes(roomNumber)) {
        if (!Object.keys(roomData).includes(roomNumber)) {
          roomData[roomNumber] = {
            generalTopic: chosenGeneralTopic,
            packname: chosenPackname,
            hostName,
            gameStarted: false,
          };
          socket.join(roomNumber);
          socket.emit("createRoom/out", roomNumber);
        }
      }
    },
  );

  socket.on("startGame/in", (roomNumber) => {
    roomData[roomNumber] = { ...roomData[roomNumber], gameStarted: true };
    io.to(roomNumber).emit("startGame/out");
  });

  socket.on("joinRoom/in", (roomNumber, userName, socketId) => {
    if (Object.keys(roomData).includes(roomNumber)) {
      const room = roomData[roomNumber];
      if (room) {
        if (room.players && room.players.length > 0) {
          if (room.players.length < 4) {
            if (
              !room.players.find(
                ({ userName: joinedName }) => joinedName === userName,
              )
            ) {
              room.players = [
                ...room.players,
                { userName, socketId, points: 0 },
              ];
            }
          } else {
            socket.emit("joinRoom/error", "Zu viele Spieler.");
          }
        } else {
          room.players = [{ userName, socketId, points: 0 }];
        }
        socket.join(roomNumber);
        io.to(roomNumber).emit("joinRoom/out", room);
      } else {
        socket.emit("joinRoom/error", "Raum nicht gefunden.");
      }
    } else {
      socket.emit("joinRoom/error", "Raum nicht gefunden.");
    }
  });

  socket.on("leaveRoom/in", (roomNumber: string, userName: string) => {
    if (Object.keys(roomData).includes(roomNumber)) {
      if (roomData[roomNumber]) {
        socket.leave(roomNumber);
        const room = roomData[roomNumber];
        if (room && room.players) {
          room.players = room.players?.filter(
            ({ userName: joinedName }) => joinedName !== userName,
          );
          io.to(roomNumber).emit("leaveRoom/success", room);
        } else {
          socket.emit("leaveRoom/error");
        }
      }
    } else {
      socket.emit("leaveRoom/error", "Raum nicht gefunden.");
    }
  });
});
io.of("/").adapter.on("delete-room", (room) => {
  if (roomData[room]) {
    delete roomData[room];
  }
});
