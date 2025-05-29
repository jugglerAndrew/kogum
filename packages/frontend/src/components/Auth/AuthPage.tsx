import React from "react";
import Login from "./Login";
import Register from "./Register";

interface UserData {
  user_id: string;
  user_name: string;
  user_email: string;
}
interface AuthPageProps {
  onLoginSuccess: (token: string, userData: UserData) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row", // Default, but explicit
        justifyContent: "space-around", // Distribute space around items
        alignItems: "flex-start", // Align items to the top
        gap: "20px", // Space between login and register components
        padding: "20px",
        maxWidth: "1000px", // Max width for the auth page container
        margin: "20px auto", // Center the auth page container
      }}
    >
      <div style={{ flex: 1, minWidth: "300px", maxWidth: "420px" }}>
        {" "}
        {/* Login container */}
        <Login onLoginSuccess={onLoginSuccess} />
      </div>
      <p>
        <h2>
          <b>or</b>
        </h2>
      </p>
      <div style={{ flex: 1, minWidth: "300px", maxWidth: "420px" }}>
        {" "}
        {/* Register container */}
        <Register />
      </div>
    </div>
  );
};

export default AuthPage;
