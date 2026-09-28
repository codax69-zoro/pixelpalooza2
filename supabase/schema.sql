-- ====================================================================
-- GDGOC PIXELPALOOZA 2-DAY EVENT ARENA - Supabase PostgreSQL Schema
-- Supporting 2 Days, 5 Day-1 Games, 1 Day-2 Auction Game,
-- 1500 Starting Budget Wallet, Game Entry Costs, and Auditable Transactions
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Drop existing views and tables if migrating
DROP VIEW IF EXISTS team_standings CASCADE;
DROP TABLE IF EXISTS auction_results CASCADE;
DROP TABLE IF EXISTS auction_bids CASCADE;
DROP TABLE IF EXISTS auction_questions CASCADE;
DROP TABLE IF EXISTS wallet_transactions CASCADE;
DROP TABLE IF EXISTS game_participation CASCADE;
DROP TABLE IF EXISTS score_events CASCADE;
DROP TABLE IF EXISTS event_state CASCADE;
DROP TABLE IF EXISTS games CASCADE;
DROP TABLE IF EXISTS teams CASCADE;

-- 3. TEAMS Table (With 1500 Starting and Current Spendable Wallet)
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    captain VARCHAR(255) NOT NULL,
    members TEXT[] DEFAULT '{}',
    avatar VARCHAR(255) DEFAULT 'sword',
    music_icon VARCHAR(50) DEFAULT '🎸',
    starting_wallet INT NOT NULL DEFAULT 1500,
    current_wallet INT NOT NULL DEFAULT 1500,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT positive_starting_wallet CHECK (starting_wallet >= 0),
    CONSTRAINT positive_current_wallet CHECK (current_wallet >= 0)
);

-- 4. GAMES Table (With Day, Difficulty, and Entry Cost)
CREATE TABLE games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    day INT NOT NULL DEFAULT 1 CHECK (day IN (1, 2)),
    difficulty VARCHAR(50) NOT NULL DEFAULT 'Medium',
    entry_cost INT NOT NULL DEFAULT 300 CHECK (entry_cost >= 0),
    order_index INT NOT NULL DEFAULT 1,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    max_participants INT,
    description TEXT NOT NULL,
    duration VARCHAR(50) NOT NULL,
    rules TEXT[] DEFAULT '{}',
    scoring_type VARCHAR(100) DEFAULT 'Performance Tiers',
    icon VARCHAR(50) DEFAULT 'gamepad',
    multiplier NUMERIC(3, 1) DEFAULT 1.0,
    attraction_stage VARCHAR(100),
    stage_tag VARCHAR(50),
    stage_color VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. GAME_PARTICIPATION Table (Tracks Optional Team Participation per Game)
-- States: NOT_SELECTED, REGISTERED, PLAYING, COMPLETED, SKIPPED, DISQUALIFIED
CREATE TABLE game_participation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'NOT_SELECTED',
    entry_cost INT NOT NULL DEFAULT 0,
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    CONSTRAINT unique_team_game UNIQUE (team_id, game_id)
);

-- 6. WALLET_TRANSACTIONS Table (Auditable Financial Ledger)
-- Types: INITIAL_ALLOCATION, GAME_ENTRY, AUCTION_BID, AUCTION_PURCHASE, GAME_REWARD, BONUS, PENALTY, REFUND, MANUAL_ADJUSTMENT, REVERSAL
CREATE TABLE wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    amount INT NOT NULL, -- Negative for debits/purchases, positive for credits/rewards
    transaction_type VARCHAR(50) NOT NULL,
    reference_type VARCHAR(50), -- 'game', 'auction_question', 'reversal', 'manual'
    reference_id VARCHAR(255),
    description TEXT NOT NULL,
    created_by VARCHAR(255) DEFAULT 'Arena Organizer',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    reversal_of_id UUID REFERENCES wallet_transactions(id) ON DELETE SET NULL,
    is_reversed BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_wallet_tx_team ON wallet_transactions(team_id);
CREATE INDEX idx_wallet_tx_created ON wallet_transactions(created_at DESC);

-- 7. AUCTION_QUESTIONS Table (Day 2 Auction Bank: 50–70 Questions)
CREATE TABLE auction_questions (
    id VARCHAR(255) PRIMARY KEY,
    question_number INT NOT NULL UNIQUE,
    question_text TEXT NOT NULL,
    answer_clue TEXT,
    category VARCHAR(100) NOT NULL,
    difficulty VARCHAR(50) NOT NULL DEFAULT 'Medium',
    base_price INT NOT NULL DEFAULT 100 CHECK (base_price >= 0),
    maximum_price INT,
    reward_points INT NOT NULL DEFAULT 250 CHECK (reward_points >= 0),
    status VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE', -- AVAILABLE, AUCTIONED, SOLD, ANSWERED, SKIPPED, CANCELLED
    winning_team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    winning_bid INT,
    answer_status VARCHAR(50), -- CORRECT, INCORRECT, PENDING
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. AUCTION_BIDS Table
CREATE TABLE auction_bids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id VARCHAR(255) NOT NULL REFERENCES auction_questions(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    bid_amount INT NOT NULL CHECK (bid_amount > 0),
    created_by VARCHAR(255) DEFAULT 'Organizer',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. AUCTION_RESULTS Table
CREATE TABLE auction_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id VARCHAR(255) NOT NULL REFERENCES auction_questions(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    winning_bid INT NOT NULL,
    answer_status VARCHAR(50) NOT NULL, -- CORRECT, INCORRECT
    reward_points INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. SCORE_EVENTS Table (Immutable Append-Only Audit Trail)
CREATE TABLE score_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    game_id UUID REFERENCES games(id) ON DELETE SET NULL,
    day INT NOT NULL DEFAULT 1 CHECK (day IN (1, 2)),
    points INT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'SCORE',
    reason TEXT,
    reversal_of_id UUID REFERENCES score_events(id) ON DELETE SET NULL,
    created_by VARCHAR(255) DEFAULT 'Organizer',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_score_events_team ON score_events(team_id);
CREATE INDEX idx_score_events_day ON score_events(day);
CREATE INDEX idx_score_events_created_at ON score_events(created_at DESC);

-- 11. EVENT_STATE Table (Single Row Tournament Control)
CREATE TABLE event_state (
    id INT PRIMARY KEY DEFAULT 1,
    current_day INT NOT NULL DEFAULT 1 CHECK (current_day IN (1, 2)),
    event_status VARCHAR(50) NOT NULL DEFAULT 'LIVE', -- NOT_STARTED, LIVE, PAUSED, BETWEEN_GAMES, FINISHED
    current_game_id UUID REFERENCES games(id) ON DELETE SET NULL,
    current_auction_question_id VARCHAR(255),
    auction_name VARCHAR(255) DEFAULT 'Tech Auction',
    active_round VARCHAR(100) DEFAULT 'Day 1: Arena Attractions',
    announcement TEXT DEFAULT 'Welcome to Pixelpalooza 2-Day Tech Festival! Spend your 1500 starting budget wisely.',
    is_hud_frozen BOOLEAN DEFAULT FALSE,
    day1_weight NUMERIC(3, 2) DEFAULT 1.0,
    day2_weight NUMERIC(3, 2) DEFAULT 1.0,
    wallet_to_score_ratio NUMERIC(3, 2) DEFAULT 0.0,
    reward_destination VARCHAR(50) DEFAULT 'score_only',
    auction_incorrect_penalty INT DEFAULT 0,
    is_live BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT single_row CHECK (id = 1)
);

-- 12. Enable Row Level Security (RLS)
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_participation ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE auction_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE auction_bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE auction_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE score_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_state ENABLE ROW LEVEL SECURITY;

-- Public can READ all tables
CREATE POLICY "Public teams can be read" ON teams FOR SELECT USING (true);
CREATE POLICY "Public games can be read" ON games FOR SELECT USING (true);
CREATE POLICY "Public game_participation can be read" ON game_participation FOR SELECT USING (true);
CREATE POLICY "Public wallet_transactions can be read" ON wallet_transactions FOR SELECT USING (true);
CREATE POLICY "Public auction_questions can be read" ON auction_questions FOR SELECT USING (true);
CREATE POLICY "Public auction_bids can be read" ON auction_bids FOR SELECT USING (true);
CREATE POLICY "Public auction_results can be read" ON auction_results FOR SELECT USING (true);
CREATE POLICY "Public score_events can be read" ON score_events FOR SELECT USING (true);
CREATE POLICY "Public event_state can be read" ON event_state FOR SELECT USING (true);

-- Authenticated admins or service roles can mutate
CREATE POLICY "Admin can modify teams" ON teams FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can modify games" ON games FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can modify game_participation" ON game_participation FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can modify wallet_transactions" ON wallet_transactions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can modify auction_questions" ON auction_questions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can modify auction_bids" ON auction_bids FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can modify auction_results" ON auction_results FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can modify score_events" ON score_events FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can modify event_state" ON event_state FOR ALL USING (auth.role() = 'authenticated');

-- 13. Realtime Publication
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE score_events;
    ALTER PUBLICATION supabase_realtime ADD TABLE wallet_transactions;
    ALTER PUBLICATION supabase_realtime ADD TABLE game_participation;
    ALTER PUBLICATION supabase_realtime ADD TABLE auction_questions;
    ALTER PUBLICATION supabase_realtime ADD TABLE event_state;
    ALTER PUBLICATION supabase_realtime ADD TABLE teams;
    ALTER PUBLICATION supabase_realtime ADD TABLE games;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;
