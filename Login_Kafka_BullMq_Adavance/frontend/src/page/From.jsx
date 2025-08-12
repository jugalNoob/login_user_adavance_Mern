// import React, { useEffect, useState } from 'react';


// function Form() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [pass, setPass] = useState('');
//   const [errors, setErrors] = useState({});
  
//   const validate = () => { 
//     const errors = {};
//     if (!name) errors.name = 'Name is required';
//     else if (name.length < 7) errors.name = 'Add more characters';

//     if (!email) errors.email = 'Email is required';
//     else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Email is invalid';

//     if (!pass) errors.password = 'Password is required';
//     else if (pass.length < 7) errors.password = 'Enter at least 7 characters';

//     return errors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault(); 
//     const errors = validate();
//     setErrors(errors);

//     if (Object.keys(errors).length === 0) {
//       try {
//         const response = await fetch("http://localhost:9000/v1/signup", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ name, email, password: pass })
//         });

//         const res = await response.json();
//         if (res.status === 201) {
//           alert("Check your form");
//         } else {
//           console.log(res.user, 'user information');
//         }
//       } catch (error) {
//         console.error("Error during fetch:", error);
//       }
//     }
//   };


//     const handleGitHubLogin = () => {
//     window.location.href = 'http://localhost:9000/auth/github';
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Enter your name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />
//         {errors.name && <p>{errors.name}</p>}

//         <input
//           type="email"
//           placeholder="Enter your email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         {errors.email && <p>{errors.email}</p>}

//         <input
//           type="password"
//           placeholder="Enter your password"
//           value={pass}
//           onChange={(e) => setPass(e.target.value)}
//         />
//         {errors.password && <p>{errors.password}</p>}

//         <button type="submit">Sign Up jugal</button>
//       </form>

//       <hr />
//      <button onClick={handleGitHubLogin}>
//         Login with GitHub
//       </button>
//       {/* Google Login Button */}
  
//     </div>
//   );
// }

// export default Form;




import React, { useEffect, useState, useRef } from 'react';
import cookie from "js-cookie";
import GitLogin from './GitLogin';
import { useNavigate } from 'react-router-dom';

function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    if (!name) errors.name = 'Name is required';
    else if (name.length < 7) errors.name = 'Add more characters';

    if (!email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Email is invalid';

    if (!pass) errors.password = 'Password is required';
    else if (pass.length < 7) errors.password = 'Enter at least 7 characters';

    return errors;
  };

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      if (Object.keys(validationErrors).length === 0) {
        try {
          const response = await fetch("http://localhost:9000/signin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password: pass })
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

         if (!res.user || !res.user.token) {
  console.log("Cookie not added: Token is missing or invalid");
} else {
  cookie.set("usersdatatoken", res.user.token, {
    secure: true,
    sameSite: "Strict",
    expires: 1, // 1 day
  });
  console.log("Cookie added successfully!");
}
          }
        } catch (error) {
          console.error("Error during fetch:", error);
        }
      }
    }, 2000);
  };


      const handleGitHubLogin = () => {
    window.location.href = 'http://localhost:9000/auth/github';
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {errors.name && <span>{errors.name}</span>}

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {errors.email && <span>{errors.email}</span>}

      <input
        type="password"
        placeholder="Password"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
      />
      {errors.password && <span>{errors.password}</span>}

      <button type="submit">Register</button>

      {serverError && <div style={{ color: 'red' }}>{serverError}</div>}

      <GitLogin />
    </form>
  );
}

export default Form;