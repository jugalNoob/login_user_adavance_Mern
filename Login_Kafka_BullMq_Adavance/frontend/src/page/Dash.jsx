import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import "./style/dash.css";
import cookie from "js-cookie"

function Dash() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for better UX
  const [error, setError] = useState(null); // Error state for fetch failures
  const navigate = useNavigate();

  useEffect(() => {
    const callAbout = async () => {
      // const token = localStorage.getItem("usersdatatoken");

      const token =  cookie.get("usersdatatoken")

      // if (!token) {
      //   navigate("/login");
      //   return; // Exit early if no token is found
      // }

      try {
        const res = await fetch("http://localhost:9000/GetUser", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token,
          },
        });

        if (res.status === 401) {
          setError("Unauthorized access. Please log in.");
          localStorage.removeItem("usersdatatoken"); // Clear invalid token
          navigate("/login");
          return;
        }

        const data = await res.json();

       console.log(data)

        if (!data || res.status !== 200) {
          setError("Failed to fetch user data.");
        } else {
          setUserData(data);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false); // End loading state
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

  return (
    <div className="dashBack">
      <div className="dash">
        <div className="head-dash">
          <h1>User Dashboard</h1>
        </div>
        <div className="dash-user">
          <div className="user-one">
            <h1>_id: {userData?.userData?._id || "ID not available"}</h1>
            <h1>Name: {userData?.userData?.name || "Name not available"}</h1>
            <h1>Email: {userData?.userData?.email || "Email not available"}</h1>
          </div>
          <div className="user-two">
            <h3>Password: {userData?.userData?.password || "Password not available"}</h3>
            <h1>Date: {userData?.userData?.date ? new Date(userData.userData.date).toLocaleDateString() : "Date not available"}</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dash;



// http://localhost:3000/dash/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2NzFiMmIyNWUxY2MxZDllMGM5ZWQxZjIiLCJlbWFpbCI6InZpc2hhbGdvZHdhckBnbWFpbC5jb20iLCJpYXQiOjE3MzI3MDc5NjR9.loQw_YWVZA4YlFx8FTf7TO0hU75frncxY1OB9uyCyM4
//http://localhost:3000/dash/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2NzFiMmIyNWUxY2MxZDllMGM5ZWQxZjIiLCJlbWFpbCI6InZpc2hhbGdvZHdhckBnbWFpbC5jb20iLCJpYXQiOjE3MzI3NzUzNDF9.qRTq7TRfj1L7k9e8yqUhURA0gkT_JutPUqgswpAL4Tc
//http://localhost:3000/dash/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2NzFiMmIyNWUxY2MxZDllMGM5ZWQxZjIiLCJlbWFpbCI6InZpc2hhbGdvZHdhckBnbWFpbC5jb20iLCJpYXQiOjE3MzI3NzU4NjZ9.WgVXncpdlm-00hGNHNkVkMqm9H3pjN-gegqtCbRwECw\

