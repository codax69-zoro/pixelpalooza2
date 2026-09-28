import { Game } from "@/types/arena";

export const OFFICIAL_GAMES: Game[] = [
  // ==========================================
  // DAY 1 GAMES (Exactly 5 Games)
  // ==========================================
  {
    id: "00000000-0000-0000-0000-000000000101",
    name: "Balloon + Cup Tower",
    slug: "balloon-cup-tower",
    day: 1,
    difficulty: "Easy",
    entry_cost: 400,
    order_index: 1,
    active: true,
    attraction_stage: "Coordination Arena",
    stage_tag: "DAY 1 • GAME 1",
    stage_color: "yellow",
    duration: "5–8 min",
    icon: "trophy",
    scoring_type: "Tower Height & Speed Under Pressure",
    description:
      "A high-dexterity physical coordination challenge. Players must keep a balloon aloft using only a single hand while simultaneously constructing a stable pyramid tower using cups.",
    rules: [
      "Keep the balloon in the air at all times — it cannot touch the floor or tables.",
      "Use only a single hand for both keeping the balloon airborne and cup stacking.",
      "Build the cup tower tier by tier while maintaining continuous balloon control.",
      "If the balloon drops or the tower collapses, the team must restart within the allotted time window.",
      "Final score is evaluated by tower stability, height, and completion speed."
    ],
    multiplier: 1.0,
  },
  {
    id: "00000000-0000-0000-0000-000000000102",
    name: "GDG Logo Puzzle",
    slug: "gdg-logo-puzzle",
    day: 1,
    difficulty: "Medium",
    entry_cost: 300,
    order_index: 2,
    active: true,
    attraction_stage: "Puzzle Pavilion",
    stage_tag: "DAY 1 • GAME 2",
    stage_color: "cyan",
    duration: "5–10 min",
    icon: "grid",
    scoring_type: "Assembly Speed & Pattern Accuracy",
    description:
      "A fast-paced spatial visual assembly race. The official GDG logo is shuffled into fragmented jigsaw pieces, and teams must reconstruct the full brand mark accurately against the clock.",
    rules: [
      "Each team receives an identical set of shuffled physical GDG logo pieces.",
      "Teammates collaborate to reconstruct the exact geometry, colors, and orientation.",
      "Strict timing: the clock begins when the first piece is flipped.",
      "First correctly completed arrangement claims highest performance tier points.",
      "Organizers verify exact piece placement and alignment before locking scores."
    ],
    multiplier: 1.0,
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    name: "Tech Pictionary",
    slug: "tech-pictionary",
    day: 1,
    difficulty: "Medium",
    entry_cost: 300,
    order_index: 3,
    active: true,
    attraction_stage: "Creative Lab",
    stage_tag: "DAY 1 • GAME 3",
    stage_color: "orange",
    duration: "5–10 min",
    icon: "pen-tool",
    scoring_type: "45s Rapid Guess Rushes",
    description:
      "Physical drawing sprint where players physically sketch complex technical architectures, software concepts, and developer terms while teammates guess them before the timer runs out.",
    rules: [
      "One teammate receives a secret technical keyword from organizers.",
      "Strict 45-second drawing countdown per card on physical whiteboard or sketchpad.",
      "Strictly no speaking, gestures, or writing letters/digits on the board.",
      "Teammates shout guesses; correct deduction earns points according to prompt difficulty."
    ],
    multiplier: 1.0,
  },
  {
    id: "00000000-0000-0000-0000-000000000001",
    name: "Tech Tambola",
    slug: "tech-tambola",
    day: 1,
    difficulty: "Easy",
    entry_cost: 350,
    order_index: 4,
    active: true,
    attraction_stage: "Ticket Stage",
    stage_tag: "DAY 1 • GAME 4",
    stage_color: "pink",
    duration: "10–15 min",
    icon: "music",
    scoring_type: "Line & Full House Verification",
    description:
      "Physical tech-themed Tambola/Housie conducted live with paper tickets where numbers are substituted with technology concepts. The website records game participation and scoring.",
    rules: [
      "Physical tickets are handed out with technical terms (Python, Kubernetes, Git, API, Docker, etc.).",
      "Host delivers conceptual clues rather than reading direct terminology.",
      "Teams strike out matching concepts on physical cards.",
      "Early Five, Top Line, Middle Line, Bottom Line, and Full House claims are physically checked by organizers."
    ],
    multiplier: 1.0,
  },
  {
    id: "00000000-0000-0000-0000-000000000005",
    name: "AI or Human?",
    slug: "ai-or-human",
    day: 1,
    difficulty: "Hard",
    entry_cost: 150,
    order_index: 5,
    active: true,
    attraction_stage: "AI Tent",
    stage_tag: "DAY 1 • GAME 5",
    stage_color: "red",
    duration: "5–10 min",
    icon: "bot",
    scoring_type: "Synthetic Discrimination Trials",
    description:
      "High-stakes visual and code discrimination arena. Teams inspect paired physical artifacts (art, text, code) to distinguish generative AI output from authentic human handiwork. Scores recorded manually.",
    rules: [
      "Teams evaluate paired physical cards: Image A vs Image B, Code A vs Code B, Text A vs Text B.",
      "Teams submit physical verdicts identifying synthetic vs human creations within 60s per round.",
      "Includes deceptive edge cases and visual artifact inspection.",
      "Organizers verify accuracy and log performance rewards onto the tournament ledger."
    ],
    multiplier: 1.0,
  },

  // ==========================================
  // DAY 2 MAJOR AUCTION GAME
  // ==========================================
  {
    id: "00000000-0000-0000-0000-000000000201",
    name: "Tech Auction",
    slug: "tech-auction",
    day: 2,
    difficulty: "Hard",
    entry_cost: 0, // Auction uses direct question bidding, not an entry fee
    order_index: 6,
    active: true,
    attraction_stage: "Grand Amphitheater",
    stage_tag: "DAY 2 • MAIN EVENT",
    stage_color: "amber",
    duration: "60–90 min",
    icon: "zap",
    scoring_type: "Live Point Bidding & Knowledge Payouts",
    description:
      "The definitive Day 2 climax! 50–70 curated technical questions are auctioned live. Teams spend their hard-earned remaining wallet points to bid on questions, then answer them to win massive score rewards.",
    rules: [
      "Organizers present questions one by one with difficulty tier and reward value.",
      "Teams bid using their remaining available event wallet points.",
      "A team cannot bid more points than they currently possess in their event wallet.",
      "Highest bidder wins the question rights; winning bid is immediately deducted from wallet.",
      "Correct answer awards the full reward score to the team; incorrect answers risk configured penalties."
    ],
    multiplier: 1.5,
  },

  // ==========================================
  // INACTIVE PREVIOUS GAMES (Preserved for audit)
  // ==========================================
  {
    id: "00000000-0000-0000-0000-000000000003",
    name: "Debug the Code",
    slug: "debug-the-code",
    day: 1,
    difficulty: "Medium",
    entry_cost: 250,
    order_index: 99,
    active: false,
    duration: "10 min",
    rules: ["Historical game (deactivated)."],
    scoring_type: "Code Audit",
    icon: "bug",
    description: "Archived game from single-day format.",
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    name: "Tech Bomb Defusal",
    slug: "tech-bomb-defusal",
    day: 1,
    difficulty: "Hard",
    entry_cost: 200,
    order_index: 99,
    active: false,
    duration: "10–15 min",
    rules: ["Historical game (deactivated)."],
    scoring_type: "Timer",
    icon: "clock",
    description: "Archived game from single-day format.",
  },
  {
    id: "00000000-0000-0000-0000-000000000006",
    name: "Tech Jeopardy",
    slug: "tech-jeopardy",
    day: 1,
    difficulty: "Medium",
    entry_cost: 250,
    order_index: 99,
    active: false,
    duration: "10–15 min",
    rules: ["Historical game (deactivated)."],
    scoring_type: "Jeopardy",
    icon: "mic",
    description: "Archived game from single-day format.",
  },
  {
    id: "00000000-0000-0000-0000-000000000007",
    name: "Code Relay",
    slug: "code-relay",
    day: 1,
    difficulty: "Medium",
    entry_cost: 250,
    order_index: 99,
    active: false,
    duration: "10 min",
    rules: ["Historical game (deactivated)."],
    scoring_type: "Relay",
    icon: "sliders",
    description: "Archived game from single-day format.",
  }
];

export const DAY_1_GAMES = OFFICIAL_GAMES.filter((g) => g.day === 1 && g.active);
export const DAY_2_GAMES = OFFICIAL_GAMES.filter((g) => g.day === 2 && g.active);
