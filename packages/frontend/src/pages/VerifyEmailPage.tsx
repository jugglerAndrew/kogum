import React, { useEffect, useState, useRef } from "react";
import { useLocation, Link } from "react-router-dom";

const VerifyEmailPage: React.FC = () => {
  const [status, setStatus] = useState<
    "pending" | "success" | "expired" | "invalid" | "already" | "error"
  >("pending");
  const [message, setMessage] = useState<string>("");
  const location = useLocation();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (!token) {
      setStatus("invalid");
      setMessage("Verification token is required.");
      return;
    }
    fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          if (data.message === "Email verified successfully!") {
            setStatus("success");
            setMessage(data.message);
          } else if (data.message === "Account already verified.") {
            setStatus("already");
            setMessage(data.message);
          } else {
            setStatus("success");
            setMessage(data.message);
          }
        } else {
          if (data.message === "Verification link has expired.") {
            setStatus("expired");
          } else {
            setStatus("invalid");
          }
          setMessage(data.message || "Verification failed.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("An error occurred while verifying your email.");
      });
  }, [location.search]);

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto", textAlign: "center" }}>
      <h2>Email Verification</h2>
      {status === "pending" && <p>Verifying your email...</p>}
      {status === "success" && (
        <>
          <p style={{ color: "green" }}>{message}</p>
          <Link to="/login">Go to Login</Link>
        </>
      )}
      {status === "already" && (
        <>
          <p>{message}</p>
          <Link to="/login">Go to Login</Link>
        </>
      )}
      {status === "expired" && (
        <>
          <p style={{ color: "red" }}>{message}</p>
          {/* Optionally add a resend link here */}
        </>
      )}
      {status === "invalid" && <p style={{ color: "red" }}>{message}</p>}
      {status === "error" && <p style={{ color: "red" }}>{message}</p>}
    </div>
  );
};

export default VerifyEmailPage;
