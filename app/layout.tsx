import type { Metadata } from "next";
import "./globals.css";
import { ArenaProvider } from "@/lib/store/arena-context";

export const metadata: Metadata = {
  title: "PIXELPALOOZA 2026 | GDG On Campus NMIMS Navi Mumbai",
  description:
    "The mega techno-cultural music festival & competitive sandbox gaming arena. 16 Collegiate Squads, 7 Biome Stages, 8 Hours of relentless algorithmic combat and digital sonic euphoria.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-white font-sans text-slate-900 antialiased selection:bg-fest-yellow selection:text-black overflow-x-hidden">
        <ArenaProvider>
          {children}
        </ArenaProvider>
      </body>
    </html>
  );
}
