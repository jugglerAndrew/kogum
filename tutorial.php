<html>
<head>
  <link rel="stylesheet" type="text/css" href="/styles/main.css">
  <link rel="stylesheet" type="text/css" href="/styles/simple-grid.css">
</head>
<body>
  <div id="tutorial" class="container">
    <div class="row">
        <div class="col-12">
			<?php require_once('nav.php'); ?>
        </div>
    </div>
    <div class="row">
      <div class="col-12">
    <h1>tut<span class="empty_set">&#248;</span>rial</h1>

    <div style="overflow:auto;">
      <div style="float:right;">
        <button type="button" id="prevBtn" onclick="nextPrev(-1)">Previous</button>
        <button type="button" id="nextBtn" onclick="nextPrev(1)">Next</button>
      </div>
    </div>

    <!-- One "tab" for each step in the form: -->
    <div class="tab">
      <img src="/images/game_1.png"/>
      <p>K<span class="empty_set">&#248;</span>gum is a puzzle game composed of twelve different cells. Above is an example game.</p>
    </div>

    <div class="tab">
      <table id="attributes">
				<th>Attribute</th>
        <th>Examples</th>
				<tr>
					<td>color</td>
					<td>
            <img src="/images/png/BLACK_EMPTY_SQUARE.png" alt=""/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <img src="/images/png/DODGERBLUE_EMPTY_SQUARE.png" alt=""/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <img src="/images/png/MEDIUMSEAGREEN_EMPTY_SQUARE.png" alt=""/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <img src="/images/png/ORANGE_EMPTY_SQUARE.png" alt=""/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <img src="/images/png/HOTPINK_EMPTY_SQUARE.png" alt=""/>
          </td>
				</tr>
				<tr>
					<td>number</td>
          <td>
            <img src="/images/png/RED_HORIZONTALSTRIPE5_CIRCLE.png" alt=""/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <img src="/images/png/RED_HORIZONTALSTRIPE5_CIRCLE.png" alt=""/>
            <img src="/images/png/RED_HORIZONTALSTRIPE5_CIRCLE.png" alt=""/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <img src="/images/png/RED_HORIZONTALSTRIPE5_CIRCLE.png" alt=""/>
            <img src="/images/png/RED_HORIZONTALSTRIPE5_CIRCLE.png" alt=""/>
            <img src="/images/png/RED_HORIZONTALSTRIPE5_CIRCLE.png" alt=""/>
          </td>
				</tr>
				<tr>
					<td>fill</td>
          <td>
            <img src="/images/png/MEDIUMSEAGREEN_EMPTY_ISOSCELES.png" alt=""/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <img src="/images/png/MEDIUMSEAGREEN_DOTS5_ISOSCELES.png" alt=""/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <img src="/images/png/MEDIUMSEAGREEN_DIAGONALSTRIPE4_ISOSCELES.png" alt=""/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <img src="/images/png/MEDIUMSEAGREEN_HOUNDSTOOTH1_ISOSCELES.png" alt=""/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <img src="/images/png/MEDIUMSEAGREEN_FILLED_ISOSCELES.png" alt=""/>
          </td>
				</tr>
				<tr>
					<td>shape</td>
          <td>
            <img src="/images/png/DODGERBLUE_FILLED_CIRCLE.png" alt=""/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <img src="/images/png/DODGERBLUE_FILLED_SQUARE.png" alt=""/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <img src="/images/png/DODGERBLUE_FILLED_PENTAGON.png" alt=""/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <img src="/images/png/DODGERBLUE_FILLED_ISOSCELES.png" alt=""/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <img src="/images/png/DODGERBLUE_FILLED_RHOMBUS.png" alt=""/>
          </td>
				</tr>
			</table>
      <p>Each cell has four different attributes.</p>
    </div>

    <div class="tab">
      <h2><span class="empty_set">&#248;</span>bjective</h2>
      <p>The goal of Kogum is to identify a pattern of three cells. There are six patterns in each puzzle - find them all to win.</p>
      <h2>the tw<span class="empty_set">&#248;</span> rules</h2>
      <p>For three cells to be a valid pattern, follow the TWO RULES:</p>
      <ol>
        <li>The three cells must be unique.</li>
        <li>For any given attribute, the three cells must all share that same attribute or they must all have different types of that attribute.</li>
      </ol>
      <p>Each attribute must be all different or all the same? What does that mean? Let's look at an example.</p>
    </div>

    <div class="tab">
      <img src="/images/game_2.png"/>
      <p>Going back to our original puzzle, we'll first choose the one-blue-empty-triangle.</p>
    </div>

    <div class="tab">
      <img src="/images/game_3.png"/>
      <p>At this point, it doesn't matter what the second cell we pick is, so let's choose the one-blue-striped-square.</p>
    </div>

    <div class="tab">
      <img src="/images/game_3.png"/>
      <p>Now that we have two unique cells, we can use the TWO RULES to figure out the third to make a valid pattern. We see that the two cells we've picked are both blue. Color is the SAME, so therefore the third cell must also be blue. Remember, each attribute must be all the same or all different!

      Both cells each have only one object in them, so the number is the SAME too.</p>
    </div>

    <div class="tab">
      <img src="/images/game_4.png"/>
      <p>At the moment we are looking for another cell that is both a one and a blue. There are two possible candidates - highlighted in yellow above. Let's continue narrowing down by looking at the other two attributes: fill and shape.</p>
    </div>

    <div class="tab">
      <img src="/images/game_5.png"/>
      <p>Both of our original cells have DIFFERENT fills. The triangle has no fill and the square is striped. We would therefore expect the third shape to have a different fill too - we want one that is filled in!

      Since both of our candidates are filled in, let's look at shape. One is a square, so its DIFFERENT than the one-blue-empty-triangle, but its also the SAME as the one-blue-striped-square. That breaks our second rule, so let's check out the other cell. The circle is DIFFERENT than both of the other shapes, so it completes the pattern!

      Continue on to see the other five patterns, or click <a href="/game.php">here</a> to start playing!</p>
    </div>

    <div class="tab">
      <img src="/images/game_6.png"/>
      <p>Solution two:</p>
      <ul>
        <li>Color = different</li>
        <li>Fill = different</li>
        <li>Number = different</li>
        <li>Shape = different</li>
      </ul>
    </div>

    <div class="tab">
      <img src="/images/game_7.png"/>
      <p>Solution three:</p>
      <ul>
        <li>Color = different</li>
        <li>Fill = same</li>
        <li>Number = different</li>
        <li>Shape = same</li>
      </ul>
    </div>

    <div class="tab">
      <img src="/images/game_8.png"/>
      <p>Solution four:</p>
      <ul>
        <li>Color = same</li>
        <li>Fill = different</li>
        <li>Number = different</li>
        <li>Shape = different</li>
      </ul>
    </div>

    <div class="tab">
      <img src="/images/game_9.png"/>
      <p>Solution five:</p>
      <ul>
        <li>Color = same</li>
        <li>Fill = different</li>
        <li>Number = different</li>
        <li>Shape = same</li>
      </ul>
    </div>

    <div class="tab">
      <img src="/images/game_10.png"/>
      <p>Solution six:</p>
      <ul>
        <li>Color = different</li>
        <li>Fill = different</li>
        <li>Number = different</li>
        <li>Shape = same</li>
      </ul>
      <p>That's all there is to it. Play anytime <a href="/game.php">here</a> or coming soon: register so you can play our daily puzzles and get ranked!</p>
    </div>

    <!-- Circles which indicates the steps of the form: -->
    <div style="text-align:center;margin-top:40px;">
      <span class="step"></span>
      <span class="step"></span>
      <span class="step"></span>
      <span class="step"></span>
      <span class="step"></span>
      <span class="step"></span>
      <span class="step"></span>
      <span class="step"></span>
      <span class="step"></span>
      <span class="step"></span>
      <span class="step"></span>
      <span class="step"></span>
      <span class="step"></span>
    </div>
  </div>
  </div>
  </div>

  <script>
  var currentTab = 0; // Current tab is set to be the first tab (0)
  showTab(currentTab); // Display the crurrent tab

  function showTab(n) {
    // This function will display the specified tab of the form...
    var x = document.getElementsByClassName("tab");
    x[n].style.display = "block";
    //... and fix the Previous/Next buttons:
    if (n == 0) {
      document.getElementById("prevBtn").style.display = "none";
    } else {
      document.getElementById("prevBtn").style.display = "inline";
    }
    if (n == (x.length - 1)) {
      document.getElementById("nextBtn").style.display = "none";
    } else {
      document.getElementById("nextBtn").style.display = "inline";
      document.getElementById("nextBtn").innerHTML = "Next";
    }
    //... and run a function that will display the correct step indicator:
    fixStepIndicator(n)
  }

  function nextPrev(n) {
    // This function will figure out which tab to display
    var x = document.getElementsByClassName("tab");
    // Exit the function if any field in the current tab is invalid:
    if (n == 1 && !validateForm()) return false;
    // Hide the current tab:
    x[currentTab].style.display = "none";
    // Increase or decrease the current tab by 1:
    currentTab = currentTab + n;
    // if you have reached the end of the form...
    if (currentTab >= x.length) {
      // ... the form gets submitted:
      document.getElementById("regForm").submit();
      return false;
    }
    // Otherwise, display the correct tab:
    showTab(currentTab);
  }

  function validateForm() {
    // This function deals with validation of the form fields
    var x, y, i, valid = true;
    x = document.getElementsByClassName("tab");
    y = x[currentTab].getElementsByTagName("input");
    // A loop that checks every input field in the current tab:
    for (i = 0; i < y.length; i++) {
      // If a field is empty...
      if (y[i].value == "") {
        // add an "invalid" class to the field:
        y[i].className += " invalid";
        // and set the current valid status to false
        valid = false;
      }
    }
    // If the valid status is true, mark the step as finished and valid:
    if (valid) {
      document.getElementsByClassName("step")[currentTab].className += " finish";
    }
    return valid; // return the valid status
  }

  function fixStepIndicator(n) {
    // This function removes the "active" class of all steps...
    var i, x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; i++) {
      x[i].className = x[i].className.replace(" active", "");
    }
    //... and adds the "active" class on the current step:
    x[n].className += " active";
  }
  </script>

</body>
</html>
