// Utility functions for puzzle leaderboards and personal bests
// Uses JWT from localStorage for auth endpoints

const API_BASE = "/api/puzzle";

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
  const res = await fetch(input, init);
  if (res.status === 401) {
    localStorage.removeItem("authToken");
    // Optionally, redirect to login page
    window.location.href = "/login";
    throw new Error(
      "Unauthorized: Token expired or invalid. Redirecting to login."
    );
  }
  return res;
}

export async function fetchPersonalBests() {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...getAuthHeaders(),
  };
  const res = await fetchWithAuth(`${API_BASE}/personal-bests`, {
    headers,
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch personal bests: ${res.status}`);
  }
  return res.json();
}

export async function recordPuzzleCompletion({
  daily_puzzle_id,
  meal_type,
  puzzle_type = "daily",
  start_time,
  end_time,
}: {
  daily_puzzle_id: number;
  meal_type: string;
  puzzle_type?: string;
  start_time: string; // ISO string
  end_time: string; // ISO string
}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...getAuthHeaders(),
  };
  const res = await fetchWithAuth(`${API_BASE}/complete`, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify({
      dailyPuzzleId: daily_puzzle_id, // use camelCase for backend compatibility
      meal_type,
      puzzle_type,
      start_time,
      end_time,
    }),
  });
  if (!res.ok) {
    throw new Error(`Failed to record puzzle completion: ${res.status}`);
  }
  return res.json();
}

export async function startPuzzleForUser(daily_puzzle_id: number) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...getAuthHeaders(),
  };
  const res = await fetchWithAuth(`${API_BASE}/start`, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify({ dailyPuzzleId: daily_puzzle_id }),
  });
  if (!res.ok) {
    throw new Error(`Failed to start puzzle: ${res.status}`);
  }
  return res.json();
}

// Optionally, add leaderboard fetchers here as needed
