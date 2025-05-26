// /workspaces/kogum/packages/frontend/src/pages/LoginPage.tsx
import React from "react";
import AuthPage from "../components/Auth/AuthPage";
import type { UserData } from "../types";

interface LoginPageProps {
  onLoginSuccess: (token: string, userData: UserData) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  return <AuthPage onLoginSuccess={onLoginSuccess} />;
};

export default LoginPage;
