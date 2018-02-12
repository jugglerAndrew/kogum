<html>
<style>
svg {
    margin-right: 10px;
}
</style>
<body>

<?php
$sql = new MySQLi('localhost', 'root', 'root', 'kogum_dev');

//Get colors
$result = $sql->query("SELECT color_name, color_code FROM `color` WHERE active_flag = active_flag;");
for ($colors = array (); $row = $result->fetch_assoc(); $colors[] = $row);
$result->close();
//print_r($colors);

//Get counts
$result = $sql->query("SELECT count_name, count_value FROM `ncount` WHERE active_flag = active_flag;");
for ($counts = array (); $row = $result->fetch_assoc(); $counts[] = $row);
$result->close();
//print_r($fills);

//Get fills
$result = $sql->query("SELECT fill_name, svg_pattern_id, svg_markup FROM `fill` WHERE active_flag = active_flag;");
for ($fills = array (); $row = $result->fetch_assoc(); $fills[] = $row);
$result->close();
//print_r($fills);

//Get shapes
$result = $sql->query("SELECT shape_name, svg_tag, svg_attribute_value FROM `shape` WHERE active_flag = 1;");
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
      // foreach ($counts as $n) {
        //echo $c , ' ' , $f['svg_pattern_id'] , ' ' , $s['svg_tag']; //style="background-color: linen;"
        //$metaName = $counts[0]['count_name'].'_'.$c['color_name'].'_'.$f['fill_name'].'_'.$s['shape_name'];
        $metaName = $c['color_name'].'_'.$f['fill_name'].'_'.$s['shape_name'];
        $metaPatternId = $c['color_name'].'_'.$f['fill_name'];

        $svgMarkupString = $svgMarkupString. '<svg id="'.$metaName.'" viewBox="0 0 '.$svgViewBoxHeight.' '.$svgViewBoxWidth.'" width="'.$svgWidth.'" height="'.$svgHeight.'" xmlns="http://www.w3.org/2000/svg">';
        //$svgMarkupString = $svgMarkupString. '<defs><pattern id="'.$f['svg_pattern_id'].$c['color_code'].'" patternUnits="userSpaceOnUse" width="10" height="10"><image xlink:href="data:image/svg+xml;utf8,'. preg_replace("/#([0-9A-FZ][0-9A-FZ])([0-9A-FZ][0-9A-FZ])([0-9A-FZ][0-9A-FZ])/", "#".$c['color_code'], $f['svg_markup']).'" x="0" y="0" width="10" height="10"></image></pattern></defs>';
        $svgMarkupString = $svgMarkupString. '<defs><pattern id="'.$metaPatternId.'" patternUnits="userSpaceOnUse" width="10" height="10"><image xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="data:image/svg+xml;base64,'. base64_encode(preg_replace("/#([0-9A-FZ][0-9A-FZ])([0-9A-FZ][0-9A-FZ])([0-9A-FZ][0-9A-FZ])/", "#".$c['color_code'], $f['svg_markup'])).'" x="0" y="0" width="10" height="10"></image></pattern></defs>';

        if ($s['svg_tag'] == 'polygon') {
          $svgMarkupString = $svgMarkupString.'<polygon points="'.$s['svg_attribute_value'].'" fill="url(#'.$metaPatternId.')" stroke="#'.$c['color_code'].'" stroke-width="4"/>';
        }
        elseif ($s['svg_tag'] == 'circle') {
          $svgMarkupString = $svgMarkupString.'<circle cx="25" cy="25" r="20" stroke="#'.$c['color_code'].'" stroke-width="4" fill="url(#'.$metaPatternId.')"/>';
        }
        elseif ($s['svg_tag'] == 'ellipse') {
          # code...
          //  <ellipse cx="200" cy="80" rx="100" ry="50" style="fill:yellow;stroke:purple;stroke-width:2" />
          $svgMarkupString = $svgMarkupString.'<ellipse cx="25" cy="25" rx="10" ry="20" stroke="#'.$c['color_code'].'" stroke-width="4" fill="url(#'.$metaPatternId.')"/>';
        }
        elseif ($s['svg_tag'] == 'path') {
          $svgMarkupString = $svgMarkupString.'<path d="'.$s['svg_attribute_value'].'" stroke="#'.$c['color_code'].'" stroke-width="4" fill="url(#'.$metaPatternId.')"/>';
        }

        $svgMarkupString = $svgMarkupString.'</svg>';
        echo $svgMarkupString;
        //file_put_contents('images/'.$metaName.'.svg', $svgMarkupString);
        $svgMarkupString = '';
    // }
    }
  }
}
?>
</body>
</html>
