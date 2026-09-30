import http from "http";
import { WebSocketServer, WebSocket } from "ws";

const PORT = process.env.WS_PORT || process.env.PORT || 3001;

// Global tournament in-memory state for WebSocket server
const state = {
  teams: [],
  games: [],
  participations: [],
  transactions: [],
  scores: [],
  auction: [],
  eventState: null,
  version: 1,
  lastUpdated: new Date().toISOString(),
};

// Create HTTP server for health checks & REST sync bridge
const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === "/health" || url.pathname === "/") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: "ok",
        service: "Pixelpalooza Realtime WebSocket Server",
        connectedClients: wss.clients.size,
        stateVersion: state.version,
        uptimeSeconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
      })
    );
    return;
  }

  if (url.pathname === "/api/state" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(state));
    return;
  }

  if (url.pathname === "/api/sync" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        const payload = JSON.parse(body);
        applyPatchAndBroadcast(payload, null);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, version: state.version }));
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not Found" }));
});

// Create WebSocket server attached to HTTP server
const wss = new WebSocketServer({ server });

function applyPatchAndBroadcast(data, senderWs) {
  if (!data || typeof data !== "object") return;

  state.version++;
  state.lastUpdated = new Date().toISOString();

  // Merge into in-memory state
  if (data.teams && Array.isArray(data.teams)) state.teams = data.teams;
  if (data.games && Array.isArray(data.games)) state.games = data.games;
  if (data.participations && Array.isArray(data.participations)) state.participations = data.participations;
  if (data.transactions && Array.isArray(data.transactions)) state.transactions = data.transactions;
  if (data.scores && Array.isArray(data.scores)) state.scores = data.scores;
  if (data.auction && Array.isArray(data.auction)) state.auction = data.auction;
  if (data.eventState && typeof data.eventState === "object") state.eventState = data.eventState;

  // Single event appends
  if (data.type === "SCORE_ADDED" && data.event) {
    if (!state.scores.some((s) => s.id === data.event.id)) {
      state.scores = [data.event, ...state.scores];
    }
  }

  const broadcastMsg = JSON.stringify({
    ...data,
    _serverVersion: state.version,
    _timestamp: state.lastUpdated,
  });

  // Broadcast to all clients (except sender if senderWs provided)
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client !== senderWs) {
      try {
        client.send(broadcastMsg);
      } catch (e) {
        console.error("Error sending to client:", e);
      }
    }
  });
}

wss.on("connection", (ws, req) => {
  const ip = req.socket.remoteAddress;
  console.log(`[WS] Client connected from ${ip}. Total active clients: ${wss.clients.size}`);

  // Send current full state on connect
  ws.send(
    JSON.stringify({
      type: "STATE_SYNC",
      teams: state.teams.length > 0 ? state.teams : undefined,
      games: state.games.length > 0 ? state.games : undefined,
      participations: state.participations.length > 0 ? state.participations : undefined,
      transactions: state.transactions.length > 0 ? state.transactions : undefined,
      scores: state.scores.length > 0 ? state.scores : undefined,
      auction: state.auction.length > 0 ? state.auction : undefined,
      eventState: state.eventState || undefined,
      _serverVersion: state.version,
      _clientCount: wss.clients.size,
    })
  );

  // Notify everyone of updated client count
  const clientCountMsg = JSON.stringify({
    type: "CLIENT_COUNT",
    count: wss.clients.size,
  });
  wss.clients.forEach((c) => {
    if (c.readyState === WebSocket.OPEN) {
      try {
        c.send(clientCountMsg);
      } catch {}
    }
  });

  ws.isAlive = true;
  ws.on("pong", () => {
    ws.isAlive = true;
  });

  ws.on("message", (raw) => {
    try {
      const data = JSON.parse(raw.toString());
      applyPatchAndBroadcast(data, ws);
    } catch (e) {
      console.warn("[WS] Received malformed message:", e);
    }
  });

  ws.on("close", () => {
    console.log(`[WS] Client disconnected. Total active clients: ${wss.clients.size}`);
    const dcMsg = JSON.stringify({
      type: "CLIENT_COUNT",
      count: wss.clients.size,
    });
    wss.clients.forEach((c) => {
      if (c.readyState === WebSocket.OPEN) {
        try {
          c.send(dcMsg);
        } catch {}
      }
    });
  });

  ws.on("error", (err) => {
    console.error("[WS] Client socket error:", err);
  });
});

// Heartbeat interval to prune stale connections
const heartbeatInterval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (!ws.isAlive) {
      return ws.terminate();
    }
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

wss.on("close", () => {
  clearInterval(heartbeatInterval);
});

server.listen(PORT, () => {
  console.log(`
==========================================================
🎪 PIXELPALOOZA 2.0 - DEDICATED REALTIME WEBSOCKET SERVER
==========================================================
-> WebSocket Endpoint: ws://localhost:${PORT}
-> REST Health API:    http://localhost:${PORT}/health
-> Multi-Device Sync:  ACTIVE & READY
==========================================================
  `);
});
