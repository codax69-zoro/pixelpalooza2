import { Team, ScoreEvent } from "@/types/arena";

// Clean default production state: Starts completely fresh with 0 teams and 0 scores
export const INITIAL_TEAMS: Team[] = [];

export const INITIAL_SCORE_EVENTS: ScoreEvent[] = [];

// Optional sample data available only if organizers explicitly click "Load Sample Test Data" in Admin
export const DEMO_SAMPLE_TEAMS: Team[] = [
  {
    id: "10000000-0000-0000-0000-000000000001",
    name: "Byte Bandits",
    captain: "Krishna",
    members: ["Rahul", "Aarav", "Riya", "Vikram"],
    avatar: "sword",
    music_icon: "🎤",
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "10000000-0000-0000-0000-000000000002",
    name: "Code Raiders",
    captain: "Tanya",
    members: ["Aarav", "Sneha", "Rohan", "Aditya"],
    avatar: "pickaxe",
    music_icon: "🎸",
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "10000000-0000-0000-0000-000000000003",
    name: "Pixel Pioneers",
    captain: "Vikram",
    members: ["Kabir", "Ananya", "Dev"],
    avatar: "helmet",
    music_icon: "🎮",
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "10000000-0000-0000-0000-000000000004",
    name: "Debug Squad",
    captain: "Sarah",
    members: ["Mihir", "Kavya", "Siddharth", "Pooja"],
    avatar: "compass",
    music_icon: "🔧",
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "10000000-0000-0000-0000-000000000005",
    name: "Binary Beasts",
    captain: "Dev",
    members: ["Nikhil", "Diya", "Alok", "Tanvi"],
    avatar: "chest",
    music_icon: "⚡",
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "10000000-0000-0000-0000-000000000006",
    name: "Syntax Squad",
    captain: "Ananya",
    members: ["Varun", "Meera", "Arjun", "Simran"],
    avatar: "axe",
    music_icon: "🎧",
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
];

export const DEMO_SAMPLE_SCORES: ScoreEvent[] = [
  {
    id: "20000000-0000-0000-0000-000000000001",
    team_id: "10000000-0000-0000-0000-000000000001",
    game_id: "00000000-0000-0000-0000-000000000006",
    points: 300,
    type: "SCORE",
    reason: "Jeopardy Main Stage Correct Answer",
    created_by: "Vol. Rahul",
    created_at: new Date(Date.now() - 120000).toISOString(),
  },
  {
    id: "20000000-0000-0000-0000-000000000002",
    team_id: "10000000-0000-0000-0000-000000000002",
    game_id: "00000000-0000-0000-0000-000000000002",
    points: 100,
    type: "SCORE",
    reason: "Pictionary Round 2 solved",
    created_by: "Vol. Tanya",
    created_at: new Date(Date.now() - 240000).toISOString(),
  },
];
