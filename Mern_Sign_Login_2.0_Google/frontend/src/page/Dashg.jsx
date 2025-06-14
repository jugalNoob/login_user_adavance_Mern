
import axios from "axios";
import React, { useEffect, useState } from "react";

function Dashg() {
  const [users, setUsers] = useState([]); // State to store user data
  const [error, setError] = useState(null); // State to handle errors

  const getUser = async () => {
    try {
      const response = await axios.get("http://localhost:9000/users", { withCredentials: true });

      console.log("Response Data:", response.data); // Debug: Check the exact API response

      if (response.data.users) {
        setUsers(response.data.users); // Assuming API returns { users: [...] }
      } else if (response.data.user) {
        setUsers([response.data.user]); // If API returns a single user object { user: {...} }
      } else {
        setUsers([]); // Handle unexpected response format
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users. Please try again.");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div>
      <h2>User List</h2>

      {error && <p style={{ color: "red" }}>{error}</p>} {/* Show error if exists */}

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>googleId</th>
            <th>email</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id || user._id}> {/* Use `id` or `_id` depending on API */}
                <td>{user.id || user._id}</td>
                <td>{user.displayName || user.name}</td> {/* Fallback to `name` */}
                <td>{user.googleId || user.googleId}</td> {/* Fallback to `email` */}
                <td>{user.email || user.email}</td> {/* Fallback to `email` */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Dashg;
