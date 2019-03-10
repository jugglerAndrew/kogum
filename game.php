<html>
<head>
  <link rel="stylesheet" type="text/css" href="/styles/main.css">
  <link rel="stylesheet" type="text/css" href="/styles/simple-grid.css">
  <script type="text/javascript" src="/scripts/game.js"></script>
</head>
<body onload="loadGame('random')">
  <div id="game" class="container">
    <div class="row">
        <div class="col-12">
        <?php require_once 'nav.php' ; ?>
        </div>
    </div>
    <div id="puzzle">
      <div class="row">
        <div id="puzzle_header" >
          <div id="puzzle_timer" class="col-10">
            <span id="time"></span>
          </div>
          <div class="col-1">
            <button id="play_pause_button" onclick="playPauseButton(this.value)" value="PLAY" type="button"></button>
          </div>
          <div class="col-1">
            <button id="reload_button" onclick="loadGame('random')" type="button">NEW</button>
          </div>
        </div>
      </div>
      <div id="puzzle_row" class="row">
        <div class="col-4">
          <div id="cell-0" class="card"></div>
        </div>
        <div class="col-4">
          <div id="cell-1" class="card"></div>
        </div>
        <div class="col-4">
          <div id="cell-2" class="card"></div>
        </div>
      </div>
      <div id="puzzle_row" class="row">
        <div class="col-4">
          <div id="cell-3" class="card"></div>
        </div>
        <div class="col-4">
          <div id="cell-4" class="card"></div>
        </div>
        <div class="col-4">
          <div id="cell-5" class="card"></div>
        </div>
      </div>
      <div id="puzzle_row" class="row">
        <div class="col-4">
          <div id="cell-6" class="card"></div>
        </div>
        <div class="col-4">
          <div id="cell-7" class="card"></div>
        </div>
        <div class="col-4">
          <div id="cell-8" class="card"></div>
        </div>
      </div>
      <div id="puzzle_row" class="row">
        <div class="col-4">
          <div id="cell-9" class="card"></div>
        </div>
        <div class="col-4">
          <div id="cell-10" class="card"></div>
        </div>
        <div class="col-4">
          <div id="cell-11" class="card"></div>
        </div>
      </div>
    </div>

    <div id="solution">

      <div id="solution_header" class="row">
        <div class="col-3">s<span class="empty_set">&#248;</span>luti<span class="empty_set">&#248;</span>ns</div>
      </div>

      <div id="solution_row" class="row">
        <div class="col-10">
          <span class="solution_number">1</span>
          <div class="solution_set">
            <div id="sol-0" class="solution_card"></div>
            <span class="forward_slash">&#47;</span>
            <div id="sol-1" class="solution_card"></div>
            <span class="forward_slash">&#47;</span>
            <div id="sol-2" class="solution_card"></div>
          </div>
        </div>
      </div>

      <div id="solution_row" class="row">
        <div class="col-10">
          <span class="solution_number">2</span>
          <div class="solution_set">
            <div id="sol-3" class="solution_card"></div>
            <span class="forward_slash">&#47;</span>
            <div id="sol-4" class="solution_card"></div>
            <span class="forward_slash">&#47;</span>
            <div id="sol-5" class="solution_card"></div>
          </div>
        </div>
      </div>

      <div id="solution_row" class="row">
        <div class="col-10">
          <span class="solution_number">3</span>
          <div class="solution_set">
            <div id="sol-6" class="solution_card"></div>
            <span class="forward_slash">&#47;</span>
            <div id="sol-7" class="solution_card"></div>
            <span class="forward_slash">&#47;</span>
            <div id="sol-8" class="solution_card"></div>
          </div>
        </div>
      </div>

      <div id="solution_row" class="row">
        <div class="col-10">
          <span class="solution_number">4</span>
          <div class="solution_set">
            <div id="sol-9" class="solution_card"></div>
            <span class="forward_slash">&#47;</span>
            <div id="sol-10" class="solution_card"></div>
            <span class="forward_slash">&#47;</span>
            <div id="sol-11" class="solution_card"></div>
          </div>
        </div>
      </div>

      <div id="solution_row" class="row">
        <div class="col-10">
          <span class="solution_number">5</span>
          <div class="solution_set">
            <div id="sol-12" class="solution_card"></div>
            <span class="forward_slash">&#47;</span>
            <div id="sol-13" class="solution_card"></div>
            <span class="forward_slash">&#47;</span>
            <div id="sol-14" class="solution_card"></div>
          </div>
        </div>
      </div>

      <div id="solution_row" class="row">
        <div class="col-10">
          <span class="solution_number">6</span>
          <div class="solution_set">
            <div id="sol-15" class="solution_card"></div>
            <span class="forward_slash">&#47;</span>
            <div id="sol-16" class="solution_card"></div>
            <span class="forward_slash">&#47;</span>
            <div id="sol-17" class="solution_card"></div>
          </div>
        </div>
      </div>

    </div>
  </div>
</body>
</html>
