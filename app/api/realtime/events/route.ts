import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      let lastKnownVersion = 0;

      // Send initial connect notification
      controller.enqueue(
        encoder.encode(`event: connected\ndata: ${JSON.stringify({ status: "connected", time: new Date().toISOString() })}\n\n`)
      );

      // Interval to poll global state and push updates to SSE stream
      const interval = setInterval(() => {
        try {
          const globalState = globalThis.__pixelpalooza_state__;
          if (globalState && globalState.version > lastKnownVersion) {
            lastKnownVersion = globalState.version;
            const message = JSON.stringify({
              type: "STATE_SYNC",
              teams: globalState.teams,
              games: globalState.games,
              participations: globalState.participations,
              transactions: globalState.transactions,
              scores: globalState.scores,
              auction: globalState.auction,
              eventState: globalState.eventState,
              version: globalState.version,
            });
            controller.enqueue(encoder.encode(`event: message\ndata: ${message}\n\n`));
          } else {
            // Heartbeat
            controller.enqueue(encoder.encode(`: heartbeat\n\n`));
          }
        } catch (err) {
          clearInterval(interval);
        }
      }, 1000);

      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        try {
          controller.close();
        } catch {}
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
