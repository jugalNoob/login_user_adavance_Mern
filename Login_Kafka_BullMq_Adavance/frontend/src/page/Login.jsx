import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cookie from 'js-cookie';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [serverMessage, setServerMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setServerMessage('');

    if (!email || !password || !otp) {
      setError('All fields are required');
      return;
    }

    try {
      const res = await fetch("http://localhost:9000/v1/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, otp }),
      });

      const data = await res.json();

      if (res.status !== 200) {
        setError(data.error || "Login failed");
        return;
      }

      cookie.set("usersdatatoken", data.token, {
        expires: 1,
        sameSite: "Strict",
      });

      setServerMessage(data.message);
      alert("🎉 Login successful!");
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Server error during login");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <input
          type="text"
          placeholder="OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          style={{ width: '100%', marginBottom: '10px' }}
        />

        <button type="submit" style={{ width: '100%', padding: '10px' }}>
          Login
        </button>

        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        {serverMessage && <p style={{ color: 'green', marginTop: '10px' }}>{serverMessage}</p>}
      </form>
    </div>
  );
}

export default Login;
