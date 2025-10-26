import { useState } from "react";

export default function UserProfile() {
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    if (!userId.trim()) {
      setError("Please enter a user ID");
      return;
    }

    setLoading(true);
    setError(null);
    setUser(null);

    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
      if (!response.ok) {
        throw new Error("User not found");
      }
      const data = await response.json();
      setUser(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchUser();
  };

  return (
    <div>
      <h2>Find User by ID</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Enter user ID..."
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {user && (
        <div>
          <h3>User Profile</h3>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>City:</strong> {user.address.city}</p>
        </div>
      )}
    </div>
  );
}