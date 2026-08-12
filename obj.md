# Riverside-Inspired Recording Platform — Phased Build Plan

## Guiding principles established

- **Signaling server is permanent infrastructure.** It is never removed, only relocated (e.g., to Durable Objects) or given less work post-connection. Every mode — mesh, P2P, SFU — depends on it for room join and SDP/ICE exchange.
- **SFU does not eliminate signaling — it adds more of it** (transport creation, produce/consume negotiation) on top of the original room signaling.
- **Media quality and "no server" are not the same axis.** Removing the *signaling* server has zero quality impact. Removing the *media* server (going full mesh) sacrifices quality/scale as participants grow, since upload bandwidth splits N-1 ways.
- **Local recording is a separate pipeline from the live call**, built once, and unaffected by mesh vs. SFU vs. P2P mode:

```
getUserMedia()
    ├──→ WebRTC PeerConnection → other participants (live, adaptive, lossy)
    └──→ MediaRecorder → chunks → IndexedDB → upload (fixed high quality, network-independent)
```

- **2-person calls can run peer-to-peer after signaling** (no media/chat relay through the server). 3+ person calls need the SFU. This is a single-backend routing decision, not two separate backends.
- **Mid-call dynamic switching (2→3 people) is a scoped-out rabbit hole.** Decision: choose P2P vs. SFU mode **at room creation** ("Quick Call" vs. "Meeting Room"), not dynamically mid-call.

---

## Phase 1 — Foundation

**Goal:** Auth, landing page, basic app shell. Not the main event — move fast.

- Better Auth: session cookies, Google OAuth, email OTP
- Landing page
- Basic UI shell (not polished, just navigable)

---

## Phase 2 — Signaling (Socket.IO)

**Goal:** Rooms exist and people can join them. No media yet.

- Create room
- Join room
- Leave room / disconnect handling
- Participant list sync
- Relay channel for SDP offer/answer and ICE candidates

This server is used in **every subsequent phase**, including SFU and P2P modes.

---

## Phase 3 — Basic WebRTC (Mesh, 2 people)

**Goal:** Understand SDP/ICE/track negotiation with the simplest possible topology.

- Direct browser↔browser peer connection
- Audio/video tracks flowing
- Deliberately capped at 2 people — mesh is for learning WebRTC fundamentals here, not the final architecture

---

## Phase 4 — Local Recording (built once, real implementation)

**Goal:** Real feature, not a throwaway exercise. Built here, left unchanged through every later phase.

```
MediaRecorder → chunk (ondataavailable, timeslice) → IndexedDB → upload to backend/S3 or R2
```

- Runs off the raw local `getUserMedia()` stream, independent of what WebRTC is doing
- Fixed high quality (e.g. 1080p WebM), not subject to network conditions
- Chunked upload: resumable, crash-recoverable, no memory explosion
- **Explicitly out of scope for now:** browser-to-browser chunk transfer / P2P recording backup (Future Exploration #2, #7) — deprioritized, revisit later only as a resilience enhancement

---

## Phase 5 — Mediasoup SFU

**Goal:** Replace mesh with SFU for 3+ participant scale and consistent quality.

- Transport creation, connect, produce, consume signaling (all still over the Phase 2 signaling server)
- One upload stream per participant, fanned out by the SFU
- Local recording (Phase 4) requires **no changes** — it never touched mesh or SFU in the first place

---

## Phase 6 — Mode Routing: 2-person P2P vs. SFU

**Goal:** Single backend, two modes, chosen at room creation — not switched mid-call.

- **"Quick Call" mode (2 people):** after signaling handshake, peers connect directly; media and chat flow over WebRTC/DataChannel; server steps back from the media path but remains the signaling authority
- **"Meeting Room" mode (3+ people):** signaling routes peers to Mediasoup transports as in Phase 5
- Mode is a property set at room creation, avoiding the live-migration problem (tearing down mesh mid-call to move to SFU is a known hard edge case — intentionally deferred)

Resume framing: *"Implemented hybrid architecture where 1:1 sessions use direct peer-to-peer WebRTC after initial signaling, eliminating server-side media/chat relay for two-party calls while retaining SFU routing for group sessions."*

---

## Phase 7+ — Everything else from the original doc, now correctly sequenced after the core pipeline works

Once Phases 1–6 are solid, layer in from the original design doc as time allows:

- Chat persistence (Socket.IO → DB → broadcast), waiting room, host controls, mute/camera, raise hand, reactions
- Screen sharing (separate track, renegotiation)
- Device controls (camera/mic/speaker selection, noise suppression)
- Network recovery (reconnect → resume socket → resume WebRTC → resume recording → retry uploads)
- Recording merge (FFmpeg on chunks → merged file → playback page)
- Redis adapter + multiple socket servers (only relevant if NOT moving signaling to Durable Objects)
- Monitoring (bitrate, packet loss, RTT, upload progress)

---

## Deferred / Future Exploration (not MVP)

These are documented but intentionally not built until the core is done:

1. **Serverless signaling via Cloudflare Durable Objects** — replaces Node+Socket.IO for room coordination; zero quality impact since it only touches metadata, not media. Best done as a documented **v2 migration** after the Socket.IO version works, so there's a clear "before/after" architecture story.
2. **Browser-to-browser recording chunk backup** — P2P chunk relay as a resilience feature, not core pipeline.
3. **Peer-assisted uploads** for participants with poor connectivity.
4. **Live captions, transcription, diarization, AI summary/action items.**
5. **Adaptive streaming / active speaker optimization** — quality-of-service layer on top of SFU.
6. **End-to-end encryption, plugin architecture, collaborative whiteboard, edge-based multi-region signaling.**

---

## Known limitations to state honestly (not hide)

- Mid-call 2→3 person transition is not dynamically handled — mode is fixed at room creation.
- Signaling server is not eliminated anywhere in this architecture; only its post-connection role in the media path is reduced, and only for 2-person calls.
- Durable Object migration is a planned architectural evolution, not part of the MVP critical path.
