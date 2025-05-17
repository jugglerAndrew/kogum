DELIMITER //
DROP FUNCTION IF EXISTS getElapsedTimeByMs //
CREATE FUNCTION getElapsedTimeByMs(p_ms INTEGER) RETURNS VARCHAR(20)
    NOT DETERMINISTIC
BEGIN
	DECLARE hr, mins, sec, ms, ms_per_hr, ms_per_min, ms_per_sec INTEGER;
	
	SET ms_per_hr = 3600000;
	SET ms_per_min = 60000;
	SET ms_per_sec = 1000;
	
	SET hr = FLOOR((p_ms/(1000*60*60))%24);
	SET mins = FLOOR(((p_ms/(1000*60))%60));
	SET sec = FLOOR(((p_ms/1000)%60));
	SET ms = p_ms-(hr*ms_per_hr)-(mins*ms_per_min)-(sec*ms_per_sec);

	RETURN CONCAT(LPAD(hr,2,'0'), ':', LPAD(mins,2,'0'), ':', LPAD(sec,2,'0'), '.', LPAD(ms,3,'0'));
END//
DELIMITER ;