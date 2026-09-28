-- ====================================================================
-- GDGOC PIXELPALOOZA 2-DAY EVENT - Production Seed Data
-- 5 Day-1 Games, 1 Day-2 Major Tech Auction, Initial Event State,
-- and Sample Auction Question Bank (60 Questions)
-- ====================================================================

-- 1. Insert Official Day-1 and Day-2 Games
INSERT INTO games (id, name, slug, day, difficulty, entry_cost, order_index, active, description, duration, rules, scoring_type, icon, multiplier, attraction_stage, stage_tag, stage_color)
VALUES
(
    '00000000-0000-0000-0000-000000000101',
    'Balloon + Cup Tower',
    'balloon-cup-tower',
    1,
    'Easy',
    400,
    1,
    true,
    'A high-dexterity physical coordination challenge. Players must keep a balloon aloft using only a single hand while simultaneously constructing a stable pyramid tower using cups.',
    '5–8 min',
    ARRAY[
        'Keep the balloon in the air at all times — it cannot touch the floor or tables.',
        'Use only a single hand for both keeping the balloon airborne and cup stacking.',
        'Build the cup tower tier by tier while maintaining continuous balloon control.',
        'If the balloon drops or the tower collapses, the team must restart within the allotted time window.'
    ],
    'Tower Height & Speed Under Pressure',
    'trophy',
    1.0,
    'Coordination Arena',
    'DAY 1 • GAME 1',
    'yellow'
),
(
    '00000000-0000-0000-0000-000000000102',
    'GDG Logo Puzzle',
    'gdg-logo-puzzle',
    1,
    'Medium',
    300,
    2,
    true,
    'A fast-paced spatial visual assembly race. The official GDG logo is shuffled into fragmented jigsaw pieces, and teams must reconstruct the full brand mark accurately against the clock.',
    '5–10 min',
    ARRAY[
        'Each team receives an identical set of shuffled physical GDG logo pieces.',
        'Teammates collaborate to reconstruct the exact geometry, colors, and orientation.',
        'Strict timing: the clock begins when the first piece is flipped.',
        'First correctly completed arrangement claims highest performance tier points.'
    ],
    'Assembly Speed & Pattern Accuracy',
    'grid',
    1.0,
    'Puzzle Pavilion',
    'DAY 1 • GAME 2',
    'cyan'
),
(
    '00000000-0000-0000-0000-000000000002',
    'Tech Pictionary',
    'tech-pictionary',
    1,
    'Medium',
    300,
    3,
    true,
    'Physical drawing sprint where players physically sketch complex technical architectures, software concepts, and developer terms while teammates guess them before the timer runs out.',
    '5–10 min',
    ARRAY[
        'One teammate receives a secret technical keyword from organizers.',
        'Strict 45-second drawing countdown per card on physical whiteboard or sketchpad.',
        'Strictly no speaking, gestures, or writing letters/digits on the board.',
        'Teammates shout guesses; correct deduction earns points according to prompt difficulty.'
    ],
    '45s Rapid Guess Rushes',
    'pen-tool',
    1.0,
    'Creative Lab',
    'DAY 1 • GAME 3',
    'orange'
),
(
    '00000000-0000-0000-0000-000000000001',
    'Tech Tambola',
    'tech-tambola',
    1,
    'Easy',
    350,
    4,
    true,
    'Physical tech-themed Tambola/Housie conducted live with paper tickets where numbers are substituted with technology concepts. The website records game participation and scoring.',
    '10–15 min',
    ARRAY[
        'Physical tickets are handed out with technical terms (Python, Kubernetes, Git, API, Docker, etc.).',
        'Host delivers conceptual clues rather than reading direct terminology.',
        'Teams strike out matching concepts on physical cards.',
        'Line and Full House claims are physically checked by organizers.'
    ],
    'Line & Full House Verification',
    'music',
    1.0,
    'Ticket Stage',
    'DAY 1 • GAME 4',
    'pink'
),
(
    '00000000-0000-0000-0000-000000000005',
    'AI or Human?',
    'ai-or-human',
    1,
    'Hard',
    150,
    5,
    true,
    'High-stakes visual and code discrimination arena. Teams inspect paired physical artifacts (art, text, code) to distinguish generative AI output from authentic human handiwork. Scores recorded manually.',
    '5–10 min',
    ARRAY[
        'Teams evaluate paired physical cards: Image A vs Image B, Code A vs Code B, Text A vs Text B.',
        'Teams submit physical verdicts identifying synthetic vs human creations within 60s per round.',
        'Organizers verify accuracy and log performance rewards onto the tournament ledger.'
    ],
    'Synthetic Discrimination Trials',
    'bot',
    1.0,
    'AI Tent',
    'DAY 1 • GAME 5',
    'red'
),
(
    '00000000-0000-0000-0000-000000000201',
    'Tech Auction',
    'tech-auction',
    2,
    'Hard',
    0,
    6,
    true,
    'The definitive Day 2 climax! 50–70 curated technical questions are auctioned live. Teams spend their hard-earned remaining wallet points to bid on questions, then answer them to win massive score rewards.',
    '60–90 min',
    ARRAY[
        'Organizers present questions one by one with difficulty tier and reward value.',
        'Teams bid using their remaining available event wallet points.',
        'A team cannot bid more points than they currently possess in their event wallet.',
        'Highest bidder wins the question rights; winning bid is immediately deducted from wallet.',
        'Correct answer awards the full reward score to the team; incorrect answers risk configured penalties.'
    ],
    'Live Point Bidding & Knowledge Payouts',
    'zap',
    1.5,
    'Grand Amphitheater',
    'DAY 2 • MAIN EVENT',
    'amber'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    entry_cost = EXCLUDED.entry_cost,
    difficulty = EXCLUDED.difficulty,
    day = EXCLUDED.day,
    description = EXCLUDED.description;

-- 2. Insert Initial Tournament State
INSERT INTO event_state (
    id, current_day, event_status, current_game_id, current_auction_question_id,
    auction_name, active_round, announcement, is_hud_frozen,
    day1_weight, day2_weight, wallet_to_score_ratio, reward_destination,
    auction_incorrect_penalty, is_live
)
VALUES (
    1,
    1,
    'LIVE',
    '00000000-0000-0000-0000-000000000101',
    'q-001',
    'Tech Auction',
    'Day 1: Arena Attractions',
    'Welcome to Pixelpalooza 2-Day Festival! Each squad starts with 1500 points budget. Choose your games strategically!',
    false,
    1.0,
    1.0,
    0.0,
    'score_only',
    0,
    true
)
ON CONFLICT (id) DO UPDATE SET
    current_day = EXCLUDED.current_day,
    event_status = EXCLUDED.event_status,
    active_round = EXCLUDED.active_round;

-- 3. Insert Starter Auction Questions (Sample 10 out of the 60 Question Bank)
INSERT INTO auction_questions (id, question_number, category, difficulty, base_price, reward_points, question_text, answer_clue, status)
VALUES
('q-001', 1, 'AI & Machine Learning', 'Easy', 100, 250, 'What does the ''GPT'' in ChatGPT officially stand for?', 'Generative Pre-trained Transformer', 'AVAILABLE'),
('q-002', 2, 'AI & Machine Learning', 'Medium', 200, 450, 'Which milestone 2017 research paper introduced the Transformer architecture with self-attention mechanism?', '''Attention Is All You Need'' (Vaswani et al., Google Brain)', 'AVAILABLE'),
('q-003', 3, 'AI & Machine Learning', 'Hard', 300, 700, 'What mathematical technique freezes pre-trained model weights and injects trainable rank decomposition matrices to fine-tune LLMs with massive memory reduction?', 'LoRA (Low-Rank Adaptation)', 'AVAILABLE'),
('q-011', 11, 'Cloud & DevOps', 'Easy', 110, 260, 'What declarative language and tool created by HashiCorp is the de-facto standard for Infrastructure as Code (IaC)?', 'Terraform (HCL)', 'AVAILABLE'),
('q-012', 12, 'Cloud & DevOps', 'Medium', 200, 460, 'In Kubernetes, what controller ensures that a specified number of pod replicas are running across the cluster nodes at all times?', 'ReplicaSet (or Deployment Controller)', 'AVAILABLE'),
('q-013', 13, 'Cloud & DevOps', 'Hard', 320, 720, 'What Linux kernel feature, combined with namespaces, forms the fundamental isolation backbone behind Docker containers to limit memory and CPU?', 'cgroups (Control Groups)', 'AVAILABLE'),
('q-021', 21, 'Web & Frameworks', 'Easy', 100, 220, 'In React 18, what hook is used to access and subscribe to context without wrapping nested render props?', 'useContext', 'AVAILABLE'),
('q-031', 31, 'Cybersecurity', 'Easy', 110, 250, 'What security attack injects malicious executable JavaScript code into web applications viewed by unsuspecting victims?', 'XSS (Cross-Site Scripting)', 'AVAILABLE'),
('q-041', 41, 'Algorithms & DS', 'Easy', 100, 230, 'What is the worst-case time complexity of quicksort when the pivot is consistently chosen as the maximum or minimum element of an already sorted array?', 'O(n²)', 'AVAILABLE'),
('q-051', 51, 'Developer Lore & Trivia', 'Easy', 100, 220, 'In what year did Linus Torvalds write and release the initial version of Git after conflicts with BitKeeper?', '2005', 'AVAILABLE')
ON CONFLICT (id) DO NOTHING;
