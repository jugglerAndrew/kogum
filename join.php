<?php
$username = null;
$email = null;
$password = null;

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
	
	require_once('/models/db.php');
	
	if(!empty($_POST["username"]) && !empty($_POST["email"]) && !empty($_POST["password"])) {
		$username = $_POST["username"];
		$email = $_POST["email"];		
		$password = $_POST["password"];
		
		$query = $connection->prepare("INSERT INTO `users` ( `user_name`, `user_password`, `user_email`) VALUES (?, PASSWORD(?), ?);");
		$query->bind_param("sss", $username, $password, $email);
		$query->execute();
		$query->close();		
		
		header('Location: login.php');		
	} else {
		header('Location: join.php');
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
      <div id="game_header">
        <div class="col-12">
			<?php require_once('nav.php'); ?>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-1">
        <div class="center">
			<h1>j<span class="empty_set">&#248;</span>in</h1>
			<form id="join" method="post">
				<label for="username">Username:</label>
				<input id="username" name="username" type="text" required>
				<label for="email">Email:</label>
				<input id="email" name="email" type="text" required>				
				<label for="password">Password:</label>
				<input id="password" name="password" type="password" required>					
				<br />
				<input type="submit" value="Join">
			</form>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
<?php } ?>
