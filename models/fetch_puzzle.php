<?php
// Get parameters
$game = strtolower($_GET["game"]);
$difficulty = (int)$_GET["difficulty"];
$id = (int)$_GET["id"];

// Open database connection
$sql = new MySQLi('localhost', 'root', 'root', 'kogum_dev');

// Set difficulty
if ($difficulty === "" || $difficulty === null || $difficulty === 0) {
    $difficulty = 99999;
}

if ($game === "random") {
    
    if ($id === "" || $id === null || $id === 0) {
        
        // Get random puzzle
        $result = $sql->query("SELECT puzzle_id, solution_id FROM puzzle ORDER BY RAND() LIMIT 1");
        for ($puzzle = array (); $row = $result->fetch_assoc(); $puzzle[] = $row);
        $result->close();
        
    } else {
        
        // Get override puzzle
        $result = $sql->query("SELECT puzzle_id, solution_id FROM puzzle WHERE puzzle_id = ".$id);
        for ($puzzle = array (); $row = $result->fetch_assoc(); $puzzle[] = $row);
        $result->close();
        
    }
    
    // Get counts
    $result = $sql->query("SELECT count_name FROM ncount WHERE difficulty <= ".$difficulty." AND active_flag = 1");
    for ($n = array (); $row = $result->fetch_assoc(); $n[] = $row);
    $result->close();

    // Get colors
    $result = $sql->query("SELECT color_name FROM color WHERE difficulty <= ".$difficulty." AND active_flag = 1 ORDER BY RAND() LIMIT 3");
    for ($c = array (); $row = $result->fetch_assoc(); $c[] = $row);
    $result->close();

    // Get fills
    $result = $sql->query("SELECT fill_name FROM fill WHERE difficulty <= ".$difficulty." AND active_flag = 1 ORDER BY RAND() LIMIT 3");
    for ($f = array (); $row = $result->fetch_assoc(); $f[] = $row);
    $result->close();

    // Get shapes
    $result = $sql->query("SELECT shape_name FROM shape WHERE difficulty <= ".$difficulty." AND active_flag = 1 ORDER BY RAND() LIMIT 3");
    for ($s = array (); $row = $result->fetch_assoc(); $s[] = $row);
    $result->close();  
    
} elseif ($game === "daily") {
    
    // Get preset puzzle
    $result = $sql->query("SELECT p.puzzle_id, p.solution_id, pg.puzzle_game_id FROM puzzle_game pg JOIN puzzle p ON p.puzzle_id = pg.puzzle_id WHERE SYSDATE() BETWEEN pg.start_date and pg.end_date");
    for ($puzzle = array (); $row = $result->fetch_assoc(); $puzzle[] = $row);
    $result->close();    
    $puzzle_game_id = $puzzle_id = $puzzle[0]['puzzle_game_id'];

    // Get user info
    require_once 'auth.php';
    global $user_id;
    $_SESSION["puzzle_game_id"] = $puzzle_game_id;    
    
    // Initiate game for user    
    $query = $connection->prepare("INSERT INTO user_game(puzzle_game_id, user_id) values(?, ?);");
    $query->bind_param("ii", $puzzle_game_id, $user_id);
    $query->execute();
    $query->close();
    
    // Get counts
    $result = $sql->query("SELECT count_name FROM ncount WHERE active_flag = 1");
    for ($n = array (); $row = $result->fetch_assoc(); $n[] = $row);
    $result->close();

    // Get colors
    $result = $sql->query("SELECT c.color_name FROM color c JOIN game_color gc ON gc.color_id = c.color_id WHERE gc.puzzle_game_id = ".$puzzle_game_id." AND c.active_flag = 1");
    for ($c = array (); $row = $result->fetch_assoc(); $c[] = $row);
    $result->close();

    // Get fills
    $result = $sql->query("SELECT f.fill_name FROM fill f JOIN game_fill gf ON gf.fill_id = f.fill_id WHERE gf.puzzle_game_id = ".$puzzle_game_id." AND f.active_flag = 1");
    for ($f = array (); $row = $result->fetch_assoc(); $f[] = $row);
    $result->close();

    // Get shapes
    $result = $sql->query("SELECT s.shape_name FROM shape s JOIN game_shape gs ON gs.shape_id = s.shape_id WHERE gs.puzzle_game_id = ".$puzzle_game_id." AND s.active_flag = 1");
    for ($s = array (); $row = $result->fetch_assoc(); $s[] = $row);
    $result->close();  
    
} elseif ($game === "debug") {
    
    // Get puzzle 
    if ($id === "" || $id === null || $id === 0) {
        
        // Get random puzzle
        $result = $sql->query("SELECT puzzle_id, solution_id FROM puzzle ORDER BY RAND() LIMIT 1");
        for ($puzzle = array (); $row = $result->fetch_assoc(); $puzzle[] = $row);
        $result->close();
        
    } else {
        
        // Get override puzzle
        $result = $sql->query("SELECT puzzle_id, solution_id FROM puzzle WHERE puzzle_id = ".$id);
        for ($puzzle = array (); $row = $result->fetch_assoc(); $puzzle[] = $row);
        $result->close();
        
    }    
    $puzzle_game_id = $id;
    
    // Get counts
    $result = $sql->query("SELECT count_name FROM ncount WHERE active_flag = 1");
    for ($n = array (); $row = $result->fetch_assoc(); $n[] = $row);
    $result->close();

    // Get colors
    $result = $sql->query("SELECT c.color_name FROM color c JOIN game_color gc ON gc.color_id = c.color_id WHERE gc.puzzle_game_id = ".$puzzle_game_id." AND c.active_flag = 1");
    for ($c = array (); $row = $result->fetch_assoc(); $c[] = $row);
    $result->close();

    // Get fills
    $result = $sql->query("SELECT f.fill_name FROM fill f JOIN game_fill gf ON gf.fill_id = f.fill_id WHERE gf.puzzle_game_id = ".$puzzle_game_id." AND f.active_flag = 1");
    for ($f = array (); $row = $result->fetch_assoc(); $f[] = $row);
    $result->close();

    // Get shapes
    $result = $sql->query("SELECT s.shape_name FROM shape s JOIN game_shape gs ON gs.shape_id = s.shape_id WHERE gs.puzzle_game_id = ".$puzzle_game_id." AND s.active_flag = 1");
    for ($s = array (); $row = $result->fetch_assoc(); $s[] = $row);
    $result->close();  
}

// Set IDs
$puzzle_id = $puzzle[0]['puzzle_id'];
$solution_id = $puzzle[0]['solution_id'];

// Get puzzle cards
// Count value hardcoded to blank for now (TODO)
$result = $sql->query(
    "SELECT c.card_id card_id,
                        REPLACE(REPLACE(REPLACE(
                        REPLACE(REPLACE(REPLACE(
                        REPLACE(REPLACE(REPLACE(
                        REPLACE(REPLACE(REPLACE(
                          c.card_name, 'n1_', ''), 'n2_', ''), 'n3_', ''),
                                      'c1', '".$c[0]["color_name"]."'), 'c2', '".$c[1]["color_name"]."'), 'c3', '".$c[2]["color_name"]."'),
                                      'f1', '".$f[0]["fill_name"]."'), 'f2', '".$f[1]["fill_name"]."'), 'f3', '".$f[2]["fill_name"]."'),
                                      's1', '".$s[0]["shape_name"]."'), 's2', '".$s[1]["shape_name"]."'), 's3', '".$s[2]["shape_name"]."') card_name,
                              c.meta_count_id count_value
                        FROM puzzle_card pc JOIN card c ON pc.card_id = c.card_id WHERE pc.puzzle_id =  ".$puzzle_id);
for ($puzzle_cards = array (); $row = $result->fetch_assoc(); $puzzle_cards[] = $row);
$result->close();

// Get solution
$result = $sql->query("SELECT sg.solution_set_code FROM solution_group sg WHERE sg.solution_id = ".$solution_id);
for ($solution_cards = array (); $row = $result->fetch_assoc(); $solution_cards[] = $row);
$result->close();

// Close database connection
$sql->close();

// Organize arrays
foreach ($puzzle_cards as $r) {
    $cards[$r['card_id']] = array('card_name' => $r['card_name'],
                                'count_value' => $r['count_value']);
}
$solutions = array();
foreach ($solution_cards as $r) {
    array_push($solutions, $r['solution_set_code']);
}

// E'ryday I'm shufflin'
shuffle($puzzle_cards);

// Build return payload
$return = array ("id" => $puzzle_id,
                 "card" => $cards,
                 // "card" => $puzzle_cards,
                "solution" => $solutions);

//echo"<pre>";
//print_r($c);
//echo "</pre>";
header("Content-Type: application/json;charset=utf-8");
echo json_encode($return);
?>