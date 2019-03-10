DELIMITER //
DROP PROCEDURE IF EXISTS generatePuzzle //
/* Create abstract puzzles. */
CREATE PROCEDURE generatePuzzle(IN p_amount INT)
BEGIN
  DECLARE not_found INT DEFAULT FALSE;
  DECLARE v_set_ctr, v_card_ctr, v_i, v_sol_id, v_puz_id, v_card_id INT DEFAULT 0;
  DECLARE v_sol_set_code VARCHAR(50);

  DECLARE c_sol CURSOR FOR
    SELECT ss.solution_set_code
    FROM solution_set ss
    JOIN (SELECT card_id
          FROM solution_set
          ORDER BY RAND() LIMIT 12) d ON ss.card_id IN (d.card_id)
    GROUP BY ss.solution_set_code
    HAVING COUNT(DISTINCT ss.card_id) = 3
    ORDER BY NULL;

  DECLARE CONTINUE HANDLER FOR NOT FOUND SET not_found = TRUE;

  CREATE TEMPORARY TABLE IF NOT EXISTS temp_set(solution_set_code VARCHAR(50));
  CREATE TEMPORARY TABLE IF NOT EXISTS temp_card(card_id INTEGER);

  WHILE v_i < p_amount DO
    SET v_card_ctr = 0;

    -- Loop through
    OPEN c_sol;
    sol_loop: LOOP
      SET not_found = FALSE;
      FETCH c_sol INTO v_sol_set_code;
      IF not_found THEN
        LEAVE sol_loop;
      END IF;
      SET v_set_ctr = v_set_ctr + 1;
      INSERT INTO temp_set VALUES(v_sol_set_code);
      IF v_set_ctr > 6 THEN
        LEAVE sol_loop;
      END IF;
    END LOOP sol_loop;
    CLOSE c_sol;
    SET not_found = FALSE;

    IF v_set_ctr = 6 THEN
      -- Load all solution cards into temp table
      INSERT INTO temp_card SELECT DISTINCT card_id FROM solution_set WHERE solution_set_code IN (SELECT solution_set_code FROM temp_set);

      -- Determine how many filler cards are needed (filler cards populate the remaining open card slots but are part of no solution)
      SELECT COUNT(card_id) INTO v_card_ctr FROM temp_card;

      -- Populate filler cards
      WHILE v_card_ctr < 12 DO
        SELECT card_id INTO v_card_id -- get random card that does not interact with current solution
        FROM card
        WHERE card_id NOT IN (
          SELECT card_id -- get all cards that could interact with current solution
          FROM solution_set
          WHERE solution_set_code IN (
            SELECT solution_set_code -- get all potential solution sets that could interact with current solution
            FROM solution_set
            WHERE card_id IN (
              SELECT card_id -- get all cards in current solution
              FROM temp_card
            )
            GROUP BY solution_set_code HAVING count(card_id) > 1
          )
        )
        ORDER BY RAND()
        LIMIT 1;

        -- Add to puzzle cards
        INSERT INTO temp_card VALUES(v_card_id);

        SET v_card_ctr = v_card_ctr + 1;
      END WHILE;

      -- Create solution header
      INSERT INTO solution VALUES();
      SET v_sol_id = LAST_INSERT_ID();

      -- Create solution groups
      INSERT INTO solution_group(solution_id, solution_set_code) SELECT v_sol_id, solution_set_code FROM temp_set;
      SET v_i = v_i + 1;

      -- Create puzzle header
      INSERT INTO puzzle(solution_id) VALUES(v_sol_id);
      SET v_puz_id = LAST_INSERT_ID();

      -- Create puzzle cards
      INSERT INTO puzzle_card(puzzle_id, card_id) SELECT DISTINCT v_puz_id, card_id FROM temp_card;
    END IF;

    SET v_set_ctr = 0;
    TRUNCATE TABLE temp_set;
    TRUNCATE TABLE temp_card;

  END WHILE;

END//
DELIMITER ;
