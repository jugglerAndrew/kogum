import React from "react";

interface UserData {
  user_id: string;
  user_name: string;
  user_email: string;
}

interface UserPageProps {
  currentUser: UserData | null;
  onLogout: () => void;
}

const UserPage: React.FC<UserPageProps> = ({ currentUser, onLogout }) => {
  if (!currentUser) {
    return <p>Loading user data or not logged in...</p>;
  }

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Welcome, {currentUser.user_name}!</h1>
      <p>This is your personal page. More features coming soon!</p>
      <p>User ID: {currentUser.user_id}</p>
      <p>Email: {currentUser.user_email}</p>
      {/* Placeholder for rankings, settings, daily puzzles links */}
      <a
        href="#"
        className="layout-nav-link logout"
        onClick={(e) => {
          e.preventDefault();
          onLogout();
        }}
      >
        løgout
      </a>
    </div>
  );
};

export default UserPage;
