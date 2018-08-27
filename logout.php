<?php
	require_once('/models/db.php');

	session_start();
	$session_key = session_id();

	//Get session info
	$query = $connection->prepare("SELECT `sessions`.`session_id`, `users`.`user_id`, `users`.`user_name` FROM `sessions` JOIN `users` ON `sessions`.user_id = `users`.user_id WHERE `sessions`.`session_key` = ? AND `sessions`.`session_address` = ? AND `sessions`.`session_useragent` = ? AND `sessions`.`session_expire_date` > NOW();");
	$query->bind_param("sss", $session_key, $_SERVER['REMOTE_ADDR'], $_SERVER['HTTP_USER_AGENT']);
	$query->execute();
	$query->bind_result($session_id, $user_id, $user_name);
	$query->fetch();
	$query->close();
	
	
	if(!empty($session_id)) {
		$query = $connection->prepare("DELETE FROM `sessions` WHERE `session_id` = ?;");
		$query->bind_param("i", $session_id);
		$query->execute();
		$query->close();		
	} 
	
	header('Location: ../login.php');
?>
