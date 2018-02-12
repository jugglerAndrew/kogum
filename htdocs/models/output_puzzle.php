<html>
<style>
svg {
    margin-right: 10px;
}
</style>
<body>

<?php
$sql = new MySQLi('localhost', 'root', 'root', 'kogum_dev');

// Get puzzle
$result = $sql->query("SELECT puzzle_id, solution_id FROM puzzle WHERE puzzle_id = 5");
for ($puzzle = array (); $row = $result->fetch_assoc(); $puzzle[] = $row);
$result->close();

// Get puzzle cards
$result = $sql->query("SELECT c.card_id card_id,
REPLACE(REPLACE(REPLACE(
REPLACE(REPLACE(REPLACE(
REPLACE(REPLACE(REPLACE(
REPLACE(REPLACE(REPLACE(
  c.card_name, 'n1', 'ONE'), 'n2', 'TWO'), 'n3', 'THREE'),
              'c1', 'RED'), 'c2', 'KHAKI'), 'c3', 'DODGERBLUE'),
              'f1', 'EMPTY'), 'f2', 'FILLED'), 'f3', 'CIRCLES6'),
              's1', 'ISOSCELES'), 's2', 'RHOMBUS'), 's3', 'HEXAGON') card_name
FROM puzzle_card pc JOIN card c ON pc.card_id = c.card_id WHERE pc.puzzle_id =  ".$puzzle[0]['puzzle_id']);
for ($puzzle_cards = array (); $row = $result->fetch_assoc(); $puzzle_cards[] = $row);
$result->close();

$sql->close();

shuffle($puzzle_cards);

foreach ($puzzle_cards as $pc) {
  if (strtok($pc['card_name'], '_') == 'ONE') {
    $png_markup = "<img src='/images/png/".$pc['card_name'].".png' />";
  }
  elseif (strtok($pc['card_name'], '_') == 'TWO') {
    $png_markup = "<img src='/images/png/".str_replace('TWO','ONE',$pc['card_name']).".png' />";
    $png_markup = $png_markup.$png_markup;
  }
  elseif (strtok($pc['card_name'], '_') == 'THREE') {
    $png_markup = "<img src='/images/png/".str_replace('THREE','ONE',$pc['card_name']).".png' />";
    $png_markup = $png_markup.$png_markup.$png_markup;
  }
echo $png_markup."<br/><br/>";
}

// Get solution sets


/*
$sql = new MySQLi('localhost', 'root', 'root', 'kogum_dev');

//Get colors
$result = $sql->query("SELECT meta_color_name, meta_color_code FROM `meta_color` WHERE active_flag = active_flag;");
for ($colors = array (); $row = $result->fetch_assoc(); $colors[] = $row);
$result->close();
//print_r($colors);

//Get counts
$result = $sql->query("SELECT meta_count_name, meta_count_value FROM `meta_count` WHERE active_flag = active_flag;");
for ($counts = array (); $row = $result->fetch_assoc(); $counts[] = $row);
$result->close();
//print_r($fills);

//Get fills
$result = $sql->query("SELECT meta_fill_name, svg_pattern_id, svg_markup FROM `meta_fill` WHERE active_flag = active_flag AND svg_markup <> '';");
for ($fills = array (); $row = $result->fetch_assoc(); $fills[] = $row);
$result->close();
//print_r($fills);

//Get shapes
$result = $sql->query("SELECT meta_shape_name, svg_tag, svg_attribute_value FROM `meta_shape` WHERE active_flag = 1;");
for ($shapes = array (); $row = $result->fetch_assoc(); $shapes[] = $row);
$result->close();
//print_r($shapes);
$sql->close();

//Output all shapes/fills/colors
$svgSize = 50;
$svgViewBoxWidth = $svgSize;
$svgViewBoxHeight = $svgSize;
$svgWidth = $svgSize;
$svgHeight = $svgSize;
$svgMarkupString = '';
$switch = true;
foreach ($colors as $c) {
  foreach ($fills as $f) {
    foreach ($shapes as $s) {
      //echo $c , ' ' , $f['svg_pattern_id'] , ' ' , $s['svg_tag']; //style="background-color: linen;"
      $metaName = $counts[0]['meta_count_name'].'_'.$c['meta_color_name'].'_'.$f['meta_fill_name'].'_'.$s['meta_shape_name'];
      $metaPatternId = $c['meta_color_name'].'_'.$f['meta_fill_name'];

      $svgMarkupString = $svgMarkupString. '<svg id="'.$metaName.'" viewBox="0 0 '.$svgViewBoxHeight.' '.$svgViewBoxWidth.'" width="'.$svgWidth.'" height="'.$svgHeight.'" xmlns="http://www.w3.org/2000/svg">';
      //$svgMarkupString = $svgMarkupString. '<defs><pattern id="'.$f['svg_pattern_id'].$c['meta_color_code'].'" patternUnits="userSpaceOnUse" width="10" height="10"><image xlink:href="data:image/svg+xml;utf8,'. preg_replace("/#([0-9A-FZ][0-9A-FZ])([0-9A-FZ][0-9A-FZ])([0-9A-FZ][0-9A-FZ])/", "#".$c['meta_color_code'], $f['svg_markup']).'" x="0" y="0" width="10" height="10"></image></pattern></defs>';
      $svgMarkupString = $svgMarkupString. '<defs><pattern id="'.$metaPatternId.'" patternUnits="userSpaceOnUse" width="10" height="10"><image xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="data:image/svg+xml;base64,'. base64_encode(preg_replace("/#([0-9A-FZ][0-9A-FZ])([0-9A-FZ][0-9A-FZ])([0-9A-FZ][0-9A-FZ])/", "#".$c['meta_color_code'], $f['svg_markup'])).'" x="0" y="0" width="10" height="10"></image></pattern></defs>';
      if ($s['svg_tag'] == 'polygon') {
        $svgMarkupString = $svgMarkupString. '<polygon points="'.$s['svg_attribute_value'].'" fill="url(#'.$metaPatternId.')" stroke="#'.$c['meta_color_code'].'" stroke-width="4"/>';
      }
      elseif ($s['svg_tag'] == 'circle') {
        //echo '<circle points="' , s$['svg_attribute_value'] , '" fill="url(#' , $f['svg_pattern_id']  , ')" stroke="#' , $c , '" stroke-width="2"/>';
      }
      elseif ($s['svg_tag'] == 'ellipse') {
        # code...
      }
      $svgMarkupString = $svgMarkupString. '</svg>';
      echo $svgMarkupString;
      //file_put_contents('images/'.$metaName.'.svg', $svgMarkupString);
      $svgMarkupString = '';
    }
  }
}*/
?>
</body>
</html>
