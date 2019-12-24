<ul class="nav">
<?php 
require_once 'models/auth.php';

if(isset($_SESSION['username'])) {
	//Authenticated
	echo '<li><a href="/profile.php?user_id='.$_SESSION['username'].'">'.$_SESSION['username'].'</a></li> ';
	echo '<li><a href="/daily.php">t<span class="empty_set">&#248;</span>day</a></li> ';
	echo '<li><a href="/game.php">rand<span class="empty_set">&#248;</span>m</a></li> ';
	echo '<li><a href="/tutorial.php">tut<span class="empty_set">&#248;</span>rial</a></li> ';
	echo '<li><a href="/logout.php">l<span class="empty_set">&#248;</span>g<span class="empty_set">&#248;</span>ut</a></li> ';
}

if(!isset($_SESSION['username'])) {
	//Not authenticated
	echo '<li><a href="/index.php">h<span class="empty_set">&#248;</span>me</a></li> ';
	echo '<li><a href="/game.php">rand<span class="empty_set">&#248;</span>m</a></li> ';
	echo '<li><a href="/tutorial.php">tut<span class="empty_set">&#248;</span>rial</a></li> ';
	echo '<li><a href="/join.php">j<span class="empty_set">&#248;</span>in</a></li> ';
	echo '<li><a href="/login.php">l<span class="empty_set">&#248;</span>gin</a></li> ';
}
?>
</ul>