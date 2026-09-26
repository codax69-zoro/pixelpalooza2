"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Key, ArrowLeft, Terminal, AlertCircle, Lock } from "lucide-react";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Check campus master organizer passkey first
      const masterCode = process.env.NEXT_PUBLIC_ORGANIZER_ACCESS_CODE || "GDGPixelpalooza123";
      if (
        passcode.trim() === masterCode || 
        passcode.trim().toLowerCase() === masterCode.toLowerCase() || 
        password === masterCode
      ) {
        localStorage.setItem("gdgoc_admin_session", "authenticated");
        router.push("/admin");
        return;
      }

      // 2. If Supabase is configured, use Supabase Auth
      if (isSupabaseConfigured()) {
        const supabase = getSupabaseBrowserClient();
        if (supabase && email && password) {
          const { error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (authError) {
            setError(authError.message);
            setLoading(false);
            return;
          }
          localStorage.setItem("gdgoc_admin_session", "authenticated");
          router.push("/admin");
          return;
        }
      }

      // 3. Fallback check for admin credential
      if (email === "admin@gdgoc.dev" && password === "GDGPixelpalooza123") {
        localStorage.setItem("gdgoc_admin_session", "authenticated");
        router.push("/admin");
        return;
      }

      setError("Invalid credentials or access passcode. Please verify with GDGOC Lead.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-950 flex flex-col justify-center items-center p-4 font-mono">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <div className="mb-4">
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO PUBLIC ARENA</span>
          </Link>
        </div>

        {/* Card */}
        <div className="voxel-card border-2 border-voxel-border p-6 sm:p-8 bg-obsidian-900 shadow-voxel relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-festival-pink/15 border border-festival-pink flex items-center justify-center text-festival-pink">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <span>ARENA OPS</span>
                <span className="text-festival-pink">🎵</span>
              </h1>
              <p className="text-[11px] text-festival-cyan font-semibold">
                ORGANIZER CONTROL TERMINAL // NMIMS NAVI MUMBAI
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            {/* Campus Master Passcode field */}
            <div>
              <label className="block text-[11px] text-slate-400 uppercase tracking-wider mb-1 font-bold">
                ORGANIZER MASTER PASSCODE
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter Master Passcode"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full bg-obsidian-950 border border-slate-700 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-festival-pink font-mono"
                />
                <Key className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Authorized GDGOC leads & referees access key.
              </p>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-3 text-[10px] text-slate-600 uppercase">
                OR SUPABASE CREDENTIALS
              </span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 uppercase tracking-wider mb-1">
                ADMIN EMAIL
              </label>
              <input
                type="email"
                placeholder="lead@gdgoc.dev"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-obsidian-950 border border-slate-700 text-white px-3 py-2 text-xs focus:outline-none focus:border-festival-pink"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 uppercase tracking-wider mb-1">
                PASSWORD
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-obsidian-950 border border-slate-700 text-white px-3 py-2 text-xs focus:outline-none focus:border-festival-pink"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-voxel bg-festival-pink hover:bg-pink-600 text-white font-black py-2.5 text-sm uppercase tracking-wider transition-all border-festival-pink shadow-festival-pink"
            >
              {loading ? "AUTHENTICATING..." : "ENTER CONTROL BOOTH"}
            </button>
          </form>

          <div className="mt-6 pt-3 border-t border-slate-800 text-center text-[10px] text-slate-500">
            GDGOC PIXELPALOOZA 2026 // RESTRICTED ACCESS
          </div>
        </div>
      </div>
    </div>
  );
}
