import React, { useState } from "react";

// Define a simple type for the user data returned on login
interface UserData {
  user_id: string;
  user_name: string;
  user_email: string;
}

interface LoginProps {
  // Optional: Callback for when login is successful
  // onLoginSuccess?: (token: string, userData: UserData) => void;
}

const Login: React.FC<LoginProps> = (/*{ onLoginSuccess }*/) => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    if (!userName || !password) {
      setMessage("Username and password are required.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_name: userName,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Login successful!");
        // Store token and user data (e.g., in localStorage)
        // localStorage.setItem('authToken', data.token);
        // localStorage.setItem('userData', JSON.stringify(data.user));
        // if (onLoginSuccess) {
        //   onLoginSuccess(data.token, data.user);
        // }
        // For now, just clear form. Redirection/state update can be handled by parent or context.
        setUserName("");
        setPassword("");
      } else {
        setMessage(
          data.message || "Login failed. Please check your credentials."
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#000",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>løgin</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="login-username"
            style={{ display: "block", marginBottom: "5px" }}
          >
            Username:
          </label>
          <input
            type="text"
            id="login-username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              boxSizing: "border-box",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="login-password"
            style={{ display: "block", marginBottom: "5px" }}
          >
            Password:
          </label>
          <input
            type="password"
            id="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              boxSizing: "border-box",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      {message && (
        <p
          style={{
            marginTop: "20px",
            textAlign: "center",
            color: message.includes("successful") ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default Login;
