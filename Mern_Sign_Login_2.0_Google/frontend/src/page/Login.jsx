import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import './style/login.css';
import cookie from "js-cookie"
function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(''); // For server-side errors

  let timeout;
  
  useEffect(() => {
    return () => {
      // Clear timeout on component unmount
      clearTimeout(timeout);
    };
  }, []);

  const validate = () => {
    const errors = {};

    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Invalid email format';
    }

    if (!pass) {
      errors.password = 'Password is required';
    } else if (pass.length < 7) {
      errors.password = 'Password must be at least 7 characters';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return; // Exit if validation fails
    }

    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      try {
        const response = await fetch("http://localhost:9000/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password: pass }),
        });

        const res = await response.json();

        if (response.status === 401) {
          setServerError('Unauthorized: Invalid email or password');
          return;
        }

        if (response.status === 201) {
          alert("Check your form for errors");
        } else {
          console.log(res, 'user information');
       

          if (!res.result || !res.result.token) {
            console.log("Cookie not added: Token is missing or invalid");
        } else {
            cookie.set("usersdatatoken", res.result.token, {
                secure: true,
                sameSite: "Strict",
                expires: 1 // Expires in 1 day
            });
            console.log("Cookie added successfully!");
        }
       

      
          //navigate("/"); // Redirect to a different route after successful login
        }
      } catch (error) {
        console.error("Error during fetch:", error);
        setServerError('An unexpected error occurred. Please try again.');
      }
    }, 2000);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <br /><br />

        <input
          type="password"
          placeholder="Enter your password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <br /><br />

        <button type="submit">Login</button>
        {serverError && <p className="error">{serverError}</p>}
      </form>
    </div>
  );
}

export default Login;

//Etherworld

//Ether123@gmail.com

//ether786