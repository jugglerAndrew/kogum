DELIMITER //
DROP PROCEDURE IF EXISTS generateSolutionSet //
CREATE PROCEDURE generateSolutionSet() -- (IN p_color_code INT, IN p_fill_id INT, IN p_shape_id INT)
BEGIN
  DECLARE not_found INT DEFAULT FALSE;
  DECLARE v_card_a, v_card_b, v_card_c INT;
  DECLARE v_set_code, v_id, v_sol_exists, v_potential INT;

  DECLARE c_color CURSOR FOR
    SELECT meta_color_id FROM meta_color WHERE active_flag = 1 AND meta_color_id IN (1,2,3); -- p_color_id;
  DECLARE c_fill CURSOR FOR
    SELECT meta_fill_id FROM meta_fill WHERE active_flag = 1 AND meta_fill_id IN (1,2,3);
  DECLARE c_shape CURSOR FOR
    SELECT meta_shape_id FROM meta_shape WHERE active_flag = 1 AND meta_shape_id IN (1,2,3);

  DECLARE c_proc_pool CURSOR FOR
    SELECT a.card_id card_a, b.card_id card_b, c.card_id card_c
    FROM card a
    CROSS JOIN card b
    CROSS JOIN card c;

  DECLARE c_temp_sort CURSOR FOR
    SELECT card_id
    FROM temp_sort
    ORDER BY card_id ASC;

  DECLARE c_validate_sol CURSOR FOR SELECT COUNT(1) FROM
    (SELECT * FROM card WHERE card_id = v_card_a) a,
    (SELECT * FROM card WHERE card_id = v_card_b) b,
    (SELECT * FROM card WHERE card_id = v_card_c) c
    WHERE ( (a.meta_count_id != b.meta_count_id AND b.meta_count_id != c.meta_count_id AND a.meta_count_id != c.meta_count_id)
      AND (a.meta_color_id = b.meta_color_id AND b.meta_color_id = c.meta_color_id AND a.meta_color_id = c.meta_color_id)
      AND (a.meta_fill_id = b.meta_fill_id AND b.meta_fill_id = c.meta_fill_id AND a.meta_fill_id = c.meta_fill_id)
      AND (a.meta_shape_id = b.meta_shape_id AND b.meta_shape_id = c.meta_shape_id AND a.meta_shape_id = c.meta_shape_id) )
    OR ( (a.meta_count_id != b.meta_count_id AND b.meta_count_id != c.meta_count_id AND a.meta_count_id != c.meta_count_id)
      AND (a.meta_color_id != b.meta_color_id AND b.meta_color_id != c.meta_color_id AND a.meta_color_id != c.meta_color_id)
      AND (a.meta_fill_id = b.meta_fill_id AND b.meta_fill_id = c.meta_fill_id AND a.meta_fill_id = c.meta_fill_id)
      AND (a.meta_shape_id = b.meta_shape_id AND b.meta_shape_id = c.meta_shape_id AND a.meta_shape_id = c.meta_shape_id) )
    OR ( (a.meta_count_id != b.meta_count_id AND b.meta_count_id != c.meta_count_id AND a.meta_count_id != c.meta_count_id)
      AND (a.meta_color_id != b.meta_color_id AND b.meta_color_id != c.meta_color_id AND a.meta_color_id != c.meta_color_id)
      AND (a.meta_fill_id = b.meta_fill_id AND b.meta_fill_id = c.meta_fill_id AND a.meta_fill_id = c.meta_fill_id)
      AND (a.meta_shape_id = b.meta_shape_id AND b.meta_shape_id = c.meta_shape_id AND a.meta_shape_id = c.meta_shape_id) )
    OR (  (a.meta_count_id != b.meta_count_id AND b.meta_count_id != c.meta_count_id AND a.meta_count_id != c.meta_count_id)
      AND (a.meta_color_id != b.meta_color_id AND b.meta_color_id != c.meta_color_id AND a.meta_color_id != c.meta_color_id)
      AND (a.meta_fill_id != b.meta_fill_id AND b.meta_fill_id != c.meta_fill_id AND a.meta_fill_id != c.meta_fill_id)
      AND (a.meta_shape_id = b.meta_shape_id AND b.meta_shape_id = c.meta_shape_id AND a.meta_shape_id = c.meta_shape_id) )
    OR (  (a.meta_count_id != b.meta_count_id AND b.meta_count_id != c.meta_count_id AND a.meta_count_id != c.meta_count_id)
      AND (a.meta_color_id != b.meta_color_id AND b.meta_color_id != c.meta_color_id AND a.meta_color_id != c.meta_color_id)
      AND (a.meta_fill_id != b.meta_fill_id AND b.meta_fill_id != c.meta_fill_id AND a.meta_fill_id != c.meta_fill_id)
      AND (a.meta_shape_id != b.meta_shape_id AND b.meta_shape_id != c.meta_shape_id AND a.meta_shape_id != c.meta_shape_id) )
    OR (  (a.meta_count_id = b.meta_count_id AND b.meta_count_id = c.meta_count_id AND a.meta_count_id = c.meta_count_id)
      AND (a.meta_color_id != b.meta_color_id AND b.meta_color_id != c.meta_color_id AND a.meta_color_id != c.meta_color_id)
      AND (a.meta_fill_id != b.meta_fill_id AND b.meta_fill_id != c.meta_fill_id AND a.meta_fill_id != c.meta_fill_id)
      AND (a.meta_shape_id != b.meta_shape_id AND b.meta_shape_id != c.meta_shape_id AND a.meta_shape_id != c.meta_shape_id) )
    OR (  (a.meta_count_id = b.meta_count_id AND b.meta_count_id = c.meta_count_id AND a.meta_count_id = c.meta_count_id)
      AND (a.meta_color_id = b.meta_color_id AND b.meta_color_id = c.meta_color_id AND a.meta_color_id = c.meta_color_id)
      AND (a.meta_fill_id != b.meta_fill_id AND b.meta_fill_id != c.meta_fill_id AND a.meta_fill_id != c.meta_fill_id)
      AND (a.meta_shape_id != b.meta_shape_id AND b.meta_shape_id != c.meta_shape_id AND a.meta_shape_id != c.meta_shape_id) )
    OR (  (a.meta_count_id = b.meta_count_id AND b.meta_count_id = c.meta_count_id AND a.meta_count_id = c.meta_count_id)
      AND (a.meta_color_id = b.meta_color_id AND b.meta_color_id = c.meta_color_id AND a.meta_color_id = c.meta_color_id)
      AND (a.meta_fill_id = b.meta_fill_id AND b.meta_fill_id = c.meta_fill_id AND a.meta_fill_id = c.meta_fill_id)
      AND (a.meta_shape_id != b.meta_shape_id AND b.meta_shape_id != c.meta_shape_id AND a.meta_shape_id != c.meta_shape_id) )
    OR (  (a.meta_count_id != b.meta_count_id AND b.meta_count_id != c.meta_count_id AND a.meta_count_id != c.meta_count_id)
      AND (a.meta_color_id = b.meta_color_id AND b.meta_color_id = c.meta_color_id AND a.meta_color_id = c.meta_color_id)
      AND (a.meta_fill_id = b.meta_fill_id AND b.meta_fill_id = c.meta_fill_id AND a.meta_fill_id = c.meta_fill_id)
      AND (a.meta_shape_id != b.meta_shape_id AND b.meta_shape_id != c.meta_shape_id AND a.meta_shape_id != c.meta_shape_id) )
    OR (  (a.meta_count_id = b.meta_count_id AND b.meta_count_id = c.meta_count_id AND a.meta_count_id = c.meta_count_id)
      AND (a.meta_color_id != b.meta_color_id AND b.meta_color_id != c.meta_color_id AND a.meta_color_id != c.meta_color_id)
      AND (a.meta_fill_id = b.meta_fill_id AND b.meta_fill_id = c.meta_fill_id AND a.meta_fill_id = c.meta_fill_id)
      AND (a.meta_shape_id != b.meta_shape_id AND b.meta_shape_id != c.meta_shape_id AND a.meta_shape_id != c.meta_shape_id) )
    OR (  (a.meta_count_id != b.meta_count_id AND b.meta_count_id != c.meta_count_id AND a.meta_count_id != c.meta_count_id)
      AND (a.meta_color_id = b.meta_color_id AND b.meta_color_id = c.meta_color_id AND a.meta_color_id = c.meta_color_id)
      AND (a.meta_fill_id != b.meta_fill_id AND b.meta_fill_id != c.meta_fill_id AND a.meta_fill_id != c.meta_fill_id)
      AND (a.meta_shape_id = b.meta_shape_id AND b.meta_shape_id = c.meta_shape_id AND a.meta_shape_id = c.meta_shape_id) )
    OR (  (a.meta_count_id = b.meta_count_id AND b.meta_count_id = c.meta_count_id AND a.meta_count_id = c.meta_count_id)
      AND (a.meta_color_id != b.meta_color_id AND b.meta_color_id != c.meta_color_id AND a.meta_color_id != c.meta_color_id)
      AND (a.meta_fill_id != b.meta_fill_id AND b.meta_fill_id != c.meta_fill_id AND a.meta_fill_id != c.meta_fill_id)
      AND (a.meta_shape_id = b.meta_shape_id AND b.meta_shape_id = c.meta_shape_id AND a.meta_shape_id = c.meta_shape_id) )
    OR (  (a.meta_count_id = b.meta_count_id AND b.meta_count_id = c.meta_count_id AND a.meta_count_id = c.meta_count_id)
      AND (a.meta_color_id != b.meta_color_id AND b.meta_color_id != c.meta_color_id AND a.meta_color_id != c.meta_color_id)
      AND (a.meta_fill_id = b.meta_fill_id AND b.meta_fill_id = c.meta_fill_id AND a.meta_fill_id = c.meta_fill_id)
      AND (a.meta_shape_id = b.meta_shape_id AND b.meta_shape_id = c.meta_shape_id AND a.meta_shape_id = c.meta_shape_id) )
      OR (  (a.meta_count_id = b.meta_count_id AND b.meta_count_id = c.meta_count_id AND a.meta_count_id = c.meta_count_id)
        AND (a.meta_color_id = b.meta_color_id AND b.meta_color_id = c.meta_color_id AND a.meta_color_id = c.meta_color_id)
        AND (a.meta_fill_id != b.meta_fill_id AND b.meta_fill_id != c.meta_fill_id AND a.meta_fill_id != c.meta_fill_id)
        AND (a.meta_shape_id = b.meta_shape_id AND b.meta_shape_id = c.meta_shape_id AND a.meta_shape_id = c.meta_shape_id) );

  DECLARE CONTINUE HANDLER FOR NOT FOUND SET not_found = TRUE;

  CREATE TEMPORARY TABLE IF NOT EXISTS temp_sort(card_id INT);

  -- Loop through all potential meta solution sets
  OPEN c_proc_pool;
  pool_loop: LOOP
    SET not_found = FALSE;
    FETCH c_proc_pool INTO v_card_a, v_card_b, v_card_c;
    IF not_found THEN
      LEAVE pool_loop;
    END IF;

    -- Validate potential meta solution set
    OPEN c_validate_sol;
    FETCH c_validate_sol INTO v_potential;
    CLOSE c_validate_sol;

    IF v_potential > 0 THEN
      SET v_set_code = '';
      SET not_found = FALSE;
      SET v_sol_exists = 0;
      SET v_potential = 0;

      -- Insert into a table and then order by ascending to create a sorted "code"
      INSERT INTO temp_sort VALUES(v_card_a);
      INSERT INTO temp_sort VALUES(v_card_b);
      INSERT INTO temp_sort VALUES(v_card_c);

      -- Sort meta solution set
      OPEN c_temp_sort;
      sort_loop: LOOP
        SET not_found = FALSE;
        FETCH c_temp_sort INTO v_id;
        IF not_found THEN
          LEAVE sort_loop;
        END IF;
        SET v_set_code = concat(v_set_code, CAST(v_id AS CHAR(50)));
      END LOOP;
      CLOSE c_temp_sort;
      SET not_found = FALSE;
      TRUNCATE TABLE temp_sort;

      -- Check if meta solution set already exists
      SELECT COUNT(1) INTO v_sol_exists FROM solution_set WHERE solution_set_code = v_set_code;

      -- Insert meta solution set
      IF v_sol_exists = 0 THEN
        INSERT INTO solution_set(card_id, solution_set_code)
          SELECT v_card_a, v_set_code
          UNION
          SELECT v_card_b, v_set_code
          UNION
          SELECT v_card_c, v_set_code;
      END IF;

    END IF;

  END LOOP pool_loop;
  CLOSE c_proc_pool;
  SET not_found = FALSE;

END//
DELIMITER ;
