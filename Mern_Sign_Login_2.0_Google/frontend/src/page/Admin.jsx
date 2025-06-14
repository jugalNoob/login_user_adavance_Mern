import axios from 'axios';
import React, { useEffect, useState } from 'react';
import "./style/admin.css";

function Admin() {
  const [users, setUsers] = useState([]); // Rename state variable for clarity
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  const fetchAdminData = async () => {
    try {
      const response = await axios.get("http://localhost:9000/Admin", { withCredentials: true });

      if (response.status === 400) {
        setError("Not Authorized");
        setUsers([]);
      } else {
        setUsers(response.data.getuser || []);
        setError(null); // Clear any previous error
      }
    } catch (err) {
      console.error("Error fetching admin data:", err);
      setError("An error occurred while fetching admin data.");
      setUsers([]);
    } finally {
      setLoading(false); // End loading state
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <div className="admin-container">
      {loading ? (
        <p>Loading...</p> // Loading message
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
        </div>
      ) : users.length === 0 ? (
        <p>No users found.</p> // Message for empty user list
      ) : (
        <div className="users-display">
          {users.map((user) => (
            <div className="user-card" key={user._id}>
              <h2>User ID: {user._id}</h2>
              <h2>Name: {user.name}</h2>
              <h2>Email: {user.email}</h2>
              <h2>Date: {new Date(user.date).toLocaleDateString()}</h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Admin;



// Changes Explained:
// loading State:

// Displays "Loading..." until data fetch is complete.
// error State:

// Displays specific error messages when fetch fails or user is unauthorized.
// users.length Check:

// Displays "No users found" if the fetched data is empty.
// CSS Class Names:

// More descriptive names like admin-container, users-display, user-card, and error-message.