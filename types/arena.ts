export type ScoreEventType = 
  | 'SCORE'
  | 'BONUS'
  | 'PENALTY'
  | 'MANUAL_ADJUSTMENT'
  | 'REVERSAL';

export type GameDifficulty = 'Easy' | 'Medium' | 'Hard';
export type GameDay = 1 | 2;

export interface Team {
  id: string;
  name: string;
  captain: string;
  members: string[];
  avatar: string;
  music_icon?: string;
  starting_wallet: number; // Defaults to 1500
  current_wallet: number;  // Available budget to spend
  created_at?: string;
  updated_at?: string;
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
  day: GameDay;
  difficulty: GameDifficulty;
  entry_cost: number;
  order_index: number;
  active: boolean;
  max_participants?: number;
  multiplier?: number;
  attraction_stage?: string;
  stage_tag?: string;
  stage_color?: string;
  created_at?: string;
  updated_at?: string;
}

export type GameParticipationStatus = 
  | 'NOT_SELECTED'
  | 'REGISTERED'
  | 'PLAYING'
  | 'COMPLETED'
  | 'SKIPPED'
  | 'DISQUALIFIED';

export interface GameParticipation {
  id: string;
  team_id: string;
  game_id: string;
  status: GameParticipationStatus;
  entry_cost: number;
  registered_at: string;
  completed_at?: string;
}

export type WalletTransactionType = 
  | 'INITIAL_ALLOCATION'
  | 'GAME_ENTRY'
  | 'AUCTION_BID'
  | 'AUCTION_PURCHASE'
  | 'GAME_REWARD'
  | 'BONUS'
  | 'PENALTY'
  | 'REFUND'
  | 'MANUAL_ADJUSTMENT'
  | 'REVERSAL';

export interface WalletTransaction {
  id: string;
  team_id: string;
  amount: number; // positive = credit (+), negative = debit (-)
  transaction_type: WalletTransactionType;
  reference_type?: 'game' | 'auction_question' | 'reversal' | 'manual' | 'system';
  reference_id?: string;
  description: string;
  created_by: string;
  created_at: string;
  reversal_of_id?: string | null;
  is_reversed?: boolean;
}

export interface ScoreEvent {
  id: string;
  team_id: string;
  game_id: string | null;
  day: GameDay;
  points: number;
  type: ScoreEventType;
  reason?: string;
  reversal_of_id?: string | null;
  created_by: string;
  created_at: string;
}

export type AuctionQuestionStatus = 
  | 'AVAILABLE'
  | 'AUCTIONED'
  | 'SOLD'
  | 'ANSWERED'
  | 'SKIPPED'
  | 'CANCELLED';

export interface AuctionQuestion {
  id: string;
  question_number: number;
  question_text: string;
  answer_clue?: string;
  category: string;
  difficulty: GameDifficulty;
  base_price: number;
  maximum_price?: number;
  reward_points: number;
  status: AuctionQuestionStatus;
  winning_team_id?: string | null;
  winning_bid?: number | null;
  answer_status?: 'CORRECT' | 'INCORRECT' | 'PENDING' | null;
  created_at?: string;
  updated_at?: string;
}

export interface AuctionBid {
  id: string;
  question_id: string;
  team_id: string;
  bid_amount: number;
  created_at: string;
  created_by?: string;
}

export interface AuctionResult {
  id: string;
  question_id: string;
  team_id: string;
  winning_bid: number;
  answer_status: 'CORRECT' | 'INCORRECT';
  reward_points: number;
  created_at: string;
}

export type EventStatus = 
  | 'NOT_STARTED'
  | 'LIVE'
  | 'PAUSED'
  | 'BETWEEN_GAMES'
  | 'FINISHED';

export interface EventState {
  id: number;
  current_day: GameDay;
  event_status: EventStatus;
  current_game_id: string | null;
  current_auction_question_id: string | null;
  auction_name: string; // e.g. "Tech Auction" or "The Auction"
  active_round: string;
  announcement: string;
  is_hud_frozen: boolean;
  day1_weight: number; // default: 1.0
  day2_weight: number; // default: 1.0
  wallet_to_score_ratio: number; // default: 0.0 (configurable unspent wallet conversion)
  reward_destination: 'score_only' | 'wallet_only' | 'both';
  auction_incorrect_penalty: number;
  is_live: boolean;
  updated_at: string;
}

export interface TeamStanding {
  team: Team;
  rank: number;
  previous_rank?: number;
  day1_score: number;
  day2_score: number;
  total_score: number; // final computed score based on configurable formula
  current_wallet: number;
  games_played: number;
  questions_won: number;
  game_statuses: Record<string, GameParticipationStatus>;
  game_breakdown: Record<string, number>;
  last_score_delta?: number;
  last_score_type?: ScoreEventType;
  last_game_name?: string;
  last_updated_at?: string;
  streak: number;
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
