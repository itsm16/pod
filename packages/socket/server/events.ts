const ServerEvents = {
  JOIN_ROOM: 'client:join-room',
  LEAVE_ROOM: 'client:leave-room',
  MESSAGE: 'client:message',
} as const;

const ClientEvents = {
  JOIN_ROOM: 'server:join-room',
  LEAVE_ROOM: 'server:leave-room',
  MESSAGE: 'server:message',
};

export { ServerEvents, ClientEvents };