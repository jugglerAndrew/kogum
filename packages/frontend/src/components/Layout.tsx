// /workspaces/kogum/packages/frontend/src/components/Layout.tsx
import React from "react";
import type { ActivePage, UserData } from "../types";

interface LayoutProps {
  children: React.ReactNode;
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  isLoggedIn: boolean;
  currentUser: UserData | null;
  onLogout: () => void;
  onNavigateLogin: () => void; // Specific handler for login navigation
  onNavigateKogum: () => void;
  onNavigateToday: () => void;
  onNavigateRandom: () => void;
  onNavigateScores: () => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  activePage,
  setActivePage,
  isLoggedIn,
  currentUser,
  onLogout,
  onNavigateLogin,
  onNavigateKogum,
  onNavigateToday,
  onNavigateRandom,
  onNavigateScores,
}) => {
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
            onClick={(e) => {
              e.preventDefault();
              onNavigateKogum();
            }}
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
            onClick={(e) => {
              e.preventDefault();
              onNavigateToday();
            }}
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
            onClick={(e) => {
              e.preventDefault();
              onNavigateRandom();
            }}
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
            onClick={(e) => {
              e.preventDefault();
              onNavigateScores();
            }}
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
                  onLogout();
                }}
                style={{ textDecoration: "none", color: "#dc3545" }}
              >
                løgout
              </a>
            </>
          ) : (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onNavigateLogin();
              }}
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
      <main>{children}</main>
    </div>
  );
};

export default Layout;
