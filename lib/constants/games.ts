import { Game } from "@/types/arena";

export const OFFICIAL_GAMES: Game[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    name: "Tech Tambola",
    slug: "tech-tambola",
    attraction_stage: "Ticket Stage",
    stage_tag: "BOOTH",
    stage_color: "red",
    description:
      "A technology-themed version of Tambola/Housie where numbers are replaced with technical terms. Clues are given instead of direct names.",
    duration: "10–15 min",
    rules: [
      "Participants receive tickets with terms (Python, AI, Cloud, API, SQL, Git, Linux, Docker, etc.).",
      "Host delivers conceptual clues (e.g. 'Language created by Guido van Rossum' -> Python).",
      "Special cards: Diamond (Double Points), Creeper (Penalty), Redstone (Bonus Clue), Emerald (Extra Chance).",
      "Fast claim checks by organizers for lines and full house."
    ],
    scoring_type: "Line & Full House Claims",
    icon: "grid",
    multiplier: 1.0,
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    name: "Tech Pictionary",
    slug: "tech-pictionary",
    attraction_stage: "Creative Lab",
    stage_tag: "STAGE 2",
    stage_color: "orange",
    description:
      "A high-speed drawing challenge where participants sketch complex technical architectures and terms while teammates deduce the answer before time expires.",
    duration: "5–10 min",
    rules: [
      "One participant receives a secret technical keyword.",
      "Strict 45-second drawing window per prompt.",
      "No speaking, no writing letters or numbers on the canvas.",
      "Categories span Easy (Laptop, Wi-Fi), Medium (Cloud, API, Firewall), and Hard (Machine Learning, Recursion)."
    ],
    scoring_type: "45s Drawing Rushes",
    icon: "pen-tool",
    multiplier: 1.0,
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    name: "Debug the Code",
    slug: "debug-the-code",
    attraction_stage: "Redstone Lab",
    stage_tag: "⚡ REDSTONE",
    stage_color: "yellow",
    description:
      "Participants analyze live code snippets across multiple languages to hunt syntax and logical bugs, trace execution memory, and refactor broken routines.",
    duration: "10 min",
    rules: [
      "Round 1: Find the Bug — isolate off-by-one errors and type mismatches.",
      "Round 2: Predict the Output — trace stack mutations and closures without running the code.",
      "Round 3: Fix the Code — rewrite broken snippets into working solutions under time pressure.",
      "Languages supported: Python, C++, Java, SQL, HTML/CSS."
    ],
    scoring_type: "Multi-Round Code Audit",
    icon: "bug",
    multiplier: 1.2,
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    name: "Tech Bomb Defusal",
    slug: "tech-bomb-defusal",
    attraction_stage: "Danger Stage",
    stage_tag: "PANIC",
    stage_color: "red",
    description:
      "A high-adrenaline physical and logical puzzle race. Teams collaborate against a 5-minute ticking countdown to solve 5 interconnected technical puzzles.",
    duration: "10–15 min",
    rules: [
      "Puzzle 1: Binary to Hexadecimal conversion.",
      "Puzzle 2: Boolean Logic Gates evaluation.",
      "Puzzle 3: Algorithmic output tracing.",
      "Puzzle 4: Cryptographic Cipher decode.",
      "Puzzle 5: Minecraft Redstone & Crafting logic puzzle.",
      "Combine all five solutions to punch in the final disarm code before detonation."
    ],
    scoring_type: "5:00 Pressure Countdown",
    icon: "clock",
    multiplier: 1.5,
  },
  {
    id: "00000000-0000-0000-0000-000000000005",
    name: "AI or Human?",
    slug: "ai-or-human",
    attraction_stage: "AI Tent",
    stage_tag: "SYNTH",
    stage_color: "cyan",
    description:
      "High-stakes visual and code discrimination arena. Participants inspect paired artifacts to distinguish generative AI creations from authentic human handiwork.",
    duration: "5–10 min",
    rules: [
      "Teams evaluate paired content: Image A vs Image B, Code A vs Code B, Text A vs Text B.",
      "Teams submit their verdict on which is synthetic and which is genuine.",
      "Includes advanced visual challenge: AI-generated Minecraft screenshots vs genuine game rendering."
    ],
    scoring_type: "Synthetic Discrimination",
    icon: "bot",
    multiplier: 1.0,
  },
  {
    id: "00000000-0000-0000-0000-000000000006",
    name: "Tech Jeopardy",
    slug: "tech-jeopardy",
    attraction_stage: "Main Stage",
    stage_tag: "MAIN STAGE",
    stage_color: "pink",
    description:
      "Competitive classroom quiz featuring a 5x5 board across AI, Coding, Google, Cybersecurity, and Minecraft categories with 100 to 500 XP difficulty tiers.",
    duration: "10–15 min",
    rules: [
      "Categories: AI, Coding Concepts, Google Ecosystem, Cybersecurity, Minecraft Logic.",
      "Tiers: 100, 200, 300, 400, 500 XP.",
      "Special Tiles: Diamond Tile (2x Points), Creeper Tile (Penalty Deduction), Redstone Tile (Buzzer Steal Advantage).",
      "Organizers read official Ignite question bank."
    ],
    scoring_type: "5x5 Board Tiers (100–500 XP)",
    icon: "mic",
    multiplier: 1.0,
  },
  {
    id: "00000000-0000-0000-0000-000000000007",
    name: "Code Relay",
    slug: "code-relay",
    attraction_stage: "Race Track",
    stage_tag: "FAST",
    stage_color: "amber",
    description:
      "A collective programming relay where 4 teammates take turns coding sequential modules of a program with strictly zero communication between transitions.",
    duration: "10 min",
    rules: [
      "Player 1: Declares data structures and inputs.",
      "Player 2: Sets up accumulators and initial states.",
      "Player 3: Implements core loop and algorithmic branching.",
      "Player 4: Finalizes formatting, output rendering, and edge cases.",
      "Zero verbal or digital communication allowed between teammates during handoffs."
    ],
    scoring_type: "Silent Sequential Relay",
    icon: "zap",
    multiplier: 1.2,
  },
];
