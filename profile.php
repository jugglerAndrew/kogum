<?php
	require_once 'models/db.php';
	
	//Get user info
	$user_id = htmlspecialchars($_GET["user_id"]);
	$query = $connection->prepare("SELECT user_name, user_register_date FROM `users` WHERE `users`.`user_id` = ?;");
	$query->bind_param("s", $user_id);
	$query->execute();
	$query->bind_result($user_name, $user_register_date);
	$query->fetch();
  $query->close();

  //Get daily puzzles and user status
  $result = $connection->query(
    "SELECT pg.puzzle_game_id, d.difficulty_name, pg.start_date, pg.end_date, getElapsedTimeByMs(ug.game_completion_ms) game_completion_time, ug.update_date game_completed_date, IF(date(start_date) < date(SYSDATE()),FALSE,TRUE) today_flag
    FROM puzzle_game pg 
    JOIN difficulty d ON pg.difficulty = d.difficulty_id
    LEFT OUTER JOIN user_game ug ON pg.puzzle_game_id = ug.puzzle_game_id AND ug.user_id = ".$user_id."
    WHERE DATE(SYSDATE()) BETWEEN DATE(pg.start_date) AND DATE(pg.end_date)
    ORDER BY pg.start_date ASC"
  );
  for ($daily = array (); $row = $result->fetch_assoc(); $daily[] = $row);
  $result->close();

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
			<?php require_once 'nav.php'; ?>
		</div>
    </div>
    <div class="row">
      <div class="col-12">
        <div class="center">
          <h1><?php echo $user_name; ?></h1>
          <p>user since <?php echo $user_register_date; ?></p>
          <p>YESTERDAY</p>
          <?php
            foreach ($daily as $r) {
              if ($r['today_flag'] == '0') 
              {
                echo $r['difficulty_name'].' @ '.$r['game_completion_time'].'<br/>';
              } 
            }
          ?>
          <p>TODAY</p>
          <?php
            foreach ($daily as $r) {
              if ($r['today_flag'] == '1') 
              {
                echo $r['difficulty_name'].' @ '.$r['game_completion_time'].'<br/>';
              } 
            }
          ?>          
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
