// /workspaces/kogum/packages/frontend/src/pages/UserDashboardPage.tsx
import React from "react";
import UserPageComponent from "./UserPage";
import type { UserData } from "../types";

interface UserDashboardPageProps {
  currentUser: UserData;
}

interface UserDashboardPageWithLogoutProps extends UserDashboardPageProps {
  onLogout: () => void;
}

const UserDashboardPage: React.FC<UserDashboardPageWithLogoutProps> = ({
  currentUser,
  onLogout,
}) => {
  return <UserPageComponent currentUser={currentUser} onLogout={onLogout} />;
};

export default UserDashboardPage;
