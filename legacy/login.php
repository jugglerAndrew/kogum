<?php
$username = null;
$password = null;

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
	
	require_once('/models/db.php');
	
	if(!empty($_POST["username"]) && !empty($_POST["password"])) {
		$username = $_POST["username"];
		$password = $_POST["password"];
	
		$query = $connection->prepare("SELECT `user_id` FROM `users` WHERE `user_name` = ? and `user_password` = PASSWORD(?)");
		$query->bind_param("ss", $username, $password);
		$query->execute();
		$query->bind_result($user_id);
		$query->fetch();
		$query->close();
		
		if(!empty($user_id)) {
			session_start();
			$session_key = session_id();
			$remote_addr = $_SERVER['REMOTE_ADDR'];
			$user_agent = $_SERVER['HTTP_USER_AGENT'];
			
			$query = $connection->prepare("INSERT INTO `sessions` ( `user_id`, `session_key`, `session_address`, `session_useragent`, `session_expire_date`) VALUES ( ?, ?, ?, ?, DATE_ADD(NOW(),INTERVAL 1 DAY) );");
			$query->bind_param("isss", $user_id, $session_key, $remote_addr, $user_agent);
			$query->execute();
			$query->close();
			
			
			header('Location: index.php');
			
		}
		else {
			header('Location: login.php');
		}
		
	} else {
		header('Location: login.php');
	}
} else {
?>
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" type="text/css" href="/styles/main.css">
  <link rel="stylesheet" type="text/css" href="/styles/simple-grid.css">
</head>
<body>
  <div id="tutorial" class="container">
    <div class="row">
        <div class="col-12">          
			<?php require_once('nav.php'); ?>
        </div>
    </div>
    <div class="row">
      <div class="col-1">
        <div class="center">
			<h1>l<span class="empty_set">&#248;</span>gin</h1>
			<form id="login" method="post">
			<label for="username">Username:</label>
			<input id="username" name="username" type="text" required>
			<label for="password">Password:</label>
			<input id="password" name="password" type="password" required>					
			<br />
			<input type="submit" value="Login">
			</form>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
<?php } ?>
