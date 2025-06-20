// /workspaces/kogum/packages/frontend/src/App.tsx
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import DailyPage from "./pages/DailyPage";
import RandomPage from "./pages/RandomPage";
import ScoresPage from "./pages/ScoresPage";
import WelcomePage from "./pages/WelcomePage";
import TutorialPage from "./pages/TutorialPage";
import DebugCombinationsPage from "./pages/DebugCombinationsPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import type { UserData } from "./types";

const isDev = import.meta.env.MODE === "development";
const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [appIsLoading, setAppIsLoading] = useState<boolean>(true);
  const [, setGlobalMessage] = useState<string>(" ");

  useEffect(() => {
    // Initial auth check from localStorage
    const storedToken = localStorage.getItem("authToken");
    const storedUserData = localStorage.getItem("userData");
    if (storedToken && storedUserData) {
      try {
        const userData: UserData = JSON.parse(storedUserData);
        setCurrentUser(userData);
        setIsLoggedIn(true);
      } catch {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
      }
    }
    setAppIsLoading(false);
  }, []);

  const handleLoginSuccess = (token: string, userData: UserData) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("userData", JSON.stringify(userData));
    setCurrentUser(userData);
    setIsLoggedIn(true);
    setGlobalMessage(" ");
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setIsLoggedIn(false);
    setCurrentUser(null);
    setGlobalMessage(" ");
  };

  if (appIsLoading) {
    return (
      <p style={{ textAlign: "center", marginTop: "50px" }}>
        Loading application...
      </p>
    );
  }

  return (
    <Router>
      <Layout
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        onLogout={handleLogout}
      >
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/tutorial" element={<TutorialPage />} />
          <Route path="/random" element={<RandomPage />} />
          <Route path="/today" element={<DailyPage />} />
          <Route path="/scores" element={<ScoresPage />} />
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/user" replace />
              ) : (
                <LoginPage onLoginSuccess={handleLoginSuccess} />
              )
            }
          />
          <Route
            path="/user"
            element={
              isLoggedIn && currentUser ? (
                <UserDashboardPage
                  currentUser={currentUser}
                  onLogout={handleLogout}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/verify" element={<VerifyEmailPage />} />
          {isDev && (
            <Route
              path="/debugCombinations"
              element={<DebugCombinationsPage />}
            />
          )}
          <Route
            path="*"
            element={
              <p style={{ textAlign: "center", marginTop: "50px" }}>
                Page not found.
              </p>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
