var debug = false;
var debugId = 1;
var game = null;
var newGame = true;
var puzzle = {};
var possible = [];
var solutionCount = 0;
var solutionCardCount = 0;
var cssCardBorderColor = "#EEEEEE";
var cssCardBorderHoverColor = "#666666";
var cssCardSelectedBorderColor = "#00cc00";
var cssCardSelectedBorderHoverColor = "#66ff33";
var cssDisplayType = "inline-block";
var	clsStopwatch = function() {
		var	startAt	= 0;	// Time of last start / resume. (0 if not running)
		var	lapTime	= 0;	// Time on the clock when last stopped in milliseconds
		var	now	= function() {
				return (new Date()).getTime();
			};
		this.start = function() {
				startAt	= startAt ? startAt : now();
			};
		this.stop = function() {
				// If running, update elapsed time otherwise keep it
				lapTime	= startAt ? lapTime + now() - startAt : lapTime;
				startAt	= 0; // Paused
			};
		this.reset = function() {
				lapTime = startAt = 0;
			};
		this.time = function() {
				return lapTime + (startAt ? now() - startAt : 0);
			};
	};
var sw = new clsStopwatch();
var $time;
var clocktimer;

// START GAME
function startGame() {
  stopwatchStart();
  hideCards(false);
  document.getElementById('reload_button').disabled = true;
}

// PAUSE GAME
function pauseGame() {
  stopwatchStop();
  hideCards(true);
  clearPossible();
  document.getElementById('reload_button').disabled = false;
}

// END GAME
function endGame() {
	var userTime = sw.time().toString();
  stopwatchStop();
  document.getElementById('reload_button').disabled = false;
  document.getElementById('play_pause_button').disabled = true;
  var cards = document.getElementsByClassName("card");
  for (i = 0; i < cards.length; i++) {
    cards[i].removeAttribute("onclick");
    setCardBorder(cards[i].id, cssCardBorderColor, cssCardBorderColor);
  }
	// TODO save time
	if (game == 'daily') {
		/*var x = new XMLHttpRequest();
    x.open("GET","/models/save_game.php?time=" + sw.time.toString(),true);
    x.send();
    return false;*/
		window.location.replace("/models/save_game.php?time=" + userTime);
	}
}

// RENDER CARDS VISIBLE OR INVISIBLE
function hideCards(bool) {
  var emptyVal = "";
  var cardVal = "";
  var cards = document.getElementsByClassName("card"); //TODO

  // Set on click and border values
  if (bool) {
    emptyVal = cssDisplayType;
    cardVal = "none";
    for (i = 0; i < cards.length; i++) {
      cards[i].removeAttribute("onclick");
      setCardBorder(cards[i].id, cssCardBorderColor, cssCardBorderColor);
    }
  } else {
    emptyVal = "none";
    cardVal = cssDisplayType;
    for (i = 0; i < cards.length; i++) {
      cards[i].setAttribute("onClick", "addToPossible(" + cards[i].id + ");" );
      setCardBorder(cards[i].id, cssCardBorderHoverColor, cssCardBorderColor);
    }
  }

  // Hide or unhide relevant images
  var empty_imgs = document.getElementsByClassName("empty_img");
  for (i = 0; i < empty_imgs.length; i++) {
    empty_imgs[i].style.display = emptyVal;
  }
  var card_imgs = document.getElementsByClassName("card_img");
  for (i = 0; i < card_imgs.length; i++) {
    card_imgs[i].style.display = cardVal;
  }
  var solution_imgs = document.getElementsByClassName("solution_img");
  for (i = 0; i < solution_imgs.length; i++) {
    solution_imgs[i].style.display = cardVal;
  }

}

// SET PLAY/PAUSE BUTTON
function playPauseButton(value) {

  if (value == "PLAY") {
    document.getElementById("play_pause_button").value = "PAUSE";
    document.getElementById("play_pause_button").innerHTML = "PAUSE";
    startGame();
  } else if (value == "RESUME") {
    document.getElementById("play_pause_button").value = "PAUSE";
    document.getElementById("play_pause_button").innerHTML = "PAUSE";
    startGame();
  } else if (value == "PAUSE") {
    document.getElementById("play_pause_button").value = "RESUME";
    document.getElementById("play_pause_button").innerHTML = "RESUME";
    pauseGame();
  } else if (value == "NEW") {
    document.getElementById("play_pause_button").value = "PLAY";
    document.getElementById("play_pause_button").innerHTML = "PLAY";
    pauseGame();
  }
}
// END PUZZLE GAME AND TIMER

// GET PUZZLE GAME
function loadGame(gameType) {
	var fetchPuzzleUrl = "../models/fetch_puzzle.php?game=" + gameType.toString() + "&difficulty&id";
  if (debug) fetchPuzzleUrl = "../models/fetch_puzzle.php?&game&difficulty&id=" + debugId.toString();

  //Get puzzle API call
  fetch(fetchPuzzleUrl)
    .then( function(response) {
            return response.json();
    })
    .then(function(returnPuzzle) {
    // Set puzzle global
    puzzle = returnPuzzle;

    // Reset
    newGame = true;
    possible = [];
    solutionCount = 0;
    solutionCardCount = 0;

    // For each puzzle card
    var cards = document.getElementsByClassName("card");
    var i = 0;
    for (var key in puzzle.card) {
      // Update element ID
      cards[i].setAttribute("id", key);
      // Clear out for new puzzle card
      document.getElementById(key).innerHTML = "<img class='empty_img' src='/images/png/emptyset.png'/>";
      // Render and append images
      document.getElementById(key).innerHTML += renderCard(key, "card_img");
      i++;
    }
    // For each solution card
    var solution_cards = document.getElementsByClassName("solution_card");
    for (j = 0; j < solution_cards.length; j++) {
      solution_cards[j].innerHTML = "";
    }
    document.getElementById('play_pause_button').disabled = false;
    playPauseButton("NEW");
    stopwatchShow();
    stopwatchReset();
  });
}

// RENDER CARD IMAGE(S)
function renderCard(cardId, cardType) {
  var htmlTag = "";
  for (i = 0; i < Number(puzzle.card[cardId].count_value); i++) {
    htmlTag += "<img class='" + cardType + "' src='/images/png/" + puzzle.card[cardId].card_name + ".png' />";
  }
  return htmlTag;
}

// CHANGE BORDERS OF SELECTED OR HOVERED CARDS
function setCardBorder(id, hover, neutral) {
	document.getElementById(id).style.borderColor = neutral;
	document.getElementById(id).onmouseover = function() { this.style.borderColor = hover; };
	document.getElementById(id).onmouseout = function() { this.style.borderColor = neutral; };
}

// ADD CARD TO POSSIBLE SOLUTION SET
function addToPossible(cardId) {
  // Add card to possible solution if it doesn't already exist
  // If it exists, remove it from possible solution
  if (possible.indexOf(cardId) >= 0) {
    // Remove
    possible.splice(possible.indexOf(cardId), 1);
    setCardBorder(cardId, cssCardBorderHoverColor, cssCardBorderColor);
  } else {
    // Add
    possible.push(cardId);
    setCardBorder(cardId, cssCardSelectedBorderHoverColor, cssCardSelectedBorderColor);
  }
  if (debug) console.log("Current: " + possible);

  // If possible set is complete, validate
  if (possible.length == 3) {
    for (let p of possible) {
      setCardBorder(p, cssCardBorderHoverColor, cssCardBorderColor);
    }
    validatePossible(possible.sort(sortNumber));
  }
}

// VALIDATE POSSIBLE SOLUTION SET
function validatePossible(set) {
  var invalid = true;
  var possibleSet = "";

  // Build solution set
  for (let s of set) {
    possibleSet += s.toString();
  }
  if (debug) console.log("Checking solution set: " + possibleSet);

  // For each solution set
  for (let s of puzzle.solution) {
    // Check if possible set is valid
    if (s == possibleSet) {
      // Valid
      invalid = false;
      if (debug) console.log(puzzle.solution.splice(puzzle.solution.indexOf(possibleSet), 1));
      solutionSetValid(possible);
      break;
    }
  }
  if (invalid) {
    // Invalid
    solutionSetInvalid(possible);
  }
  // Clear out possible set no matter what
  clearPossible();
}

function clearPossible() {
  possible = [];
}

// VALID SET
function solutionSetValid(set) {
  if (debug) console.log("VALID");
  renderSolutionSet(set);
  solutionCount++;
  if (solutionCount == 6) {
    endGame();
  }
}

// INVALID SET
function solutionSetInvalid(set) {
  if (debug) console.log("INVALID");
}

// RENDER SOLUTION SET
function renderSolutionSet(set) {
  for (let s of set) {
    document.getElementById("sol-" + solutionCardCount.toString()).innerHTML += renderCard(s, "solution_img");
    solutionCardCount++;
  }
}

// HELPER FUNCTIONS

// Sort array by numbers ascending
function sortNumber(a, b) {
  return a - b;
}

// Timer
function stopwatchPad(num, size) {
	var s = "0000" + num;
	return s.substr(s.length - size);
}
function stopwatchFormatTime(time) {
	var h = m = s = ms = 0;
	var newTime = '';
	h = Math.floor( time / (60 * 60 * 1000) );
	time = time % (60 * 60 * 1000);
	m = Math.floor( time / (60 * 1000) );
	time = time % (60 * 1000);
	s = Math.floor( time / 1000 );
	ms = time % 1000;
	newTime = stopwatchPad(h, 2) + ':' + stopwatchPad(m, 2) + ':' + stopwatchPad(s, 2) + '.' + stopwatchPad(ms, 3);
	return newTime;
}
function stopwatchShow() {
	$time = document.getElementById('time');
	stopwatchUpdate();
}
function stopwatchUpdate() {
	$time.innerHTML = stopwatchFormatTime(sw.time());
}
function stopwatchStart() {
	clocktimer = setInterval("stopwatchUpdate()", 1);
	sw.start();
}
function stopwatchStop() {
	sw.stop();
	clearInterval(clocktimer);
}
function stopwatchReset() {
	stopwatchStop();
	sw.reset();
	stopwatchUpdate();
}
