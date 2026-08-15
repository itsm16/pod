import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'

const createSocketClient = (url: string): Socket => {
  const socket = io(url);
  return socket;
}

export { createSocketClient };