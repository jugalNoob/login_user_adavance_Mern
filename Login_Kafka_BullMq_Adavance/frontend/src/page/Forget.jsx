import axios from "axios";
import React, { useState, useRef } from "react";

const Update = () => {
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const timeoutRef = useRef(null);  // persist timeout between renders
  const countRef = useRef(0);       // persist click count between renders

  const handleUpdate = (e) => {
    e.preventDefault();
    console.log("Click Count:", countRef.current++);

    clearTimeout(timeoutRef.current);  // Cancel previous pending update

    timeoutRef.current = setTimeout(async () => {
      try {
        const data = { password };
        const response = await axios.patch(
          `http://localhost:9000/v1/forget/${id}/${email}`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          alert("Student updated successfully!");
        } else {
          alert("Failed to update student data.");
        }
      } catch (error) {
        console.error("Error updating student:", error);
        alert("An error occurred while updating student data.");
      }
    }, 2000); // Delay of 2 seconds
  };

  return (
    <div style={{ width: "100%", maxWidth: "500px", margin: "0 auto" }}>
      <h2>Update Student</h2>
      <form onSubmit={handleUpdate}>
        <label>
          Student ID:
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
            placeholder="Enter student ID"
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter student email"
          />
        </label>
        <br />
        <label>
          Name:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter student name"
          />
        </label>
        <br />
     
        <br />
      
        <br />
        <button type="submit">Update Student</button>
      </form>
    </div>
  );
};

export default Update;
