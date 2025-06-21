/* 
DROP TABLE IF EXISTS solution_set CASCADE;
DROP TABLE IF EXISTS daily_puzzles CASCADE;
DROP TABLE IF EXISTS card CASCADE;
DROP TABLE IF EXISTS puzzles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS color CASCADE;
DROP TABLE IF EXISTS difficulty CASCADE;
DROP TABLE IF EXISTS fill CASCADE;
DROP TABLE IF EXISTS meta_color CASCADE;
DROP TABLE IF EXISTS meta_count CASCADE;
DROP TABLE IF EXISTS meta_fill CASCADE;
DROP TABLE IF EXISTS meta_shape CASCADE;
DROP TABLE IF EXISTS ncount CASCADE;
DROP TABLE IF EXISTS shape CASCADE;
*/

-- Enum type for meal_type for better data integrity
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'meal_type_enum') THEN
        CREATE TYPE meal_type_enum AS ENUM ('breakfast', 'lunch', 'dinner', 'dessert');
    END IF;
END$$;

CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  user_name VARCHAR(100) NOT NULL UNIQUE,
  user_password VARCHAR(255) NOT NULL, /* Increased length for modern hashes */
  user_email VARCHAR(100) NOT NULL UNIQUE, /* Added UNIQUE constraint */
  user_register_date TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  insert_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
/* We will insert users via the application with proper hashing */
-- INSERT INTO users(user_name, user_password, user_email) VALUES('test', 'hashed_password_here', 'kogumgame+test@gmail.com');

CREATE TABLE IF NOT EXISTS difficulty (
  difficulty_id SERIAL PRIMARY KEY,
  difficulty_value INTEGER,
  meal_type meal_type_enum NOT NULL,
  active_flag BOOLEAN DEFAULT TRUE
);
INSERT INTO difficulty(difficulty_value, meal_type) VALUES(100, 'breakfast');
INSERT INTO difficulty(difficulty_value, meal_type) VALUES(200, 'lunch');
INSERT INTO difficulty(difficulty_value, meal_type) VALUES(300, 'dinner');
INSERT INTO difficulty(difficulty_value, meal_type) VALUES(400, 'dessert');

CREATE TABLE IF NOT EXISTS color (
  color_id SERIAL PRIMARY KEY,
  color_code VARCHAR(6),
  color_name VARCHAR(50),
  difficulty INTEGER,
  active_flag BOOLEAN DEFAULT TRUE,
  insert_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO color(color_name, difficulty) VALUES('RED', 100);
INSERT INTO color(color_name, difficulty) VALUES('GREEN', 100);
INSERT INTO color(color_name, difficulty) VALUES('BLUE', 100);
INSERT INTO color(color_name, difficulty) VALUES('GOLD', 200);
INSERT INTO color(color_name, difficulty) VALUES('PURPLE', 200);
INSERT INTO color(color_name, difficulty) VALUES('ORANGE', 200);
INSERT INTO color(color_name, difficulty) VALUES('BLACK', 400);
INSERT INTO color(color_name, difficulty) VALUES('CYAN', 400);
INSERT INTO color(color_name, difficulty) VALUES('MAGENTA', 400);

CREATE TABLE IF NOT EXISTS ncount ( -- Named this way because 'count' may be reserved
  count_id SERIAL PRIMARY KEY,
  count_value INTEGER NOT NULL,
  count_name VARCHAR(50),
  difficulty INTEGER,
  active_flag BOOLEAN DEFAULT TRUE,
  insert_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO ncount(count_value, count_name, difficulty) VALUES(1,'ONE', 100);
INSERT INTO ncount(count_value, count_name, difficulty) VALUES(2,'TWO', 100);
INSERT INTO ncount(count_value, count_name, difficulty) VALUES(3,'THREE', 100);
INSERT INTO ncount(count_value, count_name, difficulty) VALUES(4,'FOUR', 400);
INSERT INTO ncount(count_value, count_name, difficulty) VALUES(5,'FIVE', 400);
INSERT INTO ncount(count_value, count_name, difficulty) VALUES(6,'SIX', 400);


-- INSERT INTO fill_group(fill_group_name) VALUES('CARBON');
-- INSERT INTO fill_group(fill_group_name) VALUES('HOUNDSTOOTH');
-- INSERT INTO fill_group(fill_group_name) VALUES('BASIC');

CREATE TABLE IF NOT EXISTS fill (
  fill_id SERIAL PRIMARY KEY,
  fill_name VARCHAR(50),
  svg_pattern JSONB,
  difficulty INTEGER,
  active_flag BOOLEAN DEFAULT TRUE,
  insert_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- SOLID (no pattern needed)
INSERT INTO fill (fill_name, difficulty, svg_pattern)
VALUES (
  'SOLID',
  100,
  NULL
);
-- STRIPED
INSERT INTO fill (fill_name, difficulty, svg_pattern)
VALUES (
  'STRIPED',
  100,
  '{
    "type": "striped",
    "patternUnits": "userSpaceOnUse",
    "patternTransform": "rotate(45)",
    "width": 8,
    "height": 8,
    "elements": [
      { "element": "rect", "width": 8, "height": 8, "fill": "transparent" },
      { "element": "line", "x1": 0, "y1": 0, "x2": 0, "y2": 8, "strokeWidth": 6 }
    ]
  }'
);
-- OPEN (no pattern, just outline)
INSERT INTO fill (fill_name, difficulty, svg_pattern)
VALUES (
  'OPEN',
  100,
  NULL
);
-- DOTTED
INSERT INTO fill (fill_name, difficulty, svg_pattern)
VALUES (
  'DOTTED',
  400,
  '{
    "type": "dotted",
    "patternUnits": "userSpaceOnUse",
    "width": 8,
    "height": 8,
    "elements": [
      { "element": "rect", "width": 8, "height": 8, "fill": "transparent" },
      { "element": "circle", "cx": 2, "cy": 2, "r": 1.5 },
      { "element": "circle", "cx": 6, "cy": 6, "r": 1.5 }
    ]
  }'
);
-- CROSSHATCH
INSERT INTO fill (fill_name, difficulty, svg_pattern)
VALUES (
  'CROSSHATCH',
  400,
  '{
    "type": "crosshatch",
    "patternUnits": "userSpaceOnUse",
    "width": 8,
    "height": 8,
    "elements": [
      { "element": "rect", "width": 8, "height": 8, "fill": "transparent" },
      { "element": "line", "x1": 4, "y1": 0, "x2": 4, "y2": 8, "strokeWidth": 2 },
      { "element": "line", "x1": 0, "y1": 4, "x2": 8, "y2": 4, "strokeWidth": 2 }
    ]
  }'
);

CREATE TABLE IF NOT EXISTS shape (
  shape_id SERIAL PRIMARY KEY,
  shape_name VARCHAR(50),
  svg_type VARCHAR(50),
  svg_properties JSONB,
  difficulty INTEGER,
  active_flag BOOLEAN DEFAULT TRUE,
  insert_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- OVAL (as an ellipse)
INSERT INTO shape(shape_name, svg_type, svg_properties, difficulty) 
VALUES(
  'OVAL', 
  'ellipse', 
  '{"cx":25,"cy":25,"rx":20,"ry":12}', 
  100
);
-- DIAMOND (as a polygon)
INSERT INTO shape(shape_name, svg_type, svg_properties, difficulty)
VALUES (
  'DIAMOND',
  'polygon',
  '{"points":"25,5 45,25 25,45 5,25"}',
  100
);
-- TRIANGLE (equilateral, pointing up)
INSERT INTO shape(shape_name, svg_type, svg_properties, difficulty)
VALUES (
  'TRIANGLE',
  'polygon',
  '{"points":"25,7 43,43 7,43"}',
  100
);
-- PARALLELOGRAM
INSERT INTO shape(shape_name, svg_type, svg_properties, difficulty)
VALUES (
  'PARALLELOGRAM',
  'polygon',
  '{"points":"10,40 35,40 45,10 20,10"}',
  300
);
-- HEXAGON
INSERT INTO shape(shape_name, svg_type, svg_properties, difficulty)
VALUES (
  'HEXAGON',
  'polygon',
  '{"points":"25,7 43,17 43,37 25,47 7,37 7,17"}',
  300
);
-- CIRCLE
INSERT INTO shape(shape_name, svg_type, svg_properties, difficulty)
VALUES (
  'CIRCLE',
  'circle',
  '{"cx":25,"cy":25,"r":18}',
  300
);
-- PENTAGON
INSERT INTO shape(shape_name, svg_type, svg_properties, difficulty)
VALUES (
  'PENTAGON',
  'polygon',
  '{"points":"25,7 43,20 35,43 15,43 7,20"}',
  400
);

CREATE TABLE IF NOT EXISTS meta_color (
  meta_color_id SERIAL PRIMARY KEY,
  meta_color_name VARCHAR(50),
  insert_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO meta_color(meta_color_name) VALUES('c1');
INSERT INTO meta_color(meta_color_name) VALUES('c2');
INSERT INTO meta_color(meta_color_name) VALUES('c3');

CREATE TABLE IF NOT EXISTS meta_count (
  meta_count_id SERIAL PRIMARY KEY,
  meta_count_name VARCHAR(50),
  insert_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO meta_count(meta_count_name) VALUES('n1');
INSERT INTO meta_count(meta_count_name) VALUES('n2');
INSERT INTO meta_count(meta_count_name) VALUES('n3');

CREATE TABLE IF NOT EXISTS meta_fill (
  meta_fill_id SERIAL PRIMARY KEY,
  meta_fill_name VARCHAR(50),
  insert_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO meta_fill(meta_fill_name) VALUES('f1');
INSERT INTO meta_fill(meta_fill_name) VALUES('f2');
INSERT INTO meta_fill(meta_fill_name) VALUES('f3');

CREATE TABLE IF NOT EXISTS meta_shape (
  meta_shape_id SERIAL PRIMARY KEY,
  meta_shape_name VARCHAR(50),
  insert_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO meta_shape(meta_shape_name) VALUES('s1');
INSERT INTO meta_shape(meta_shape_name) VALUES('s2');
INSERT INTO meta_shape(meta_shape_name) VALUES('s3');

CREATE TABLE IF NOT EXISTS card (
  card_id SERIAL PRIMARY KEY,
  card_name VARCHAR(200), -- This will be generated by combining meta_names
  meta_count_id INTEGER NOT NULL REFERENCES meta_count(meta_count_id),
  meta_color_id INTEGER NOT NULL REFERENCES meta_color(meta_color_id),
  meta_fill_id INTEGER NOT NULL REFERENCES meta_fill(meta_fill_id),
  meta_shape_id INTEGER NOT NULL REFERENCES meta_shape(meta_shape_id),
  insert_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS solution_set (
  solution_set_id SERIAL PRIMARY KEY,
  solution_set_code VARCHAR(50) NOT NULL UNIQUE, -- This code represents the set of 3 cards
  -- The individual card_id column here was a bit confusing.
  -- A solution_set is defined by its 3 cards via the solution_set_code.
  -- The link from solution_set_code to individual cards happens when generating puzzles
  -- or when the backend needs to resolve a solution_set_code back to card attributes.
  -- For now, let's keep it simple. The `generateSolutionSet` procedure populates this.
  -- The original had `card_id INTEGER NOT NULL` which might mean one row per card *in* a set.
  -- Let's assume `solution_set_code` is the primary identifier for the triplet for now.
  -- If we need to link individual cards here, we'd make a junction table:
  -- solution_set_to_cards (solution_set_code_ref, card_id_ref)
  insert_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- The original `solution_set` table structure in MySQL had `card_id` and `solution_set_code`.
-- This means each row was "this card is part of this solution set code".
-- Let's replicate that for now, as `generateSolutionSet` procedure expects it.
DROP TABLE IF EXISTS solution_set; -- Re-drop if exists from above simplified version
CREATE TABLE IF NOT EXISTS solution_set (
  solution_set_entry_id SERIAL PRIMARY KEY, -- Changed from solution_set_id to avoid confusion with a set's unique ID
  solution_set_code VARCHAR(50) NOT NULL, -- The code for the set of 3 cards (e.g., "1-5-10")
  card_id INTEGER NOT NULL REFERENCES card(card_id),
  insert_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (solution_set_code, card_id) -- A card is only in a specific set once
);
-- Add an index for faster lookups on solution_set_code
CREATE INDEX IF NOT EXISTS idx_solution_set_code ON solution_set (solution_set_code);


CREATE TABLE IF NOT EXISTS puzzles (
    puzzle_id SERIAL PRIMARY KEY,
    -- Stores an array of abstract card IDs, e.g., {"c0-s1-f2-n0", "c1-s0-f1-n2", ...}
    card_ids VARCHAR(30)[] NOT NULL, -- Max length for "cXX-sXX-fXX-nXX" is less than 30
    -- Optional: A unique constraint on card_ids if you want to prevent identical puzzles.
    -- This requires a canonical representation (e.g., sorted array) and might be complex with array types.
    -- For now, we'll rely on the seeder to manage uniqueness if strictly needed, or allow duplicates.
    -- CONSTRAINT unique_puzzle_cards UNIQUE (card_ids)
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
-- Optional: Index on card_ids if you plan to query by them, though less common for this table.
-- CREATE INDEX IF NOT EXISTS idx_puzzles_card_ids ON puzzles USING GIN (card_ids);
COMMENT ON TABLE puzzles IS 'Stores pre-generated abstract puzzles, each consisting of 12 abstract card IDs that form 6 solutions.';
COMMENT ON COLUMN puzzles.card_ids IS 'Array of 12 abstract card identifiers that make up the puzzle.';

CREATE TABLE daily_puzzles (
    daily_puzzle_id SERIAL PRIMARY KEY,
    puzzle_date DATE NOT NULL,
    meal_type meal_type_enum NOT NULL,
    puzzle_id INTEGER NOT NULL REFERENCES puzzles(puzzle_id) ON DELETE CASCADE,
    -- difficulty_level INTEGER, -- For future use
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_date_meal UNIQUE (puzzle_date, meal_type) -- Ensures only one puzzle per meal per day
);

-- Optional: Index for faster lookups
CREATE INDEX idx_daily_puzzles_date_meal ON daily_puzzles (puzzle_date, meal_type);

-- Trigger to update 'updated_at' timestamp (optional but good practice)
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_daily_puzzles_timestamp
BEFORE UPDATE ON daily_puzzles
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

--
-- Puzzle Completion Tracking for User Rankings and Leaderboards
--
CREATE TABLE IF NOT EXISTS puzzle_completions (
    completion_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id),
    daily_puzzle_id INTEGER NOT NULL REFERENCES daily_puzzles(daily_puzzle_id),
    puzzle_type VARCHAR(50) NOT NULL DEFAULT 'daily', -- for future expansion
    meal_type meal_type_enum NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    completion_time_ms INTEGER GENERATED ALWAYS AS ((EXTRACT(EPOCH FROM (end_time - start_time)) * 1000)::INTEGER) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, daily_puzzle_id) -- Prevent duplicate completions per user per puzzle
);
-- Indexes for leaderboard and personal best queries
CREATE INDEX IF NOT EXISTS idx_puzzle_completions_meal_type ON puzzle_completions (meal_type);
CREATE INDEX IF NOT EXISTS idx_puzzle_completions_puzzle_type ON puzzle_completions (puzzle_type);
CREATE INDEX IF NOT EXISTS idx_puzzle_completions_end_time ON puzzle_completions (end_time);
