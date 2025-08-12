import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [serverMessage, setServerMessage] = useState("");


  let timeout; // Declare it outside component or useRef for safety

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setServerMessage("");

    if (!email || !password || !otp) {
      setError("All fields are required");
      return;
    }

  clearTimeout(timeout); // Clear any previous timeout

  timeout = setTimeout(async () => {
      try {
       

    const response = await axios.post(
      "http://localhost:9000/loginUser",
      { email, password, otp }, // Request body (Axios will stringify this)
      { withCredentials: true } // Axios config
    );



      const res = response.data;


        if (response.status === 401) {
          setError("Unauthorized: Invalid email or password");
          return;
        }

        if (response.status === 201) {
          alert("Check your form for errors");
          return;
        }

        const data = await response.json();

        console.log("User info:", data);

        if (data?.user?.token) {
          const existingToken = Cookies.get("usersdatatoken");

          if (!existingToken || existingToken !== data.user.token) {
            Cookies.set("usersdatatoken", data.user.token, {
              secure: true,
              sameSite: "Strict",
              expires: 1, // 1 day
            });
            console.log("Cookie added/updated successfully!");
          } else {
            console.log("Cookie already exists and is up-to-date:", existingToken);
          }
        } else {
          console.log("Token missing from response");
        }

        setServerMessage("Login successful!");
        navigate("/dashboard");

      } catch (err) {
        console.error("Error during login:", err.message);
        setError("An unexpected error occurred. Please try again.");
      }
    }, 2000);
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <input
          type="text"
          placeholder="OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <button type="submit" style={{ width: "100%", padding: "10px" }}>
          Login
        </button>

        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        {serverMessage && <p style={{ color: "green", marginTop: "10px" }}>{serverMessage}</p>}
      </form>
    </div>
  );
}

export default Login;
