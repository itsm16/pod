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

### Initializing a new package (`@repo/socket`) in this pnpm monorepo

- Every package is auto-registered by `pnpm-workspace.yaml` (`packages/*`), so creating the folder is enough — no manual workspace edit. It only becomes *resolvable* once another package lists it as a dependency AND `pnpm install` links it.
- To add the package to a consumer: add `"@repo/socket": "workspace:*"` to that package's `dependencies`, then run `pnpm install` at the repo root. pnpm creates a symlink at `<consumer>/node_modules/@repo/socket -> packages/socket`. Verified with `ls -la apps/api/node_modules/@repo/socket`.
- Each package needs the repo's scaffolding to typecheck: `tsconfig.json` extending `@repo/typescript-config/node.json` (with `"include": ["server/", "client/", "index.ts"]`) and a `.eslintrc.cjs` extending `@repo/eslint-config/node.js`. Without the tsconfig, `tsc` won't know the paths.
- The `node.json` base sets `noEmit`-style resolution but the api app has its own `tsconfig.json` with `rootDir: ./src` — that's why `packages/socket` needs its own tsconfig that includes its source folders.
- **`pnpm --filter`** scopes a command to one package: `pnpm --filter @repo/socket <script>`. It only works if that package has the script defined (e.g. it errored with "None of the selected packages has a check-types script" because `@repo/socket` doesn't define one). To check types of a package lacking a script, run `npx tsc -p <path>/tsconfig.json --noEmit`.
- Repo-wide scripts use turbo (`pnpm build` / `pnpm check-types`), which fans out to each package that declares the script.

### Duplicate identifier pitfall when importing socket.io + node:http

- `packages/socket/server/index.ts` imported both `Server` (from `socket.io`) and `Server` (from `node:http`) → `TS2300 Duplicate identifier`. Fix: alias imports — `import { Server as IOServer } from "socket.io"` and `import type { Server as HttpServer } from "node:http"`. Use `new IOServer(httpServer, {...})`.
- Kept `type SocketServer = IOServer<ClientToServerEvents, ServerToClientEvents>` (socket.io is generic over the client/server event maps) so the app can type the instance.
- Attaching socket.io: `new IOServer(httpServer)` attaches to the existing HTTP server; the HTTP server keeps doing `.listen(PORT)`. Only pass the http server, don't call `io.listen(PORT)` too — that double-listens.

---

### "Added to package.json but import still fails" — why

- Declaring `"@repo/socket": "workspace:*"` in a consumer's `package.json` is NOT enough. pnpm only (re)creates the node_modules symlink during `pnpm install`. Symptom: `import ... from "@repo/socket"` throws "Cannot find module '@repo/socket'" even though the dep + the source folder both exist.
- Fix: run `pnpm install` at the repo root, then verify the link with `ls -la apps/api/node_modules/@repo/socket` → shows `-> ../../../../packages/socket`.
- A running dev server (tsx watch / next dev) caches module resolution at startup — restart it after installing so it picks up the new symlink.
- Internal packages must use `"workspace:*"` (not `"*"` or a version) — otherwise pnpm queries the npm registry and fails on the private package.
- A symlinked folder with no `main`/`exports` field still resolves: the TS loader falls back to `index.ts`, so no build step is needed — but only once the symlink exists.

---

### React: the `useEffect` cleanup — `return () => socket.disconnect()`

- `useEffect(() => { ... return () => { socket.disconnect() } }, [])` — the returned function is the cleanup, run by React (not you).
- It runs on **unmount** (leaving the page) so the socket closes and the server sees "User disconnected" — prevents leaked connections.
- It also runs **before every re-run** of the effect when deps change — with `[]` deps it only runs on unmount.
- `createSocketClient` must live inside the effect (or be memoized), not created on every render — otherwise each render makes a new socket.
- React StrictMode (dev) mounts → unmounts → remounts once, so cleanup + re-connect firing twice is expected, not a bug.
- Without the cleanup the component re-mounts a second socket while the first stays open → duplicate "User connected" on the server.

---

### "Can't resolve fs" in Next.js when importing a node package barrel
### simply - changed import from import { createSocketClient } from '@repo/socket/client';
to import { createSocketClient } from '@repo/socket/client';
### '@repo/socket' (imports both server and client) => '@repo/socket/client' (only client)

- `packages/socket/index.ts` re-exports both `./server` and `./client`. The server side imports `socket.io`, and `socket.io/dist/index.js` does `require("fs")` (it can serve the client bundle).
- The web app imported `createSocketClient` from `@repo/socket` — Next's browser bundle pulls the whole barrel, hits `socket.io` → `fs`, and fails with "Module not found: Can't resolve 'fs'".
- Fix: import from the leaf subpath so the browser only gets `socket.io-client`:
  - web: `import { createSocketClient } from "@repo/socket/client"`
  - api: `import { createSocketServer } from "@repo/socket/server"`
- Same pattern as `@repo/trpc/client`. tsc passes either way — this error only shows up in the bundler (next build/dev), not in `tsc --noEmit`.
- Rule: a shared package that ships both a node server and a browser client must NOT expose a barrel that mixes them; consumers import the leaf (`@repo/socket/client` vs `@repo/socket/server`).

---

### "Socket closed before connection is established" in DevTools — StrictMode, not a bug

- Symptom: the Network tab shows a socket.io request that closed before the handshake finished, yet the socket works.
- Cause: React StrictMode (dev) mounts → unmounts → remounts the component once. The effect's cleanup (`socket.disconnect()`) kills the FIRST socket mid-handshake; that aborted request is the "closed" one. The second socket connects fine.
- Not a bug — expected dev-only behavior; production builds don't double-mount.
- Design takeaway: don't connect a socket on a page that doesn't need it. Only connect where the room/media actually live.

### Join-page vs meet-page socket placement

- Join page (`/join/[roomId]`): no socket at all — just a button that redirects to `/meet/[roomId]`.
- Meet page (`/meet/[roomId]`): the single place the socket connects, in a `useEffect` on mount → on `connect`, emit `joinRoom(roomId)` (auto-join), then wire chat/participants/RTC.
- Keeps one connection per room, no connect-on-join-page noise, and the closed-request artifact goes away.

---

### Connection lifecycle: join → meet → end call

- Join page (`/join/[roomId]`): no socket, just a "Join" button → `router.push('/meet/' + roomId)`.
- Meet page (`/meet/[roomId]`): `useEffect` on mount creates + connects the socket; on `connect` → auto-`joinRoom(roomId)` + set status. One connection, one place — no separate join button to get out of sync.
- End call: `socket.disconnect()` → `router.push('/')`. No explicit `leaveRoom` emit needed — the server's `disconnect` handler broadcasts `USER_LEFT`, so abrupt leaves (tab close / nav away) behave identically to pressing End Call. Unmount cleanup calls `disconnect()` as a safety net.
- If you later need to distinguish "left room but kept socket" (e.g., switch rooms) from "left call", add an explicit `leaveRoom` emit. For basic signaling, `disconnect()` is enough.

---
