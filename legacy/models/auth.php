<?php
	session_start();
	$session_key = session_id();

	require_once('db.php');

	//Get session info
	$query = $connection->prepare("SELECT `sessions`.`session_id`, `users`.`user_id`, `users`.`user_name` FROM `sessions` JOIN `users` ON `sessions`.user_id = `users`.user_id WHERE `sessions`.`session_key` = ? AND `sessions`.`session_address` = ? AND `sessions`.`session_useragent` = ? AND `sessions`.`session_expire_date` > NOW();");
	$query->bind_param("sss", $session_key, $_SERVER['REMOTE_ADDR'], $_SERVER['HTTP_USER_AGENT']);
	$query->execute();
	$query->bind_result($session_id, $user_id, $user_name);
	$query->fetch();
	$query->close();

	if(!empty($user_id)) {
		//Update session expiry time
		$query = $connection->prepare("UPDATE `sessions` SET `session_expire_date` = DATE_ADD(NOW(),INTERVAL 1 DAY) WHERE `session_id` = ?;");
		$query->bind_param("i", $session_id );
		$query->execute();
		$query->close();
	}
?>
