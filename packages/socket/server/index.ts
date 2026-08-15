import { Server as SocketIOServer } from 'socket.io'
import type { Server as HttpServer } from 'http'
import { ServerEvents } from './events';

function createSocketServer(httpServer: HttpServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
    },
  });

  // create types for socket events later
  io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    socket.on(ServerEvents.JOIN_ROOM, () => {
      console.log("join room", socket.id);
    });

    socket.on(ServerEvents.LEAVE_ROOM, () => {
      console.log("leave room", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
    });
  });

  return io;
  
}

export { createSocketServer };