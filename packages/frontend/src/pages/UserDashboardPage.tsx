// /workspaces/kogum/packages/frontend/src/pages/UserDashboardPage.tsx
import React from "react";
import UserPageComponent from "../components/UserPage"; // Renamed to avoid conflict
import type { UserData } from "../types";

interface UserDashboardPageProps {
  currentUser: UserData;
}

const UserDashboardPage: React.FC<UserDashboardPageProps> = ({
  currentUser,
}) => {
  return <UserPageComponent currentUser={currentUser} />;
};

export default UserDashboardPage;
