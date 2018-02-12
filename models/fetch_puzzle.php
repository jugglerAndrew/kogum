<?php
// Get parameters
$puzzle_id = $_GET["puzzle_id"];
$difficulty = $_GET["difficulty"];

// Open database connection
$sql = new MySQLi('localhost', 'root', 'root', 'kogum_dev');

// Set difficulty
if ($difficulty === "" || $difficulty === null) {
  $difficulty = 99999;
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

// Get puzzle
if ($puzzle_id === "" || $puzzle_id === null) {
  $result = $sql->query("SELECT puzzle_id, solution_id FROM puzzle ORDER BY RAND() LIMIT 1");
} else {
  $result = $sql->query("SELECT puzzle_id, solution_id FROM puzzle WHERE puzzle_id = ".$puzzle_id);
}
for ($puzzle = array (); $row = $result->fetch_assoc(); $puzzle[] = $row);
$result->close();

// Set IDs
$puzzle_id = $puzzle[0]['puzzle_id'];
$solution_id = $puzzle[0]['solution_id'];

// Get puzzle cards
// Count value hardcoded to blank for now (TODO)
$result = $sql->query("SELECT c.card_id card_id,
                        REPLACE(REPLACE(REPLACE(
                        REPLACE(REPLACE(REPLACE(
                        REPLACE(REPLACE(REPLACE(
                        REPLACE(REPLACE(REPLACE(
                          c.card_name, 'n1_', ''), 'n2_', ''), 'n3_', ''),
                                      'c1', '".$c[0]["color_name"]."'), 'c2', '".$c[1]["color_name"]."'), 'c3', '".$c[2]["color_name"]."'),
                                      'f1', '".$f[0]["fill_name"]."'), 'f2', '".$f[1]["fill_name"]."'), 'f3', '".$f[2]["fill_name"]."'),
                                      's1', '".$s[0]["shape_name"]."'), 's2', '".$s[1]["shape_name"]."'), 's3', '".$s[2]["shape_name"]."') card_name,
                              c.meta_count_id count_value
                        FROM puzzle_card pc JOIN card c ON pc.card_id = c.card_id WHERE pc.puzzle_id =  ".$puzzle[0]['puzzle_id']);
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
//print_r($return['card'][0]);
//echo "</pre>";
header("Content-Type: application/json;charset=utf-8");
echo json_encode($return);
?>
