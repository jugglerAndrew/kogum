/* Adapted for PostgreSQL */

CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  user_name VARCHAR(100) NOT NULL,
  user_password VARCHAR(255) NOT NULL, /* Increased length for modern hashes */
  user_email VARCHAR(100) NOT NULL UNIQUE, /* Added UNIQUE constraint */
  user_register_date TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  insert_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
/* We will insert users via the application with proper hashing */
-- INSERT INTO users(user_name, user_password, user_email) VALUES('test', 'hashed_password_here', 'kogumgame+test@gmail.com');

CREATE TABLE IF NOT EXISTS sessions (
  session_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE, /* Added ON DELETE CASCADE */
  session_key VARCHAR(60) NOT NULL,
  session_address VARCHAR(100) NOT NULL,
  session_useragent VARCHAR(200) NOT NULL,
  session_expire_date TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS game (
  game_id SERIAL PRIMARY KEY,
  game_name VARCHAR(100) NOT NULL,
  game_desc VARCHAR(500) NULL,
  insert_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO game(game_name) VALUES('CLASSIC');

CREATE TABLE IF NOT EXISTS difficulty (
  difficulty_id INTEGER NOT NULL PRIMARY KEY,
  difficulty_name VARCHAR(100) NOT NULL,
  difficulty_desc VARCHAR(500) NULL,
  insert_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO difficulty(difficulty_id, difficulty_name) VALUES(100, 'Breakfast');
INSERT INTO difficulty(difficulty_id, difficulty_name) VALUES(200, 'Lunch');
INSERT INTO difficulty(difficulty_id, difficulty_name) VALUES(300, 'Dinner');
INSERT INTO difficulty(difficulty_id, difficulty_name) VALUES(400, 'Dessert');

CREATE TABLE IF NOT EXISTS puzzle_game (
  puzzle_game_id SERIAL PRIMARY KEY,
  puzzle_id INTEGER NOT NULL, /* Will add FK constraint after puzzle table */
  game_id INTEGER NOT NULL REFERENCES game(game_id),
  difficulty INTEGER NOT NULL REFERENCES difficulty(difficulty_id),
  start_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  end_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  insert_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS color (
  color_id SERIAL PRIMARY KEY,
  color_code VARCHAR(6) NOT NULL,
  color_name VARCHAR(50),
  difficulty INTEGER,
  active_flag BOOLEAN DEFAULT TRUE,
  insert_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- (Your color INSERT statements are mostly fine, just ensure column names match)
INSERT INTO color(color_name, color_code, difficulty) VALUES('RED','FF0000',100);
INSERT INTO color(color_name, color_code, difficulty) VALUES('HOTPINK','FF69B4',200);
INSERT INTO color(color_name, color_code, difficulty) VALUES('ORANGE','FFA500',200);
INSERT INTO color(color_name, color_code, difficulty) VALUES('GOLD','FFD700',100);
INSERT INTO color(color_name, color_code, difficulty) VALUES('KHAKI','F0E68C',300);
INSERT INTO color(color_name, color_code, difficulty) VALUES('MEDIUMPURPLE','9370DB',200);
INSERT INTO color(color_name, color_code, difficulty) VALUES('GREENYELLOW','ADFF2F',300);
INSERT INTO color(color_name, color_code, difficulty) VALUES('MEDIUMSEAGREEN','3CB371',200);
INSERT INTO color(color_name, color_code, difficulty) VALUES('AQUA','00FFFF',200);
INSERT INTO color(color_name, color_code, difficulty) VALUES('POWDERBLUE','B0E0E6',300);
INSERT INTO color(color_name, color_code, difficulty) VALUES('DODGERBLUE','1E90FF',100);
INSERT INTO color(color_name, color_code, difficulty) VALUES('ROSYBROWN','BC8F8F',300);
INSERT INTO color(color_name, color_code, difficulty) VALUES('SILVER','C0C0C0',200);
INSERT INTO color(color_name, color_code, difficulty) VALUES('DIMGRAY','696969',300);
INSERT INTO color(color_name, color_code, difficulty) VALUES('BLACK','000000',200);


CREATE TABLE IF NOT EXISTS game_color (
  game_color_id SERIAL PRIMARY KEY,
  puzzle_game_id INTEGER NOT NULL REFERENCES puzzle_game(puzzle_game_id) ON DELETE CASCADE,
  color_id INTEGER NOT NULL REFERENCES color(color_id),
  insert_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ncount ( -- Renamed from 'ncount' for clarity if 'count' is reserved
  count_id SERIAL PRIMARY KEY,
  count_value INTEGER NOT NULL,
  count_name VARCHAR(50),
  difficulty INTEGER,
  active_flag BOOLEAN DEFAULT TRUE,
  insert_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO ncount(count_value, count_name, difficulty) VALUES(1,'ONE',100);
INSERT INTO ncount(count_value, count_name, difficulty) VALUES(2,'TWO',100);
INSERT INTO ncount(count_value, count_name, difficulty) VALUES(3,'THREE',100);

CREATE TABLE IF NOT EXISTS fill_group (
  fill_group_id SERIAL PRIMARY KEY,
  fill_group_name VARCHAR(50),
  active_flag BOOLEAN DEFAULT TRUE,
  insert_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- (Your fill_group INSERT statements are fine)
INSERT INTO fill_group(fill_group_name) VALUES('CIRCLE DOT');
INSERT INTO fill_group(fill_group_name) VALUES('SQUARE DOT');
INSERT INTO fill_group(fill_group_name) VALUES('DIAGONAL STRIPE');
INSERT INTO fill_group(fill_group_name) VALUES('HORIZONTAL STRIPE');
INSERT INTO fill_group(fill_group_name) VALUES('VERTICAL STRIPE');
INSERT INTO fill_group(fill_group_name) VALUES('CROSSHATCH');
INSERT INTO fill_group(fill_group_name) VALUES('CARBON');
INSERT INTO fill_group(fill_group_name) VALUES('HOUNDSTOOTH');
INSERT INTO fill_group(fill_group_name) VALUES('BASIC');


CREATE TABLE IF NOT EXISTS fill (
  fill_id SERIAL PRIMARY KEY,
  fill_name VARCHAR(50),
  fill_group_id INTEGER REFERENCES fill_group(fill_group_id),
  svg_pattern_id VARCHAR(50) NOT NULL,
  svg_base64 TEXT, -- Changed VARCHAR(800) to TEXT for potentially longer base64
  svg_markup TEXT, -- Changed VARCHAR(500) to TEXT
  difficulty INTEGER,
  active_flag BOOLEAN DEFAULT TRUE,
  insert_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- (Your fill INSERT statements need fill_group_id to be an existing ID or a subselect that works in PG)
-- Example of adapting an INSERT for fill (assuming fill_group_id is known or use subselect)
INSERT INTO fill(fill_name, fill_group_id, svg_pattern_id, svg_base64, svg_markup, difficulty) VALUES('EMPTY', (SELECT fill_group_id FROM fill_group WHERE fill_group_name = 'BASIC'),'empty','','<svg xmlns=''http://www.w3.org/2000/svg'' width=''10'' height=''10''><rect width=''10'' height=''10'' fill=''WHITE'' /><circle cx=''2'' cy=''2'' r=''2'' fill=''WHITE''/></svg>',100);
INSERT INTO fill(fill_name, fill_group_id, svg_pattern_id, svg_base64, svg_markup, difficulty) VALUES('FILLED', (SELECT fill_group_id FROM fill_group WHERE fill_group_name = 'BASIC'),'filled','','<svg xmlns=''http://www.w3.org/2000/svg'' width=''10'' height=''10''><rect width=''10'' height=''10'' fill=''#ZZZZZZ'' /><circle cx=''2'' cy=''2'' r=''2'' fill=''#ZZZZZZ''/></svg>',100);
-- ... (adapt other fill inserts similarly)
INSERT INTO fill(fill_name, fill_group_id, svg_pattern_id, svg_base64, svg_markup, difficulty) VALUES('CIRCLES3', (SELECT fill_group_id FROM fill_group WHERE fill_group_name = 'CIRCLE DOT'),'circles-3','PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd3aGl0ZScgLz4KICA8Y2lyY2xlIGN4PScyJyBjeT0nMicgcj0nMicgZmlsbD0nIzU1OTRlNycvPgo8L3N2Zz4=','<svg xmlns=''http://www.w3.org/2000/svg'' width=''10'' height=''10''><rect width=''10'' height=''10'' fill=''WHITE'' /><circle cx=''2'' cy=''2'' r=''2'' fill=''#ZZZZZZ''/></svg>',100);
INSERT INTO fill(fill_name, fill_group_id, svg_pattern_id, svg_base64, svg_markup, difficulty) VALUES('CIRCLES6', (SELECT fill_group_id FROM fill_group WHERE fill_group_name = 'CIRCLE DOT'),'circles-6','PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd3aGl0ZScgLz4KICA8Y2lyY2xlIGN4PSczLjUnIGN5PSczLjUnIHI9JzMuNScgZmlsbD0nIzU1OTRlNycvPgo8L3N2Zz4K','<svg xmlns=''http://www.w3.org/2000/svg'' width=''10'' height=''10''><rect width=''10'' height=''10'' fill=''WHITE'' /><circle cx=''3.5'' cy=''3.5'' r=''3.5'' fill=''#ZZZZZZ''/></svg>',100);
INSERT INTO fill(fill_name, fill_group_id, svg_pattern_id, svg_base64, svg_markup, difficulty) VALUES('CIRCLES9', (SELECT fill_group_id FROM fill_group WHERE fill_group_name = 'CIRCLE DOT'),'circles-9','PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd3aGl0ZScgLz4KICA8Y2lyY2xlIGN4PSc1JyBjeT0nNScgcj0nNScgZmlsbD0nIzU1OTRlNycvPgo8L3N2Zz4=','<svg xmlns=''http://www.w3.org/2000/svg'' width=''10'' height=''10''><rect width=''10'' height=''10'' fill=''WHITE'' /><circle cx=''5'' cy=''5'' r=''5'' fill=''#ZZZZZZ''/></svg>',100);
INSERT INTO fill(fill_name, fill_group_id, svg_pattern_id, svg_base64, svg_markup, difficulty) VALUES('DIAGONALSTRIPE2', (SELECT fill_group_id FROM fill_group WHERE fill_group_name = 'DIAGONAL STRIPE'),'diagonal-stripe-2','PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd3aGl0ZScvPgogIDxwYXRoIGQ9J00tMSwxIGwyLC0yCiAgICAgICAgICAgTTAsMTAgbDEwLC0xMAogICAgICAgICAgIE05LDExIGwyLC0yJyBzdHJva2U9JyM1NTk0ZTcnIHN0cm9rZS13aWR0aD0nMicvPgo8L3N2Zz4=','<svg xmlns=''http://www.w3.org/2000/svg'' width=''10'' height=''10''><rect width=''10'' height=''10'' fill=''WHITE''/><path d=''M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2'' stroke=''#ZZZZZZ'' stroke-width=''2''/></svg>',100);
INSERT INTO fill(fill_name, fill_group_id, svg_pattern_id, svg_base64, svg_markup, difficulty) VALUES('DIAGONALSTRIPE4', (SELECT fill_group_id FROM fill_group WHERE fill_group_name = 'DIAGONAL STRIPE'),'diagonal-stripe-4','PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPScjNTU5NGU3Jy8+CiAgPHBhdGggZD0nTS0xLDEgbDIsLTIKICAgICAgICAgICBNMCwxMCBsMTAsLTEwCiAgICAgICAgICAgTTksMTEgbDIsLTInIHN0cm9rZT0nd2hpdGUnIHN0cm9rZS13aWR0aD0nMycvPgo8L3N2Zz4=','<svg xmlns=''http://www.w3.org/2000/svg'' width=''10'' height=''10''><rect width=''10'' height=''10'' fill=''#ZZZZZZ''/><path d=''M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2'' stroke=''WHITE'' stroke-width=''3''/></svg>',100);
INSERT INTO fill(fill_name, fill_group_id, svg_pattern_id, svg_base64, svg_markup, difficulty) VALUES('DOTS2', (SELECT fill_group_id FROM fill_group WHERE fill_group_name = 'SQUARE DOT'),'dots-2','PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd3aGl0ZScgLz4KICA8cmVjdCB4PScwJyB5PScwJyB3aWR0aD0nMicgaGVpZ2h0PScyJyBmaWxsPScjNTU5NGU3JyAvPgo8L3N2Zz4=','<svg xmlns=''http://www.w3.org/2000/svg'' width=''10'' height=''10''><rect width=''10'' height=''10'' fill=''WHITE'' /><rect x=''0'' y=''0'' width=''2'' height=''2'' fill=''#ZZZZZZ'' /></svg>',100);
INSERT INTO fill(fill_name, fill_group_id, svg_pattern_id, svg_base64, svg_markup, difficulty) VALUES('DOTS5', (SELECT fill_group_id FROM fill_group WHERE fill_group_name = 'SQUARE DOT'),'dots-5','PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd3aGl0ZScgLz4KICA8cmVjdCB4PScwJyB5PScwJyB3aWR0aD0nNScgaGVpZ2h0PSc1JyBmaWxsPScjNTU5NGU3JyAvPgo8L3N2Zz4=','<svg xmlns=''http://www.w3.org/2000/svg'' width=''10'' height=''10''><rect width=''10'' height=''10'' fill=''WHITE'' /><rect x=''0'' y=''0'' width=''5'' height=''5'' fill=''#ZZZZZZ'' /></svg>',100);
INSERT INTO fill(fill_name, fill_group_id, svg_pattern_id, svg_base64, svg_markup, difficulty) VALUES('DOTS8', (SELECT fill_group_id FROM fill_group WHERE fill_group_name = 'SQUARE DOT'),'dots-8','PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd3aGl0ZScgLz4KICA8cmVjdCB4PScwJyB5PScwJyB3aWR0aD0nOCcgaGVpZ2h0PSc4JyBmaWxsPScjNTU5NGU3JyAvPgo8L3N2Zz4=','<svg xmlns=''http://www.w3.org/2000/svg'' width=''10'' height=''10''><rect width=''10'' height=''10'' fill=''WHITE'' /><rect x=''0'' y=''0'' width=''8'' height=''8'' fill=''#ZZZZZZ'' /></svg>',100);
INSERT INTO fill(fill_name, fill_group_id, svg_pattern_id, svg_base64, svg_markup, difficulty) VALUES('HORIZONTALSTRIPE2', (SELECT fill_group_id FROM fill_group WHERE fill_group_name = 'HORIZONTAL STRIPE'),'horizontal-stripe-2','PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd3aGl0ZScgLz4KICA8cmVjdCB4PScwJyB5PScwJyB3aWR0aD0nMTAnIGhlaWdodD0nMicgZmlsbD0nIzU1OTRlNycgLz4KPC9zdmc+','<svg xmlns=''http://www.w3.org/2000/svg'' width=''10'' height=''10''><rect width=''10'' height=''10'' fill=''WHITE'' /><rect x=''0'' y=''0'' width=''10'' height=''2'' fill=''#ZZZZZZ'' /></svg>',100);
INSERT INTO fill(fill_name, fill_group_id, svg_pattern_id, svg_base64, svg_markup, difficulty) VALUES('HORIZONTALSTRIPE5', (SELECT fill_group_id FROM fill_group WHERE fill_group_name = 'HORIZONTAL STRIPE'),'horizontal-stripe-5','PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd3aGl0ZScgLz4KICA8cmVjdCB4PScwJyB5PScwJyB3aWR0aD0nMTAnIGhlaWdodD0nNScgZmlsbD0nIzU1OTRlNycgLz4KPC9zdmc+','<svg xmlns=''http://www.w3.org/2000/svg'' width=''10'' height=''10''><rect width=''10'' height=''10'' fill=''WHITE'' /><rect x=''0'' y=''0'' width=''10'' height=''5'' fill=''#ZZZZZZ'' /></svg>',100);
INSERT INTO fill(fill_name, fill_group_id, svg_pattern_id, svg_base64, svg_markup, difficulty) VALUES('HORIZONTALSTRIPE8', (SELECT fill_group_id FROM fill_group WHERE fill_group_name = 'HORIZONTAL STRIPE'),'horizontal-stripe-8','PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd3aGl0ZScgLz4KICA8cmVjdCB4PScwJyB5PScwJyB3aWR0aD0nMTAnIGhlaWdodD0nOCcgZmlsbD0nIzU1OTRlNycgLz4KPC9zdmc+','<svg xmlns=''http://www.w3.org/2000/svg'' width=''10'' height=''10''><rect width=''10'' height=''10'' fill=''WHITE'' /><rect x=''0'' y=''0'' width=''10'' height=''8'' fill=''#ZZZZZZ'' /></svg>',100);
INSERT INTO fill(fill_name, fill_group_id, svg_pattern_id, svg_base64, svg_markup, difficulty) VALUES('VERTICALSTRIPE1', (SELECT fill_group_id FROM fill_group WHERE fill_group_name = 'VERTICAL STRIPE'),'vertical-stripe-1','PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd3aGl0ZScgLz4KICA8cmVjdCB4PScwJyB5PScwJyB3aWR0aD0nMScgaGVpZ2h0PScxMCcgZmlsbD0nIzU1OTRlNycgLz4KPC9zdmc+','<svg xmlns=''http://www.w3.org/2000/svg'' width=''10'' height=''10''><rect width=''10'' height=''10'' fill=''WHITE'' /><rect x=''0'' y=''0'' width=''1'' height=''10'' fill=''#ZZZZZZ'' /></svg>',100);
INSERT INTO fill(fill_name, fill_group_id, svg_pattern_id, svg_base64, svg_markup, difficulty) VALUES('VERTICALSTRIPE4', (SELECT fill_group_id FROM fill_group WHERE fill_group_name = 'VERTICAL STRIPE'),'vertical-stripe-4','PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd3aGl0ZScgLz4KICA8cmVjdCB4PScwJyB5PScwJyB3aWR0aD0nNCcgaGVpZ2h0PScxMCcgZmlsbD0nIzU1OTRlNycgLz4KPC9zdmc+','<svg xmlns=''http://www.w3.org/2000/svg'' width=''10'' height=''10''><rect width=''10'' height=''10'' fill=''WHITE'' /><rect x=''0'' y=''0'' width=''4'' height=''10'' fill=''#ZZZZZZ'' /></svg>',100);
INSERT INTO fill(fill_name, fill_group_id, svg_pattern_id, svg_base64, svg_markup, difficulty) VALUES('VERTICALSTRIPE7', (SELECT fill_group_id FROM fill_group WHERE fill_group_name = 'VERTICAL STRIPE'),'vertical-stripe-7','PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd3aGl0ZScgLz4KICA8cmVjdCB4PScwJyB5PScwJyB3aWR0aD0nNycgaGVpZ2h0PScxMCcgZmlsbD0nIzU1OTRlNycgLz4KPC9zdmc+','<svg xmlns=''http://www.w3.org/2000/svg'' width=''10'' height=''10''><rect width=''10'' height=''10'' fill=''WHITE'' /><rect x=''0'' y=''0'' width=''7'' height=''10'' fill=''#ZZZZZZ'' /></svg>',100);
INSERT INTO fill(fill_name, fill_group_id, svg_pattern_id, svg_base64, svg_markup, difficulty) VALUES('CROSSHATCH1', (SELECT fill_group_id FROM fill_group WHERE fill_group_name = 'CROSSHATCH'),'crosshatch-1','PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc4JyBoZWlnaHQ9JzgnPgogIDxyZWN0IHdpZHRoPSc4JyBoZWlnaHQ9JzgnIGZpbGw9JyNmZmYnLz4KICA8cGF0aCBkPSdNMCAwTDggOFpNOCAwTDAgOFonIHN0cm9rZS13aWR0aD0nMC41JyBzdHJva2U9JyNhYWEnLz4KPC9zdmc+Cg==','<svg xmlns=''http://www.w3.org/2000/svg'' width=''8'' height=''8''><rect width=''8'' height=''8'' fill=''WHITE''/><path d=''M0 0L8 8ZM8 0L0 8Z'' stroke-width=''0.5'' stroke=''#ZZZZZZ''/></svg>',100);
INSERT INTO fill(fill_name, fill_group_id, svg_pattern_id, svg_base64, svg_markup, difficulty) VALUES('HOUNDSTOOTH1', (SELECT fill_group_id FROM fill_group WHERE fill_group_name = 'HOUNDSTOOTH'),'houndstooth-1','PHN2ZyB3aWR0aD0nMTAnIGhlaWdodD0nMTAnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+CiAgPHBhdGggZD0nTTAgMEw0IDQnIHN0cm9rZT0nI2FhYScgZmlsbD0nI2FhYScgc3Ryb2tlLXdpZHRoPScxJy8+CiAgPHBhdGggZD0nTTIuNSAwTDUgMi41TDUgNUw5IDlMNSA1TDEwIDVMMTAgMCcgc3Ryb2tlPScjYWFhJyBmaWxsPScjYWFhJyBzdHJva2Utd2lkdGg9JzEnLz4KICA8cGF0aCBkPSdNNSAxMEw1IDcuNUw3LjUgMTAnIHN0cm9rZT0nI2FhYScgZmlsbD0nI2FhYScgc3Ryb2tlLXdpZHRoPScxJy8+Cjwvc3ZnPgo=','<svg width=''10'' height=''10'' xmlns=''http://www.w3.org/2000/svg''><path d=''M0 0L4 4'' stroke=''#ZZZZZZ'' fill=''#ZZZZZZ'' stroke-width=''1''/><path d=''M2.5 0L5 2.5L5 5L9 9L5 5L10 5L10 0'' stroke=''#ZZZZZZ'' fill=''#ZZZZZZ'' stroke-width=''1''/><path d=''M5 10L5 7.5L7.5 10'' stroke=''#ZZZZZZ'' fill=''#ZZZZZZ'' stroke-width=''1''/></svg>',100);


CREATE TABLE IF NOT EXISTS game_fill (
  game_fill_id SERIAL PRIMARY KEY,
  puzzle_game_id INTEGER NOT NULL REFERENCES puzzle_game(puzzle_game_id) ON DELETE CASCADE,
  fill_id INTEGER NOT NULL REFERENCES fill(fill_id),
  insert_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS shape_group (
  shape_group_id SERIAL PRIMARY KEY,
  shape_group_name VARCHAR(50),
  active_flag BOOLEAN DEFAULT TRUE,
  insert_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- (Your shape_group INSERT statements are fine)
INSERT INTO shape_group(shape_group_name) VALUES('TRIANGLE');
INSERT INTO shape_group(shape_group_name) VALUES('QUADRILATERAL');
INSERT INTO shape_group(shape_group_name) VALUES('PENTAGON');
INSERT INTO shape_group(shape_group_name) VALUES('HEXAGON');
INSERT INTO shape_group(shape_group_name) VALUES('HEPTAGON AND HIGHER');
INSERT INTO shape_group(shape_group_name) VALUES('STANDARD SYMBOL');

CREATE TABLE IF NOT EXISTS shape (
  shape_id SERIAL PRIMARY KEY,
  shape_name VARCHAR(50),
  shape_group_id INTEGER REFERENCES shape_group(shape_group_id),
  svg_tag VARCHAR(50) NOT NULL,
  svg_attribute_value VARCHAR(800) NOT NULL,
  difficulty INTEGER,
  active_flag BOOLEAN DEFAULT TRUE,
  insert_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- (Your shape INSERT statements are mostly fine, just ensure fill_group_id refers to existing IDs or use subselects)
-- Example:
INSERT INTO shape(shape_name, shape_group_id, svg_tag, svg_attribute_value, difficulty) VALUES('ISOSCELES', (SELECT shape_group_id FROM shape_group WHERE shape_group_name = 'TRIANGLE'), 'polygon', '25 5, 5 45, 45 45',100);
-- ... (adapt other shape inserts similarly)
INSERT INTO shape(shape_name, shape_group_id, svg_tag, svg_attribute_value, difficulty) VALUES('TRAPEZOID', (SELECT shape_group_id FROM shape_group WHERE shape_group_name = 'QUADRILATERAL'), 'polygon', '10 5, 40 5, 45 45, 5 45',100);
INSERT INTO shape(shape_name, shape_group_id, svg_tag, svg_attribute_value, difficulty) VALUES('PARALLELOGRAMR', (SELECT shape_group_id FROM shape_group WHERE shape_group_name = 'QUADRILATERAL'), 'polygon', '17.5 2.5, 45 2.5, 32.5 47.5, 5 47.5',100);
INSERT INTO shape(shape_name, shape_group_id, svg_tag, svg_attribute_value, difficulty) VALUES('RHOMBUS', (SELECT shape_group_id FROM shape_group WHERE shape_group_name = 'QUADRILATERAL'), 'polygon', '25 5, 45 25, 25 45, 5 25',100);
INSERT INTO shape(shape_name, shape_group_id, svg_tag, svg_attribute_value, difficulty) VALUES('SQUARE', (SELECT shape_group_id FROM shape_group WHERE shape_group_name = 'QUADRILATERAL'), 'polygon', '5 5, 5 45, 45 45, 45 5',100);
INSERT INTO shape(shape_name, shape_group_id, svg_tag, svg_attribute_value, difficulty) VALUES('PENTAGON', (SELECT shape_group_id FROM shape_group WHERE shape_group_name = 'PENTAGON'), 'polygon', '25 5, 45 20, 35 45, 15 45, 5 20',100);
INSERT INTO shape(shape_name, shape_group_id, svg_tag, svg_attribute_value, difficulty) VALUES('HEXAGON', (SELECT shape_group_id FROM shape_group WHERE shape_group_name = 'HEXAGON'), 'polygon', '25 5, 45 16.25, 45 33.75, 25 45, 5 33.75, 5 16.25',100);
INSERT INTO shape(shape_name, shape_group_id, svg_tag, svg_attribute_value, difficulty) VALUES('OCTAGON', (SELECT shape_group_id FROM shape_group WHERE shape_group_name = 'HEPTAGON AND HIGHER'), 'polygon', '30 0, 70 0, 100 30, 100 70, 70 100, 30 100, 0 70, 0 30',100);
INSERT INTO shape(shape_name, shape_group_id, svg_tag, svg_attribute_value, difficulty) VALUES('RABBET', (SELECT shape_group_id FROM shape_group WHERE shape_group_name = 'STANDARD SYMBOL'), 'polygon', '0 15, 15 15, 15 0, 85 0, 85 15, 100 15, 100 85, 85 85, 85 100, 15 100, 15 85, 0 85',100);
INSERT INTO shape(shape_name, shape_group_id, svg_tag, svg_attribute_value, difficulty) VALUES('CHEVRONL', (SELECT shape_group_id FROM shape_group WHERE shape_group_name = 'STANDARD SYMBOL'), 'polygon', '100 0, 75 50, 100 100, 25 100, 0 50, 25 0',100);
INSERT INTO shape(shape_name, shape_group_id, svg_tag, svg_attribute_value, difficulty) VALUES('STAR', (SELECT shape_group_id FROM shape_group WHERE shape_group_name = 'STANDARD SYMBOL'), 'polygon', '50 0, 61 35, 98 35, 68 57, 79 91, 50 70, 21 91, 32 57, 2 35, 39 35',100);
INSERT INTO shape(shape_name, shape_group_id, svg_tag, svg_attribute_value, difficulty) VALUES('X', (SELECT shape_group_id FROM shape_group WHERE shape_group_name = 'STANDARD SYMBOL'), 'polygon', '20 0, 0 20, 30 50, 0 80, 20 100, 50 70, 80 100, 100 80, 70 50, 100 20, 80 0, 50 30',100);
INSERT INTO shape(shape_name, shape_group_id, svg_tag, svg_attribute_value, difficulty) VALUES('CIRCLE', (SELECT shape_group_id FROM shape_group WHERE shape_group_name = 'STANDARD SYMBOL'), 'circle', '50 at 50 50',100); /* '50 at 50 50' is not standard SVG for circle, might need to be 'cx="25" cy="25" r="25"' with viewBox */
INSERT INTO shape(shape_name, shape_group_id, svg_tag, svg_attribute_value, difficulty) VALUES('ELLIPSE', (SELECT shape_group_id FROM shape_group WHERE shape_group_name = 'STANDARD SYMBOL'), 'ellipse', '25 40 at 50 50',100); /* Similar to circle, 'rx="25" ry="40" cx="50" cy="50"' */
INSERT INTO shape(shape_name, shape_group_id, svg_tag, svg_attribute_value, difficulty) VALUES('CRESCENTL', (SELECT shape_group_id FROM shape_group WHERE shape_group_name = 'STANDARD SYMBOL'), 'path', 'M50 20A40 40 0 1 0 50 70 30 30 0 1 1 50 20z',100);

UPDATE shape SET active_flag = FALSE WHERE shape_group_id IN (SELECT shape_group_id FROM shape_group WHERE shape_group_name IN ('HEPTAGON AND HIGHER','STANDARD SYMBOL'));


CREATE TABLE IF NOT EXISTS game_shape (
  game_shape_id SERIAL PRIMARY KEY,
  puzzle_game_id INTEGER NOT NULL REFERENCES puzzle_game(puzzle_game_id) ON DELETE CASCADE,
  shape_id INTEGER NOT NULL REFERENCES shape(shape_id),
  insert_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
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

CREATE TABLE IF NOT EXISTS solution (
  solution_id SERIAL PRIMARY KEY,
  -- This table might just be for grouping solution_sets into what a puzzle uses
  insert_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS puzzle (
  puzzle_id SERIAL PRIMARY KEY,
  puzzle_name VARCHAR(200), -- Can be NULL or auto-generated
  solution_id INTEGER NOT NULL REFERENCES solution(solution_id),
  active_flag BOOLEAN DEFAULT TRUE,
  insert_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add FK for puzzle_game.puzzle_id after puzzle table is defined
ALTER TABLE puzzle_game ADD CONSTRAINT fk_puzzle_id FOREIGN KEY (puzzle_id) REFERENCES puzzle(puzzle_id);

CREATE TABLE IF NOT EXISTS puzzle_card (
  puzzle_card_id SERIAL PRIMARY KEY,
  puzzle_id INTEGER NOT NULL REFERENCES puzzle(puzzle_id) ON DELETE CASCADE,
  card_id INTEGER NOT NULL REFERENCES card(card_id),
  active_flag BOOLEAN DEFAULT TRUE,
  insert_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (puzzle_id, card_id) -- A card should only appear once in a puzzle
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


CREATE TABLE IF NOT EXISTS solution_group (
  solution_group_id SERIAL PRIMARY KEY,
  solution_id INTEGER NOT NULL REFERENCES solution(solution_id) ON DELETE CASCADE,
  solution_set_code VARCHAR(50) NOT NULL, -- This should reference the unique code of a solution set
  -- If solution_set.solution_set_code is not unique on its own, this FK might need adjustment
  -- For now, assuming it refers to the concept of the set.
  insert_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(solution_id, solution_set_code)
);


CREATE TABLE IF NOT EXISTS user_game (
  user_game_id SERIAL PRIMARY KEY,
  puzzle_game_id INTEGER NOT NULL REFERENCES puzzle_game(puzzle_game_id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  game_completion_ms VARCHAR(20), -- Storing the formatted string as per getElapsedTimeByMs
  insert_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

/* Stored procedures/functions are not directly translated here.
   Their logic will be implemented in the Node.js backend.
-- CALL generateCard();
-- CALL generateSolutionSet();
-- CALL generatePuzzle(p_amount INT);
*/