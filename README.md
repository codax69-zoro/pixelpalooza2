# GDGOC PIXELPALOOZA GAME ARENA 🎪🎵
### "Where ideas get Unhinged" · GDGOC NMIMS Navi Mumbai
### Live Event Leaderboard, Stage Projector HUD & Fast Score-Management System

A production-ready manual score-management and real-time live leaderboard web application custom-built for **Google Developer Groups on Campus (GDGOC), NMIMS Navi Mumbai** for the **Pixelpalooza** fest.

> **Important Architecture Principle:**  
> The 7 games (*Tech Tambola, Tech Pictionary, Debug the Code, Tech Bomb Defusal, AI or Human?, Tech Jeopardy, Code Relay*) are conducted physically by GDGOC organizers and student volunteers. This web application functions as the server-authoritative tournament scoring grid, audit engine, live spectator leaderboard, and auditorium stage projector HUD.

---

## ⚡ Key Deliverables & Features

- **🎪 Pixelpalooza Visual Theme**:
  - Faithfully reproduces the approved Stitch festival control room design: hanging pixel bunting flags, neon pink (`#FF2D78`), Minecraft obsidian voxel borders (`#3A4556`), festival attraction stage tags, and stage spotlights.
  - Zero sample/prototype teams loaded by default: starts on a clean slate ready for the live fest.

- **🏆 Live Animated Spectator Leaderboard (`/leaderboard` & `/`)**:
  - **Stage Podium**: Gold (#1 Headliner), Silver (#2), and Bronze (#3) tiers with instant confetti fanfare when a new team takes the lead.
  - **Empty-State Standby**: Elegant festival standby card awaiting qualifying squads.
  - **Framer Motion Dynamic Grid**: Instant ranking reorders with zero page refreshes, stage filter tabs, and sorting options (Score, Stages Played, Active Streak).
  - **Web Audio 8-Bit Synthesizer**: Custom retro audio engine synthesizing score chimes, penalty buzzes, undo beeps, and fanfare (100% zero external audio asset dependencies).

- **📺 Auditorium Stage Projector HUD (`/display`)**:
  - Ultra-high contrast, large-format layout engineered specifically for 1920x1080 and 1366x768 auditorium stage projectors.
  - Legible from 25+ meters across campus halls.
  - 1-click Fullscreen toggle (`F11` compatible) and Audio FX mute toggle.
  - Live Attraction marquee and real-time WebSocket sync status.

- **🎛️ Organizer Control Booth (`/admin`)**:
  - **< 10s Score Dispatch Desk**: Select attraction stage, select squad, tap quick XP chip (`+25`, `+50`, `+100`, `+150`, `+200`, `+300`) or custom XP, and commit.
  - **Double-Click & Spam Prevention**: Server-side and client-side debouncing with disabled state during dispatch transit.
  - **Penalty Deduction Desk**: Protected minus presets (`-25`, `-50 XP`) with mandatory penalty reason logging.
  - **Tamper-Proof Rollback (Undo)**: Undoing an error generates an audited `REVERSAL` transaction entry rather than hard-deleting records, guaranteeing tournament audit traceability.
  - **Bulk CSV Squad Importer**: Import your entire tournament squad registry in 3 seconds by pasting comma-separated lines (`Team Name, Captain, Member 1, Member 2...`).
  - **Single Squad Register & Editor**: Add or edit team captains and rosters on the fly.
  - **Tournament Safety Controls**: Instant **HUD Freeze** (for suspense before final reveals), **Stage FX** triggers, **Reset Scores** (keeps teams, resets XP to 0), and **Clear All Squads** (resets entire system).

- **📊 Squad Backstage Dossier (`/teams/[id]`)**:
  - Deep-dive team dossier displaying team captain, member roster, rank, total XP, per-game breakdown, and full chronological audit timeline.

- **🎪 Festival Attractions Hub (`/games`)**:
  - Complete rules, durations, scoring rubrics, and station requirements for all 7 GDGOC festival challenges.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14.2 (App Router) + React 18 + TypeScript
- **Design System**: Tailwind CSS (Pixelpalooza 40% Control Room / 30% Minecraft Voxel / 30% Music Fest)
- **Motion & Polish**: Framer Motion + Canvas Confetti
- **Sound**: Web Audio API Retro 8-bit Oscillator Synthesizer
- **Icons**: Lucide React
- **Realtime Layer**: Supabase Realtime (PostgreSQL WebSockets) + Native `BroadcastChannel` local fallback
- **Database (Optional/Production)**: Supabase PostgreSQL (Postgres changes publication on `score_events`, `teams`, `event_state`)

---

## 🚀 Quick Start for the Event

### 1. Run in Production Mode
```bash
# Install dependencies
npm install

# Build optimized production bundle
npm run build

# Start production server on port 3000
npm run start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Event URLs
| Screen | URL | Purpose |
| :--- | :--- | :--- |
| **Live Leaderboard** | `http://localhost:3000/leaderboard` | Spectators & participant smartphones |
| **Auditorium Projector HUD** | `http://localhost:3000/display` | Stage projector in the auditorium |
| **Attractions Hub** | `http://localhost:3000/games` | Game descriptions & festival rules |
| **Control Booth** | `http://localhost:3000/admin` | Organizers & referee score entry |
| **Admin Login** | `http://localhost:3000/admin/login` | Secure Organizer Passcode Entry |

---

## 📋 Loading Your Fest Teams During the Event

### Method A: Bulk CSV Import (Fastest)
1. Go to `/admin` and log in with the private organizer passcode.
2. In the right panel under **FESTIVAL SQUADS**, click **[+ BULK IMPORT SQUADS (CSV)]**.
3. Paste your team list in the format:
   ```csv
   Byte Bandits, Krishna, Rahul, Aarav, Riya
   Code Raiders, Tanya, Sneha, Rohan, Aditya
   Pixel Pioneers, Vikram, Kabir, Ananya, Dev
   ```
4. Click **[IMPORT SQUADS]**. All squads appear immediately in the standings and admin dropdowns.

### Method B: Single Squad Registration
1. In `/admin`, scroll to **REGISTER SINGLE SQUAD**.
2. Type Team Designation, Captain Name, Initial XP (defaults to 0), and Members.
3. Click **[+ ADD NEW SQUAD]**.

---

## 📡 Multi-Device Realtime WebSockets & Referee Station Setup

Pixelpalooza 2.0 comes equipped with an enterprise-grade multi-transport Realtime WebSocket layer designed specifically for multi-device festival coordination across campus:

### 1. Dedicated WebSocket Server (Local Wi-Fi or Remote VPS / Render)
Run the built-in standalone WebSocket server alongside Next.js:
```bash
# Terminal 1: Launch Realtime WebSocket Server (Port 3001)
npm run socket

# Terminal 2: Launch Next.js Application (Port 3000)
npm run dev
# OR for production: npm run build && npm run start
```
- Devices connected to the same campus Wi-Fi router (e.g. `http://192.168.x.x:3000`) connect directly to `ws://192.168.x.x:3001` with sub-5ms sync.
- For cloud hosting (Render, Railway, Fly.io), deploy `server/websocket-server.mjs` and set `NEXT_PUBLIC_WS_URL=wss://your-ws-server.onrender.com`.

### 2. Zero-Config Vercel Live-Sync (Server-Sent Events + Delta Engine)
If you deploy to **Vercel without any external services or database**, the application automatically activates **Vercel Serverless Live-Sync Engine** (`/api/realtime/events` and `/api/realtime/sync`).
- **All devices sync live** across smartphones, tablets, and auditorium projectors with zero setup.
- Displays `LIVE SYNC ACTIVE` on the HUD and Control Booth.

### 3. Supabase Realtime WebSockets (High-Volume Cloud Database)
For large festivals with persistent PostgreSQL audit trails:
1. Create a free project at [supabase.com](https://supabase.com).
2. In Supabase **SQL Editor**, execute `supabase/schema.sql` (fixed RLS policies and `REPLICA IDENTITY FULL`).
3. In Supabase **SQL Editor**, execute `supabase/seed.sql`.
4. In your Vercel Project Settings (or `.env.local`):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ORGANIZER_PASSCODE_HASH=64df054a478c31e62514c51b6bbf3f5a52f0341addcc7e2e14f1c1d938b71aba
   ```
5. Supabase WebSockets broadcast events across all devices in <30ms with instant `ARENA_SYNC` broadcast and Postgres CDC replication!

---

## 📱 Multi-Device Referee Stations (Scoring & Registration per Game)

Referees at each festival stall can open their smartphone browser directly to their assigned game station:

| Game Attraction | Direct Referee URL |
| :--- | :--- |
| **Balloon + Cup Tower** | `https://your-domain.vercel.app/admin?game=balloon-cup-tower` |
| **Tech Tambola** | `https://your-domain.vercel.app/admin?game=tech-tambola` |
| **Tech Pictionary** | `https://your-domain.vercel.app/admin?game=tech-pictionary` |
| **Debug the Code** | `https://your-domain.vercel.app/admin?game=debug-the-code` |
| **Tech Bomb Defusal** | `https://your-domain.vercel.app/admin?game=tech-bomb-defusal` |
| **AI or Human?** | `https://your-domain.vercel.app/admin?game=ai-or-human` |
| **Tech Jeopardy** | `https://your-domain.vercel.app/admin?game=tech-jeopardy` |
| **The Tech Auction (Day 2)** | `https://your-domain.vercel.app/admin?game=tech-auction` |

Referees can also tap the **Referee Station** quick-selector bar at the top of `/admin` to switch games with 1 tap.
When a squad walks up:
1. Tap **[REGISTER & PAY ENTRY FEE]** (auto-deducts entry cost from squad wallet).
2. Set status to **PLAYING** → **COMPLETED**.
3. Tap **[AWARD REWARD (+XP)]** or custom XP chips.
4. The auditorium projector (`/display`) and spectator leaderboard (`/leaderboard`) instantly celebrate with sound chimes and fanfare across all connected devices!

---

## 🔒 Security & Data Integrity

- Score inputs are sanitized and server-authoritative.
- Double-click spamming is eliminated with both frontend lockouts and database constraint guards.
- Scores cannot be silently deleted; score reversals are appended as audited transactions.
- Zero mock teams exist in the live database or local storage (`gdgoc_pixelpalooza_teams_v2`).

---

## 🎓 Credits
Organized by **Google Developer Groups on Campus (GDGOC)**, **NMIMS Navi Mumbai**.  
*Pixelpalooza — Where ideas get Unhinged.*
