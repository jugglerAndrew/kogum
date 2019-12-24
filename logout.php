<?php
	require_once 'models/auth.php';
    unset($_SESSION['username']);
    header('Location: /');
    die();	
?>
