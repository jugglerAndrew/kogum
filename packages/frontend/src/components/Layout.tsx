// /workspaces/kogum/packages/frontend/src/components/Layout.tsx
import React from "react";
import type { UserData } from "../types";
import { Link, useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
  isLoggedIn: boolean;
  currentUser: UserData | null;
  onLogout: () => void;
}

// Extend the Window interface to include setActivePage for dev/debug use
declare global {
  interface Window {
    setActivePage?: (page: string) => void;
  }
}

const isDev = import.meta.env.MODE === "development";
const Layout: React.FC<LayoutProps> = ({
  children,
  isLoggedIn,
  currentUser,
  onLogout,
}) => {
  const location = useLocation();
  return (
    <div className="layout-container">
      <nav className="layout-nav">
        <div className="layout-nav-links">
          <Link
            className={`layout-nav-link${
              location.pathname === "/" ? " active" : ""
            }`}
            to="/"
          >
            køgum
          </Link>
          <Link
            className={`layout-nav-link${
              location.pathname === "/tutorial" ? " active" : ""
            }`}
            to="/tutorial"
          >
            tutørial
          </Link>
          <Link
            className={`layout-nav-link${
              location.pathname === "/today" ? " active" : ""
            }`}
            to="/today"
          >
            tøday
          </Link>
          <Link
            className={`layout-nav-link${
              location.pathname === "/random" ? " active" : ""
            }`}
            to="/random"
          >
            randøm
          </Link>
          <Link
            className={`layout-nav-link${
              location.pathname === "/scores" ? " active" : ""
            }`}
            to="/scores"
          >
            scøres
          </Link>
          {isDev && (
            <Link
              className={`layout-nav-link${
                location.pathname === "/debugCombinations" ? " active" : ""
              }`}
              to="/debugCombinations"
            >
              debug
            </Link>
          )}
          {isLoggedIn && currentUser ? (
            <Link
              className={`layout-nav-link${
                location.pathname === "/user" ? " active" : ""
              }`}
              to="/user"
            >
              {currentUser.user_name}
            </Link>
          ) : (
            <Link
              className={`layout-nav-link${
                location.pathname === "/login" ? " active" : ""
              }`}
              to="/login"
            >
              løgin
            </Link>
          )}
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
