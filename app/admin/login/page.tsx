"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { KeyRound, ArrowLeft, Terminal, ShieldAlert, Eye, EyeOff, Lock } from "lucide-react";
import { soundFx } from "@/lib/audio/sound-fx";
import { FestoonLights } from "@/components/FestoonLights";
import { PixelBunting } from "@/components/PixelBunting";
import confetti from "canvas-confetti";

export default function AdminPasscodeLoginPage() {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setError("Please enter the organizer master passcode.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // Authenticate against secure server-side SHA-256 verification endpoint
      // This ensures the actual master passcode is never stored or bundled in client files
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: passcode.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        soundFx.playScoreAdded();
        try {
          confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
        } catch {}
        localStorage.setItem("gdgoc_admin_session", "authenticated");
        router.push("/admin");
      } else {
        soundFx.playPenalty();
        setError(data.error || "Invalid organizer passcode. Contact GDG Lead.");
      }
    } catch {
      soundFx.playPenalty();
      setError("Server connection failed. Please ensure the dev server is active.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col justify-between font-sans selection:bg-fest-yellow selection:text-black relative overflow-hidden">
      {/* Festoon Lights and Pixel Bunting */}
      <FestoonLights />
      <PixelBunting />

      {/* Top Navbar Header */}
      <header className="px-4 lg:px-8 pt-6 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 border border-white/20 text-xs font-grotesk font-bold uppercase tracking-wider text-slate-300 hover:text-fest-yellow hover:border-fest-yellow transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN TO FESTIVAL ARENA</span>
          </Link>

          <div className="flex items-center gap-2 bg-yellow-950/50 border border-fest-yellow/40 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-fest-yellow animate-ping" />
            <span className="font-grotesk text-[10px] uppercase font-bold tracking-widest text-fest-yellow">
              SECURE ACCESS PORTAL
            </span>
          </div>
        </div>
      </header>

      {/* Center Auth Card */}
      <main className="flex-1 flex items-center justify-center p-4 z-10 my-8">
        <div className="w-full max-w-md">
          {/* Neo-brutalist Container */}
          <div className="bg-white text-slate-900 border-4 border-black rounded-3xl p-6 sm:p-8 retro-shadow-black relative overflow-hidden">
            {/* Top Accent Strip */}
            <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-fest-yellow via-fest-pink to-fest-cyan" />

            {/* Badge & Title */}
            <div className="flex items-center gap-3 mb-5 mt-2">
              <div className="w-12 h-12 rounded-xl bg-black text-fest-yellow border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000]">
                <KeyRound className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-grotesk text-[10px] font-black uppercase tracking-widest text-fest-magenta bg-fest-magenta/10 border border-fest-magenta/30 px-2 py-0.5 rounded">
                  AUTHORIZED STAFF ONLY
                </span>
                <h1 className="font-anton text-3xl sm:text-4xl uppercase tracking-tight text-black leading-none mt-1">
                  CONTROL BOOTH
                </h1>
              </div>
            </div>

            <p className="font-grotesk text-xs text-slate-600 font-semibold uppercase tracking-wider mb-6">
              Enter the private master festival passcode to access the referee score dispatch and tournament console.
            </p>

            {/* Error Notification */}
            {error && (
              <div className="mb-5 p-3.5 bg-red-100 border-2 border-red-600 rounded-xl text-red-900 text-xs font-grotesk font-bold flex items-start gap-2.5 animate-shake">
                <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="leading-tight">{error}</span>
              </div>
            )}

            {/* Single Passcode Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label
                  htmlFor="passcode"
                  className="block font-grotesk text-xs uppercase font-black tracking-wider text-black mb-1.5"
                >
                  ORGANIZER MASTER PASSCODE
                </label>
                <div className="relative">
                  <input
                    id="passcode"
                    type={showPasscode ? "text" : "password"}
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter passcode..."
                    required
                    autoFocus
                    autoComplete="current-password"
                    className="w-full px-4 py-3 bg-slate-50 border-3 border-black rounded-xl font-mono text-base font-bold text-black placeholder:text-slate-400 focus:outline-none focus:bg-yellow-50 focus:ring-2 focus:ring-fest-yellow pr-12 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasscode(!showPasscode)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-black p-1 transition-colors"
                    title={showPasscode ? "Hide Passcode" : "Show Passcode"}
                  >
                    {showPasscode ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 bg-fest-yellow hover:bg-fest-coral hover:text-white text-black font-anton text-xl uppercase tracking-wider rounded-xl border-3 border-black retro-shadow-black transition-all active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>VERIFYING CREDENTIALS...</span>
                  </>
                ) : (
                  <>
                    <span>UNLOCK CONTROL BOOTH</span>
                    <span className="font-sans group-hover:translate-x-1 transition-transform">⚡</span>
                  </>
                )}
              </button>
            </form>

            {/* Bottom Security Note */}
            <div className="mt-6 pt-4 border-t-2 border-slate-200 flex items-center justify-between text-[11px] font-grotesk font-bold text-slate-500">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-slate-400" />
                <span>SHA-256 TIMING-SAFE</span>
              </span>
              <span>GDG ON CAMPUS • NMIMS</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs font-grotesk text-slate-500 z-10">
        PIXELPALOOZA 2026 // STRICTLY FOR CONTEST ORGANIZERS & FIELD REFEREES
      </footer>
    </div>
  );
}
