-- ====================================================================
-- GDGOC PIXELPALOOZA GAME ARENA - Supabase Production Seed Data
-- Only seeds the 7 official GDGOC games and initial tournament state.
-- No sample teams or sample scores - ready for your live festival event!
-- ====================================================================

-- 1. Insert Official GDGOC Games (Pixelpalooza Festival Attraction Stages)
INSERT INTO games (id, name, slug, description, duration, rules, scoring_type, icon, multiplier) VALUES
(
    '00000000-0000-0000-0000-000000000001',
    'Tech Tambola',
    'tech-tambola',
    'A technology-themed version of Tambola/Housie where numbers are replaced with technology-related terms. Clues are given instead of direct names.',
    '10–15 min',
    ARRAY[
        'Participants receive a ticket containing terms such as Python, AI, Cloud, API, SQL, Git, Linux, Docker.',
        'Host provides conceptual clues rather than calling numbers.',
        'Special Cards: Diamond (Double Points), Creeper (Penalty), Redstone (Bonus Clue), Emerald (Extra Chance).'
    ],
    'Ticket Stage (Line & House Claims)',
    'grid',
    1.0
),
(
    '00000000-0000-0000-0000-000000000002',
    'Tech Pictionary',
    'tech-pictionary',
    'Participants draw complex technical terms on whiteboard or paper while teammates rush to guess them before time expires.',
    '5–10 min',
    ARRAY[
        'One participant receives a technical term (Laptop, Wi-Fi, Cloud, Firewall, Machine Learning, Recursion).',
        'Strict 45-second timer per prompt.',
        'No speaking, no writing letters or numbers on the drawing canvas.',
        'Teammates must guess within the time limit to score.'
    ],
    'Creative Stage (45s Drawing Rushes)',
    'pen-tool',
    1.0
),
(
    '00000000-0000-0000-0000-000000000003',
    'Debug the Code',
    'debug-the-code',
    'Participants analyze snippets across Python, C++, Java, SQL to find runtime bugs, predict outputs, and provide clean fixes.',
    '10 min',
    ARRAY[
        'Round 1: Find the Bug — spot logic / syntax / off-by-one errors.',
        'Round 2: Predict the Output — trace memory and state mutations.',
        'Round 3: Fix the Code — rewrite broken functions into working solutions.',
        'Bonus speed points for fastest correct submission.'
    ],
    'Redstone Lab (Multi-round Code Analysis)',
    'bug',
    1.2
),
(
    '00000000-0000-0000-0000-000000000004',
    'Tech Bomb Defusal',
    'tech-bomb-defusal',
    'Fictional bomb countdown! Teams race against a 5-minute ticking timer solving 5 chained technical puzzles to extract the defusal code.',
    '10–15 min',
    ARRAY[
        'Puzzle 1: Binary to Hexadecimal conversion.',
        'Puzzle 2: Boolean Logic Gates.',
        'Puzzle 3: Coding output prediction.',
        'Puzzle 4: Cryptographic Cipher decode.',
        'Puzzle 5: Minecraft Redstone / Crafting logic clue.',
        'Combine 5 answers to input final disarm code before timer hits 00:00.'
    ],
    'Danger Stage (5:00 Ticking Clock)',
    'clock',
    1.5
),
(
    '00000000-0000-0000-0000-000000000005',
    'AI or Human?',
    'ai-or-human',
    'High-stakes visual and code discrimination challenge! Teams inspect pairs of code, artwork, and technical text to identify which was synthetically generated.',
    '5–10 min',
    ARRAY[
        'Teams are shown paired samples: Image A vs Image B, Code A vs Code B.',
        'Determine whether content was created by generative AI or a human developer.',
        'Includes advanced round: AI Minecraft screenshots vs authentic voxel terrain.'
    ],
    'AI Tent (Synthetic Discrimination)',
    'bot',
    1.0
),
(
    '00000000-0000-0000-0000-000000000006',
    'Tech Jeopardy',
    'tech-jeopardy',
    'Classroom-based competitive Jeopardy board with 5 categories: AI, Coding, Google, Cybersecurity, and Minecraft, tiered 100 to 500 XP.',
    '10–15 min',
    ARRAY[
        'Categories: AI, Coding Concepts, Google Ecosystem, Cybersecurity, Minecraft Logic.',
        'Tiered values: 100, 200, 300, 400, 500 XP.',
        'Special Tiles: Diamond Tile (2x Points), Creeper Tile (Penalty Deduction), Redstone Tile (Buzzer Steal Advantage).'
    ],
    'Main Stage (5x5 Board Tiers)',
    'mic',
    1.0
),
(
    '00000000-0000-0000-0000-000000000007',
    'Code Relay',
    'code-relay',
    '4 team members take turns coding a complete program with strictly zero verbal or written communication between handoffs.',
    '10 min',
    ARRAY[
        'Player 1 defines variables and data structures.',
        'Player 2 initializes states and inputs.',
        'Player 3 implements the loop / core algorithmic logic.',
        'Player 4 completes output handling and error assertions.',
        'Zero communication permitted between handoffs.'
    ],
    'Race Track (Sequential Blind Coding)',
    'zap',
    1.2
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    duration = EXCLUDED.duration;

-- 2. Insert Initial Tournament Event State (Ready for live fest)
INSERT INTO event_state (id, is_live, current_game_id, active_round, announcement, is_hud_frozen)
VALUES (
    1, 
    true, 
    '00000000-0000-0000-0000-000000000006', 
    'Round 1: Preliminary Attractions', 
    'Welcome to GDGOC Pixelpalooza 2026! Real-time scoring grid is live.',
    false
)
ON CONFLICT (id) DO UPDATE SET
    is_live = EXCLUDED.is_live,
    active_round = EXCLUDED.active_round;
