import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cookie from "js-cookie";

const Dash = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleGitHubLogin = () => {
    window.location.href = 'http://localhost:9000/auth/github';
  };

  useEffect(() => {
    const callAbout = async () => {
      const token = cookie.get("usersdatatoken");

      if (!token) {
        setError("Token not found. Please log in.");
        navigate("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:9000/GetUser", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token,
          },
        });

        if (res.status === 401) {
          setError("Unauthorized access. Please log in again.");
          cookie.remove("usersdatatoken");
          navigate("/login");
          return;
        }

        const data = await res.json();

        if (!data || res.status !== 200) {
          setError("Failed to fetch user data.");
        } else {
          setUserData(data);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    callAbout();
  }, [navigate]);

  if (loading) {
    return <p>Loading user data...</p>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
      </div>
    );
  }

  const user = userData?.userData;

  return (
    <div className="dashBack">
      <div className="dash">
        <div className="head-dash">
          <h1>User Dashboard</h1>
        </div>
        <div className="dash-user">
          <div className="user-one">
            <h1>_id: {user?._id || "ID not available"}</h1>
            <h1>Name: {user?.name || "Name not available"}</h1>
            <h1>Email: {user?.email || "Email not available"}</h1>
          </div>
          <div className="user-two">
            <h3>Password: {user?.password || "Password not available"}</h3>
            <h1>Date: {user?.date ? new Date(user.date).toLocaleDateString() : "Date not available"}</h1>
          </div>
        </div>

        <button onClick={handleGitHubLogin}>Login with GitHub</button>
      </div>
    </div>
  );
};

export default Dash;


// http://localhost:3000/dash/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2NzFiMmIyNWUxY2MxZDllMGM5ZWQxZjIiLCJlbWFpbCI6InZpc2hhbGdvZHdhckBnbWFpbC5jb20iLCJpYXQiOjE3MzI3MDc5NjR9.loQw_YWVZA4YlFx8FTf7TO0hU75frncxY1OB9uyCyM4
// http://localhost:3000/dash/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2NzFiMmIyNWUxY2MxZDllMGM5ZWQxZjIiLCJlbWFpbCI6InZpc2hhbGdvZHdhckBnbWFpbC5jb20iLCJpYXQiOjE3MzI3NzUzNDF9.qRTq7TRfj1L7k9e8yqUhURA0gkT_JutPUqgswpAL4Tc
// http://localhost:3000/dash/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2NzFiMmIyNWUxY2MxZDllMGM5ZWQxZjIiLCJlbWFpbCI6InZpc2hhbGdvZHdhckBnbWFpbC5jb20iLCJpYXQiOjE3MzI3NzU4NjZ9.WgVXncpdlm-00hGNHNkVkMqm9H3pjN-gegqtCbRwECw\

