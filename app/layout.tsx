import type { Metadata } from "next";
import "./globals.css";
import { ArenaProvider } from "@/lib/store/arena-context";
import { ParticleBackground } from "@/components/ParticleBackground";

export const metadata: Metadata = {
  title: "GDGOC GAME ARENA | Campus Tournament Leaderboard",
  description:
    "Production-grade manual score management and real-time live leaderboard system for GDGOC technical gaming events.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-obsidian-950 text-slate-100 min-h-screen relative font-mono selection:bg-realm-emerald selection:text-obsidian-950">
        <ArenaProvider>
          <ParticleBackground />
          <div className="relative z-10 min-h-screen flex flex-col">
            {children}
          </div>
        </ArenaProvider>
      </body>
    </html>
  );
}
