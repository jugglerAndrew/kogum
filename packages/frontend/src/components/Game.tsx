// /workspaces/kogum/packages/frontend/src/components/Game.tsx
import React, { useState, useEffect, useRef } from "react";
import CardComponent from "./Card";
import AuthPage from "./Auth/AuthPage"; // Import the AuthPage component
import UserPage from "./UserPage"; // Import the UserPage component

// Types to match backend response
interface ClientCardData {
  card_name: string;
  count_value: 1 | 2 | 3;
  abstractCardId: string;
}

interface PuzzleData {
  puzzle_id: number;
  cards: ClientCardData[];
  solutions: string[][]; // Array of arrays of abstract card IDs
}

// User data type from login
interface UserData {
  user_id: string;
  user_name: string;
  user_email: string;
}

const Game: React.FC = () => {
  const [puzzle, setPuzzle] = useState<PuzzleData | null>(null);
  const [selectedCards, setSelectedCards] = useState<string[]>([]); // Store abstractCardIds
  const [message, setMessage] = useState<string>(" "); // Initialized with a space to maintain height
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [foundSolutions, setFoundSolutions] = useState<
    (ClientCardData[] | null)[]
  >(Array(6).fill(null));

  // Timer state
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0); // Time in ms when paused
  const [currentTime, setCurrentTime] = useState<number>(0); // Continuously updated time in ms
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isGameCompleted, setIsGameCompleted] = useState<boolean>(false);

  // Active page state for navigation
  type ActivePage =
    | "kogum"
    | "today"
    | "random"
    | "scores"
    | "login"
    | "userPage";
  const [activePage, setActivePage] = useState<ActivePage>("kogum");

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check for existing login session
    const storedToken = localStorage.getItem("authToken");
    const storedUserData = localStorage.getItem("userData");

    let initialPage: ActivePage = "kogum";
    let shouldFetchPuzzle = true;

    if (storedToken && storedUserData) {
      try {
        const userData: UserData = JSON.parse(storedUserData);
        setAuthToken(storedToken);
        setCurrentUser(userData);
        setIsLoggedIn(true);
        initialPage = "userPage"; // Start on user page if logged in
        shouldFetchPuzzle = false; // Don't fetch puzzle if going to user page
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        // Fallback to default if parsing fails
      }
    }

    setActivePage(initialPage);
    if (shouldFetchPuzzle) {
      fetchNewPuzzle();
    } else if (initialPage !== "userPage") {
      // Ensure loading state is handled if not fetching puzzle immediately
      setIsLoading(false);
    }
  }, []); // Empty dependency array ensures this runs once on mount

  // Timer effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (!isPaused && startTime !== null && puzzle) {
      intervalId = setInterval(() => {
        setCurrentTime(elapsedTime + (Date.now() - startTime));
      }, 47); // Update frequently for ms accuracy
    } else if (isPaused) {
      // Ensure currentTime reflects the paused time accurately
      setCurrentTime(elapsedTime);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPaused, startTime, elapsedTime, puzzle]);

  // Effect to make messages temporary
  useEffect(() => {
    if (message.trim() !== "") {
      // If there's a non-empty message
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
      messageTimeoutRef.current = setTimeout(() => {
        setMessage(" "); // Clear message after 5 seconds
      }, 5000);
    }
    // Cleanup timeout if component unmounts or message changes before timeout fires
    return () => {
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
    };
  }, [message]);

  const fetchNewPuzzle = async () => {
    setIsLoading(true);
    setMessage(" "); // Reset message to a space to maintain height
    setSelectedCards([]);
    setFoundSolutions(Array(6).fill(null)); // Reset found solutions
    try {
      setIsGameCompleted(false); // Reset game completion state
      const response = await fetch("/api/puzzles/random");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: PuzzleData = await response.json();
      setPuzzle(data);
      // Reset and start timer
      setElapsedTime(0);
      setCurrentTime(0);
      setStartTime(Date.now());
      setIsPaused(false);
    } catch (error) {
      console.error("Failed to fetch puzzle:", error);
      setMessage("Failed to load puzzle. Please try again.");
      setPuzzle(null); // Ensure puzzle is null on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardSelect = (abstractCardId: string) => {
    if (isPaused || isGameCompleted) return; // Do nothing if paused or game is completed
    setSelectedCards((prevSelected) => {
      if (prevSelected.includes(abstractCardId)) {
        return prevSelected.filter((id) => id !== abstractCardId); // Deselect
      }
      if (prevSelected.length < 3) {
        const newSelection = [...prevSelected, abstractCardId];
        if (newSelection.length === 3) {
          checkIfSet(newSelection);
        }
        return newSelection;
      }
      return prevSelected; // Max 3 selected
    });
  };

  const checkIfSet = (currentSelection: string[]) => {
    if (!puzzle || currentSelection.length !== 3) return;

    const sortedSelectedIds = [...currentSelection].sort();

    let isSetFoundThisTurn = false;
    for (const solutionIds of puzzle.solutions) {
      const sortedSolutionIds = [...solutionIds].sort();

      if (
        JSON.stringify(sortedSelectedIds) === JSON.stringify(sortedSolutionIds)
      ) {
        const alreadyFound = foundSolutions.some(
          (foundSet) =>
            foundSet &&
            JSON.stringify(
              [...foundSet.map((c) => c.abstractCardId)].sort()
            ) === JSON.stringify(sortedSolutionIds)
        );

        if (alreadyFound) {
          setMessage("You already found this Set!");
          isSetFoundThisTurn = true;
          break;
        }

        const emptySlotIndex = foundSolutions.findIndex(
          (slot) => slot === null
        );
        if (emptySlotIndex !== -1) {
          const cardsForSolutionSet = solutionIds
            .map((id) =>
              puzzle.cards.find((card) => card.abstractCardId === id)
            )
            .filter(Boolean) as ClientCardData[];

          if (cardsForSolutionSet.length === 3) {
            // Ensure all cards were found
            setFoundSolutions((prev) => {
              const newFound = [...prev];
              newFound[emptySlotIndex] = cardsForSolutionSet;
              return newFound;
            });

            // Check if all sets are found
            const newNumSolutionsFound =
              foundSolutions.filter((s) => s !== null).length + 1; // +1 for the current one
            if (
              newNumSolutionsFound === puzzle.solutions.length &&
              puzzle.solutions.length > 0
            ) {
              setIsGameCompleted(true);
              if (startTime) {
                // If timer was running
                // Capture final elapsed time
                const finalElapsedTime = elapsedTime + (Date.now() - startTime);
                setElapsedTime(finalElapsedTime);
                setCurrentTime(finalElapsedTime); // Ensure currentTime reflects the final time immediately
              }
              setStartTime(null); // Stop the timer
              setMessage("Congratulations! You found all Sets!");
            } else {
              setMessage("Congratulations! You found a Set!");
            }
            isSetFoundThisTurn = true;
          } else {
            // This case should ideally not happen if puzzle data is consistent
            console.error("Could not find all cards for a valid solution set.");
            setMessage("Error processing set. Try again.");
          }
        } else {
          // All 6 slots are filled, but this set wasn't among them (should be rare if puzzle.solutions is the source of truth)
          setMessage(
            "Congratulations! You found a Set! (All solution slots full)"
          );
          isSetFoundThisTurn = true;
        }
        break;
      }
    }

    if (!isSetFoundThisTurn) {
      setMessage("Not a Set. Try again!");
    }
    setSelectedCards([]); // Clear selection after checking
  };

  const handlePauseResume = () => {
    if (isGameCompleted) return; // Don't allow pause/resume if game is completed
    const now = Date.now();
    if (isPaused) {
      // Resuming
      setStartTime(now); // Current time becomes the new start for the current segment
      // elapsedTime remains the accumulated time from previous segments
      setIsPaused(false);
    } else {
      // Pausing
      if (startTime) {
        setElapsedTime(
          (prevElapsedTime) => prevElapsedTime + (now - startTime)
        );
      }
      setStartTime(null); // Indicate that the timer is not actively running a segment
      setIsPaused(true);
    }
  };

  const handleNewPuzzleClick = () => {
    const wasGameAlreadyPaused = isPaused;

    // If the game is not already paused by the user, pause it for the dialog
    if (!wasGameAlreadyPaused && startTime && !isGameCompleted) {
      // Only pause if game is running
      handlePauseResume(); // This will set isPaused to true and stop the timer
    }

    // Defer the confirm dialog to allow the pause state to render
    setTimeout(() => {
      if (
        window.confirm(
          "Are you sure you want to start a new puzzle? Your current game progress will be lost."
        )
      ) {
        fetchNewPuzzle(); // fetchNewPuzzle will reset isPaused to false and restart timer
      } else {
        // If user cancels, and we paused the game for this dialog, resume it
        if (!wasGameAlreadyPaused && startTime && !isGameCompleted) {
          // Only resume if we paused it
          handlePauseResume(); // This will set isPaused back to false and resume the timer
        }
      }
    }, 0); // Timeout of 0ms defers execution to the next event loop cycle
  };

  // Navigation Handlers
  const handleNavigateKogum = (e: React.MouseEvent) => {
    e.preventDefault();
    if (activePage === "kogum" && puzzle) return; // Avoid refetch if already on kogum with a puzzle
    setActivePage("kogum");
    fetchNewPuzzle(); // "kogum" page shows a new random puzzle
  };

  const handleNavigateToday = (e: React.MouseEvent) => {
    e.preventDefault();
    setActivePage("today");
    // Placeholder for daily puzzle functionality
    setMessage("Daily puzzle feature coming soon!");
  };

  const handleNavigateRandom = (e: React.MouseEvent) => {
    e.preventDefault();
    if (
      activePage === "random" &&
      puzzle &&
      !window.confirm(
        "Start a new random puzzle? Current progress will be lost."
      )
    ) {
      return; // User cancelled
    }
    setActivePage("random");
    fetchNewPuzzle(); // "random" link explicitly fetches a new random puzzle
  };

  const handleNavigateScores = (e: React.MouseEvent) => {
    e.preventDefault();
    setActivePage("scores");
    setMessage("Scores page coming soon!");
  };

  const handleNavigateLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    if (activePage === "login") return;

    if (startTime && !isPaused && !isGameCompleted) {
      const now = Date.now();
      setElapsedTime(
        (prevElapsedTime) => prevElapsedTime + (now - (startTime || now))
      );
      setStartTime(null);
      setIsPaused(true);
    }
    setActivePage("login");
    setMessage(" ");
  };

  const handleLoginSuccess = (token: string, userData: UserData) => {
    setAuthToken(token);
    setCurrentUser(userData);
    setIsLoggedIn(true);
    setActivePage("userPage");
    setMessage(" "); // Clear any previous messages
    // No need to fetch puzzle here, user page is shown
    setIsLoading(false); // Ensure loading is false when navigating to user page
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setIsLoggedIn(false);
    setCurrentUser(null);
    setAuthToken(null);
    setActivePage("kogum");
    fetchNewPuzzle(); // Fetch a new puzzle for the kogum page
  };

  // Initial loading state for the very first puzzle fetch or when navigating
  if (isLoading && (activePage === "kogum" || activePage === "random")) {
    return <p>Loading puzzle...</p>;
  }
  // If there's no puzzle data after initial load (and not on login/user page)
  if (!puzzle && (activePage === "kogum" || activePage === "random")) {
    return <p>{message || "No puzzle data. Try fetching a new one."}</p>;
  }

  const numSolutionsProvided = puzzle ? puzzle.solutions.length : 0;

  const formatTime = (totalMilliseconds: number): string => {
    const ms = String(totalMilliseconds % 1000).padStart(3, "0");
    const totalSeconds = Math.floor(totalMilliseconds / 1000);
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    return `${minutes}:${seconds}:${ms}`;
  };
  const displayTime = formatTime(currentTime);

  return (
    <div>
      <nav
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px 15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          marginBottom: "0px",
        }}
      >
        <div style={{ display: "flex", gap: "20px" }}>
          <a
            href="#"
            onClick={handleNavigateKogum}
            style={{
              textDecoration: "none",
              color: "#007bff",
              fontWeight: activePage === "kogum" ? "bold" : "normal",
            }}
          >
            køgum
          </a>
          <a
            href="#"
            onClick={handleNavigateToday}
            style={{
              textDecoration: "none",
              color: "#495057",
              fontWeight: activePage === "today" ? "bold" : "normal",
            }}
          >
            tøday
          </a>
          <a
            href="#"
            onClick={handleNavigateRandom}
            style={{
              textDecoration: "none",
              color: "#495057",
              fontWeight: activePage === "random" ? "bold" : "normal",
            }}
          >
            randøm
          </a>
          <a
            href="#"
            onClick={handleNavigateScores}
            style={{
              textDecoration: "none",
              color: "#495057",
              fontWeight: activePage === "scores" ? "bold" : "normal",
            }}
          >
            scøres
          </a>
          {isLoggedIn && currentUser ? (
            <>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActivePage("userPage");
                }}
                style={{
                  textDecoration: "none",
                  color: "#007bff",
                  fontWeight: activePage === "userPage" ? "bold" : "normal",
                }}
              >
                {currentUser.user_name}
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
                style={{ textDecoration: "none", color: "#dc3545" }}
              >
                løgout
              </a>
            </>
          ) : (
            <a
              href="#"
              onClick={handleNavigateLogin}
              style={{
                textDecoration: "none",
                color: "#495057",
                fontWeight: activePage === "login" ? "bold" : "normal",
              }}
            >
              løgin
            </a>
          )}
        </div>
      </nav>

      {/* Content based on activePage */}
      {activePage === "login" && !isLoggedIn && (
        <AuthPage onLoginSuccess={handleLoginSuccess} />
      )}
      {activePage === "userPage" && isLoggedIn && currentUser && (
        <UserPage currentUser={currentUser} />
      )}

      {(activePage === "kogum" || activePage === "random") && puzzle && (
        <>
          {/* Puzzle Menu Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px 15px",
              borderBottom: "1px solid #eee",
              marginBottom: "15px",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div style={{ fontSize: "1.1em", fontWeight: "bold" }}>
              {activePage === "kogum" ? "køgum" : "randøm"}
            </div>

            <div
              style={{
                color:
                  message.trim() === "" || message.startsWith("Congratulations")
                    ? "green"
                    : "red",
                fontWeight: "bold",
                minHeight: "1.2em",
                textAlign: "center",
                flexGrow: 1,
                visibility: message.trim() === "" ? "hidden" : "visible",
              }}
            >
              {message}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <div style={{ fontSize: "1.2em", fontFamily: "monospace" }}>
                {displayTime}
              </div>
              <button
                onClick={handlePauseResume}
                disabled={isGameCompleted || !puzzle}
              >
                {isPaused ? "Resume" : "Pause"}
              </button>
              <button
                onClick={() => {
                  setActivePage("random");
                  handleNewPuzzleClick();
                }}
                disabled={!puzzle}
              >
                New Puzzle
              </button>
            </div>
          </div>

          {/* Main Game Layout */}
          <div
            className="game-area-container"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              gap: "20px",
              padding: "0 15px",
            }}
          >
            {/* Solution Area Wrapper */}
            <div
              className="solution-area-wrapper"
              style={{
                width: "310px",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "8px",
              }}
            >
              <div
                className="solution-slots"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gridTemplateRows: "repeat(6, auto)",
                  gap: "8px",
                  justifyItems: "center",
                }}
              >
                {Array(numSolutionsProvided > 0 ? numSolutionsProvided : 6)
                  .fill(null)
                  .map((_, index) => {
                    const solutionSet = foundSolutions[index];
                    return (
                      <div
                        key={`solution-slot-${index}`}
                        className="solution-slot"
                        style={{
                          border: "1px dashed #aaa",
                          borderRadius: "5px",
                          padding: "5px",
                          width: "284px",
                          height: "68px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: solutionSet ? "flex-start" : "center",
                          gap: "7px",
                          backgroundColor: solutionSet ? "#e8f5e9" : "#f0f0f0",
                        }}
                      >
                        {solutionSet ? (
                          solutionSet.map((card) => (
                            <div
                              key={`sol-${card.abstractCardId}-${index}-wrapper`}
                              style={{
                                transform: "scale(0.5)",
                                transformOrigin: "top left",
                                width: "90px",
                                height: "60px",
                              }}
                            >
                              <CardComponent
                                cardData={card}
                                onSelect={() => {}}
                                isSelected={false}
                                applyMargins={false}
                                isPaused={isPaused}
                                isSolutionDisplayCard={true}
                              />
                            </div>
                          ))
                        ) : (
                          <span style={{ color: "#aaa" }}>
                            Solution Set {index + 1}
                          </span>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Card Grid */}
            <div
              className="card-board"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gridTemplateRows: "repeat(4, 1fr)",
                gap: "5px",
                maxWidth: "600px",
                padding: "5px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                alignSelf: "flex-start",
              }}
            >
              {puzzle.cards.map((card) => (
                <CardComponent
                  key={card.abstractCardId}
                  cardData={card}
                  onSelect={handleCardSelect}
                  isSelected={selectedCards.includes(card.abstractCardId)}
                  isPaused={isPaused}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {(activePage === "today" || activePage === "scores") && (
        <div
          style={{ textAlign: "center", marginTop: "20px", padding: "20px" }}
        >
          <p>{message}</p>
        </div>
      )}
    </div>
  );
};

export default Game;
