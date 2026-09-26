export type ScoreEventType = 
  | 'SCORE'
  | 'BONUS'
  | 'PENALTY'
  | 'MANUAL_ADJUSTMENT'
  | 'REVERSAL';

export interface Team {
  id: string;
  name: string;
  captain: string;
  members: string[];
  avatar: string;
  music_icon?: string;
  created_at?: string;
}

export interface Game {
  id: string;
  name: string;
  slug: string;
  description: string;
  duration: string;
  rules: string[];
  scoring_type: string;
  icon: string;
  multiplier?: number;
  attraction_stage?: string;
  stage_tag?: string;
  stage_color?: string;
  created_at?: string;
}

export interface ScoreEvent {
  id: string;
  team_id: string;
  game_id: string | null;
  points: number;
  type: ScoreEventType;
  reason?: string;
  reversal_of_id?: string | null;
  created_by: string;
  created_at: string;
}

export interface TeamStanding {
  team: Team;
  total_xp: number;
  rank: number;
  previous_rank?: number;
  games_played: number;
  last_score_delta?: number;
  last_score_type?: ScoreEventType;
  last_game_name?: string;
  last_updated_at?: string;
  streak: number;
  game_breakdown: Record<string, number>;
}

export interface EventState {
  id: number;
  is_live: boolean;
  current_game_id: string | null;
  active_round: string;
  announcement: string;
  is_hud_frozen: boolean;
  updated_at: string;
}

export interface ScoreTransaction {
  id: string;
  time: string;
  team_id: string;
  team_name: string;
  music_icon?: string;
  game_id: string | null;
  game_name: string;
  score_change: number;
  type: ScoreEventType;
  new_total: number;
  logged_by: string;
  reason?: string;
  is_reversal: boolean;
}
