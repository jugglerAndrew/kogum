<?php
require_once 'auth.php';
global $user_id;
$ms = (int)$_GET["time"];
$puzzle_game_id = (int)$_SESSION["puzzle_game_id"];

require_once 'db.php';
//Save game completion time for user
$query = $connection->prepare("UPDATE user_game SET game_completion_ms = getElapsedTimeByMs(?), update_date = sysdate WHERE puzzle_game_id = ? AND user_id = ? AND game_completion_ms IS NULL;");
$query->bind_param("sii", $ms, $puzzle_game_id, $user_id);
$query->execute();
$query->close();

header('Location: ../profile.php?user_id='.$user_id);
?>