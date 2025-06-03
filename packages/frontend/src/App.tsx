// /workspaces/kogum/packages/frontend/src/App.tsx
import React, { useState, useEffect } from "react";
import Layout from "./components/Layout"; // Assuming Layout.tsx is in src/components/
import LoginPage from "./pages/LoginPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import DailyPage from "./pages/DailyPage";
import RandomPage from "./pages/RandomPage";
import ScoresPage from "./pages/ScoresPage";
import WelcomePage from "./pages/WelcomePage";
import TutorialPage from "./pages/TutorialPage";
import type { ActivePage, UserData } from "./types";
import DebugCombinationsPage from "./pages/DebugCombinationsPage";

const isDev = import.meta.env.MODE === "development";
const App: React.FC = () => {
  const [activePage, setActivePage] = useState<ActivePage>("kogum");
  // Expose setActivePage globally for debug nav (dev only)
  if (isDev && typeof window !== "undefined") {
    // @ts-expect-error: Exposing for debug nav
    window.setActivePage = setActivePage;
  }
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  // Remove unused authToken
  const [appIsLoading, setAppIsLoading] = useState<boolean>(true); // For initial auth check
  const [globalMessage, setGlobalMessage] = useState<string>(" "); // For messages not tied to game page

  useEffect(() => {
    // Initial auth check from localStorage
    const storedToken = localStorage.getItem("authToken");
    const storedUserData = localStorage.getItem("userData");
    let initialPage: ActivePage = "kogum";

    if (storedToken && storedUserData) {
      try {
        const userData: UserData = JSON.parse(storedUserData);
        setCurrentUser(userData);
        setIsLoggedIn(true);
        initialPage = "userPage"; // Default to user page if logged in
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        // Fallback to default 'kogum' page
      }
    }
    setActivePage(initialPage);
    setAppIsLoading(false); // Done with initial auth check and page setup
  }, []); // Empty dependency array ensures this runs once on mount

  // Effect for global messages (e.g., "Feature coming soon")
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    if (globalMessage.trim() !== "") {
      timeoutId = setTimeout(() => {
        setGlobalMessage(" ");
      }, 5000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [globalMessage]);

  const handleLoginSuccess = (token: string, userData: UserData) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("userData", JSON.stringify(userData));
    setCurrentUser(userData);
    setIsLoggedIn(true);
    setActivePage("userPage");
    setGlobalMessage(" ");
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActivePage("kogum"); // Or 'login' if you prefer
    setGlobalMessage(" ");
  };

  // Navigation Handlers
  const handleNavigateKogum = () => {
    setActivePage("kogum");
    setGlobalMessage(" ");
  };

  const handleNavigateToday = () => {
    setActivePage("today");
    setGlobalMessage(" ");
  };

  const handleNavigateRandom = () => {
    setActivePage("random");
    setGlobalMessage(" ");
  };

  const handleNavigateScores = () => {
    setActivePage("scores");
    setGlobalMessage("Scores page coming soon!");
  };

  const handleNavigateLogin = () => {
    if (activePage === "login") return;
    // If coming from a game page, the GamePage component itself should handle pausing its timer on unmount.
    setActivePage("login");
    setGlobalMessage(" ");
  };

  const handleNavigateTutorial = () => {
    setActivePage("tutorial");
    setGlobalMessage(" ");
  };

  const handleNavigateUserPage = () => {
    setActivePage("userPage");
    setGlobalMessage(" ");
  };

  const renderPage = () => {
    if (appIsLoading) {
      return (
        <p style={{ textAlign: "center", marginTop: "50px" }}>
          Loading application...
        </p>
      );
    }
    // Debug page route (only in dev)
    if (isDev && activePage === "debugCombinations") {
      return <DebugCombinationsPage />;
    }
    switch (activePage) {
      case "kogum":
        return (
          <WelcomePage
            onPlayToday={handleNavigateToday}
            onPlayRandom={handleNavigateRandom}
            onRegister={handleNavigateLogin}
          />
        );
      case "tutorial":
        return <TutorialPage />;
      case "random":
        return <RandomPage />;
      case "today":
        return <DailyPage />;
      case "scores":
        return <ScoresPage />;
      case "login":
        if (!isLoggedIn) {
          return <LoginPage onLoginSuccess={handleLoginSuccess} />;
        }
        setActivePage("userPage");
        return null;
      case "userPage":
        if (isLoggedIn && currentUser) {
          return (
            <UserDashboardPage
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          );
        }
        setActivePage("login");
        return null;
      default:
        return (
          <p style={{ textAlign: "center", marginTop: "50px" }}>
            Page not found.
          </p>
        );
    }
  };

  if (appIsLoading) {
    // This ensures that the Layout isn't rendered before auth check is complete,
    // preventing a flash of the wrong nav items.
    return (
      <p style={{ textAlign: "center", marginTop: "50px" }}>
        Loading application...
      </p>
    );
  }

  return (
    <Layout
      activePage={activePage}
      isLoggedIn={isLoggedIn}
      currentUser={currentUser}
      onLogout={handleLogout}
      onNavigateLogin={handleNavigateLogin}
      onNavigateKogum={handleNavigateKogum}
      onNavigateToday={handleNavigateToday}
      onNavigateRandom={handleNavigateRandom}
      onNavigateScores={handleNavigateScores}
      onNavigateTutorial={handleNavigateTutorial}
      onNavigateUserPage={handleNavigateUserPage}
    >
      {renderPage()}
    </Layout>
  );
};

export default App;
