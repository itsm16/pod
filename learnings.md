# Learnings

### How deployment decides which socket

- Serverless (Vercel/Cloudflare) can't hold a persistent WebSocket connection at all — any realtime socket must live in a separate standalone server regardless of which library you pick.
- Long-running Node (VM/Docker/Bun server) lets you attach the socket to the same process as Next via a custom `server.ts` — one process, one port, one deployable.
- Standalone signaling server (own port) is the only layout that works on both serverless and VM, and it makes a later Durable Objects migration a straight swap since the signaling module stays transport-agnostic.
- The socket choice itself (Socket.IO vs tRPC ws vs raw ws) is downstream of the deployment question — first decide where it runs, then pick the library.

### The room hub is just a Map — the "manager" aha moment

- A room "manager" doesn't need a server or a DB — it's an in-memory data structure: `Map<roomId, Map<userId, emitFn>>`.
- Join = `hub.join(roomId, userId, emit)` which inserts into the inner Map.
- Leave/disconnect = the subscription's teardown (or socket close) calls the returned `unsubscribe`, which deletes the entry and prunes empty rooms.
- Sending a signal = look up `rooms.get(roomId).get(targetUserId)` and call its `emitFn` — routing is just nested Map lookups.
- So a WebSocket server "manages" rooms exactly like a hash table; the whole architecture collapses to CRUD on a `Map`.

### tRPC ws built-in features (things you don't build yourself)

- **Reconnect with exponential backoff** — `createWSClient` auto-reconnects on `close`/`error`. Default delay: attempt 0 → 0ms, then 1s, 2s, 4s… capped at 30s. Override with `retryDelayMs: (attempt) => ms`.
- **Pending subscriptions survive reconnect** — the client keeps them in the request manager and re-sends them after the socket reopens; pending one-shot queries/mutations are failed immediately instead.
- **Server-forced reconnect** — `applyWSSHandler` returns `broadcastReconnectNotification()`. Call it on deploy/restart; every client gets `{method:"reconnect"}` and reconnects.
- **Keep-alive heartbeat** — client `keepAlive: {enabled, intervalMs: 5000, pongTimeoutMs: 1000}` sends PING/PONG; a dead connection is killed, which triggers the reconnect loop. Server side: `applyWSSHandler({keepAlive:{enabled:true}})`.
- **connectionState** — a `BehaviorSubject` observable (connecting/pending/connected) for showing "reconnecting…" in the UI.
- **connectionParams** — client sends `{method:"connectionParams"}` as the first message; the server exposes it on `createContext` via `info.connectionParams`. An auth channel alternative to cookies (no token in the URL).
- **Per-subscription AbortController** — calling `subscription.stop()` (or the socket closing) aborts the server-side generator, which runs its `finally` block — this is exactly the hook the room hub uses to remove the user and broadcast the new participant list.
- **Lazy mode** — `lazy: {enabled, closeMs}` closes the ws after inactivity (no messages + no pending requests), reopening on demand.
- **Custom encoder** — `experimental_encoder` lets you swap JSON for a binary wire format.
- **prefix** — restrict which request paths the ws handler accepts; **onError** hook logs context-creation and per-operation failures; the client also batches multiple operations into one socket frame.

### The lastEventId / resume nuance

- tRPC subscriptions can tag each emitted event with an id via `tracked(id, data)`; the client remembers the last one and sends it back on resubscribe as `params.lastEventId`, letting the server *resume* the stream where it left off.
- This is meaningful for **replayable** streams: chat history, a notification log, anything you can re-request from a snapshot.
- It is **meaningless for signaling**: SDP offers, ICE candidates and join/leave are one-shot ephemeral events — there's nothing to replay. The right recovery is exactly the re-join: the client re-subscribes to `room.join`, the hub re-syncs the participant snapshot, and the peer renegotiates WebRTC from scratch. Don't build resume for signaling; build re-join + renegotiation.
