DELIMITER //
DROP PROCEDURE IF EXISTS generatePuzzleGame //
/* Create actual instances of games for users to solve. */
CREATE PROCEDURE generatePuzzleGame(IN p_game_type INT, IN p_difficulty INT, IN p_amount INT)
/* Usage: generatePuzzleGame(1,200,100) will create 100 lunch puzzles */
BEGIN
	DECLARE not_found INT DEFAULT FALSE;
  DECLARE v_i, v_puzzle_id, v_puzzle_game_id INT DEFAULT 0;
	DECLARE v_max_start_date, v_max_start_time VARCHAR(20);
	DECLARE v_start_date, v_end_date DATETIME;
	
	DECLARE c_pz CURSOR FOR
		SELECT puzzle_id
		FROM puzzle
		ORDER BY RAND() LIMIT 1;
		
	DECLARE c_game CURSOR FOR
		SELECT MAX(puzzle_game_id)+1 max_id
		FROM puzzle_game;
		
	DECLARE c_start CURSOR FOR
		SELECT DATE_FORMAT(MAX(start_date),'%Y%m%d') max_start 
		FROM puzzle_game
		WHERE difficulty = p_difficulty;
		
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET not_found = TRUE;
			
  WHILE v_i < p_amount DO
	
		-- Get random puzzle id
		OPEN c_pz;
		FETCH c_pz INTO v_puzzle_id;
		CLOSE c_pz;
		
		OPEN c_game;
		FETCH c_game INTO v_puzzle_game_id;
		CLOSE c_game;
		
		IF v_puzzle_game_id IS NULL THEN
			SET v_puzzle_game_id = 1;
		END IF;
		
		-- Get max start date
		SET not_found = FALSE;
		OPEN c_start;		
		FETCH c_start INTO v_max_start_date;
		CLOSE c_start;
		
		IF v_max_start_date IS NULL THEN
			SET v_max_start_date = DATE_FORMAT(DATE_SUB(SYSDATE(), INTERVAL 1 DAY),'%Y%m%d');
		END IF;
		
		-- Get start time for each puzzle difficulty
		-- TODO:Should create a table for this
		IF p_difficulty = 100 THEN
			SET v_max_start_time = '040000';
		ELSEIF p_difficulty = 200 THEN
			SET v_max_start_time = '120000';
		ELSEIF p_difficulty = 300 THEN
			SET v_max_start_time = '200000';
		END IF;
		
		SET v_start_date = DATE_ADD(STR_TO_DATE(CONCAT(v_max_start_date,v_max_start_time),'%Y%m%d%k%i%s'), INTERVAL 1 DAY);
		SET v_end_date = DATE_ADD(v_start_date, INTERVAL 8 HOUR);
		
		INSERT INTO puzzle_game(puzzle_game_id, puzzle_id, game_id, difficulty, start_date, end_date)
			VALUES(v_puzzle_game_id, v_puzzle_id, p_game_type, p_difficulty, v_start_date, v_end_date);
		
		INSERT INTO game_color(puzzle_game_id, color_id)
			SELECT v_puzzle_game_id, color_id FROM color WHERE difficulty <= p_difficulty AND active_flag = 1 ORDER BY RAND() LIMIT 3;
		
		INSERT INTO game_fill(puzzle_game_id, fill_id)
			SELECT v_puzzle_game_id, fill_id FROM fill WHERE difficulty <= p_difficulty AND active_flag = 1 ORDER BY RAND() LIMIT 3;
		
		INSERT INTO game_shape(puzzle_game_id, shape_id)
			SELECT v_puzzle_game_id, shape_id FROM shape WHERE difficulty <= p_difficulty AND active_flag = 1 ORDER BY RAND() LIMIT 3;		
		
		SET v_i = v_i + 1;
		SET v_puzzle_game_id = v_puzzle_game_id + 1;
		
  END WHILE;
END//
DELIMITER ;