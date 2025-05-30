// /workspaces/kogum/packages/frontend/src/components/Layout.tsx
import React from "react";
import type { ActivePage, UserData } from "../types";

interface LayoutProps {
  children: React.ReactNode;
  activePage: ActivePage;
  isLoggedIn: boolean;
  currentUser: UserData | null;
  onLogout: () => void;
  onNavigateLogin: () => void;
  onNavigateKogum: () => void;
  onNavigateToday: () => void;
  onNavigateRandom: () => void;
  onNavigateScores: () => void;
  onNavigateTutorial: () => void;
  onNavigateUserPage: () => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  activePage,
  isLoggedIn,
  currentUser,
  onNavigateLogin,
  onNavigateKogum,
  onNavigateToday,
  onNavigateRandom,
  onNavigateScores,
  onNavigateTutorial,
  onNavigateUserPage,
}) => {
  return (
    <div className="layout-container">
      <nav className="layout-nav">
        <div className="layout-nav-links">
          <a
            href="#"
            className={`layout-nav-link${
              activePage === "kogum" ? " active" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              onNavigateKogum();
            }}
          >
            køgum
          </a>
          <a
            href="#"
            className={`layout-nav-link${
              activePage === "tutorial" ? " active" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              onNavigateTutorial();
            }}
          >
            tutørial
          </a>
          <a
            href="#"
            className={`layout-nav-link${
              activePage === "today" ? " active" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              onNavigateToday();
            }}
          >
            tøday
          </a>
          <a
            href="#"
            className={`layout-nav-link${
              activePage === "random" ? " active" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              onNavigateRandom();
            }}
          >
            randøm
          </a>
          <a
            href="#"
            className={`layout-nav-link${
              activePage === "scores" ? " active" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              onNavigateScores();
            }}
          >
            scøres
          </a>
          {isLoggedIn && currentUser ? (
            <>
              <a
                href="#"
                className={`layout-nav-link${
                  activePage === "userPage" ? " active" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateUserPage();
                }}
              >
                {currentUser.user_name}
              </a>
            </>
          ) : (
            <a
              href="#"
              className={`layout-nav-link${
                activePage === "login" ? " active" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                onNavigateLogin();
              }}
            >
              løgin
            </a>
          )}
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
