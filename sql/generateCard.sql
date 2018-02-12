DELIMITER //
DROP PROCEDURE IF EXISTS generateCard //
CREATE PROCEDURE generateCard()
BEGIN
  DECLARE done INT DEFAULT FALSE;
  DECLARE v_count_id, v_color_id, v_fill_id, v_shape_id INT;
  DECLARE v_meta_name VARCHAR(200);
  DECLARE c_meta CURSOR FOR
  SELECT CONCAT(n.meta_count_name,'_',c.meta_color_name,'_',f.meta_fill_name,'_',s.meta_shape_name) meta_name,
       n.meta_count_id, c.meta_color_id, f.meta_fill_id, s.meta_shape_id
    FROM meta_count n CROSS JOIN meta_color c CROSS JOIN meta_fill f CROSS JOIN meta_shape s;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

  OPEN c_meta;
  meta_loop: LOOP
    FETCH c_meta INTO v_meta_name, v_count_id, v_color_id, v_fill_id, v_shape_id;
    IF done THEN
      LEAVE meta_loop;
    END IF;
    INSERT INTO card(card_name, meta_count_id, meta_color_id, meta_fill_id, meta_shape_id)
    VALUES(v_meta_name, v_count_id, v_color_id, v_fill_id, v_shape_id);
  END LOOP;
  CLOSE c_meta;
END//
DELIMITER ;
