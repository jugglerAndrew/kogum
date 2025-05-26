// /workspaces/kogum/packages/frontend/src/App.tsx
import React, { useState, useEffect } from "react";
import Layout from "./components/Layout"; // Assuming Layout.tsx is in src/components/
import LoginPage from "./pages/LoginPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import GamePage from "./pages/GamePage";
import TodayPage from "./pages/TodayPage";
import ScoresPage from "./pages/ScoresPage";
import type { ActivePage, UserData } from "./types";

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<ActivePage>("kogum");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
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
        setAuthToken(storedToken);
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
    let timeoutId: NodeJS.Timeout | null = null;
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
    setAuthToken(token);
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
    setAuthToken(null);
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

  const renderPage = () => {
    if (appIsLoading) {
      return (
        <p style={{ textAlign: "center", marginTop: "50px" }}>
          Loading application...
        </p>
      );
    }
    switch (activePage) {
      case "kogum":
        // Using key to force re-mount and data fetch if navigating from 'random' to 'kogum'
        // or if you want 'køgum' link to always start a fresh puzzle.
        return <GamePage key="kogum" pageTitle="køgum" />;
      case "random":
        return <GamePage key="random" pageTitle="randøm" />;
      case "today":
        return <TodayPage />;
      case "scores":
        return <ScoresPage />;
      case "login":
        if (!isLoggedIn) {
          return <LoginPage onLoginSuccess={handleLoginSuccess} />;
        }
        // If logged in and tries to go to login, redirect to userPage
        // This state update will cause a re-render, and this function will be called again.
        // To avoid an infinite loop if something goes wrong, ensure userPage logic is sound.
        setActivePage("userPage");
        return null; // Render nothing this cycle, will re-render with 'userPage'
      case "userPage":
        if (isLoggedIn && currentUser) {
          return <UserDashboardPage currentUser={currentUser} />;
        }
        // If not logged in and tries to go to userPage, redirect to login
        setActivePage("login");
        return null; // Render nothing this cycle, will re-render with 'login'
      default:
        // Fallback for unknown page
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
      setActivePage={setActivePage} // Pass setActivePage for direct navigation like User Profile link
      isLoggedIn={isLoggedIn}
      currentUser={currentUser}
      onLogout={handleLogout}
      onNavigateLogin={handleNavigateLogin}
      onNavigateKogum={handleNavigateKogum}
      onNavigateToday={handleNavigateToday}
      onNavigateRandom={handleNavigateRandom}
      onNavigateScores={handleNavigateScores}
    >
      {renderPage()}
    </Layout>
  );
};

export default App;
