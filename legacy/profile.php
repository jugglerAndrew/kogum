<?php
	require_once('/models/db.php');
	
	//Get user info
	$user_id = htmlspecialchars($_GET["user_id"]);
	$query = $connection->prepare("SELECT user_name, user_register_date FROM `users` WHERE `users`.`user_id` = ?;");
	$query->bind_param("s", $user_id);
	$query->execute();
	$query->bind_result($user_name, $user_register_date);
	$query->fetch();
	$query->close();

?>
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
      <div class="col-12">
        <div class="center">
          <h1><?php echo $user_name; ?></h1>
          <p>user since <?php echo $user_register_date; ?></p>
        </div>
      </div>
      <div class="col-6">
      </div>
      <div class="col-6">
      </div>
    </div>
  </div>
</body>
</html>
