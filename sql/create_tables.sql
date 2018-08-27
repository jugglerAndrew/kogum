/* BETA SQL */
CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  user_name VARCHAR(100) NOT NULL,
  user_password VARCHAR(64) NOT NULL,
  user_email VARCHAR(100) NOT NULL,
  user_register_date DATETIME NOT NULL DEFAULT NOW(),
  insert_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP  
);
INSERT INTO users(user_name, user_password, user_email) VALUES('test', 'test1', 'kogumgame+test@gmail.com');

CREATE TABLE IF NOT EXISTS sessions (
  session_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(user_id),
  session_key VARCHAR(60) NOT NULL,
  session_address VARCHAR(100) NOT NULL,
  session_useragent VARCHAR(200) NOT NULL,
  session_expire_date DATETIME NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS game (
  game_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
	game_name VARCHAR(100) NOT NULL,
	game_desc VARCHAR(500) NULL,
  insert_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
INSERT INTO game(game_name) VALUES('CLASSIC');

CREATE TABLE IF NOT EXISTS puzzle_game (
  puzzle_game_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  puzzle_id INTEGER NOT NULL,
	game_id INTEGER NOT NULL,
  difficulty INTEGER NOT NULL,	
  start_date DATETIME NOT NULL,
	end_date DATETIME NOT NULL, 
  insert_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS game_color (
  game_color_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  puzzle_game_id INTEGER NOT NULL,
  color_id INTEGER NOT NULL,
  insert_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS game_fill (
  game_fill_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  puzzle_game_id INTEGER NOT NULL,
  fill_id INTEGER NOT NULL,
  insert_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS game_shape (
  game_shape_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  puzzle_game_id INTEGER NOT NULL,
  shape_id INTEGER NOT NULL,
  insert_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_game (
	user_game_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
	puzzle_game_id INTEGER NOT NULL,
	user_id INTEGER NOT NULL,
	game_completion_ms INTEGER, 
  insert_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
/* END BETA */

CREATE TABLE meta_color (
  meta_color_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  meta_color_name VARCHAR(50),
  insert_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
INSERT INTO meta_color(meta_color_name) VALUES('c1');
INSERT INTO meta_color(meta_color_name) VALUES('c2');
INSERT INTO meta_color(meta_color_name) VALUES('c3');

CREATE TABLE color (
  color_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  color_code VARCHAR(6) NOT NULL,
  color_name VARCHAR(50),
  difficulty INTEGER,
  active_flag BOOLEAN DEFAULT TRUE,
  insert_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
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

CREATE TABLE meta_count (
  meta_count_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  meta_count_name VARCHAR(50),
  insert_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
INSERT INTO meta_count(meta_count_name) VALUES('n1');
INSERT INTO meta_count(meta_count_name) VALUES('n2');
INSERT INTO meta_count(meta_count_name) VALUES('n3');

CREATE TABLE ncount (
  count_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  count_value INTEGER NOT NULL,
  count_name VARCHAR(50),
  difficulty INTEGER,
  active_flag BOOLEAN DEFAULT TRUE,
  insert_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
INSERT INTO ncount(count_value, count_name, difficulty) VALUES(1,'ONE',100);
INSERT INTO ncount(count_value, count_name, difficulty) VALUES(2,'TWO',100);
INSERT INTO ncount(count_value, count_name, difficulty) VALUES(3,'THREE',100);

CREATE TABLE meta_fill (
  meta_fill_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  meta_fill_name VARCHAR(50),
  insert_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
INSERT INTO meta_fill(meta_fill_name) VALUES('f1');
INSERT INTO meta_fill(meta_fill_name) VALUES('f2');
INSERT INTO meta_fill(meta_fill_name) VALUES('f3');

CREATE TABLE fill_group (
  fill_group_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  fill_group_name VARCHAR(50),
  active_flag BOOLEAN DEFAULT TRUE,
  insert_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
INSERT INTO fill_group(fill_group_name) VALUES('CIRCLE DOT');
INSERT INTO fill_group(fill_group_name) VALUES('SQUARE DOT');
INSERT INTO fill_group(fill_group_name) VALUES('DIAGONAL STRIPE');
INSERT INTO fill_group(fill_group_name) VALUES('HORIZONTAL STRIPE');
INSERT INTO fill_group(fill_group_name) VALUES('VERTICAL STRIPE');
INSERT INTO fill_group(fill_group_name) VALUES('CROSSHATCH');
INSERT INTO fill_group(fill_group_name) VALUES('CARBON');
INSERT INTO fill_group(fill_group_name) VALUES('HOUNDSTOOTH');
INSERT INTO fill_group(fill_group_name) VALUES('BASIC');

CREATE TABLE fill (
  fill_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  fill_name VARCHAR(50),
  fill_group_id INTEGER,
  svg_pattern_id VARCHAR(50) NOT NULL,
  svg_base64  VARCHAR(800),
  svg_markup  VARCHAR(500),
  difficulty INTEGER,
  active_flag BOOLEAN DEFAULT TRUE,
  insert_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
INSERT INTO fill(fill_name, fill_group_id, svg_pattern_id, svg_base64, svg_markup, difficulty) VALUES('EMPTY', (SELECT fill_group_id FROM fill_group WHERE fill_group_name = 'BASIC'),'empty','','<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'10\'>
  <rect width=\'10\' height=\'10\' fill=\'WHITE\' />
  <circle cx=\'2\' cy=\'2\' r=\'2\' fill=\'WHITE\'/>
</svg>',100);
INSERT INTO fill(fill_name, fill_group_id, svg_pattern_id, svg_base64, svg_markup, difficulty) VALUES('FILLED', (SELECT fill_group_id FROM fill_group WHERE fill_group_name = 'BASIC'),'filled','','<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'10\'>
  <rect width=\'10\' height=\'10\' fill=\'#ZZZZZZ\' />
  <circle cx=\'2\' cy=\'2\' r=\'2\' fill=\'#ZZZZZZ\'/>
</svg>',100);
INSERT INTO fill(fill_name, fill_group_id, svg_pattern_id, svg_base64, svg_markup, difficulty) VALUES('CIRCLES3', (SELECT fill_group_id FROM fill_group WHERE fill_group_name = 'CIRCLE DOT'),'circles-3','PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd3aGl0ZScgLz4KICA8Y2lyY2xlIGN4PScyJyBjeT0nMicgcj0nMicgZmlsbD0nIzU1OTRlNycvPgo8L3N2Zz4=','<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'10\'>
  <rect width=\'10\' height=\'10\' fill=\'WHITE\' />
  <circle cx=\'2\' cy=\'2\' r=\'2\' fill=\'#ZZZZZZ\'/>
</svg>',100);
INSERT INTO fill(fill_name, fill_group_id, svg_pattern_id, svg_base64, svg_markup, difficulty) VALUES('CIRCLES6', (SELECT fill_group_id FROM fill_group WHERE fill_group_name = 'CIRCLE DOT'),'circles-6','PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd3aGl0ZScgLz4KICA8Y2lyY2xlIGN4PSczLjUnIGN5PSczLjUnIHI9JzMuNScgZmlsbD0nIzU1OTRlNycvPgo8L3N2Zz4K','<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'10\'>
  <rect width=\'10\' height=\'10\' fill=\'WHITE\' />
  <circle cx=\'3.5\' cy=\'3.5\' r=\'3.5\' fill=\'#ZZZZZZ\'/>
</svg>
',100);
INSERT INTO fill(fill_name, fill_group_id, svg_pattern_id, svg_base64, svg_markup, difficulty) VALUES('CIRCLES9', (SELECT fill_group_id FROM fill_group WHERE fill_group_name = 'CIRCLE DOT'),'circles-9','PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd3aGl0ZScgLz4KICA8Y2lyY2xlIGN4PSc1JyBjeT0nNScgcj0nNScgZmlsbD0nIzU1OTRlNycvPgo8L3N2Zz4=','<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'10\'>
  <rect width=\'10\' height=\'10\' fill=\'WHITE\' />
  <circle cx=\'5\' cy=\'5\' r=\'5\' fill=\'#ZZZZZZ\'/>
</svg>',100);
INSERT INTO fill(fill_name, fill_group_id, svg_pattern_id, svg_base64, svg_markup, difficulty) VALUES('DIAGONALSTRIPE2', (SELECT fill_group_id FROM fill_group WHERE fill_group_name = 'DIAGONAL STRIPE'),'diagonal-stripe-2','PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd3aGl0ZScvPgogIDxwYXRoIGQ9J00tMSwxIGwyLC0yCiAgICAgICAgICAgTTAsMTAgbDEwLC0xMAogICAgICAgICAgIE05LDExIGwyLC0yJyBzdHJva2U9JyM1NTk0ZTcnIHN0cm9rZS13aWR0aD0nMicvPgo8L3N2Zz4=','<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'10\'>
  <rect width=\'10\' height=\'10\' fill=\'WHITE\'/>
  <path d=\'M-1,1 l2,-2
           M0,10 l10,-10
           M9,11 l2,-2\' stroke=\'#ZZZZZZ\' stroke-width=\'2\'/>
</svg>',100);
INSERT INTO fill(fill_name, fill_group_id, svg_pattern_id, svg_base64, svg_markup, difficulty) VALUES('DIAGONALSTRIPE4', (SELECT fill_group_id FROM fill_group WHERE fill_group_name = 'DIAGONAL STRIPE'),'diagonal-stripe-4','PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPScjNTU5NGU3Jy8+CiAgPHBhdGggZD0nTS0xLDEgbDIsLTIKICAgICAgICAgICBNMCwxMCBsMTAsLTEwCiAgICAgICAgICAgTTksMTEgbDIsLTInIHN0cm9rZT0nd2hpdGUnIHN0cm9rZS13aWR0aD0nMycvPgo8L3N2Zz4=','<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'10\'>
  <rect width=\'10\' height=\'10\' fill=\'#ZZZZZZ\'/>
  <path d=\'M-1,1 l2,-2
           M0,10 l10,-10
           M9,11 l2,-2\' stroke=\'WHITE\' stroke-width=\'3\'/>
</svg>',100);
INSERT INTO fill(fill_name, fill_group_id, svg_pattern_id, svg_base64, svg_markup, difficulty) VALUES('DOTS2', (SELECT fill_group_id FROM fill_group WHERE fill_group_name = 'SQUARE DOT'),'dots-2','PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd3aGl0ZScgLz4KICA8cmVjdCB4PScwJyB5PScwJyB3aWR0aD0nMicgaGVpZ2h0PScyJyBmaWxsPScjNTU5NGU3JyAvPgo8L3N2Zz4=','<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'10\'>
  <rect width=\'10\' height=\'10\' fill=\'WHITE\' />
  <rect x=\'0\' y=\'0\' width=\'2\' height=\'2\' fill=\'#ZZZZZZ\' />
</svg>',100);
INSERT INTO fill(fill_name, fill_group_id, svg_pattern_id, svg_base64, svg_markup, difficulty) VALUES('DOTS5', (SELECT fill_group_id FROM fill_group WHERE fill_group_name = 'SQUARE DOT'),'dots-5','PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd3aGl0ZScgLz4KICA8cmVjdCB4PScwJyB5PScwJyB3aWR0aD0nNScgaGVpZ2h0PSc1JyBmaWxsPScjNTU5NGU3JyAvPgo8L3N2Zz4=','<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'10\'>
  <rect width=\'10\' height=\'10\' fill=\'WHITE\' />
  <rect x=\'0\' y=\'0\' width=\'5\' height=\'5\' fill=\'#ZZZZZZ\' />
</svg>',100);
INSERT INTO fill(fill_name, fill_group_id, svg_pattern_id, svg_base64, svg_markup, difficulty) VALUES('DOTS8', (SELECT fill_group_id FROM fill_group WHERE fill_group_name = 'SQUARE DOT'),'dots-8','PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd3aGl0ZScgLz4KICA8cmVjdCB4PScwJyB5PScwJyB3aWR0aD0nOCcgaGVpZ2h0PSc4JyBmaWxsPScjNTU5NGU3JyAvPgo8L3N2Zz4=','<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'10\'>
  <rect width=\'10\' height=\'10\' fill=\'WHITE\' />
  <rect x=\'0\' y=\'0\' width=\'8\' height=\'8\' fill=\'#ZZZZZZ\' />
</svg>',100);
INSERT INTO fill(fill_name, fill_group_id, svg_pattern_id, svg_base64, svg_markup, difficulty) VALUES('HORIZONTALSTRIPE2', (SELECT fill_group_id FROM fill_group WHERE fill_group_name = 'HORIZONTAL STRIPE'),'horizontal-stripe-2','PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd3aGl0ZScgLz4KICA8cmVjdCB4PScwJyB5PScwJyB3aWR0aD0nMTAnIGhlaWdodD0nMicgZmlsbD0nIzU1OTRlNycgLz4KPC9zdmc+','<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'10\'>
  <rect width=\'10\' height=\'10\' fill=\'WHITE\' />
  <rect x=\'0\' y=\'0\' width=\'10\' height=\'2\' fill=\'#ZZZZZZ\' />
</svg>',100);
INSERT INTO fill(fill_name, fill_group_id, svg_pattern_id, svg_base64, svg_markup, difficulty) VALUES('HORIZONTALSTRIPE5', (SELECT fill_group_id FROM fill_group WHERE fill_group_name = 'HORIZONTAL STRIPE'),'horizontal-stripe-5','PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd3aGl0ZScgLz4KICA8cmVjdCB4PScwJyB5PScwJyB3aWR0aD0nMTAnIGhlaWdodD0nNScgZmlsbD0nIzU1OTRlNycgLz4KPC9zdmc+','<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'10\'>
  <rect width=\'10\' height=\'10\' fill=\'WHITE\' />
  <rect x=\'0\' y=\'0\' width=\'10\' height=\'5\' fill=\'#ZZZZZZ\' />
</svg>',100);
INSERT INTO fill(fill_name, fill_group_id, svg_pattern_id, svg_base64, svg_markup, difficulty) VALUES('HORIZONTALSTRIPE8', (SELECT fill_group_id FROM fill_group WHERE fill_group_name = 'HORIZONTAL STRIPE'),'horizontal-stripe-8','PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd3aGl0ZScgLz4KICA8cmVjdCB4PScwJyB5PScwJyB3aWR0aD0nMTAnIGhlaWdodD0nOCcgZmlsbD0nIzU1OTRlNycgLz4KPC9zdmc+','<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'10\'>
  <rect width=\'10\' height=\'10\' fill=\'WHITE\' />
  <rect x=\'0\' y=\'0\' width=\'10\' height=\'8\' fill=\'#ZZZZZZ\' />
</svg>',100);
INSERT INTO fill(fill_name, fill_group_id, svg_pattern_id, svg_base64, svg_markup, difficulty) VALUES('VERTICALSTRIPE1', (SELECT fill_group_id FROM fill_group WHERE fill_group_name = 'VERTICAL STRIPE'),'vertical-stripe-1','PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd3aGl0ZScgLz4KICA8cmVjdCB4PScwJyB5PScwJyB3aWR0aD0nMScgaGVpZ2h0PScxMCcgZmlsbD0nIzU1OTRlNycgLz4KPC9zdmc+','<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'10\'>
  <rect width=\'10\' height=\'10\' fill=\'WHITE\' />
  <rect x=\'0\' y=\'0\' width=\'1\' height=\'10\' fill=\'#ZZZZZZ\' />
</svg>
',100);
INSERT INTO fill(fill_name, fill_group_id, svg_pattern_id, svg_base64, svg_markup, difficulty) VALUES('VERTICALSTRIPE4', (SELECT fill_group_id FROM fill_group WHERE fill_group_name = 'VERTICAL STRIPE'),'vertical-stripe-4','PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd3aGl0ZScgLz4KICA8cmVjdCB4PScwJyB5PScwJyB3aWR0aD0nNCcgaGVpZ2h0PScxMCcgZmlsbD0nIzU1OTRlNycgLz4KPC9zdmc+','<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'10\'>
  <rect width=\'10\' height=\'10\' fill=\'WHITE\' />
  <rect x=\'0\' y=\'0\' width=\'4\' height=\'10\' fill=\'#ZZZZZZ\' />
</svg>',100);
INSERT INTO fill(fill_name, fill_group_id, svg_pattern_id, svg_base64, svg_markup, difficulty) VALUES('VERTICALSTRIPE7', (SELECT fill_group_id FROM fill_group WHERE fill_group_name = 'VERTICAL STRIPE'),'vertical-stripe-7','PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSd3aGl0ZScgLz4KICA8cmVjdCB4PScwJyB5PScwJyB3aWR0aD0nNycgaGVpZ2h0PScxMCcgZmlsbD0nIzU1OTRlNycgLz4KPC9zdmc+','<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'10\'>
  <rect width=\'10\' height=\'10\' fill=\'WHITE\' />
  <rect x=\'0\' y=\'0\' width=\'7\' height=\'10\' fill=\'#ZZZZZZ\' />
</svg>',100);
INSERT INTO fill(fill_name, fill_group_id, svg_pattern_id, svg_base64, svg_markup, difficulty) VALUES('CROSSHATCH1', (SELECT fill_group_id FROM fill_group WHERE fill_group_name = 'CROSSHATCH'),'crosshatch-1','PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc4JyBoZWlnaHQ9JzgnPgogIDxyZWN0IHdpZHRoPSc4JyBoZWlnaHQ9JzgnIGZpbGw9JyNmZmYnLz4KICA8cGF0aCBkPSdNMCAwTDggOFpNOCAwTDAgOFonIHN0cm9rZS13aWR0aD0nMC41JyBzdHJva2U9JyNhYWEnLz4KPC9zdmc+Cg==','<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'8\' height=\'8\'>
  <rect width=\'8\' height=\'8\' fill=\'WHITE\'/>
  <path d=\'M0 0L8 8ZM8 0L0 8Z\' stroke-width=\'0.5\' stroke=\'#ZZZZZZ\'/>
</svg>',100);
/*INSERT INTO fill(fill_name, fill_group_id, svg_pattern_id, svg_base64, svg_markup, difficulty) VALUES('carbon-1', (SELECT fill_group_id FROM fill_group WHERE fill_group_name = 'CARBON'),'carbon-1','PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHhtbG5zOnhsaW5rPSdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJyB3aWR0aD0nNicgaGVpZ2h0PSc2Jz4KICA8cmVjdCB3aWR0aD0nNicgaGVpZ2h0PSc2JyBmaWxsPScjZWVlZWVlJy8+CiAgPGcgaWQ9J2MnPgogICAgPHJlY3Qgd2lkdGg9JzMnIGhlaWdodD0nMycgZmlsbD0nI2U2ZTZlNicvPgogICAgPHJlY3QgeT0nMScgd2lkdGg9JzMnIGhlaWdodD0nMicgZmlsbD0nI2Q4ZDhkOCcvPgogIDwvZz4KICA8dXNlIHhsaW5rOmhyZWY9JyNjJyB4PSczJyB5PSczJy8+Cjwvc3ZnPg==','<svg xmlns=\'http://www.w3.org/2000/svg\' xmlns:xlink=\'http://www.w3.org/1999/xlink\' width=\'6\' height=\'6\'>
  <rect width=\'6\' height=\'6\' fill=\'WHITE\'/>
  <g id=\'c\'>
    <rect width=\'3\' height=\'3\' fill=\'WHITE\'/>
    <rect y=\'1\' width=\'3\' height=\'2\' fill=\'#ZZZZZZ\'/>
  </g>
  <use xlink:href=\'#c\' x=\'3\' y=\'3\'/>
</svg>',100);*/
INSERT INTO fill(fill_name, fill_group_id, svg_pattern_id, svg_base64, svg_markup, difficulty) VALUES('HOUNDSTOOTH1', (SELECT fill_group_id FROM fill_group WHERE fill_group_name = 'HOUNDSTOOTH'),'houndstooth-1','PHN2ZyB3aWR0aD0nMTAnIGhlaWdodD0nMTAnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+CiAgPHBhdGggZD0nTTAgMEw0IDQnIHN0cm9rZT0nI2FhYScgZmlsbD0nI2FhYScgc3Ryb2tlLXdpZHRoPScxJy8+CiAgPHBhdGggZD0nTTIuNSAwTDUgMi41TDUgNUw5IDlMNSA1TDEwIDVMMTAgMCcgc3Ryb2tlPScjYWFhJyBmaWxsPScjYWFhJyBzdHJva2Utd2lkdGg9JzEnLz4KICA8cGF0aCBkPSdNNSAxMEw1IDcuNUw3LjUgMTAnIHN0cm9rZT0nI2FhYScgZmlsbD0nI2FhYScgc3Ryb2tlLXdpZHRoPScxJy8+Cjwvc3ZnPgo=','<svg width=\'10\' height=\'10\' xmlns=\'http://www.w3.org/2000/svg\'>
  <path d=\'M0 0L4 4\' stroke=\'#ZZZZZZ\' fill=\'#ZZZZZZ\' stroke-width=\'1\'/>
  <path d=\'M2.5 0L5 2.5L5 5L9 9L5 5L10 5L10 0\' stroke=\'#ZZZZZZ\' fill=\'#ZZZZZZ\' stroke-width=\'1\'/>
  <path d=\'M5 10L5 7.5L7.5 10\' stroke=\'#ZZZZZZ\' fill=\'#ZZZZZZ\' stroke-width=\'1\'/>
</svg>',100);

CREATE TABLE meta_shape (
  meta_shape_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  meta_shape_name VARCHAR(50),
  insert_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
INSERT INTO meta_shape(meta_shape_name) VALUES('s1');
INSERT INTO meta_shape(meta_shape_name) VALUES('s2');
INSERT INTO meta_shape(meta_shape_name) VALUES('s3');

CREATE TABLE shape_group (
  shape_group_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  shape_group_name VARCHAR(50),
  active_flag BOOLEAN DEFAULT TRUE,
  insert_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
INSERT INTO shape_group(shape_group_name) VALUES('TRIANGLE');
INSERT INTO shape_group(shape_group_name) VALUES('QUADRILATERAL');
INSERT INTO shape_group(shape_group_name) VALUES('PENTAGON');
INSERT INTO shape_group(shape_group_name) VALUES('HEXAGON');
INSERT INTO shape_group(shape_group_name) VALUES('HEPTAGON AND HIGHER');
INSERT INTO shape_group(shape_group_name) VALUES('STANDARD SYMBOL');

CREATE TABLE shape (
  shape_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  shape_name VARCHAR(50),
  shape_group_id INTEGER,
  svg_tag     VARCHAR(50) NOT NULL,
  svg_attribute_value VARCHAR(800) NOT NULL,
  difficulty INTEGER,
  active_flag BOOLEAN DEFAULT TRUE,
  insert_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
INSERT INTO shape(shape_name, shape_group_id, svg_tag, svg_attribute_value, difficulty) VALUES('ISOSCELES', (SELECT shape_group_id FROM shape_group WHERE shape_group_name = 'TRIANGLE'), 'polygon', '25 5, 5 45, 45 45',100);
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
INSERT INTO shape(shape_name, shape_group_id, svg_tag, svg_attribute_value, difficulty) VALUES('CIRCLE', (SELECT shape_group_id FROM shape_group WHERE shape_group_name = 'STANDARD SYMBOL'), 'circle', '50 at 50 50',100);
INSERT INTO shape(shape_name, shape_group_id, svg_tag, svg_attribute_value, difficulty) VALUES('ELLIPSE', (SELECT shape_group_id FROM shape_group WHERE shape_group_name = 'STANDARD SYMBOL'), 'ellipse', '25 40 at 50 50',100);
INSERT INTO shape(shape_name, shape_group_id, svg_tag, svg_attribute_value, difficulty) VALUES('CRESCENTL', (SELECT shape_group_id FROM shape_group WHERE shape_group_name = 'STANDARD SYMBOL'), 'path', 'M50 20A40 40 0 1 0 50 70 30 30 0 1 1 50 20z',100);
UPDATE shape SET active_flag = 0 WHERE shape_group_id IN (SELECT shape_group_id FROM shape_group WHERE shape_group_name IN ('HEPTAGON AND HIGHER','STANDARD SYMBOL'));

CREATE TABLE card (
  card_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  card_name VARCHAR(200),
  meta_count_id INTEGER NOT NULL,
  meta_color_id INTEGER NOT NULL,
  meta_fill_id INTEGER NOT NULL,
  meta_shape_id INTEGER NOT NULL,
  insert_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE puzzle (
  puzzle_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  puzzle_name VARCHAR(200),
  solution_id INTEGER NOT NULL,
  active_flag BOOLEAN DEFAULT TRUE,
  insert_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE puzzle_card (
  puzzle_card_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  puzzle_id INTEGER NOT NULL,
  card_id INTEGER NOT NULL,
  active_flag BOOLEAN DEFAULT TRUE,
  insert_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE solution_set (
  solution_set_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  solution_set_code VARCHAR(50) NOT NULL,
  card_id INTEGER NOT NULL,
  insert_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE solution (
  solution_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  insert_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE solution_group (
  solution_group_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  solution_id INTEGER NOT NULL,
  solution_set_code VARCHAR(50),
  insert_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  update_date DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create all possible cards
-- CALL generateCard();

-- Create all possible solution sets
-- CALL generateSolutionSet();

-- Create any number of puzzles (exactly 12 cards with 1 solution group/6 solution sets)
-- CALL generatePuzzle(p_amount INT);
