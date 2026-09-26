-- ====================================================================
-- GDGOC GAME ARENA - Supabase PostgreSQL Schema & Realtime Setup
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Drop existing tables if re-running migration
DROP VIEW IF EXISTS team_standings CASCADE;
DROP TABLE IF EXISTS score_events CASCADE;
DROP TABLE IF EXISTS event_state CASCADE;
DROP TABLE IF EXISTS games CASCADE;
DROP TABLE IF EXISTS teams CASCADE;

-- 3. TEAMS Table
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    captain VARCHAR(255) NOT NULL,
    members TEXT[] DEFAULT '{}',
    avatar VARCHAR(255) DEFAULT 'sword',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. GAMES Table
CREATE TABLE games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    duration VARCHAR(50) NOT NULL,
    rules TEXT[] DEFAULT '{}',
    scoring_type VARCHAR(100) DEFAULT 'Points / Diamonds',
    icon VARCHAR(50) DEFAULT 'gamepad',
    multiplier NUMERIC(3, 1) DEFAULT 1.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. EVENT_STATE Table (Single row tracking live tournament state)
CREATE TABLE event_state (
    id INT PRIMARY KEY DEFAULT 1,
    is_live BOOLEAN DEFAULT TRUE,
    current_game_id UUID REFERENCES games(id) ON DELETE SET NULL,
    active_round VARCHAR(50) DEFAULT 'Round 1',
    announcement TEXT DEFAULT 'Welcome to GDGOC Game Arena! Scores are synchronizing live.',
    is_hud_frozen BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT single_row CHECK (id = 1)
);

-- 6. SCORE_EVENTS Table (Immutable Append-Only Audit Trail)
-- Types: SCORE, BONUS, PENALTY, MANUAL_ADJUSTMENT, REVERSAL
CREATE TABLE score_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    game_id UUID REFERENCES games(id) ON DELETE SET NULL,
    points INT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'SCORE',
    reason TEXT,
    reversal_of_id UUID REFERENCES score_events(id) ON DELETE SET NULL,
    created_by VARCHAR(255) DEFAULT 'Organizer',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lightning fast queries
CREATE INDEX idx_score_events_team ON score_events(team_id);
CREATE INDEX idx_score_events_game ON score_events(game_id);
CREATE INDEX idx_score_events_created_at ON score_events(created_at DESC);

-- 7. TEAM_STANDINGS VIEW (Calculates total XP dynamically from score events)
CREATE OR REPLACE VIEW team_standings AS
SELECT 
    t.id AS team_id,
    t.name,
    t.captain,
    t.members,
    t.avatar,
    COALESCE(SUM(se.points), 0) AS total_xp,
    COUNT(DISTINCT se.game_id) FILTER (WHERE se.points > 0 AND se.game_id IS NOT NULL) AS games_played,
    COUNT(se.id) AS total_events_count,
    MAX(se.created_at) AS last_updated_at,
    (
        SELECT se_sub.points 
        FROM score_events se_sub 
        WHERE se_sub.team_id = t.id 
        ORDER BY se_sub.created_at DESC 
        LIMIT 1
    ) AS last_score_delta,
    (
        SELECT g_sub.name 
        FROM score_events se_sub 
        LEFT JOIN games g_sub ON g_sub.id = se_sub.game_id 
        WHERE se_sub.team_id = t.id 
        ORDER BY se_sub.created_at DESC 
        LIMIT 1
    ) AS last_game_name
FROM teams t
LEFT JOIN score_events se ON se.team_id = t.id
GROUP BY t.id, t.name, t.captain, t.members, t.avatar;

-- 8. Enable Row Level Security (RLS)
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE score_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_state ENABLE ROW LEVEL SECURITY;

-- Public can READ all tables
CREATE POLICY "Public teams can be read" ON teams FOR SELECT USING (true);
CREATE POLICY "Public games can be read" ON games FOR SELECT USING (true);
CREATE POLICY "Public score_events can be read" ON score_events FOR SELECT USING (true);
CREATE POLICY "Public event_state can be read" ON event_state FOR SELECT USING (true);

-- Authenticated admins can mutate
CREATE POLICY "Admin can modify teams" ON teams FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can modify games" ON games FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can insert score_events" ON score_events FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin can update score_events" ON score_events FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can modify event_state" ON event_state FOR ALL USING (auth.role() = 'authenticated');

-- 9. Realtime Publication
-- Add tables to supabase_realtime publication
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE score_events;
    ALTER PUBLICATION supabase_realtime ADD TABLE event_state;
    ALTER PUBLICATION supabase_realtime ADD TABLE teams;
    ALTER PUBLICATION supabase_realtime ADD TABLE games;
EXCEPTION
    WHEN duplicate_object THEN
        NULL;
END $$;
