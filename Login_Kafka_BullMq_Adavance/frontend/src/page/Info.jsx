import React from 'react'

function Info() {
  const loginwithgoogle = ()=>{
    window.open("http://localhost:9000/auth/google/callback","_self")
}


  return (
    <div>
           <button className='login-with-google-btn' onClick={loginwithgoogle}>
                    Sign In With Google
                </button>
    </div>
  )
}

export default Info


// neyex31437@evasud.com
// Jugal786123***
// dev-hivbof3lupfa66p4  us.auth0.com
// https://manage.auth0.com/dashboard/us/dev-hivbof3lupfa66p4/onboarding
//https://dev-hivbof3lupfa66p4.us.auth0.com/u/login?state=hKFo2SB5UlFNYkdPVnJMSDJNc1RPWG5VZFA4VE5PQU9EcmozTKFur3VuaXZlcnNhbC1sb2dpbqN0aWTZIENaanduVmVQV1NJRUxhb1hiblRnV0xMR3VuYnpxdEl2o2NpZNkgbnFSMnNqS052S05xMmJMbTQwTks4aE12UHVrOEdQSTI

// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';
// import { GoogleOAuthProvider } from '@react-oauth/google';

// ReactDOM.render(
//   <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
//     <App />
//   </GoogleOAuthProvider>,
//   document.getElementById('root')
// );
