import React, { useEffect, useState } from 'react';
import Info from './Info'; // Import the Google Login component

function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [errors, setErrors] = useState({});
  
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

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    const errors = validate();
    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        const response = await fetch("http://localhost:9000/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password: pass })
        });

        const res = await response.json();
        if (res.status === 201) {
          alert("Check your form");
        } else {
          console.log(res.user, 'user information');
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <p>{errors.name}</p>}

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p>{errors.email}</p>}

        <input
          type="password"
          placeholder="Enter your password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
        {errors.password && <p>{errors.password}</p>}

        <button type="submit">Sign Up</button>
      </form>

      <hr />

      {/* Google Login Button */}
      <Info />
    </div>
  );
}

export default Form;
